import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coach Matcher",
  description: "Find your ideal coach in minutes — quiz → match → book."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
