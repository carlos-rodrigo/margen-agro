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
  title: "RindeMax - Calculá tu margen. Maximizá tu campo.",
  description: "Calculadora de margen bruto agrícola. Analizá la rentabilidad de tu campaña de soja, maíz, trigo y más. Gratis y sin registro.",
  keywords: ["margen bruto", "agricultura", "soja", "maíz", "trigo", "rentabilidad", "campo", "agro"],
  openGraph: {
    title: "RindeMax - Calculá tu margen agrícola",
    description: "Calculadora gratuita de margen bruto para tu campo. Sin registro.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
