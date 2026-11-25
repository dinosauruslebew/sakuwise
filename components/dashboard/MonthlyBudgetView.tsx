"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Sliders,
  Sparkles,
  PieChart,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Check,
  X,
  RefreshCw,
  Wallet,
} from "lucide-react";
import {
  useFinance,
  formatRupiah,
  formatShortDate,
  parseISODate,
  addDays,
  diffDays,
  type BudgetGroup,
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
    applyAutoAllocation,
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
    groupStats,
    periodStart,
    nextAllowanceDate,
  } = summary;

  // Modals state
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Income & Auto-allocation Form state
  const [incomeInputStr, setIncomeInputStr] = useState(() =>
    income > 0 ? income.toLocaleString("id-ID") : "5.000.000"
  );
  const [selectedPreset, setSelectedPreset] = useState<
    "50/30/20" | "70/20/10" | "60/20/20" | "custom"
  >("50/30/20");
  const [customRatios, setCustomRatios] = useState({
    needs: 50,
    wants: 30,
    savings: 20,
  });
  const [allocationNotice, setAllocationNotice] = useState<Notice | null>(null);

  // Add-category Form state
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newBudgetStr, setNewBudgetStr] = useState("");
  const [newGroup, setNewGroup] = useState<BudgetGroup>("needs");
  const [addError, setAddError] = useState("");

  // Next allowance date inline update
  const [dateStr, setDateStr] = useState(() => nextAllowanceDate);
  const [allowNotice, setAllowNotice] = useState<Notice | null>(null);

  const totalSpent = categoryStats.reduce((acc, c) => acc + c.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overCount = categoryStats.filter((c) => c.over).length;
  const allocatedPercent = income > 0 ? Math.round((totalBudget / income) * 100) : 0;
  const periodEnd = addDays(nextAllowanceDate, -1);
  const nextDay = parseISODate(nextAllowanceDate).getDate();

  // Helper for parsing raw currency input
  const parseAmount = (str: string) => {
    const raw = str.replace(/[^0-9]/g, "");
    return raw ? parseInt(raw, 10) : 0;
  };

  const handleApplyAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanIncome = parseAmount(incomeInputStr);
    if (cleanIncome <= 0) {
      setAllocationNotice({
        ok: false,
        text: "Please enter a valid monthly income greater than 0.",
      });
      return;
    }

    const res = applyAutoAllocation(cleanIncome, selectedPreset, customRatios);
    if (!res.ok) {
      setAllocationNotice({ ok: false, text: res.error || "Failed to allocate budget." });
      return;
    }

    setAllocationNotice({
      ok: true,
      text: "Monthly budget successfully auto-allocated!",
    });
    setTimeout(() => {
      setShowIncomeModal(false);
      setAllocationNotice(null);
    }, 800);
  };

  const handleSaveAllowanceDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateStr || diffDays(today, dateStr) <= 0) {
      setAllowNotice({ ok: false, text: "Next allowance date must be in the future." });
      return;
    }
    const res = setNextAllowanceDate(dateStr);
    if (!res.ok) {
      setAllowNotice({ ok: false, text: res.error || "Invalid date." });
      return;
    }
    setAllowNotice({ ok: true, text: "Next allowance date updated." });
    setTimeout(() => setAllowNotice(null), 3000);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const budget = parseAmount(newBudgetStr);
    const result = addCategory({ name: newName, desc: newDesc, budget, group: newGroup });
    if (!result.ok) {
      setAddError(result.error || "Could not add this category.");
      return;
    }
    setNewName("");
    setNewDesc("");
    setNewBudgetStr("");
    setNewGroup("needs");
    setAddError("");
    setShowAddCategory(false);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (
      window.confirm(
        `Delete "${name}" category? Existing recorded transactions will be preserved.`
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

  // Preview numbers for modal
  const previewIncome = parseAmount(incomeInputStr);
  const activePercentages =
    selectedPreset === "50/30/20"
      ? { needs: 50, wants: 30, savings: 20 }
      : selectedPreset === "70/20/10"
      ? { needs: 70, wants: 20, savings: 10 }
      : selectedPreset === "60/20/20"
      ? { needs: 60, wants: 20, savings: 20 }
      : customRatios;

  const previewNeeds = Math.round((previewIncome * activePercentages.needs) / 100);
  const previewWants = Math.round((previewIncome * activePercentages.wants) / 100);
  const previewSavings = previewIncome - previewNeeds - previewWants;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* 1. HERO AUTOMATIC ALLOCATION BANNER */}
      <div className="bg-gradient-to-r from-[#244833] via-[#2A523A] to-[#1E3A2B] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-radial from-white/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-[#F7DE9D] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart 50/30/20 Auto-Allocation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Automatic Budget Allocation
            </h2>
            <p className="text-xs sm:text-sm text-[#A9C4B2] mt-2 leading-relaxed">
              Set your monthly salary or allowance once. Sakuwise automatically splits it into
              Needs (50%), Wants (30%), and Savings (20%) with live real-time progress.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIncomeInputStr(income > 0 ? income.toLocaleString("id-ID") : "5.000.000");
                setShowIncomeModal(true);
              }}
              className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-[#1E3A2B] bg-[#F7DE9D] hover:bg-[#F3D68B] transition-transform hover:scale-[1.02] active:scale-95 shadow-sm cursor-pointer flex items-center gap-2"
            >
              <Wallet className="w-4 h-4 text-[#9A5B15]" />
              <span>Set Monthly Income</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCustomizeModal(true)}
              className="px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              <span>Customize Allocation</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. THREE 50/30/20 ALLOCATION PILLARS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Pillar 1: Needs (50%) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E7EDE7] shadow-2xs hover:border-[#CCDBCF] transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#20743E]" />
              <span className="text-xs font-bold text-[#1E3A2B]">Needs (Kebutuhan Pokok)</span>
            </div>
            <span className="text-xs font-extrabold text-[#20743E] bg-[#E7F6EC] px-2 py-0.5 rounded-md">
              {groupStats.needs.ratio}% Target
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <p className="text-lg sm:text-xl font-extrabold text-[#1E3A2B]">
                {formatRupiah(groupStats.needs.budget)}
              </p>
              <p className="text-[11px] text-[#788C7E]">
                Spent: {formatRupiah(groupStats.needs.spent)}
              </p>
            </div>
            <span className="text-xs font-bold text-[#5B6D60]">
              {groupStats.needs.percent}% used
            </span>
          </div>

          {/* Interactive Progress Bar */}
          <div className="w-full h-2 rounded-full bg-[#EBF0EC] overflow-hidden mt-3">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                groupStats.needs.percent > 100
                  ? "bg-[#D2642F]"
                  : groupStats.needs.percent >= 80
                  ? "bg-[#E08C38]"
                  : "bg-[#20743E]"
              }`}
              style={{ width: `${Math.min(100, groupStats.needs.percent)}%` }}
            />
          </div>

          <p className="text-[11px] text-[#718576] mt-2.5">
            Bills, Groceries, Meals, Accommodation & Transport.
          </p>
        </div>

        {/* Pillar 2: Wants (30%) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E7EDE7] shadow-2xs hover:border-[#CCDBCF] transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#E08C38]" />
              <span className="text-xs font-bold text-[#1E3A2B]">Wants (Keinginan & Hiburan)</span>
            </div>
            <span className="text-xs font-extrabold text-[#9A5B15] bg-[#FEF3E2] px-2 py-0.5 rounded-md">
              {groupStats.wants.ratio}% Target
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <p className="text-lg sm:text-xl font-extrabold text-[#1E3A2B]">
                {formatRupiah(groupStats.wants.budget)}
              </p>
              <p className="text-[11px] text-[#788C7E]">
                Spent: {formatRupiah(groupStats.wants.spent)}
              </p>
            </div>
            <span className="text-xs font-bold text-[#5B6D60]">
              {groupStats.wants.percent}% used
            </span>
          </div>

          {/* Interactive Progress Bar */}
          <div className="w-full h-2 rounded-full bg-[#EBF0EC] overflow-hidden mt-3">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                groupStats.wants.percent > 100
                  ? "bg-[#D2642F]"
                  : groupStats.wants.percent >= 80
                  ? "bg-[#E08C38]"
                  : "bg-[#E08C38]"
              }`}
              style={{ width: `${Math.min(100, groupStats.wants.percent)}%` }}
            />
          </div>

          <p className="text-[11px] text-[#718576] mt-2.5">
            Lifestyle, Outings, Coffee, Shopping & Entertainment.
          </p>
        </div>

        {/* Pillar 3: Savings (20%) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E7EDE7] shadow-2xs hover:border-[#CCDBCF] transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#4B3B70]" />
              <span className="text-xs font-bold text-[#1E3A2B]">Savings (Tabungan & Investasi)</span>
            </div>
            <span className="text-xs font-extrabold text-[#4B3B70] bg-[#EAE8F2] px-2 py-0.5 rounded-md">
              {groupStats.savings.ratio}% Target
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <p className="text-lg sm:text-xl font-extrabold text-[#1E3A2B]">
                {formatRupiah(groupStats.savings.budget)}
              </p>
              <p className="text-[11px] text-[#788C7E]">
                Allocated: {formatRupiah(groupStats.savings.budget)}
              </p>
            </div>
            <span className="text-xs font-bold text-[#5B6D60]">Protected</span>
          </div>

          {/* Interactive Progress Bar */}
          <div className="w-full h-2 rounded-full bg-[#EBF0EC] overflow-hidden mt-3">
            <div
              className="h-full rounded-full bg-[#4B3B70] transition-all duration-500"
              style={{ width: "100%" }}
            />
          </div>

          <p className="text-[11px] text-[#718576] mt-2.5">
            Emergency Fund Buffer & Dream Savings Goals.
          </p>
        </div>

      </div>

      {/* 3. MAIN BUDGET TABLE & RIGHT SETTINGS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Category Pockets with Interactive Bars */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDE7] shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#F0F4F0] gap-2">
            <div>
              <h3 className="text-base font-bold text-[#1E3A2B]">Category Pockets</h3>
              <p className="text-xs text-[#718576]">
                Real-time tracking of each pocket. Adjust budget numbers directly in the input field.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddCategory((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#244833] hover:text-[#112419] bg-[#E8EFEA] hover:bg-[#DCE6DF] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddCategory ? "Close" : "Add Pocket"}</span>
            </button>
          </div>

          {/* Add Category Form */}
          {showAddCategory && (
            <form
              onSubmit={handleAddCategory}
              className="mb-6 p-4 rounded-xl bg-[#FAF8F5] border border-[#E4ECE4] space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-4">
                  <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">
                    Pocket Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Subscriptions"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-medium text-[#1E3A2B] focus:outline-none focus:border-[#224431] bg-white"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">
                    Allocation Group
                  </label>
                  <select
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value as BudgetGroup)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-semibold text-[#1E3A2B] focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="needs">Needs (50%)</option>
                    <option value="wants">Wants (30%)</option>
                    <option value="savings">Savings (20%)</option>
                  </select>
                </div>
                <div className="sm:col-span-5">
                  <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">
                    Monthly Budget
                  </label>
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

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  className="px-3.5 py-1.5 text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#224431] hover:bg-[#163323] cursor-pointer"
                >
                  Save Pocket
                </button>
              </div>
            </form>
          )}

          {categoryStats.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#718576]">
              No pockets created yet. Use Auto-Allocation above to start.
            </div>
          ) : (
            <div className="space-y-4">
              {categoryStats.map((c) => {
                const isOver = c.over;
                const isNear = !isOver && c.percent >= 80;
                const daysRemainder = Math.max(1, daysLeft);
                const dailyBurn = Math.max(0, Math.floor(c.remaining / daysRemainder));

                return (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7EDE7] hover:border-[#CCDBCF] transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      
                      {/* Name & Group */}
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-3 h-3 rounded-full flex-shrink-0 ${
                            isOver
                              ? "bg-[#D2642F]"
                              : isNear
                              ? "bg-[#E08C38]"
                              : c.group === "savings"
                              ? "bg-[#4B3B70]"
                              : "bg-[#20743E]"
                          }`}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-[#1E3A2B]">{c.name}</h4>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                c.group === "needs"
                                  ? "bg-[#E7F6EC] text-[#20743E]"
                                  : c.group === "wants"
                                  ? "bg-[#FEF3E2] text-[#9A5B15]"
                                  : "bg-[#EAE8F2] text-[#4B3B70]"
                              }`}
                            >
                              {c.group}
                            </span>
                          </div>
                          {c.desc && (
                            <p className="text-[11px] text-[#7A8E80] mt-0.5">{c.desc}</p>
                          )}
                        </div>
                      </div>

                      {/* Budget Input & Actions */}
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-[#718576]">Budget:</span>
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
                              className="w-28 pl-8 pr-2 py-1 rounded-lg border border-[#D5E1D7] bg-white text-xs font-bold text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(c.id, c.name)}
                          className="p-1.5 rounded-md text-gray-300 hover:text-[#B4491F] hover:bg-[#FBE9E2] transition-colors cursor-pointer"
                          title={`Delete ${c.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Interactive Real-Time Progress Bar */}
                    <div className="mt-3.5 pt-3 border-t border-[#EDF2EE]">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-[#5B6D60]">
                          Spent: <strong className="text-[#1E3A2B]">{formatRupiah(c.spent)}</strong>
                        </span>
                        <span
                          className={`font-bold ${
                            isOver ? "text-[#B4491F]" : "text-[#20743E]"
                          }`}
                        >
                          {isOver
                            ? `Over by ${formatRupiah(-c.remaining)}`
                            : `Left: ${formatRupiah(c.remaining)}`}
                        </span>
                      </div>

                      <div className="w-full h-2 rounded-full bg-[#E5ECE6] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isOver
                              ? "bg-[#D2642F]"
                              : isNear
                              ? "bg-[#E08C38]"
                              : "bg-[#244833]"
                          }`}
                          style={{ width: `${Math.min(100, c.percent)}%` }}
                        />
                      </div>

                      {/* Burn-rate recommendation */}
                      <div className="flex items-center justify-between text-[11px] text-[#7A8E80] mt-1.5">
                        <span>{c.percent}% consumed</span>
                        {!isOver && c.remaining > 0 && (
                          <span>~{formatRupiah(dailyBurn)}/day for {daysLeft} days</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Total Summary Row */}
              <div className="pt-4 mt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold text-[#1E3A2B] border-t-2 border-[#E7EDE7] gap-2">
                <span>Total Budgeted: {formatRupiah(totalBudget)}</span>
                <span>Total Spent: {formatRupiah(totalSpent)}</span>
                <span className={totalRemaining < 0 ? "text-[#B4491F]" : "text-[#20743E]"}>
                  Net Remaining: {formatRupiah(totalRemaining)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Settings & Allocation Diagnostics */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Card: Next Allowance Schedule */}
          <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs">
            <h3 className="text-sm font-bold text-[#1E3A2B]">Next Allowance Cycle</h3>
            <p className="text-xs text-[#718576] mt-0.5 mb-4">
              Repeats automatically on day {nextDay} of each month.
            </p>

            <form onSubmit={handleSaveAllowanceDate} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">
                  Next Allowance Date
                </label>
                <input
                  type="date"
                  value={dateStr}
                  min={addDays(today, 1)}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-[#D7E2D9] bg-white text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
                />
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
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#224431] hover:bg-[#163323] cursor-pointer transition-colors"
              >
                Update Allowance Date
              </button>
            </form>
          </div>

          {/* Card: Allocation Status Diagnostics */}
          <div
            className={`rounded-2xl p-6 border shadow-2xs ${
              unallocated === 0
                ? "bg-[#FEF7EC] border-[#FDE5C5]"
                : unallocated > 0
                ? "bg-[#FEF7EC] border-[#FDE5C5]"
                : "bg-[#FBE9E2] border-[#F2C9B8]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A644D]">
                ALLOCATION STATUS
              </span>
              <span
                className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                  unallocated === 0
                    ? "bg-[#E7F6EC] text-[#20743E]"
                    : unallocated > 0
                    ? "bg-[#FEF3E2] text-[#9A5B15]"
                    : "bg-[#FBE9E2] text-[#B4491F]"
                }`}
              >
                {allocatedPercent}% Assigned
              </span>
            </div>

            <h4 className="text-sm font-bold text-[#1E3A2B]">
              {unallocated === 0
                ? "100% Balanced! Every rupiah has a purpose."
                : unallocated > 0
                ? `${formatRupiah(unallocated)} unallocated.`
                : `${formatRupiah(-unallocated)} over your income.`}
            </h4>

            <p className="text-xs text-[#6F5B46] mt-1.5 leading-relaxed">
              {unallocated === 0
                ? "Your budget perfectly equals your monthly income. You're set for the month."
                : unallocated > 0
                ? "You still have unassigned funds. Put them into Emergency Fund or Savings!"
                : "Your total budget exceeds your income. Lower some category budgets or adjust percentages."}
            </p>

            <button
              type="button"
              onClick={() => {
                setIncomeInputStr(income > 0 ? income.toLocaleString("id-ID") : "5.000.000");
                setShowIncomeModal(true);
              }}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-white/80 hover:bg-white text-xs font-bold text-[#1E3A2B] border border-[#E0D8CB] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rebalance Budget Automatically</span>
            </button>
          </div>

        </div>

      </div>

      {/* ================= MODAL 1: SET MONTHLY INCOME & AUTO-ALLOCATION ================= */}
      {showIncomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#DCE4DD] animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E8EFEA] flex items-center justify-center text-[#20743E]">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1E3A2B]">Set Monthly Income</h3>
                  <p className="text-[11px] text-[#718576]">Automatic percentage allocation plan</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIncomeModal(false)}
                className="p-1.5 rounded-full hover:bg-black/5 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyAllocation} className="mt-5 space-y-5">
              
              {/* Income Amount Input */}
              <div>
                <label className="text-[11px] font-bold text-[#677C6D] uppercase tracking-wider block mb-1">
                  Total Monthly Income (Salary / Allowance) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#1E3A2B]">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    autoFocus
                    placeholder="5.000.000"
                    value={incomeInputStr}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, "");
                      setIncomeInputStr(raw ? parseInt(raw, 10).toLocaleString("id-ID") : "");
                    }}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#D5E1D7] text-lg font-extrabold text-[#1E3A2B] focus:outline-none focus:border-[#224431] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              {/* Allocation Preset Selector */}
              <div>
                <label className="text-[11px] font-bold text-[#677C6D] uppercase tracking-wider block mb-2">
                  Select Allocation Rule
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedPreset("50/30/20")}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedPreset === "50/30/20"
                        ? "bg-[#E8EFEA] border-[#224431] ring-1 ring-[#224431]"
                        : "bg-white border-[#E7EDE7] hover:border-gray-300"
                    }`}
                  >
                    <p className="text-xs font-bold text-[#1E3A2B]">50 / 30 / 20</p>
                    <p className="text-[10px] text-[#677C6D] mt-0.5">Classic Rule</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPreset("70/20/10")}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedPreset === "70/20/10"
                        ? "bg-[#E8EFEA] border-[#224431] ring-1 ring-[#224431]"
                        : "bg-white border-[#E7EDE7] hover:border-gray-300"
                    }`}
                  >
                    <p className="text-xs font-bold text-[#1E3A2B]">70 / 20 / 10</p>
                    <p className="text-[10px] text-[#677C6D] mt-0.5">Needs Heavy</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPreset("60/20/20")}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedPreset === "60/20/20"
                        ? "bg-[#E8EFEA] border-[#224431] ring-1 ring-[#224431]"
                        : "bg-white border-[#E7EDE7] hover:border-gray-300"
                    }`}
                  >
                    <p className="text-xs font-bold text-[#1E3A2B]">60 / 20 / 20</p>
                    <p className="text-[10px] text-[#677C6D] mt-0.5">Balanced</p>
                  </button>
                </div>
              </div>

              {/* Live Preview Breakdown */}
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8EDE8] space-y-3">
                <p className="text-xs font-bold text-[#1E3A2B] flex items-center justify-between">
                  <span>Allocation Breakdown</span>
                  <span className="text-[#20743E]">
                    Total: {formatRupiah(previewIncome)}
                  </span>
                </p>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-[#E5ECE5]">
                    <span className="text-[10px] font-bold text-[#20743E] block">
                      Needs ({activePercentages.needs}%)
                    </span>
                    <span className="text-xs font-extrabold text-[#1E3A2B] mt-0.5 block truncate">
                      {formatRupiah(previewNeeds)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-[#E5ECE5]">
                    <span className="text-[10px] font-bold text-[#9A5B15] block">
                      Wants ({activePercentages.wants}%)
                    </span>
                    <span className="text-xs font-extrabold text-[#1E3A2B] mt-0.5 block truncate">
                      {formatRupiah(previewWants)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-[#E5ECE5]">
                    <span className="text-[10px] font-bold text-[#4B3B70] block">
                      Savings ({activePercentages.savings}%)
                    </span>
                    <span className="text-xs font-extrabold text-[#1E3A2B] mt-0.5 block truncate">
                      {formatRupiah(previewSavings)}
                    </span>
                  </div>
                </div>
              </div>

              {allocationNotice && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold ${
                    allocationNotice.ok
                      ? "bg-[#E7F6EC] text-[#20743E]"
                      : "bg-[#FBE9E2] text-[#B4491F]"
                  }`}
                >
                  {allocationNotice.text}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIncomeModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#224431] hover:bg-[#163323] transition-colors shadow-sm cursor-pointer"
                >
                  Apply & Auto-Allocate
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL 2: CUSTOMIZE PERCENTAGE ALLOCATION ================= */}
      {showCustomizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#DCE4DD] animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F0]">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#244833]" />
                <h3 className="text-base font-bold text-[#1E3A2B]">Customize Allocation</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomizeModal(false)}
                className="p-1.5 rounded-full hover:bg-black/5 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <p className="text-xs text-[#718576]">
                Adjust custom percentage ratios for your monthly income. Percentages must add up to 100%.
              </p>

              {/* Needs Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#20743E]">Needs (Kebutuhan Pokok)</span>
                  <span>{customRatios.needs}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={80}
                  step={5}
                  value={customRatios.needs}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    const remainder = 100 - val;
                    const wants = Math.round(remainder * 0.6);
                    const savings = remainder - wants;
                    setCustomRatios({ needs: val, wants, savings });
                  }}
                  className="w-full accent-[#20743E]"
                />
              </div>

              {/* Wants Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#9A5B15]">Wants (Keinginan)</span>
                  <span>{customRatios.wants}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={5}
                  value={customRatios.wants}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    const savings = Math.max(0, 100 - customRatios.needs - val);
                    setCustomRatios((prev) => ({ ...prev, wants: val, savings }));
                  }}
                  className="w-full accent-[#E08C38]"
                />
              </div>

              {/* Savings Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#4B3B70]">Savings (Tabungan & Investasi)</span>
                  <span>{customRatios.savings}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={5}
                  value={customRatios.savings}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    const wants = Math.max(0, 100 - customRatios.needs - val);
                    setCustomRatios((prev) => ({ ...prev, savings: val, wants }));
                  }}
                  className="w-full accent-[#4B3B70]"
                />
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-xl flex items-center justify-between text-xs font-bold">
                <span>Total Percentage:</span>
                <span
                  className={
                    customRatios.needs + customRatios.wants + customRatios.savings === 100
                      ? "text-[#20743E]"
                      : "text-[#B4491F]"
                  }
                >
                  {customRatios.needs + customRatios.wants + customRatios.savings}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0F4F0]">
              <button
                type="button"
                onClick={() => setShowCustomizeModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  applyAutoAllocation(income, "custom", customRatios);
                  setSelectedPreset("custom");
                  setShowCustomizeModal(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#224431] hover:bg-[#163323] cursor-pointer"
              >
                Apply Custom Ratio
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
