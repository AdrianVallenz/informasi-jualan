import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = {
  title: "SIPB Warehouse & Sales | Sistem Informasi Penjualan Barang",
  description: "Platform Manajemen Warehouse, Inventaris Pergudangan, dan Penjualan Barang Skala Grosir & Retail modern.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#F7F7F7] text-[#191919] font-sans antialiased selection:bg-[#0064D2] selection:text-white">
        {children}
      </body>
    </html>
  );
}
