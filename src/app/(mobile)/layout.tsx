import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";
import PWAInstaller from "@/components/PWAInstaller";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Online Casino - Premium Mobile Games",
  description: "Premium mobile casino games including Plinko, Slots, and more. Experience the thrill of casino gaming on your mobile device.",
  keywords: "casino, plinko, slots, mobile, games, betting, premium",
  authors: [{ name: "Online Casino" }],
  creator: "Online Casino",
  publisher: "Online Casino",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Online Casino",
    startupImage: [
      {
        url: "/icons/icon-512x512.svg",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "Online Casino",
    title: "Online Casino - Premium Mobile Games",
    description: "Premium mobile casino games including Plinko, Slots, and more.",
    url: "https://online-casino.com",
    images: [
      {
        url: "/icons/icon-512x512.svg",
        width: 512,
        height: 512,
        alt: "Online Casino Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Casino - Premium Mobile Games",
    description: "Premium mobile casino games including Plinko, Slots, and more.",
    images: ["/icons/icon-512x512.svg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#121212" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-TileColor": "#121212",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function MobileRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      {children}
      <PWAInstaller />
    </Providers>
  );
}
