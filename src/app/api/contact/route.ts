// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";
import nodemailer from "nodemailer";

const ADMIN_EMAIL = process.env.GMAIL_USER;

if (!ADMIN_EMAIL) {
  console.warn("GMAIL_USER not set - contact API won't forward messages");
}

function createTransporter() {
  // We create a transporter separately (don't import from lib to avoid circular deps)
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body ?? {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, message" },
        { status: 400 }
      );
    }

    // Prepare mail forwarded to site owner/admin
    const transporter = createTransporter();
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: ADMIN_EMAIL,
      subject: subject ? `[Contact] ${subject}` : "[Contact] New message from website",
      html: `
        <h3>New contact form submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${(message || "").replace(/\n/g, "<br/>")}</p>
        <hr/>
        <p>Sent from your Next.js site</p>
      `,
    };

    // Send to admin
    const info = await transporter.sendMail(mailOptions);
    console.log("Contact message forwarded:", info.messageId);

    // Optionally send an auto-reply / welcome to the visitor
    // If you want this, uncomment the following block.
    try {
      // await sendWelcomeEmail(email, name);
      // console.log("Auto-reply sent to visitor");
    } catch (e) {
      console.warn("Auto-reply failed (non-blocking):", e);
    }

    return NextResponse.json({ success: true, info: { messageId: info.messageId } });
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
