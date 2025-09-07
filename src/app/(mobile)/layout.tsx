import AppBar from "@/components/mobile/appBar";
import BottomNavigationBar from "@/components/mobile/bottomNavigationBar";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Raspadinha Cassino - Jogos Premium",
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

  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-TileColor": "#1a1a2e",
    "msapplication-config": "/browserconfig.xml",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1a1a2e" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
};

export default function MobileRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppBar />
      {children}
      <BottomNavigationBar />
    </>
     
  );
}
