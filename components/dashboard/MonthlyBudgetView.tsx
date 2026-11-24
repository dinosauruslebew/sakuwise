"use client";

import React, { useState } from "react";
import { Plus, Check, Calendar, AlertCircle } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function MonthlyBudgetView() {
  const {
    allowance,
    categories,
    updateCategoryBudget,
    addCategory,
    remainingBalance,
    dailySpendingLimit,
    daysRemaining,
  } = useData();

  const [addCatModalOpen, setAddCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatBudget, setNewCatBudget] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");

  const totalBudget = categories.reduce((acc, c) => acc + c.budget, 0);
  const totalSpent = categories.reduce((acc, c) => acc + c.spent, 0);
  const leftToAllocate = Math.max(0, allowance - totalBudget);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBudget = parseInt(newCatBudget.replace(/[^0-9]/g, ""), 10);
    if (!newCatName.trim() || isNaN(cleanBudget)) return;

    addCategory(newCatName.trim(), cleanBudget, newCatDesc.trim() || "Saku Anggaran");
    setNewCatName("");
    setNewCatBudget("");
    setNewCatDesc("");
    setAddCatModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* 1. TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs">
          <p className="text-xs font-semibold text-[#718576]">Monthly allowance</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2B] tracking-tight mt-1.5">
            Rp{allowance.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-[#7D9183] mt-2">
            Masuk pada tanggal 1 setiap bulan
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs">
          <p className="text-xs font-semibold text-[#718576]">Allocated budget</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2B] tracking-tight mt-1.5">
            Rp{totalBudget.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-[#7D9183] mt-2">
            {allowance > 0 ? `${Math.round((totalBudget / allowance) * 100)}% dari allowance teralokasi` : "Belum ada alokasi"}
          </p>
        </div>

        <div className="bg-[#224431] text-white rounded-2xl p-6 border border-[#2D583F] shadow-md">
          <p className="text-xs font-medium text-[#B4CEBD]">Left to allocate</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5">
            Rp{leftToAllocate.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-[#A1BFA9] mt-2">
            {leftToAllocate === 0 ? "Setiap rupiah punya tempatnya" : "Tersedia untuk saku baru"}
          </p>
        </div>
      </div>

      {/* 2. MAIN BUDGET TABLE & RIGHT PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Make room for what matters */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDE7] shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#F0F4F0] gap-2">
            <div>
              <h3 className="text-base font-bold text-[#1E3A2B]">
                Make room for what matters
              </h3>
              <p className="text-xs text-[#718576]">
                Atur pembagian saku anggaran fleksibel untuk kebutuhan harian dan impian.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAddCatModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#244833] hover:text-[#112419] bg-[#E8EFEA] hover:bg-[#DCE6DF] px-3.5 py-2 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add category</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F0F4F0] text-[10px] font-bold uppercase tracking-wider text-[#7A8E80]">
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Monthly Budget</th>
                  <th className="pb-3">Spent</th>
                  <th className="pb-3 text-right">Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F8F5]">
                {categories.map((c) => {
                  const spentPercent = c.budget > 0 ? Math.min(100, Math.round((c.spent / c.budget) * 100)) : 0;
                  const remaining = Math.max(0, c.budget - c.spent);
                  return (
                    <tr key={c.id} className="group hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#E08C38]" />
                          <div>
                            <p className="font-bold text-[#1E3A2B]">{c.name}</p>
                            <p className="text-[10px] text-[#788B7D]">{c.desc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 font-semibold text-[#1E3A2B]">
                        <input
                          type="text"
                          value={c.budget ? `Rp ${c.budget.toLocaleString("id-ID")}` : "Rp 0"}
                          onChange={(e) => {
                            const val = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
                            updateCategoryBudget(c.id, isNaN(val) ? 0 : val);
                          }}
                          className="w-32 bg-[#FAF8F5] px-2.5 py-1 rounded-md border border-[#E7EDE7] focus:bg-white focus:outline-none focus:border-[#244833]"
                        />
                      </td>
                      <td className="py-3.5 pr-4">
                        <p className="font-semibold text-[#1E3A2B]">
                          Rp{c.spent.toLocaleString("id-ID")}
                        </p>
                        <div className="w-24 h-1.5 rounded-full bg-[#EAEFEA] overflow-hidden mt-1">
                          <div
                            className="bg-[#E08C38] h-full rounded-full transition-all"
                            style={{ width: `${spentPercent}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 text-right font-bold text-[#1E3A2B]">
                        Rp{remaining.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  );
                })}

                {/* Total Row */}
                <tr className="border-t-2 border-[#E7EDE7] font-bold text-[#1E3A2B]">
                  <td className="py-4">Total</td>
                  <td className="py-4">Rp{totalBudget.toLocaleString("id-ID")}</td>
                  <td className="py-4">Rp{totalSpent.toLocaleString("id-ID")}</td>
                  <td className="py-4 text-right">Rp{Math.max(0, totalBudget - totalSpent).toLocaleString("id-ID")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Start with your allowance & All set card */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Form: Start with your allowance */}
          <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs">
            <h3 className="text-sm font-bold text-[#1E3A2B]">
              Start with your allowance
            </h3>
            <p className="text-xs text-[#718576] mt-0.5 mb-4">
              Pemasukan atau anggaran yang masuk setiap bulannya.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">
                  Monthly allowance
                </label>
                <input
                  type="text"
                  readOnly
                  value={`Rp ${allowance.toLocaleString("id-ID")}`}
                  className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-[#D7E2D9] bg-[#FAF8F5] text-[#1E3A2B] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">
                  Jadwal Masuk Berikutnya
                </label>
                <div className="flex items-center justify-between text-xs font-medium px-3 py-2.5 rounded-xl border border-[#D7E2D9] bg-white">
                  <span>01 Desember 2026</span>
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#667A6C]">Berulang</span>
                <span className="font-bold text-[#1E3A2B]">Setiap bulan</span>
              </div>

              <p className="text-[11px] text-[#7E8F82] pt-2 border-t border-[#F2F5F2]">
                Periode aktif: 1–30 November 2026
              </p>
            </div>
          </div>

          {/* Card: All set. Every rupiah has a role */}
          <div className="bg-[#FEF7EC] rounded-2xl p-6 border border-[#FDE5C5] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#E08C38]" />
            <h4 className="text-sm font-bold text-[#1E3A2B]">
              All set. Every rupiah has a role.
            </h4>

            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="font-bold text-[#20743E]">
                {allowance > 0 ? `${Math.round((totalBudget / allowance) * 100)}% dialokasikan` : "0% dialokasikan"}
              </span>
              <span className="text-[#78644A]">Rp{leftToAllocate.toLocaleString("id-ID")} tersisa</span>
            </div>

            <p className="text-xs text-[#7B613E] leading-relaxed mt-2.5">
              Kebutuhan dasarmu terlindungi. Kamu dapat menyesuaikan saku anggaran kapan saja sesuai prioritas.
            </p>

            <div className="mt-4 pt-3 border-t border-[#FCDDB5] flex items-center gap-1.5 text-xs text-[#20743E] font-semibold">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Total anggaran tersinkronisasi otomatis</span>
            </div>
          </div>

        </div>

      </div>

      {/* 3. BOTTOM BANNER */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDE7] shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-md">
            <h3 className="text-base font-bold text-[#1E3A2B]">
              A daily limit that moves with you
            </h3>
            <p className="text-xs text-[#637668] mt-1 leading-relaxed">
              Limit harianmu otomatis terhitung ulang setiap kali mencatat pengeluaran.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <div>
              <p className="text-[10px] uppercase font-bold text-[#7A8E80]">
                Remaining balance
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-[#1E3A2B]">
                Rp{remainingBalance.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="text-gray-300 font-light text-xl hidden sm:block">÷</div>

            <div>
              <p className="text-[10px] uppercase font-bold text-[#7A8E80]">
                Days until allowance
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-[#1E3A2B]">
                {daysRemaining} hari
              </p>
            </div>

            <div className="text-gray-300 font-light text-xl hidden sm:block">=</div>

            <div>
              <p className="text-[10px] uppercase font-bold text-[#7A8E80]">
                Daily spending limit
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-[#20743E]">
                Rp{dailySpendingLimit.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Category */}
      {addCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#DCE4DD]">
            <h3 className="text-sm font-bold text-[#1E3A2B]">Tambah Saku Anggaran</h3>
            <p className="text-xs text-[#718576] mt-0.5 mb-4">
              Buat saku baru untuk pos pengeluaran spesifik.
            </p>

            <form onSubmit={handleCreateCategory} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-[#677C6D] block mb-1">
                  Nama Saku
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Belanja Bulanan"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-semibold text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#677C6D] block mb-1">
                  Alokasi Anggaran (Rp)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 500.000"
                  value={newCatBudget}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setNewCatBudget(raw ? parseInt(raw, 10).toLocaleString("id-ID") : "");
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-semibold text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#677C6D] block mb-1">
                  Deskripsi Singkat (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kebutuhan dapur dan mandi"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-semibold text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddCatModalOpen(false)}
                  className="w-1/2 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 text-xs font-bold text-white bg-[#224431] hover:bg-[#163323] rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Simpan Saku
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
