// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "react-hot-toast";
import PublicLayout from "@/components/layout/public-layout";
// import { AuthProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "karkhana.shop - Your Product Marketplace",
  description: "Showcase and manage your products with karkhana.shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider defaultTheme="system" storageKey="karkhana-theme">
            <PublicLayout>
              {children}
              <Toaster position="top-right" />
            </PublicLayout>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
