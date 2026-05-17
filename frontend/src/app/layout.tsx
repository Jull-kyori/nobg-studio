import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoBg Studio",
  description: "Website remove background otomatis, gratis, dan HD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}