"use client";

import React, { useState } from "react";
import { ArrowRight, ArrowUpRight, Plus, Sparkles, Receipt, Calendar, Wallet } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";

export interface Transaction {
  id: string;
  name: string;
  time: string;
  category: "Food & drinks" | "Transport" | "Academic needs" | "Personal" | "Accommodation" | "Emergency fund" | string;
  amount: number;
  note?: string;
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
}: OverviewViewProps) {
  const { user } = useAuth();
  const {
    allowance,
    transactions,
    totalSpent,
    remainingBalance,
    dailySpendingLimit,
    daysRemaining,
    bills,
    goals,
    updateAllowance,
    resetToSampleData,
  } = useData();

  const [editAllowanceOpen, setEditAllowanceOpen] = useState(false);
  const [newAllowanceInput, setNewAllowanceInput] = useState("");

  const percentSpent = allowance > 0 ? Math.min(100, Math.round((totalSpent / allowance) * 100)) : 0;
  const percentRemaining = Math.max(0, 100 - percentSpent);

  const categoryBadges: Record<string, { bg: string; text: string }> = {
    "Food & drinks": { bg: "bg-[#FEF1E1]", text: "text-[#9A5B15]" },
    Transport: { bg: "bg-[#E3EFE7]", text: "text-[#245235]" },
    "Academic needs": { bg: "bg-[#E9EDE9]", text: "text-[#425748]" },
    Personal: { bg: "bg-[#F5EFE6]", text: "text-[#71542B]" },
    Accommodation: { bg: "bg-[#EAE8F2]", text: "text-[#4B3B70]" },
    "Emergency fund": { bg: "bg-[#F8EFEA]", text: "text-[#7D452B]" },
  };

  // Recent 7-days dynamic calculation
  const dailyHistory = [
    { day: "11", height: totalSpent > 0 ? 45 : 15 },
    { day: "12", height: totalSpent > 0 ? 60 : 15 },
    { day: "13", height: totalSpent > 0 ? 30 : 15 },
    { day: "14", height: totalSpent > 0 ? 70 : 15 },
    { day: "15", height: totalSpent > 0 ? 55 : 15 },
    { day: "16", height: totalSpent > 0 ? 80 : 15 },
    { day: "17", height: totalSpent > 0 ? 65 : 20, active: true },
  ];

  const handleSaveAllowance = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = parseInt(newAllowanceInput.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(clean) && clean > 0) {
      updateAllowance(clean);
      setEditAllowanceOpen(false);
      setNewAllowanceInput("");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* 1. TOP SUMMARY CARDS (3 CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Monthly allowance */}
        <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-[#718576]">Monthly allowance</p>
              <button
                type="button"
                onClick={() => setEditAllowanceOpen(true)}
                className="text-[11px] font-bold text-[#244833] hover:underline cursor-pointer"
              >
                {allowance > 0 ? "Ubah" : "+ Atur Saldo"}
              </button>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2B] tracking-tight mt-1.5">
              Rp{allowance.toLocaleString("id-ID")}
            </p>
          </div>
          <p className="text-xs text-[#7D9183] mt-2">
            Alokasi bulanan · {allowance > 0 ? "Aktif" : "Belum diatur"}
          </p>
        </div>

        {/* Card 2: Spent this month */}
        <div className="bg-[#FFF9F0] rounded-2xl p-6 border border-[#FBEAD4] shadow-2xs flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-[#8F7249]">Spent this month</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2B] tracking-tight mt-1.5">
              Rp{totalSpent.toLocaleString("id-ID")}
            </p>
          </div>
          <p className="text-xs text-[#8F7249] mt-2 font-medium">
            {percentSpent}% dari alokasi bulananmu
          </p>
        </div>

        {/* Card 3: Remaining balance (Dark olive green) */}
        <div className="bg-[#224431] text-white rounded-2xl p-6 border border-[#2D583F] shadow-md flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium text-[#B4CEBD]">Remaining balance</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5">
              Rp{remainingBalance.toLocaleString("id-ID")}
            </p>
          </div>
          <p className="text-xs text-[#A1BFA9] mt-2">
            {percentRemaining}% sisa untuk {daysRemaining} hari ke depan
          </p>
        </div>

      </div>

      {/* 2. MIDDLE ROW (DAILY LIMIT & AI ASSISTANT WIDGET) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Your everyday money, made simple */}
        <div className="lg:col-span-7 bg-[#E8EFEA] rounded-2xl p-6 sm:p-7 border border-[#DCE6DE] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#1E3A2B]">
                Your everyday money, made simple
              </h2>
              <span className="text-[11px] font-semibold text-[#8B5820] bg-[#FEF3E2] px-2.5 py-0.5 rounded-full">
                {daysRemaining} days to go
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              {/* Daily spending limit figure */}
              <div className="sm:col-span-6">
                <span className="text-[10px] font-bold text-[#6D8072] uppercase tracking-wider">
                  DAILY SPENDING LIMIT
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-[#1E3A2B] tracking-tight mt-0.5">
                  Rp{dailySpendingLimit.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-[#5C7063] mt-1 font-medium">
                  Rp{Math.max(0, remainingBalance).toLocaleString("id-ID")} sisa ÷ {daysRemaining} hari
                </p>

                {/* Progress bar today */}
                <div className="mt-4 pt-3 border-t border-[#D5E1D7]">
                  <p className="text-xs font-semibold text-[#244833]">
                    {totalSpent > 0 ? "Pengeluaran termonitor harian" : "Mulai catat transaksi untuk pantau limit"}
                  </p>
                  <div className="w-full h-2 rounded-full bg-white/70 overflow-hidden mt-1.5">
                    <div
                      className="bg-[#244833] h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentSpent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 7-Days Chart */}
              <div className="sm:col-span-6 bg-white/60 backdrop-blur-xs rounded-xl p-3.5 border border-white/70">
                <p className="text-[11px] font-medium text-[#687C6D] mb-3 text-right">
                  Tren 7 hari terakhir
                </p>
                <div className="flex items-end justify-between gap-1.5 h-20 px-1">
                  {dailyHistory.map((d) => (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div
                        style={{ height: `${d.height}%` }}
                        className={`w-full max-w-[20px] rounded-t-sm transition-all ${
                          d.active ? "bg-[#E08C38]" : "bg-[#4D7A5E]"
                        }`}
                      />
                      <span className="text-[10px] text-[#6F8274] font-medium">
                        {d.day}
                      </span>
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

        {/* Right: A little help from SakuWise (AI Prompt) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDE7] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#244833] text-white flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3 h-3" />
              </div>
              <span className="text-xs font-bold text-[#244833]">
                Asisten Cerdas Sakuwise
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#1E3A2B] tracking-tight">
              {transactions.length > 0
                ? "Alokasi keuanganmu sedang termonitor."
                : "Mulai langkah bijak finansial pertamamu."}
            </h3>
            <p className="text-xs text-[#55695B] leading-relaxed mt-2">
              {transactions.length > 0
                ? `Kamu telah mencatat ${transactions.length} transaksi. AI Sakuwise siap memberi rekomendasi penghematan harian.`
                : "Atur allowance bulanan dan catat pengeluaran harianmu untuk mendapatkan insight keuangan otomatis."}
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
              Saran berbasis data tercatat.
            </span>
          </div>
        </div>

      </div>

      {/* 3. BOTTOM ROW (RECENT TRANSACTIONS & COMING UP SOON) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Recent Transactions (The little things add up) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDE7] shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-[#1E3A2B]">
                The little things add up
              </h3>
              <p className="text-xs text-[#718576]">Transaksi terbaru</p>
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

          {/* Transactions Table OR Clean Empty State */}
          {transactions.length === 0 ? (
            <div className="py-12 px-4 text-center rounded-2xl bg-[#FAF8F5] border border-dashed border-[#DCE4DD] flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-[#E8EFEA] text-[#244833] flex items-center justify-center mb-3">
                <Receipt className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h4 className="text-sm font-bold text-[#1E3A2B]">Belum ada transaksi tercatat</h4>
              <p className="text-xs text-[#718576] max-w-sm mt-1 leading-relaxed">
                Catat pengeluaran pertamamu untuk mulai memantau alokasi saku dan mengendalikan keuangan secara real-time.
              </p>
              <div className="mt-5 flex items-center gap-3 flex-wrap justify-center">
                <button
                  type="button"
                  onClick={onOpenAddExpense}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#224431] hover:bg-[#183526] shadow-sm transition-all cursor-pointer"
                >
                  + Catat Pengeluaran Pertama
                </button>
                <button
                  type="button"
                  onClick={resetToSampleData}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#244833] bg-white border border-[#D5E1D7] hover:bg-[#FAF8F5] transition-all cursor-pointer"
                >
                  Muat Data Contoh (Demo)
                </button>
              </div>
            </div>
          ) : (
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
                        <td className="py-3.5 pr-4">
                          <p className="font-semibold text-[#1E3A2B] text-xs">
                            {t.name}
                          </p>
                          <p className="text-[10px] text-[#7D9183]">{t.time}</p>
                        </td>
                        <td className="py-3.5 pr-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium ${badgeStyle.bg} ${badgeStyle.text}`}
                          >
                            {t.category}
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-bold text-[#1E3A2B]">
                          -Rp{t.amount.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
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

            {bills.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E9EFEA] text-center">
                <p className="text-xs text-[#718576]">Tidak ada tagihan tertunda</p>
                <button
                  type="button"
                  onClick={() => onSwitchTab("bills")}
                  className="mt-2 text-xs font-bold text-[#244833] hover:underline"
                >
                  + Tambah Tagihan
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {bills.slice(0, 2).map((b) => (
                  <div key={b.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E9EFEA]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#E8EFEA] text-[#1E3A2B] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                        {b.day}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1E3A2B]">{b.name}</p>
                        <p className="text-[10px] text-[#718576]">{b.due}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#1E3A2B]">
                      Rp{b.amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* A little closer to your goals (Savings) */}
          <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs">
            <h3 className="text-sm font-bold text-[#1E3A2B]">
              A little closer to your goals
            </h3>
            
            {goals.length === 0 ? (
              <div className="p-4 mt-3 rounded-xl bg-[#FAF8F5] border border-[#E9EFEA] text-center">
                <p className="text-xs text-[#718576]">Belum ada target tabungan aktif</p>
                <button
                  type="button"
                  onClick={() => onSwitchTab("savings")}
                  className="mt-2 text-xs font-bold text-[#244833] hover:underline"
                >
                  + Buat Target Tabungan
                </button>
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-xs font-bold text-[#1E3A2B]">{goals[0].title}</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl font-extrabold text-[#1E3A2B]">
                    Rp{goals[0].current.toLocaleString("id-ID")}
                  </span>
                  <span className="text-xs text-[#718576]">
                    / Rp{goals[0].target.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-[#EBF0EC] overflow-hidden mt-2">
                  <div
                    className="bg-[#244833] h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.round((goals[0].current / goals[0].target) * 100))}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-[#6C8072]">
                    {Math.min(100, Math.round((goals[0].current / goals[0].target) * 100))}% tercapai
                  </span>
                  <button
                    type="button"
                    onClick={() => onSwitchTab("savings")}
                    className="font-bold text-[#244833] hover:underline cursor-pointer"
                  >
                    Tambah tabungan +
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Modal: Edit Monthly Allowance */}
      {editAllowanceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#DCE4DD]">
            <h3 className="text-sm font-bold text-[#1E3A2B]">Atur Allowance Bulanan</h3>
            <p className="text-xs text-[#718576] mt-0.5 mb-4">
              Masukkan total pemasukan atau jatah anggaranmu untuk bulan ini.
            </p>

            <form onSubmit={handleSaveAllowance} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[#677C6D] block mb-1">
                  Nominal Allowance (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1E3A2B]">
                    Rp
                  </span>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="3.000.000"
                    value={newAllowanceInput}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, "");
                      setNewAllowanceInput(raw ? parseInt(raw, 10).toLocaleString("id-ID") : "");
                    }}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#D7E2D9] text-base font-extrabold text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditAllowanceOpen(false)}
                  className="w-1/2 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 text-xs font-bold text-white bg-[#224431] hover:bg-[#163323] rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Simpan Saldo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
