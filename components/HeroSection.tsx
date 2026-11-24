"use client";

import React from "react";
import { ArrowRight, Play, Check, Sparkles } from "lucide-react";
import HeroDashboardMockup from "./HeroDashboardMockup";

interface HeroSectionProps {
  onOpenHowItWorks?: () => void;
}

export default function HeroSection({ onOpenHowItWorks }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-6 pb-20 sm:pt-10 sm:pb-28 lg:pt-14 lg:pb-32">
      {/* Background soft ambient glows */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#E6EFE8]/60 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column (Hero Content) */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8EFEA] border border-[#D5E1D7] text-xs font-semibold tracking-wider text-[#244833] uppercase shadow-2xs mb-6 sm:mb-8">
              <Sparkles className="w-3.5 h-3.5 text-[#E08C38] fill-[#E08C38]" />
              <span>Teman Bijak untuk Uangmu</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#1E3A2B] tracking-tight leading-[1.14]">
              Kelola Keuangan <br className="hidden sm:inline" />
              Pribadi Lebih Bijak <br className="hidden sm:inline" />
              <span className="text-[#1E3A2B]">& Terarah</span>
            </h1>

            {/* Sub-heading text */}
            <p className="mt-6 text-base sm:text-lg text-[#55695C] leading-relaxed max-w-xl">
              Bagi uang ke saku yang tepat, pahami pengeluaran, dan wujudkan
              tujuanmu. Semua lebih simpel bersama Sakuwise.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              {/* Primary CTA */}
              <a
                href="/signup"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-semibold text-white bg-[#224431] hover:bg-[#163323] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 group"
              >
                <span>Coba Sakuwise Gratis</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>

              {/* Secondary CTA */}
              <button
                type="button"
                onClick={onOpenHowItWorks}
                className="inline-flex items-center justify-center gap-3 px-5 py-4 rounded-xl text-base font-medium text-[#1E3A2B] hover:text-[#0F2218] hover:bg-black/[0.04] transition-all duration-200 group cursor-pointer"
              >
                <span>Kenali cara kerjanya</span>
                <span className="w-8 h-8 rounded-full border border-[#CBD9CD] flex items-center justify-center text-[#244833] group-hover:border-[#1E3A2B] group-hover:bg-[#E8EFEA] transition-colors">
                  <Play className="w-3.5 h-3.5 fill-[#244833] ml-0.5" />
                </span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 sm:mt-10 flex items-center gap-6 text-xs sm:text-sm text-[#55695C] font-medium">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#20743E] stroke-[3]" />
                <span>Gratis untuk mulai</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#20743E] stroke-[3]" />
                <span>Tanpa kartu kredit</span>
              </div>
            </div>

          </div>

          {/* Right Column (Interactive Mockup Dashboard) */}
          <div className="lg:col-span-6 w-full mt-10 sm:mt-12 lg:mt-0 pt-3 sm:pt-0">
            <HeroDashboardMockup />
          </div>

        </div>
      </div>
    </section>
  );
}
