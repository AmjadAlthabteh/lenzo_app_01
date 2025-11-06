/*
  TODO Protocol (see docs/TODO.md)
  - Update metadata per docs/TODO.md Â§5 (SEO & Sharing)
*/
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

// Prefer env override; fall back to production domain
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://luxinai.dev";
// Ensure metadataBase is a valid absolute URL; tolerate envs without scheme
let metadataBaseSafe: URL;
try {
  const withScheme = /^(https?:)?\/\//i.test(siteUrl)
    ? siteUrl
    : `https://${siteUrl}`;
  metadataBaseSafe = new URL(withScheme);
} catch {
  metadataBaseSafe = new URL("https://luxai.dev");
}

export const metadata: Metadata = {
  title: "LuxAI — AI‑Powered Lighting OS",
  description:
    "LuxAI is an AI‑powered lighting OS — autonomous scenes, adaptive circadian lighting, energy optimization, and open integrations.",
  keywords: [
    "LuxAI",
    "Luxin",
    "lighting",
    "AI",
    "smart home",
    "circadian",
    "energy",
    "Matter",
    "HomeKit",
  ],
  openGraph: {
    title: "LuxAI — AI‑Powered Lighting OS",
    description:
      "Autonomous scenes, adaptive circadian lighting, energy optimization, open integrations.",
    type: "website",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "LuxAI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LuxAI — AI‑Powered Lighting OS",
    description:
      "Autonomous scenes, adaptive circadian lighting, energy optimization, open integrations.",
    images: ["/og.svg"],
  },
  metadataBase: metadataBaseSafe,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
