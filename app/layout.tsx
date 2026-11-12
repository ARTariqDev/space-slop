import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fire-Slop | Space-Grade Wildfire Intelligence",
  description:
    "Autonomous multispectral thermal tracking, atmospheric vector modeling, and sub-minute dispatch triangulation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased selection:bg-[#ff552e] selection:text-white`}
    >
      <body className="min-h-full flex flex-col bg-[#000000] text-[#f5f5f7] antialiased">
        {children}
      </body>
    </html>
  );
}
