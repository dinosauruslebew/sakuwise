"use client";

import React, { useState } from "react";
import { Plus, Check, Trash2 } from "lucide-react";
import {
  useFinance,
  formatRupiah,
  formatShortDate,
  parseISODate,
  addDays,
  diffDays,
} from "@/context/FinanceContext";

interface Notice {
  ok: boolean;
  text: string;
}

export default function MonthlyBudgetView() {
  const {
    income,
    setIncome,
    setNextAllowanceDate,
    addCategory,
    updateCategory,
    deleteCategory,
    summary,
  } = useFinance();
  const {
    today,
    daysLeft,
    balanceAtDayStart,
    dailyLimit,
    totalBudget,
    unallocated,
    categoryStats,
    periodStart,
    nextAllowanceDate,
  } = summary;

  // Allowance form
  const [incomeStr, setIncomeStr] = useState(() => income.toLocaleString("id-ID"));
  const [dateStr, setDateStr] = useState(() => nextAllowanceDate);
  const [allowNotice, setAllowNotice] = useState<Notice | null>(null);

  // Add-category form
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newBudgetStr, setNewBudgetStr] = useState("");
  const [addError, setAddError] = useState("");

  const totalSpent = categoryStats.reduce((acc, c) => acc + c.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overCount = categoryStats.filter((c) => c.over).length;

  const handleSaveAllowance = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(incomeStr.replace(/[^0-9]/g, ""), 10);

    if (!dateStr || diffDays(today, dateStr) <= 0) {
      setAllowNotice({ ok: false, text: "Next allowance date must be in the future." });
      return;
    }
    const incomeResult = setIncome(amount);
    if (!incomeResult.ok) {
      setAllowNotice({ ok: false, text: incomeResult.error || "Invalid allowance." });
      return;
    }
    const dateResult = setNextAllowanceDate(dateStr);
    if (!dateResult.ok) {
      setAllowNotice({ ok: false, text: dateResult.error || "Invalid date." });
      return;
    }
    setAllowNotice({ ok: true, text: "Allowance updated. Your daily limit has been recalculated." });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const budget = newBudgetStr ? parseInt(newBudgetStr.replace(/[^0-9]/g, ""), 10) : 0;
    const result = addCategory({ name: newName, desc: newDesc, budget });
    if (!result.ok) {
      setAddError(result.error || "Could not add this category.");
      return;
    }
    setNewName("");
    setNewDesc("");
    setNewBudgetStr("");
    setAddError("");
    setShowAdd(false);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (
      window.confirm(
        `Delete the "${name}" category? Existing expenses in this category are kept but will no longer count toward a budget.`
      )
    ) {
      deleteCategory(id);
    }
  };

  const commitBudget = (id: string, current: number, el: HTMLInputElement) => {
    const raw = el.value.replace(/[^0-9]/g, "");
    const value = raw ? parseInt(raw, 10) : NaN;
    if (isNaN(value)) {
      el.value = current.toLocaleString("id-ID");
      return;
    }
    if (value !== current) updateCategory(id, { budget: value });
    el.value = value.toLocaleString("id-ID");
  };

  const allocatedPercent = income > 0 ? Math.round((totalBudget / income) * 100) : 0;
  const periodEnd = addDays(nextAllowanceDate, -1);
  const nextDay = parseISODate(nextAllowanceDate).getDate();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs">
          <p className="text-xs font-medium text-[#718576]">Monthly allowance</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2B] tracking-tight mt-1.5">
            {formatRupiah(income)}
          </p>
          <p className="text-xs text-[#7D9183] mt-2">Arrives on day {nextDay} of each month</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs">
          <p className="text-xs font-medium text-[#718576]">Allocated budget</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2B] tracking-tight mt-1.5">
            {formatRupiah(totalBudget)}
          </p>
          <p className="text-xs text-[#7D9183] mt-2">{allocatedPercent}% of your allowance assigned</p>
        </div>

        <div
          className={`text-white rounded-2xl p-6 border shadow-md ${
            unallocated < 0 ? "bg-[#9A3B1B] border-[#B4491F]" : "bg-[#224431] border-[#2D583F]"
          }`}
        >
          <p className="text-xs font-medium text-[#E4EEE7]">Left to allocate</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5">
            {formatRupiah(unallocated)}
          </p>
          <p className="text-xs text-[#E4EEE7]/80 mt-2">
            {unallocated === 0
              ? "Every rupiah has a place"
              : unallocated > 0
                ? "Assign the rest to a category"
                : "Over-allocated. Reduce a category"}
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
                Set a flexible budget for campus life and everyday essentials. Changes save automatically.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAdd((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#244833] hover:text-[#112419] bg-[#E8EFEA] hover:bg-[#DCE6DF] px-3 py-1.5 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAdd ? "Close" : "Add category"}</span>
            </button>
          </div>

          {/* Add category form */}
          {showAdd && (
            <form
              onSubmit={handleAddCategory}
              className="mb-5 p-4 rounded-xl bg-[#FAF8F5] border border-[#E4ECE4] space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-4">
                  <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Subscriptions"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-medium text-[#1E3A2B] focus:outline-none focus:border-[#224431] bg-white"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-medium text-[#1E3A2B] focus:outline-none focus:border-[#224431] bg-white"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">Monthly budget</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1E3A2B]">
                      Rp
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={newBudgetStr}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, "");
                        setNewBudgetStr(raw ? parseInt(raw, 10).toLocaleString("id-ID") : "");
                      }}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-bold text-[#1E3A2B] focus:outline-none focus:border-[#224431] bg-white"
                    />
                  </div>
                </div>
              </div>

              {addError && (
                <p className="text-xs font-semibold text-[#B4491F] bg-[#FBE9E2] rounded-lg px-3 py-2">
                  {addError}
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#224431] hover:bg-[#163323] cursor-pointer"
                >
                  Save category
                </button>
              </div>
            </form>
          )}

          {categoryStats.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#718576]">
              No categories yet. Add one to start planning your allowance.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#F0F4F0] text-[11px] font-bold uppercase tracking-wider text-[#7A8E80]">
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Monthly Budget</th>
                    <th className="pb-3">Spent</th>
                    <th className="pb-3 text-right">Remaining</th>
                    <th className="pb-3 w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F8F5]">
                  {categoryStats.map((c) => (
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
                        <div className="relative inline-block">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#718576]">
                            Rp
                          </span>
                          <input
                            key={`${c.id}-${c.budget}`}
                            type="text"
                            inputMode="numeric"
                            defaultValue={c.budget.toLocaleString("id-ID")}
                            onBlur={(e) => commitBudget(c.id, c.budget, e.currentTarget)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") e.currentTarget.blur();
                            }}
                            aria-label={`Monthly budget for ${c.name}`}
                            className="w-32 pl-8 pr-2 py-1 rounded-md border border-[#E7EDE7] bg-[#FAF8F5] text-xs font-semibold text-[#1E3A2B] focus:outline-none focus:border-[#224431] focus:bg-white"
                          />
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <p className="font-semibold text-[#1E3A2B]">{formatRupiah(c.spent)}</p>
                        <div className="w-24 h-1.5 rounded-full bg-[#EAEFEA] overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${c.over ? "bg-[#D2642F]" : "bg-[#E08C38]"}`}
                            style={{ width: `${Math.min(100, c.percent)}%` }}
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
                    <td className="py-4">{formatRupiah(totalBudget)}</td>
                    <td className="py-4">{formatRupiah(totalSpent)}</td>
                    <td className="py-4 text-right">{formatRupiah(totalRemaining)}</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-5">
          {/* Form: Start with your allowance */}
          <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs">
            <h3 className="text-sm font-bold text-[#1E3A2B]">Start with your allowance</h3>
            <p className="text-xs text-[#718576] mt-0.5 mb-4">Tell us what comes in, and when.</p>

            <form onSubmit={handleSaveAllowance} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">
                  Monthly allowance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1E3A2B]">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={incomeStr}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, "");
                      setIncomeStr(raw ? parseInt(raw, 10).toLocaleString("id-ID") : "");
                    }}
                    className="w-full text-xs font-bold pl-9 pr-3 py-2.5 rounded-xl border border-[#D7E2D9] bg-white text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">
                  Next allowance date
                </label>
                <input
                  type="date"
                  value={dateStr}
                  min={addDays(today, 1)}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border border-[#D7E2D9] bg-white text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#667A6C]">Repeats</span>
                <span className="font-bold text-[#1E3A2B]">Every month</span>
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
                Current period: {formatShortDate(periodStart)} to {formatShortDate(periodEnd)}
              </p>
            </form>
          </div>

          {/* Card: allocation status */}
          {unallocated === 0 ? (
            <div className="bg-[#FEF7EC] rounded-2xl p-6 border border-[#FDE5C5] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#E08C38]" />
              <h4 className="text-sm font-bold text-[#1E3A2B]">All set. Every rupiah has a role.</h4>
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
          ) : unallocated > 0 ? (
            <div className="bg-[#FEF7EC] rounded-2xl p-6 border border-[#FDE5C5] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#E08C38]" />
              <h4 className="text-sm font-bold text-[#1E3A2B]">Almost there.</h4>
              <div className="flex items-center justify-between mt-3 text-xs">
                <span className="font-bold text-[#9A5B15]">{allocatedPercent}% allocated</span>
                <span className="text-[#78644A]">{formatRupiah(unallocated)} unassigned</span>
              </div>
              <p className="text-xs text-[#7B613E] leading-relaxed mt-2.5">
                You still have money without a purpose. Add it to a category or create a new one.
              </p>
            </div>
          ) : (
            <div className="bg-[#FBE9E2] rounded-2xl p-6 border border-[#F2C9B8] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#D2642F]" />
              <h4 className="text-sm font-bold text-[#7D2E12]">Your budget is over your allowance.</h4>
              <div className="flex items-center justify-between mt-3 text-xs">
                <span className="font-bold text-[#B4491F]">{allocatedPercent}% allocated</span>
                <span className="text-[#7D2E12]">{formatRupiah(-unallocated)} too much</span>
              </div>
              <p className="text-xs text-[#7D2E12] leading-relaxed mt-2.5">
                Reduce one or more categories so the total matches your allowance.
              </p>
            </div>
          )}

          {overCount > 0 && (
            <div className="bg-[#FBE9E2] rounded-2xl p-5 border border-[#F2C9B8]">
              <p className="text-sm font-bold text-[#7D2E12]">
                {overCount} {overCount === 1 ? "category is" : "categories are"} over budget
              </p>
              <p className="text-xs text-[#7D2E12] mt-1">
                {categoryStats
                  .filter((c) => c.over)
                  .map((c) => c.name)
                  .join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. BOTTOM BANNER: A daily limit that moves with you */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDE7] shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-md">
            <h3 className="text-base font-bold text-[#1E3A2B]">A daily limit that moves with you</h3>
            <p className="text-xs text-[#637668] mt-1 leading-relaxed">
              Your daily limit updates when you log an expense. Keep your entries up to date for a more
              accurate plan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <div>
              <p className="text-[11px] uppercase font-bold text-[#7A8E80]">Remaining balance</p>
              <p className="text-xl sm:text-2xl font-extrabold text-[#1E3A2B]">
                {formatRupiah(Math.max(0, balanceAtDayStart))}
              </p>
            </div>

            <div className="text-gray-300 font-light text-xl hidden sm:block">&divide;</div>

            <div>
              <p className="text-[11px] uppercase font-bold text-[#7A8E80]">Days until allowance</p>
              <p className="text-xl sm:text-2xl font-extrabold text-[#1E3A2B]">
                {daysLeft} {daysLeft === 1 ? "day" : "days"}
              </p>
            </div>

            <div className="text-gray-300 font-light text-xl hidden sm:block">=</div>

            <div>
              <p className="text-[11px] uppercase font-bold text-[#7A8E80]">Daily spending limit</p>
              <p className="text-xl sm:text-2xl font-extrabold text-[#20743E]">{formatRupiah(dailyLimit)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
