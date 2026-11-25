"use client";

import React, { useState } from "react";
import { TrendingUp, ArrowUpRight, ShieldCheck } from "lucide-react";

interface MonthlyData {
  month: string;
  amount: string;
  primaryHeight: number;
  secondaryHeight: number;
}

export default function HeroDashboardMockup() {
  const [months] = useState<MonthlyData[]>([
    { month: "Jul", amount: "Rp 9.200.000", primaryHeight: 52, secondaryHeight: 38 },
    { month: "Aug", amount: "Rp 10.150.000", primaryHeight: 60, secondaryHeight: 45 },
    { month: "Sep", amount: "Rp 11.800.000", primaryHeight: 78, secondaryHeight: 56 },
    { month: "Oct", amount: "Rp 10.900.000", primaryHeight: 68, secondaryHeight: 48 },
    { month: "Nov", amount: "Rp 12.450.000", primaryHeight: 92, secondaryHeight: 36 },
  ]);

  const [activeMonthIndex, setActiveMonthIndex] = useState<number>(4);
  const activeData = months[activeMonthIndex];

  return (
    <div className="w-full max-w-lg mx-auto py-4 sm:py-6 select-none">
      {/* 
        Isolated Relative Showcase Stage:
        Ensures ample space around the central card so floating badges 
        never collide or obscure the bar chart month labels.
      */}
      <div className="relative min-h-[440px] sm:min-h-[470px] flex flex-col justify-center px-3 sm:px-6">
        
        {/* Ambient Warm Backdrop Glow */}
        <div
          aria-hidden="true"
          className="absolute inset-x-6 top-8 bottom-10 bg-gradient-to-tr from-[#E6EFE8]/80 via-[#F3EFE8]/70 to-[#EBF2EC]/90 rounded-[36px] -z-10 shadow-xs"
        />

        {/* 1. FLOATING TOP-RIGHT BADGE: Saved Rp 300k */}
        <div className="absolute top-0 sm:top-2 right-2 sm:-right-2 z-20 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl shadow-[0_8px_24px_rgba(30,58,43,0.08)] border border-[#E7EDE7] flex items-center gap-2.5 hover:scale-[1.02] transition-transform">
            <div className="w-7 h-7 rounded-full bg-[#FEF3E2] flex items-center justify-center text-[#D97706] flex-shrink-0">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#7A8C7F] uppercase tracking-wider leading-none">
                This month
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-[#1E3A2B] tracking-tight mt-0.5">
                Saved Rp 300k
              </p>
            </div>
          </div>
        </div>

        {/* 2. MAIN CENTER CARD: Balance & Bar Chart */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-[0_12px_36px_rgba(30,58,43,0.06)] border border-[#E7EDE7] relative z-10 mx-auto w-full max-w-md">
          {/* Header Row: Label & Total */}
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#718576] uppercase tracking-wider block">
                Total Balance
              </span>
              <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2B] tracking-tight">
                  {activeData.amount}
                </span>
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-[#20743E] bg-[#E7F6EC] border border-[#D4EEDC] px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  +12%
                </span>
              </div>
            </div>
          </div>

          {/* Paired Bar Chart */}
          <div className="mt-6 pt-2">
            <div className="flex items-end justify-between gap-3 sm:gap-6 h-28 sm:h-36 px-2 sm:px-3 border-b border-[#F0F4F0] pb-2">
              {months.map((item, idx) => {
                const isSelected = idx === activeMonthIndex;
                const isNov = item.month === "Nov";
                return (
                  <button
                    key={item.month}
                    type="button"
                    onClick={() => setActiveMonthIndex(idx)}
                    className="flex-1 flex flex-col items-center justify-end h-full group focus:outline-none cursor-pointer"
                    title={`${item.month}: ${item.amount}`}
                  >
                    <div className="flex items-end gap-1 sm:gap-1.5 h-full">
                      {/* Primary Bar */}
                      <div
                        style={{ height: `${item.primaryHeight}%` }}
                        className={`w-3.5 sm:w-4.5 rounded-t-sm sm:rounded-t-md transition-all duration-300 ${
                          isNov
                            ? "bg-[#E09B35]"
                            : isSelected
                            ? "bg-[#224431]"
                            : "bg-[#335C42]"
                        }`}
                      />
                      {/* Secondary Comparison Bar */}
                      <div
                        style={{ height: `${item.secondaryHeight}%` }}
                        className="w-3.5 sm:w-4.5 bg-[#8FA899] rounded-t-sm sm:rounded-t-md transition-all duration-300 opacity-80"
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Month Labels below bars - guaranteed clear clearance */}
            <div className="flex items-center justify-between gap-3 sm:gap-6 px-2 sm:px-3 mt-2.5 mb-2">
              {months.map((item, idx) => (
                <button
                  key={`label-${item.month}`}
                  type="button"
                  onClick={() => setActiveMonthIndex(idx)}
                  className={`flex-1 text-center text-xs transition-colors cursor-pointer ${
                    idx === activeMonthIndex
                      ? "font-bold text-[#1E3A2B]"
                      : "font-medium text-[#7D8F82] hover:text-[#1E3A2B]"
                  }`}
                >
                  {item.month}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. FLOATING BOTTOM CARDS & PILLS (Layered without covering chart labels) */}
        <div className="relative mt-3 sm:mt-0 z-20">
          
          {/* Card A: Food Budget (Bottom Left) */}
          <div className="sm:absolute sm:-bottom-8 sm:-left-3 w-full sm:w-[210px] bg-white rounded-2xl p-3.5 sm:p-4 shadow-[0_10px_28px_rgba(30,58,43,0.1)] border border-[#E7EDE7] mb-2 sm:mb-0 hover:scale-[1.02] transition-transform">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-bold text-[#1E3A2B]">
                Food Budget
              </span>
              <span className="text-xs font-extrabold text-[#244833] bg-[#E8EFEA] px-2 py-0.5 rounded-md">
                80%
              </span>
            </div>
            <p className="text-[11px] text-[#718275] mt-0.5 font-medium">
              Rp 1.2M / 1.5M
            </p>
            <div className="w-full h-1.5 rounded-full bg-[#EBF0EC] overflow-hidden mt-2.5">
              <div
                className="h-full bg-[#244833] rounded-full transition-all duration-500"
                style={{ width: "80%" }}
              />
            </div>
          </div>

          {/* Card B: Holiday Savings (Bottom Right) */}
          <div className="sm:absolute sm:-bottom-12 sm:-right-3 w-full sm:w-[230px] bg-[#224431] text-white rounded-2xl p-3.5 sm:p-4 shadow-[0_12px_32px_rgba(30,58,43,0.18)] border border-[#2D543D] hover:scale-[1.02] transition-transform">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-bold tracking-tight">
                Holiday Savings
              </span>
              <span className="text-xs font-extrabold text-[#E09B35] bg-black/25 px-2 py-0.5 rounded-md">
                65%
              </span>
            </div>
            <p className="text-[11px] text-[#A9C4B2] mt-0.5 font-medium">
              Rp 3.25M of Rp 5M
            </p>
            <div className="w-full h-1.5 rounded-full bg-[#12241A] overflow-hidden mt-2.5">
              <div
                className="h-full bg-[#E09B35] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(224,155,53,0.4)]"
                style={{ width: "65%" }}
              />
            </div>
          </div>

        </div>

        {/* 4. FLOATING BOTTOM PILLS */}
        <div className="mt-4 sm:mt-16 flex items-center justify-center gap-2.5 flex-wrap z-20">
          <div className="bg-white/95 px-3 py-1 rounded-full shadow-2xs border border-[#DBE5DD] flex items-center gap-1.5 text-xs font-semibold text-[#2E4536]">
            <span className="w-2 h-2 rounded-full bg-[#4D7A5E]" />
            <span>Entertainment 20%</span>
          </div>

          <div className="bg-white/95 px-3 py-1 rounded-full shadow-2xs border border-[#DBE5DD] flex items-center gap-1.5 text-xs font-semibold text-[#2E4536]">
            <span className="w-2 h-2 rounded-full bg-[#E09B35]" />
            <span>Emergency Fund 15%</span>
          </div>

          <div className="hidden sm:inline-flex bg-white/95 px-3 py-1 rounded-full shadow-2xs border border-[#DBE5DD] items-center gap-1.5 text-xs font-semibold text-[#2E4536]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#20743E]" />
            <span>Protected</span>
          </div>
        </div>

      </div>
    </div>
  );
}
