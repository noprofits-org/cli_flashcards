import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CLI Flashcards - Learn clasp commands",
  description: "Interactive flashcards for learning CLI commands",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
