import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Charger les polices Geist et Geist Mono
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <head>
        {/* lien Google Fonts pour la police Poppins */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;400;600&display=swap"
          rel="stylesheet"
        />
        {/* lien Google Fonts pour la police Aeonik */}
        <link
          href="https://fonts.googleapis.com/css2?family=Aeonik:wght@100;400;600&display=swap"
          rel="stylesheet"
        />
        {/* lien Google Fonts pour la police Inter */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ fontFamily: "Poppins, Aeonik, Inter, sans-serif" }}
      >
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
