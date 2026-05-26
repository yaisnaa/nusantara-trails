/**
 * File app/layout.js
 * Root layout yang membungkus seluruh halaman aplikasi.
 * Di sini kita mengatur Font dari Google Fonts dan Metadata SEO.
 */

import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// Font Sans-serif untuk body text (Inter)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Font Serif untuk heading (Playfair Display)
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  title: "Nusantara Trails | Permata Tersembunyi Indonesia",
  description: "Platform discovery destinasi wisata tersembunyi Indonesia dengan fokus narasi budaya.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${playfair.variable} antialiased flex flex-col min-h-screen`}>
        {/* Konten halaman akan dirender di sini */}
        {children}
      </body>
    </html>
  );
}
