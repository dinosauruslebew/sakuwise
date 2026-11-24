"use client";

import React from "react";
import { ArrowRight, ArrowUpRight, Plus, Sparkles } from "lucide-react";

export interface Transaction {
  id: string;
  name: string;
  time: string;
  category: "Food & drinks" | "Transport" | "Academic needs" | "Personal" | "Accommodation" | "Emergency fund";
  amount: number;
}

interface OverviewViewProps {
  onSwitchTab: (tab: string) => void;
  onOpenAddExpense: () => void;
  transactions: Transaction[];
  totalSpent: number;
}

export default function OverviewView({
  onSwitchTab,
  onOpenAddExpense,
  transactions,
  totalSpent,
}: OverviewViewProps) {
  const allowance = 3000000;
  const remaining = allowance - totalSpent;
  const percentSpent = Math.min(100, Math.round((totalSpent / allowance) * 100));
  const percentRemaining = 100 - percentSpent;

const categoryBadges: Record<string, { bg: string; text: string }> = {
  "Food & drinks": { bg: "bg-[#FEF1E1]", text: "text-[#9A5B15]" },
  Transport: { bg: "bg-[#E3EFE7]", text: "text-[#245235]" },
  "Academic needs": { bg: "bg-[#E9EDE9]", text: "text-[#425748]" },
  Personal: { bg: "bg-[#F5EFE6]", text: "text-[#71542B]" },
  Accommodation: { bg: "bg-[#EAE8F2]", text: "text-[#4B3B70]" },
  "Emergency fund": { bg: "bg-[#F8EFEA]", text: "text-[#7D452B]" },
};

  const dailyHistory = [
    { day: "11", height: 50 },
    { day: "12", height: 65 },
    { day: "13", height: 35 },
    { day: "14", height: 75 },
    { day: "15", height: 60 },
    { day: "16", height: 85 },
    { day: "17", height: 55, active: true },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. TOP SUMMARY CARDS (3 CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Monthly allowance */}
        <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs">
          <p className="text-xs font-medium text-[#718576]">Monthly allowance</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2B] tracking-tight mt-1.5">
            Rp3.000.000
          </p>
          <p className="text-xs text-[#7D9183] mt-2">
            Next allowance · 1 Dec 2026
          </p>
        </div>

        {/* Card 2: Spent this month */}
        <div className="bg-[#FFF9F0] rounded-2xl p-6 border border-[#FBEAD4] shadow-2xs">
          <p className="text-xs font-medium text-[#8F7249]">Spent this month</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2B] tracking-tight mt-1.5">
            Rp{totalSpent.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-[#8F7249] mt-2 font-medium">
            {percentSpent}% dari alokasi bulananmu
          </p>
        </div>

        {/* Card 3: Remaining balance (Dark olive green) */}
        <div className="bg-[#224431] text-white rounded-2xl p-6 border border-[#2D583F] shadow-md">
          <p className="text-xs font-medium text-[#B4CEBD]">Remaining balance</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5">
            Rp{remaining.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-[#A1BFA9] mt-2">
            {percentRemaining}% left for the next 14 days
          </p>
        </div>
      </div>

      {/* 2. MIDDLE ROW (DAILY LIMIT & AI ASSISTANT WIDGET) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Daily limit */}
        <div className="lg:col-span-7 bg-[#E8EFEA] rounded-2xl p-6 sm:p-7 border border-[#DCE6DE] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#1E3A2B]">Your everyday money, made simple</h2>
              <span className="text-[11px] font-semibold text-[#8B5820] bg-[#FEF3E2] px-2.5 py-0.5 rounded-full">
                14 days to go
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              {/* Daily spending limit figure */}
              <div className="sm:col-span-6">
                <span className="text-[11px] font-bold text-[#6D8072] uppercase tracking-wider">
                  DAILY SPENDING LIMIT
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-[#1E3A2B] tracking-tight mt-0.5">
                  Rp90.000
                </p>
                <p className="text-xs text-[#5C7063] mt-1 font-medium">
                  Rp1.260.000 remaining ÷ 14 days
                </p>

                {/* Progress bar today */}
                <div className="mt-4 pt-3 border-t border-[#D5E1D7]">
                  <p className="text-xs font-semibold text-[#244833]">
                    Rp45.000 spent today · Rp45.000 left
                  </p>
                  <div className="w-full h-2 rounded-full bg-white/70 overflow-hidden mt-1.5">
                    <div className="bg-[#244833] h-full rounded-full w-1/2" />
                  </div>
                </div>
              </div>

              {/* 7-Days Chart */}
              <div className="sm:col-span-6 bg-white/50 backdrop-blur-xs rounded-xl p-3 border border-white/60">
                <p className="text-[11px] font-medium text-[#687C6D] mb-3 text-right">
                  Your last 7 days
                </p>
                <div className="flex items-end justify-between gap-1.5 h-20 px-1">
                  {last7Days.map((d) => (
                    <div
                      key={d.date}
                      className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
                      title={`${formatShortDate(d.date)}: ${formatRupiah(d.total)}`}
                    >
                      <div
                        style={{ height: `${d.total > 0 ? Math.max(8, Math.round((d.total / maxDay) * 100)) : 4}%` }}
                        className={`w-full max-w-[20px] rounded-t-sm transition-all ${
                          d.isToday ? "bg-[#E08C38]" : d.total > 0 ? "bg-[#4D7A5E]" : "bg-[#CFDDD3]"
                        }`}
                      />
                      <span className="text-[11px] text-[#6F8274] font-medium">{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#697C6E] mt-4 pt-3 border-t border-[#D6E2D8]">
            Jaga pengeluaran harian dalam batas ini agar allowance tetap aman hingga akhir bulan.
          </p>
        </div>

        {/* Right: AI insight */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDE7] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#244833] text-white flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3 h-3" />
              </div>
              <span className="text-xs font-bold text-[#244833]">
                A little help from SakuWise
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#1E3A2B] tracking-tight">
              Your food budget is doing well.
            </h3>
            <p className="text-xs text-[#55695B] leading-relaxed mt-2">
              You&apos;ve used 57% of your food budget. Keep meals around Rp27.000 a day to stay within your Rp900.000 plan.
            </p>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => onSwitchTab("ai")}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F2EFE8] border border-[#E4ECE4] text-xs font-semibold text-[#1E3A2B] flex items-center justify-between transition-colors group cursor-pointer"
              >
                <span>Bagaimana cara mengoptimalkan pengeluaran saya?</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#677A6C] group-hover:text-[#1E3A2B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#F2F5F2] flex items-center justify-between">
            <button
              type="button"
              onClick={() => onSwitchTab("ai")}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#1E3A2B] hover:underline cursor-pointer"
            >
              <span>Buka AI Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-[#7E8F82]">
              Guidance based on your recorded expenses.
            </span>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW (RECENT TRANSACTIONS & COMING UP SOON) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Recent Transactions */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDE7] shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-[#1E3A2B]">
                The little things add up
              </h3>
              <p className="text-xs text-[#718576]">Recent transactions</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenAddExpense}
                className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#224431] hover:bg-[#183526] px-3 py-1.5 rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add expense</span>
              </button>
              <button
                type="button"
                onClick={() => onSwitchTab("expenses")}
                className="text-xs font-semibold text-[#1E3A2B] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat semua</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F0F4F0] text-[10px] font-bold uppercase tracking-wider text-[#7A8E80]">
                  <th className="pb-3 font-semibold">Transaction</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F8F5]">
                {transactions.slice(0, 5).map((t) => {
                  const badgeStyle = categoryBadges[t.category] || {
                    bg: "bg-gray-100",
                    text: "text-gray-700",
                  };
                  return (
                    <tr key={t.id} className="group hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3 pr-4">
                        <p className="font-semibold text-[#1E3A2B] text-xs">
                          {t.name}
                        </p>
                        <p className="text-[10px] text-[#7D9183]">{t.time}</p>
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium ${badgeStyle.bg} ${badgeStyle.text}`}
                        >
                          {t.category}
                        </span>
                      </td>
                      <td className="py-3 text-right font-bold text-[#1E3A2B]">
                        -Rp{t.amount.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Coming up soon & Savings Goals Widget */}
        <div className="lg:col-span-4 space-y-5">
          {/* Coming up soon (Bills) */}
          <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#1E3A2B]">Coming up soon</h3>
              <button
                type="button"
                onClick={() => onSwitchTab("bills")}
                className="text-xs font-semibold text-[#1E3A2B] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Semua tagihan</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E9EFEA]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E8EFEA] text-[#1E3A2B] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                    20
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1E3A2B]">
                      Wi-Fi subscription
                    </p>
                    <p className="text-[10px] text-[#718576]">
                      Due 20 Nov · In 3 days
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#1E3A2B]">
                  Rp100.000
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E9EFEA]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E8EFEA] text-[#1E3A2B] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                    25
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Savings goal widget */}
          <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs">
            <h3 className="text-sm font-bold text-[#1E3A2B]">
              A little closer to your goals
            </h3>
            <p className="text-xs text-[#718576] mt-0.5">New laptop fund</p>

            <div className="mt-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-[#1E3A2B]">
                  Rp450.000
                </span>
                <span className="text-xs text-[#718576]">of Rp1.500.000</span>
              </div>

              <div className="w-full h-2 rounded-full bg-[#EBF0EC] overflow-hidden mt-2">
                <div
                  className="bg-[#244833] h-full rounded-full transition-all"
                  style={{ width: "30%" }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="text-[#6C8072]">
                  30% saved · separate from allowance
                </span>
                <button
                  type="button"
                  onClick={() => onSwitchTab("savings")}
                  className="font-bold text-[#244833] hover:underline cursor-pointer"
                >
                  Add savings +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
