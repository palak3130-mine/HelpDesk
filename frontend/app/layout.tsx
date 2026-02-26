import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HelpDesk",
  description: "Professional Helpdesk System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}