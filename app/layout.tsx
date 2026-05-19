import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resume Tailor",
  description: "AI-powered resume customisation for every job application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
