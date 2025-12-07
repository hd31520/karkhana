import { NextResponse } from "next/server";

let SETTINGS = {
  siteName: "Karkhana",
};

export async function GET() {
  return NextResponse.json(SETTINGS);
}

export async function PUT(request: Request) {
  const body = await request.json();
  SETTINGS = { ...SETTINGS, ...body };
  return NextResponse.json({ message: "Updated", settings: SETTINGS });
}
