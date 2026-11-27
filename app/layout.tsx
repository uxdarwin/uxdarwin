import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Sounds } from "./components/Sounds";

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

// Google Tag Manager container for site analytics.
const GTM_ID = "GTM-MML5LQVJ";

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
      <body id="top">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Sounds />
        <Analytics />
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </body>
    </html>
  );
}
