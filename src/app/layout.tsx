import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "히라가나 · 가타카나 암기",
  description: "히라가나, 가타카나 퀴즈와 표 보기",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
