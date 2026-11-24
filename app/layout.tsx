import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { RingCursor } from "./components/RingCursor";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
});

// Display face from the Figma file: Season Mix by Displaay.
const display = localFont({
  src: "./fonts/SeasonMix-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Darwin Álvarez · Staff Product Designer",
  description:
    "Darwin Álvarez, Staff Product Designer with 11+ years in product design and 8 years leading teams. Founding Product Designer at Coverbase.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${display.variable}`}
    >
      <body>
        {children}
        <RingCursor />
      </body>
    </html>
  );
}
