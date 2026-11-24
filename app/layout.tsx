import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sakuwise - Kelola Keuangan Pribadi Lebih Bijak & Terarah",
  description:
    "Bagi uang ke saku yang tepat, pahami pengeluaran, dan wujudkan tujuanmu. Semua lebih simpel bersama Sakuwise. Manage your money, wisely.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  keywords: [
    "Sakuwise",
    "keuangan pribadi",
    "budgeting app",
    "pengatur keuangan",
    "saku anggaran",
    "fintech indonesia",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="public/icon.png" />
      </head>
      <body className="min-h-screen bg-[#FAF8F5] text-[#1E3A2B] font-sans antialiased selection:bg-[#E08C38]/20 selection:text-[#1E3A2B]">
        <AuthProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
