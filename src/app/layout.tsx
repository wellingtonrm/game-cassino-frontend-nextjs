import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import TopBar from "@/components/TopBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Game Wallet - Carteira Digital",
  description: "Aplicativo de carteira digital para jogos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" data-arp="">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white min-h-screen`}
      >

        <Providers>
          <main className="min-h-screen bg-[#00011f] text-white">
            <div className="h-full">
              {/* Conteúdo com TopBar */}
              <div className="h-full overflow-y-auto">
                {/* Top Bar */}
                <div className="p-4">
                  <TopBar />
                </div>

                <div className="px-4 pb-4">
                  <div className="w-full max-w-7xl mx-auto">
                    {children}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation Bar - Mobile Only */}
            <div className="lg:hidden">
              <BottomNavigationBar />
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
