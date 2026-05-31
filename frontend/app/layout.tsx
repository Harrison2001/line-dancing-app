import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import TopNav from "@/components/TopNavbar";
import BottomNav from "@/components/BottomNav";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Line Dancing App",
  description: "Dance community platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#100905] text-white`}
      >
        <TopNav />

        <main className="min-h-screen pb-24 md:pb-0">
          {children}
        </main>

        <BottomNav />
      </body>
    </html>
  );
}