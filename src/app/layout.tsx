import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polish Words Flashcards",
  description: "Learn Polish words with flashcards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
