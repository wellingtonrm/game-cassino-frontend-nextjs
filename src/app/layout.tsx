import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PolDex - Game de cassino online",
  description: "Aplicativo de cassino premium com jogos de Plinko, Slots, Roleta e Raspadinha. Experimente a emoção dos jogos de cassino em seu dispositivo móvel.",
  keywords: "cassino, plinko, slots, roleta, raspadinha, jogos, apostas, premium",
  authors: [{ name: "Raspadinha Cassino" }],
  creator: "Raspadinha Cassino",
  publisher: "Raspadinha Cassino",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Raspadinha Cassino",
    startupImage: [
      {
        url: "/icons/icon-512x512.svg",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "Raspadinha Cassino",
    title: "Raspadinha Cassino - Jogos Premium",
    description: "Aplicativo de cassino premium com jogos de Plinko, Slots, Roleta e Raspadinha.",
    url: "https://raspadinha-cassino.com",
    images: [
      {
        url: "/icons/icon-512x512.svg",
        width: 512,
        height: 512,
        alt: "Raspadinha Cassino Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raspadinha Cassino - Jogos Premium",
    description: "Aplicativo de cassino premium com jogos de Plinko, Slots, Roleta e Raspadinha.",
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
    { media: "(prefers-color-scheme: light)", color: "#1a1a2e" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-TileColor": "#1a1a2e",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" data-arp="">
      <head>
        <link rel="icon" href="/images/logos/icon.png" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/images/logos/icon.png" />
        <link rel="mask-icon" href="/images/logos/icon.png" color="#0d0f12" />
        <meta name="theme-color" content="#0d0f12" />
        <meta name="background-color" content="#0c0e11" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Online Casino" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0c0e11" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#121214] text-white min-h-screen`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
