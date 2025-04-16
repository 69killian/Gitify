import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Charger les polices Geist et Geist Mono
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Charger Poppins via next/font
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "400", "600"],
  display: "swap",
});

// Charger Inter via next/font
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gitify",
  description: "Git gamification for noobs",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${inter.variable} antialiased`}
        style={{ fontFamily: "var(--font-poppins), var(--font-inter), sans-serif" }}
      >
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
