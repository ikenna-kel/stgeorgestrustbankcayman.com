import type { Metadata } from "next";
import "./globals.css";
import SmartSuppProvider from "@/src/components/SmartSuppProvider";

export const metadata: Metadata = {
  title: "St. Georges Trust Bank Cayman",
  description: "The future of borderless banking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        {children}
        <SmartSuppProvider />
      </body>
    </html>
  );
}
