import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp/FloatingWhatsApp";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Ilahi Resale — Inspected Pre-Owned Cars, Pan-India",
    template: "%s | Ilahi Resale",
  },
  description:
    "Browse inspected 1st & 2nd owner pre-owned cars from Ilahi Resale, Mundgod. We sell quality used cars across India. Inquire on WhatsApp.",
  keywords: [
    "used cars India",
    "pre-owned cars Mundgod",
    "inspected second hand cars",
    "buy used car pan India",
    "1st owner cars",
    "car resale Karnataka",
    "Ilahi Resale",
  ],
  openGraph: {
    title: "Ilahi Resale — Inspected Pre-Owned Cars",
    description:
      "Quality inspected pre-owned cars. 1st & 2nd owner. Pan-India delivery. Inquire directly on WhatsApp.",
    type: "website",
    locale: "en_IN",
    siteName: "Ilahi Resale",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ilahi Resale — Inspected Pre-Owned Cars",
    description: "Quality inspected used cars, delivered pan-India.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ilahi Resale",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
