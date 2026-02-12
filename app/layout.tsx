import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DEFRAG // FRAGALICIOUS",
  description: "SINGLE STREAM CLI INTERFACE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className="antialiased selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}
