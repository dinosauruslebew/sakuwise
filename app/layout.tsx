import type { Metadata } from "next";
import React, { type ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

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
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
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
  children: ReactNode;
}) {
  return React.createElement(
    "html",
    {
      lang: "id",
      className: `${plusJakartaSans.variable} scroll-smooth`,
      "data-scroll-behavior": "smooth",
    },
    React.createElement(
      "body",
      {
        className:
          "min-h-screen bg-[#FAF8F5] text-[#1E3A2B] font-sans antialiased selection:bg-[#E08C38]/20 selection:text-[#1E3A2B]",
      },
      React.createElement(AuthProvider, null, children),
    ),
  );
}
