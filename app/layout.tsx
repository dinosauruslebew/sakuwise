import type { Metadata } from "next";
import React, { type ReactNode } from "react";
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
  title: "Sakuwise - Smart Personal Finance & Budgeting",
  description:
    "Organize your money into the right pockets, understand expenses, and achieve your goals. Smarter financial planning with Sakuwise. Manage your money, wisely.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  keywords: [
    "Sakuwise",
    "personal finance",
    "budgeting app",
    "expense tracker",
    "pocket budgeting",
    "smart money management",
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
      lang: "en",
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
