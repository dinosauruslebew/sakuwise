"use client";

import React, { useState } from "react";
import { Check, ArrowRight, Sparkles } from "lucide-react";

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="harga" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-[#6E8172]">
            Transparent & Flexible
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A2B] tracking-tight mt-2.5">
            Choose the plan that fits your goals.
          </h2>
          <p className="text-base text-[#55695C] mt-3">
            Start free with no commitment. Upgrade anytime as your needs evolve.
          </p>

          {/* Toggle Monthly / Annual */}
          <div className="mt-8 inline-flex items-center bg-[#EAEFEA] p-1.5 rounded-full border border-[#D8E2D9]">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                !isAnnual
                  ? "bg-white text-[#1E3A2B] shadow-xs"
                  : "text-[#586C5E] hover:text-[#1E3A2B]"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isAnnual
                  ? "bg-[#224431] text-white shadow-xs"
                  : "text-[#586C5E] hover:text-[#1E3A2B]"
              }`}
            >
              <span>Annual</span>
              <span className="text-[10px] bg-[#E08C38] text-white px-1.5 py-0.2 rounded-full font-bold">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Card 1: Free */}
          <div className="bg-white rounded-3xl p-8 border border-[#E4ECE4] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#1E3A2B]">Starter</span>
                <span className="text-xs font-semibold bg-[#EAF0EC] text-[#244833] px-2.5 py-1 rounded-full">
                  Free Forever
                </span>
              </div>
              <p className="text-xs text-[#637667] mt-2">
                Perfect for organizing everyday money with clarity.
              </p>

              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-[#1E3A2B]">Rp 0</span>
                <span className="text-xs text-[#718275] ml-1">/ month</span>
              </div>

              <div className="mt-8 space-y-3.5 text-xs text-[#3E5042]">
                {[
                  "Up to 5 active Budget Pockets",
                  "Monthly spending analytics",
                  "1 Dream savings goal",
                  "Instant transaction recording",
                  "Bank-grade data encryption",
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#20743E] stroke-[3] flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="/signup"
              className="mt-8 w-full py-3 px-4 rounded-xl text-center text-xs font-semibold text-[#1E3A2B] bg-[#EDF3EE] hover:bg-[#E0EAE1] transition-colors block"
            >
              Get Started Free
            </a>
          </div>

          {/* Card 2: Pro (Highlighted) */}
          <div className="bg-[#1E3A2B] text-white rounded-3xl p-8 border border-[#2D503C] shadow-xl relative flex flex-col justify-between">
            <div className="absolute -top-3 right-8 bg-[#E08C38] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Most Popular
            </div>

            <div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-white">Sakuwise Pro</span>
                <span className="text-xs font-semibold bg-white/10 text-[#E08C38] px-2.5 py-1 rounded-full">
                  Full Control
                </span>
              </div>
              <p className="text-xs text-[#A8C4B1] mt-2">
                For anyone seeking total financial clarity and disciplined spending.
              </p>

              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">
                  {isAnnual ? "Rp 21.000" : "Rp 29.000"}
                </span>
                <span className="text-xs text-[#A8C4B1] ml-1">/ month</span>
              </div>
              {isAnnual && (
                <p className="text-[11px] text-[#E08C38] mt-1 font-medium">
                  Billed Rp 252,000 / year
                </p>
              )}

              <div className="mt-8 space-y-3.5 text-xs text-[#C8DECFA]">
                {[
                  "Unlimited Budget Pockets",
                  "Unlimited Dream savings goals",
                  "Pocket Lock (Prevent impulse spending)",
                  "Smart cash flow forecast & AI spending alerts",
                  "Full report export to Excel & CSV",
                  "Multi-device real-time sync",
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E08C38] stroke-[3] flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="/signup"
              className="mt-8 w-full py-3.5 px-4 rounded-xl text-center text-xs font-bold text-white bg-[#E08C38] hover:bg-[#D47E2A] transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Try Pro Free for 14 Days</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
