import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Smart Drain | Monitoramento Inteligente de Enchentes",
  description:
    "Sistema IoT de monitoramento preventivo de galerias pluviais em Sorocaba, SP. Antes da enchente chegar. Projeto UPX Facens 2026.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Smart Drain | Monitoramento de Galerias",
    description: "Sistema inteligente para prevenção e monitoramento de enchentes em tempo real.",
    url: "https://smartdrain.mateuss.com.br",
    siteName: "Smart Drain",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Logo Smart Drain",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Drain | Monitoramento de Galerias",
    description: "Sistema inteligente para prevenção e monitoramento de enchentes em tempo real.",
    images: ["/icon.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#06090f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`scroll-smooth ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
