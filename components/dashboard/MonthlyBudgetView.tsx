"use client";

import React, { useState } from "react";
import { Plus, Check, Calendar } from "lucide-react";

export default function MonthlyBudgetView() {
  const [categories, setCategories] = useState([
    {
      id: "food",
      name: "Food & drinks",
      desc: "Meals, snacks & coffee",
      budget: 900000,
      spent: 510000,
    },
    {
      id: "transport",
      name: "Transport",
      desc: "Commutes & trips",
      budget: 300000,
      spent: 180000,
    },
    {
      id: "academic",
      name: "Academic needs",
      desc: "Books, printing & supplies",
      budget: 350000,
      spent: 125000,
    },
    {
      id: "accommodation",
      name: "Accommodation",
      desc: "Rent, utilities & Wi-Fi",
      budget: 1000000,
      spent: 800000,
    },
    {
      id: "personal",
      name: "Personal",
      desc: "Laundry, social & self-care",
      budget: 300000,
      spent: 100000,
    },
    {
      id: "emergency",
      name: "Emergency fund",
      desc: "For the unexpected",
      budget: 150000,
      spent: 25000,
    },
  ]);

  const totalBudget = categories.reduce((acc, c) => acc + c.budget, 0);
  const totalSpent = categories.reduce((acc, c) => acc + c.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs">
          <p className="text-xs font-semibold text-[#718576]">Monthly allowance</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2B] tracking-tight mt-1.5">
            Rp3.000.000
          </p>
          <p className="text-xs text-[#7D9183] mt-2">
            Arrives on the 1st of each month
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs">
          <p className="text-xs font-semibold text-[#718576]">Allocated budget</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2B] tracking-tight mt-1.5">
            Rp3.000.000
          </p>
          <p className="text-xs text-[#7D9183] mt-2">
            100% of your allowance assigned
          </p>
        </div>

        <div
          className={`text-white rounded-2xl p-6 border shadow-md ${
            unallocated < 0 ? "bg-[#9A3B1B] border-[#B4491F]" : "bg-[#224431] border-[#2D583F]"
          }`}
        >
          <p className="text-xs font-medium text-[#E4EEE7]">Left to allocate</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5">
            Rp0
          </p>
          <p className="text-xs text-[#A1BFA9] mt-2">
            Every rupiah has a place
          </p>
        </div>
      </div>

      {/* 2. MAIN BUDGET TABLE & RIGHT PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDE7] shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#F0F4F0] gap-2">
            <div>
              <h3 className="text-base font-bold text-[#1E3A2B]">Make room for what matters</h3>
              <p className="text-xs text-[#718576]">
                Set a flexible budget for campus life and everyday essentials.
              </p>
            </div>
            <button
              type="button"
              onClick={() => alert("Form tambah kategori anggaran baru")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#244833] hover:text-[#112419] bg-[#E8EFEA] hover:bg-[#DCE6DF] px-3 py-1.5 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAdd ? "Close" : "Add category"}</span>
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
                  const spentPercent = Math.min(100, Math.round((c.spent / c.budget) * 100));
                  const remaining = c.budget - c.spent;
                  return (
                    <tr key={c.id} className="group hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${c.over ? "bg-[#D2642F]" : "bg-[#E08C38]"}`}
                          />
                          <div>
                            <p className="font-bold text-[#1E3A2B]">{c.name}</p>
                            <p className="text-[11px] text-[#788B7D]">{c.desc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 font-semibold text-[#1E3A2B]">
                        <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-md border border-[#E7EDE7]">
                          Rp {c.budget.toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <p className="font-semibold text-[#1E3A2B]">{formatRupiah(c.spent)}</p>
                        <div className="w-24 h-1.5 rounded-full bg-[#EAEFEA] overflow-hidden mt-1">
                          <div
                            className="bg-[#E08C38] h-full rounded-full"
                            style={{ width: `${spentPercent}%` }}
                          />
                        </div>
                      </td>
                      <td
                        className={`py-3.5 text-right font-bold ${
                          c.over ? "text-[#B4491F]" : "text-[#1E3A2B]"
                        }`}
                      >
                        {formatRupiah(c.remaining)}
                      </td>
                      <td className="py-3.5 pl-2 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(c.id, c.name)}
                          className="p-1 rounded-md text-gray-300 hover:text-[#B4491F] hover:bg-[#FBE9E2] transition-colors cursor-pointer"
                          aria-label={`Delete ${c.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                {/* Total Row */}
                <tr className="border-t-2 border-[#E7EDE7] font-bold text-[#1E3A2B]">
                  <td className="py-4">Total</td>
                  <td className="py-4">Rp{totalBudget.toLocaleString("id-ID")}</td>
                  <td className="py-4">Rp{totalSpent.toLocaleString("id-ID")}</td>
                  <td className="py-4 text-right">Rp{totalRemaining.toLocaleString("id-ID")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-5">
          {/* Form: Start with your allowance */}
          <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs">
            <h3 className="text-sm font-bold text-[#1E3A2B]">
              Start with your allowance
            </h3>
            <p className="text-xs text-[#718576] mt-0.5 mb-4">
              Tell us what comes in, and when.
            </p>

            <form onSubmit={handleSaveAllowance} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">
                  Monthly allowance
                </label>
                <input
                  type="text"
                  readOnly
                  value="Rp 3.000.000"
                  className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-[#D7E2D9] bg-[#FAF8F5] text-[#1E3A2B] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">
                  Jadwal Masuk Berikutnya
                </label>
                <div className="flex items-center justify-between text-xs font-medium px-3 py-2.5 rounded-xl border border-[#D7E2D9] bg-white">
                  <span>01 December 2026</span>
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#667A6C]">Repeats</span>
                <span className="font-bold text-[#1E3A2B]">Every month ▾</span>
              </div>

              {allowNotice && (
                <p
                  className={`text-xs font-semibold rounded-lg px-3 py-2 ${
                    allowNotice.ok ? "text-[#20743E] bg-[#E7F6EC]" : "text-[#B4491F] bg-[#FBE9E2]"
                  }`}
                >
                  {allowNotice.text}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#224431] hover:bg-[#163323] cursor-pointer"
              >
                Update allowance
              </button>

              <p className="text-[11px] text-[#7E8F82] pt-2 border-t border-[#F2F5F2]">
                Current period: 1–30 November 2026
              </p>
            </form>
          </div>

          {/* Card: All set. Every rupiah has a role */}
          <div className="bg-[#FEF7EC] rounded-2xl p-6 border border-[#FDE5C5] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#E08C38]" />
            <h4 className="text-sm font-bold text-[#1E3A2B]">
              All set. Every rupiah has a role.
            </h4>

            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="font-bold text-[#20743E]">100% allocated</span>
              <span className="text-[#78644A]">Rp0 unassigned</span>
            </div>

            <p className="text-xs text-[#7B613E] leading-relaxed mt-2.5">
              Your essentials are covered. You can adjust any category as your month changes.
            </p>

            <div className="mt-4 pt-3 border-t border-[#FCDDB5] flex items-center gap-1.5 text-xs text-[#20743E] font-semibold">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Total budget matches your allowance</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. BOTTOM BANNER */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDE7] shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-md">
            <h3 className="text-base font-bold text-[#1E3A2B]">A daily limit that moves with you</h3>
            <p className="text-xs text-[#637668] mt-1 leading-relaxed">
              Your daily limit updates when you log an expense. Keep your entries up to date for a more accurate plan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <div>
              <p className="text-[11px] uppercase font-bold text-[#7A8E80]">Remaining balance</p>
              <p className="text-xl sm:text-2xl font-extrabold text-[#1E3A2B]">
                Rp1.260.000
              </p>
            </div>

            <div className="text-gray-300 font-light text-xl hidden sm:block">&divide;</div>

            <div>
              <p className="text-[11px] uppercase font-bold text-[#7A8E80]">Days until allowance</p>
              <p className="text-xl sm:text-2xl font-extrabold text-[#1E3A2B]">
                14 days
              </p>
            </div>

            <div className="text-gray-300 font-light text-xl hidden sm:block">=</div>

            <div>
              <p className="text-[10px] uppercase font-bold text-[#7A8E80]">
                Daily spending limit
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-[#20743E]">
                Rp90.000
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
