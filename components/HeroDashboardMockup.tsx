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
    { month: "Agu", amount: "Rp 10.150.000", primaryHeight: 60, secondaryHeight: 45 },
    { month: "Sep", amount: "Rp 11.800.000", primaryHeight: 78, secondaryHeight: 56 },
    { month: "Okt", amount: "Rp 10.900.000", primaryHeight: 68, secondaryHeight: 48 },
    { month: "Nov", amount: "Rp 12.450.000", primaryHeight: 92, secondaryHeight: 36 },
  ]);

  const [activeMonthIndex, setActiveMonthIndex] = useState<number>(4);
  const activeData = months[activeMonthIndex];

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Outer Card: Structured Flexbox / CSS Grid without uncontrolled absolute collisions */}
      <div className="rounded-[28px] sm:rounded-[36px] bg-[#EAF0EB] border border-[#DBE5DD] p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 shadow-sm transition-all">
        
        {/* 1. Top Bar: Badge Hemat & Status */}
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#D5E1D7] text-[11px] font-semibold text-[#244833]">
            <span className="w-2 h-2 rounded-full bg-[#20743E] animate-pulse" />
            <span>Alokasi Aktif</span>
          </div>

          {/* Badge: Bulan ini Hemat Rp 300 rb */}
          <div className="bg-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl shadow-xs border border-[#E5ECE6] flex items-center gap-2.5">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FEF3E2] flex items-center justify-center text-[#D97706] flex-shrink-0">
              <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-[#7A8C7F] leading-none">Bulan ini</p>
              <p className="text-xs sm:text-sm font-extrabold text-[#1E3A2B] tracking-tight mt-0.5">
                Hemat Rp 300 rb
              </p>
            </div>
          </div>
        </div>

        {/* 2. Main Center Card: Total Saldo & Paired Bar Chart */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-[#E7EDE7]">
          {/* Header Row: Label, Amount, Growth Badge */}
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#718576] uppercase tracking-wider block">
                Total Saldo
              </span>
              <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2B] tracking-tight">
                  {activeData.amount}
                </span>
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-[#20743E] bg-[#E7F6EC] border border-[#D4EEDC] px-2.5 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  +12%
                </span>
              </div>
            </div>
          </div>

          {/* Paired Bar Chart */}
          <div className="mt-6 pt-1">
            <div className="flex items-end justify-between gap-3 sm:gap-6 h-28 sm:h-36 px-2 sm:px-4 border-b border-[#F0F4F0] pb-2">
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
                        className={`w-3.5 sm:w-5 rounded-t-sm sm:rounded-t-md transition-all duration-300 ${
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
                        className="w-3.5 sm:w-5 bg-[#8FA899] rounded-t-sm sm:rounded-t-md transition-all duration-300 opacity-80"
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Month Labels below bars */}
            <div className="flex items-center justify-between gap-3 sm:gap-6 px-2 sm:px-4 mt-2">
              {months.map((item, idx) => (
                <button
                  key={`label-${item.month}`}
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

        {/* 3. Budget Cards: Saku Makan & Tabungan Liburan in Clean 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          
          {/* Card: Saku Makan */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#E7EDE7] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-bold text-[#1E3A2B]">
                  Saku Makan
                </span>
                <span className="text-xs font-extrabold text-[#244833] bg-[#E8EFEA] px-2 py-0.5 rounded-md">
                  80%
                </span>
              </div>
              <p className="text-[11px] text-[#718275] mt-1 font-medium">
                Rp 1,2 jt / 1,5 jt
              </p>
            </div>
            <div className="w-full h-2 rounded-full bg-[#EBF0EC] overflow-hidden mt-3">
              <div
                className="h-full bg-[#244833] rounded-full transition-all duration-500"
                style={{ width: "80%" }}
              />
            </div>
          </div>

          {/* Card: Tabungan Liburan */}
          <div className="bg-[#224431] text-white rounded-2xl p-4 shadow-xs border border-[#2D543D] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-bold tracking-tight">
                  Tabungan Liburan
                </span>
                <span className="text-xs font-extrabold text-[#E09B35] bg-black/20 px-2 py-0.5 rounded-md">
                  65%
                </span>
              </div>
              <p className="text-[11px] text-[#A9C4B2] mt-1 font-medium">
                Rp 3,25 jt dari Rp 5 jt
              </p>
            </div>
            <div className="w-full h-2 rounded-full bg-[#12241A] overflow-hidden mt-3">
              <div
                className="h-full bg-[#E09B35] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(224,155,53,0.4)]"
                style={{ width: "65%" }}
              />
            </div>
          </div>

        </div>

        {/* 4. Pills Row: Hiburan 20% & Dana Darurat 15% */}
        <div className="flex items-center justify-start gap-2.5 flex-wrap pt-0.5">
          <div className="bg-white/95 px-3 py-1 rounded-full shadow-2xs border border-[#DBE5DD] flex items-center gap-1.5 text-xs font-semibold text-[#2E4536]">
            <span className="w-2 h-2 rounded-full bg-[#4D7A5E]" />
            <span>Hiburan 20%</span>
          </div>

          <div className="bg-white/95 px-3 py-1 rounded-full shadow-2xs border border-[#DBE5DD] flex items-center gap-1.5 text-xs font-semibold text-[#2E4536]">
            <span className="w-2 h-2 rounded-full bg-[#E09B35]" />
            <span>Dana Darurat 15%</span>
          </div>

          <div className="hidden sm:inline-flex bg-white/95 px-3 py-1 rounded-full shadow-2xs border border-[#DBE5DD] items-center gap-1.5 text-xs font-semibold text-[#2E4536]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#20743E]" />
            <span>Terkendali</span>
          </div>
        </div>

      </div>
    </div>
  );
}
