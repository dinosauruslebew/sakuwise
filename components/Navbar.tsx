"use client";

import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import { Menu, X, ArrowRight } from "lucide-react";

interface NavbarProps {
  onOpenHowItWorks?: () => void;
}

export default function Navbar({ onOpenHowItWorks }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Fitur", href: "#fitur" },
    {
      name: "Cara Kerja",
      href: "#cara-kerja",
      onClick: onOpenHowItWorks
        ? (e: React.MouseEvent) => {
            e.preventDefault();
            onOpenHowItWorks();
          }
        : undefined,
    },
    { name: "Keamanan", href: "#keamanan" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#FAF8F5]/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-b border-[#EBEFEA]"
          : "bg-[#FAF8F5]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo (Left) */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center group">
              <Logo />
            </a>
          </div>

          {/* Desktop Navigation Links (Center) */}
          <nav aria-label="Navigasi utama" className="hidden md:flex items-center space-x-8 lg:space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={link.onClick}
                className="text-sm font-medium text-[#495B4E] hover:text-[#1E3A2B] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#1E3A2B] hover:after:w-full after:transition-all after:duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Right Actions: Masuk & Mulai Gratis */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <a
              href="/login"
              className="text-sm font-semibold text-[#1E3A2B] hover:text-[#0F2218] transition-colors px-3 py-2"
            >
              Masuk
            </a>
            <a
              href="/signup"
              className="inline-flex items-center justify-center text-sm font-medium text-white bg-[#224431] hover:bg-[#173324] px-5 py-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
            >
              Mulai Gratis
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#1E3A2B] hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#224431]"
              aria-label="Buka atau tutup menu navigasi"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-[#FAF8F5] border-b border-[#E8ECE8] px-5 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-3 duration-200">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.onClick) link.onClick(e);
                  setMobileMenuOpen(false);
                }}
                className="text-base font-medium text-[#2E4536] hover:text-[#1E3A2B] py-2 border-b border-gray-100/60"
              >
                {link.name}
              </a>
            ))}

            <div className="pt-4 flex flex-col space-y-3">
              <a
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-[#1E3A2B] rounded-xl border border-[#D8E2D9] hover:bg-black/5"
              >
                Masuk
              </a>
              <a
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-white bg-[#224431] rounded-xl shadow"
              >
                Mulai Gratis
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
