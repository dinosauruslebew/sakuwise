"use client";

import React, { useState } from "react";
import { Download, Search, Check, Trash2 } from "lucide-react";
import {
  useFinance,
  formatRupiah,
  formatShortDate,
  describeDate,
  parseISODate,
  addDays,
  todayISO,
} from "@/context/FinanceContext";
import { exportTransactionsXlsx } from "@/lib/exportTransactions";

const PAGE_SIZE = 10;

const categoryBadges: Record<string, { bg: string; text: string }> = {
  "Food & drinks": { bg: "bg-[#FEF1E1]", text: "text-[#9A5B15]" },
  Transport: { bg: "bg-[#E3EFE7]", text: "text-[#245235]" },
  "Academic needs": { bg: "bg-[#E9EDE9]", text: "text-[#425748]" },
  Personal: { bg: "bg-[#F5EFE6]", text: "text-[#71542B]" },
  Accommodation: { bg: "bg-[#EAE8F2]", text: "text-[#4B3B70]" },
  "Emergency fund": { bg: "bg-[#F8EFEA]", text: "text-[#7D452B]" },
};

export default function ExpensesView() {
  const { income, transactions, categories, addTransaction, deleteTransaction, summary } =
    useFinance();
  const {
    today,
    daysLeft,
    totalSpent,
    remaining,
    percentSpent,
    percentRemaining,
    dailyLimit,
    spentToday,
    leftToday,
    periodStart,
    nextAllowanceDate,
  } = summary;

  const nextDate = parseISODate(nextAllowanceDate);
  const nextAllowanceLabel = `${formatShortDate(nextAllowanceDate)} ${nextDate.getFullYear()}`;

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [period, setPeriod] = useState<"period" | "week" | "all">("period");
  const [page, setPage] = useState(1);

  // Side form state
  const [amountInput, setAmountInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [dateInput, setDateInput] = useState(() => todayISO());
  const [noteInput, setNoteInput] = useState("");
  const [formError, setFormError] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const activeCategory = categories.some((c) => c.name === categoryInput)
    ? categoryInput
    : categories[0]?.name ?? "";

  const resetForm = () => {
    setAmountInput("");
    setDescInput("");
    setNoteInput("");
    setFormError("");
    setDateInput(todayISO());
  };

  const handlePanelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCategory) {
      setFormError("Add a budget category first in Monthly Budget.");
      return;
    }
    const cleanAmount = parseInt(amountInput.replace(/[^0-9]/g, ""), 10);
    const result = addTransaction({
      name: descInput,
      amount: cleanAmount,
      category: activeCategory,
      date: dateInput,
      note: noteInput,
    });
    if (!result.ok) {
      setFormError(result.error || "Could not save this expense.");
      return;
    }
    setFormError("");
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      resetForm();
    }, 900);
  };

  // Apply filters
  const weekStart = addDays(today, -6);
  const filtered = transactions.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.trim().toLowerCase());
    const matchesCat = selectedCategory === "all" || t.category === selectedCategory;
    const matchesPeriod =
      period === "all" ||
      (period === "week" && t.date >= weekStart && t.date <= today) ||
      (period === "period" && t.date >= periodStart && t.date < nextAllowanceDate);
    return matchesSearch && matchesCat && matchesPeriod;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const visible = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const handleExport = async () => {
    if (filtered.length === 0) return;
    const year = parseISODate(nextAllowanceDate).getFullYear();
    const periodLabel =
      period === "all"
        ? "Semua waktu"
        : period === "week"
          ? "7 hari terakhir (sampai " + formatShortDate(today) + ")"
          : formatShortDate(periodStart) + " - " + formatShortDate(addDays(nextAllowanceDate, -1)) + " " + year;
    const notes: string[] = [];
    if (selectedCategory !== "all") notes.push("Kategori: " + selectedCategory);
    if (searchTerm.trim()) notes.push("Pencarian: " + searchTerm.trim());
    await exportTransactionsXlsx({
      transactions: filtered,
      periodLabel,
      filterNote: notes.join(", ") || undefined,
      fileDate: today,
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteTransaction(id);
    }
  };

  const overToday = leftToday < 0;
  const todayPercent =
    dailyLimit > 0 ? Math.min(100, Math.round((spentToday / dailyLimit) * 100)) : spentToday > 0 ? 100 : 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs">
          <p className="text-xs font-medium text-[#718576]">Monthly allowance</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2B] tracking-tight mt-1.5">
            {formatRupiah(income)}
          </p>
          <p className="text-xs text-[#7D9183] mt-2">Next allowance - {nextAllowanceLabel}</p>
        </div>

        <div className="bg-[#FFF9F0] rounded-2xl p-6 border border-[#FBEAD4] shadow-2xs">
          <p className="text-xs font-medium text-[#8F7249]">Spent this month</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2B] tracking-tight mt-1.5">
            {formatRupiah(totalSpent)}
          </p>
          <p className="text-xs text-[#8F7249] mt-2 font-medium">
            {percentSpent}% of your monthly allowance
          </p>
        </div>

        <div className="bg-[#224431] text-white rounded-2xl p-6 border border-[#2D583F] shadow-md">
          <p className="text-xs font-medium text-[#B4CEBD]">Remaining balance</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5">
            {formatRupiah(remaining)}
          </p>
          <p className="text-xs text-[#A1BFA9] mt-2">
            {remaining < 0
              ? "You've gone over your allowance"
              : `${percentRemaining}% left for the next ${daysLeft} ${daysLeft === 1 ? "day" : "days"}`}
          </p>
        </div>
      </div>

      {/* 2. MAIN TRANSACTIONS TABLE & ADD EXPENSE SIDEBAR FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDE7] shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#F0F4F0] gap-2">
            <div>
              <h3 className="text-base font-bold text-[#1E3A2B]">Your spending, all in one place</h3>
              <p className="text-xs text-[#718576]">
                Every entry helps you build a better picture of your money.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              disabled={filtered.length === 0}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3A2B] hover:text-[#0F2218] transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Export Excel</span>
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Filters row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-5">
            <div className="sm:col-span-6 relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D9E3DC] text-xs font-medium text-[#1E3A2B] placeholder:text-gray-400 focus:outline-none focus:border-[#224431]"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl border border-[#D9E3DC] text-xs font-medium text-[#1E3A2B] focus:outline-none bg-white cursor-pointer"
              >
                <option value="all">All categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={period}
                onChange={(e) => {
                  setPeriod(e.target.value as "period" | "week" | "all");
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl border border-[#D9E3DC] text-xs font-medium text-[#1E3A2B] focus:outline-none bg-white cursor-pointer"
              >
                <option value="period">This period</option>
                <option value="week">Last 7 days</option>
                <option value="all">All time</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {visible.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#718576]">
              {transactions.length === 0
                ? "No expenses yet. Add your first one using the form."
                : "No transactions match your filters."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#F0F4F0] text-[11px] font-bold uppercase tracking-wider text-[#7A8E80]">
                    <th className="pb-3">Transaction</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3 text-right">Amount</th>
                    <th className="pb-3 w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F8F5]">
                  {visible.map((t) => {
                    const badgeStyle = categoryBadges[t.category] || {
                      bg: "bg-gray-100",
                      text: "text-gray-700",
                    };
                    return (
                      <tr key={t.id} className="group hover:bg-[#FAF8F5] transition-colors">
                        <td className="py-3.5 pr-4">
                          <p className="font-semibold text-[#1E3A2B]">{t.name}</p>
                          <p className="text-[11px] text-[#7E9184]">
                            {describeDate(t.date, today)}
                            {t.note ? ` - ${t.note}` : ""}
                          </p>
                        </td>
                        <td className="py-3.5 pr-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${badgeStyle.bg} ${badgeStyle.text}`}
                          >
                            {t.category}
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-bold text-[#1E3A2B]">
                          -{formatRupiah(t.amount)}
                        </td>
                        <td className="py-3.5 pl-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleDelete(t.id, t.name)}
                            className="p-1 rounded-md text-gray-300 hover:text-[#B4491F] hover:bg-[#FBE9E2] transition-colors cursor-pointer"
                            aria-label={`Delete ${t.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-5 pt-4 border-t border-[#F0F4F0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#718576] gap-3">
            <span>
              {filtered.length === 0
                ? "Showing 0 transactions"
                : `Showing ${startIdx + 1}-${startIdx + visible.length} of ${filtered.length} transactions`}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage(safePage - 1)}
                className="px-3 py-1 rounded-lg border border-[#D5E1D7] text-xs font-medium hover:bg-black/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                &larr; Previous
              </button>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage(safePage + 1)}
                className="px-3 py-1 rounded-lg border border-[#D5E1D7] text-xs font-medium bg-[#E8EFEA] text-[#1E3A2B] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next &rarr;
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-[#FAF8F5] border border-[#E9EFEA] text-xs text-[#6B7E70]">
            Missing something? Add cash purchases too. The little things count.
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card: Add an expense */}
          <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs">
            <h3 className="text-sm font-bold text-[#1E3A2B]">Add an expense</h3>
            <p className="text-xs text-[#718576] mt-0.5 mb-4">
              A few seconds now. More clarity later.
            </p>

            {savedSuccess ? (
              <div className="py-8 text-center bg-[#E7F6EC] rounded-xl border border-[#CDEED5]">
                <Check className="w-6 h-6 text-[#20743E] mx-auto mb-1 stroke-[3]" />
                <p className="text-xs font-bold text-[#20743E]">Pengeluaran Disimpan!</p>
              </div>
            ) : (
              <form onSubmit={handlePanelSubmit} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">Amount *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1E3A2B]">
                      Rp
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      placeholder="0"
                      value={amountInput}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, "");
                        setAmountInput(raw ? parseInt(raw, 10).toLocaleString("id-ID") : "");
                      }}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D7E2D9] text-base font-extrabold text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">
                    What was it for? *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lunch at campus"
                    value={descInput}
                    onChange={(e) => setDescInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-medium text-[#1E3A2B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">Category *</label>
                  <select
                    value={activeCategory}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-medium text-[#1E3A2B] focus:outline-none bg-white cursor-pointer"
                  >
                    {categories.length === 0 && <option value="">No categories yet</option>}
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">Date</label>
                  <input
                    type="date"
                    value={dateInput}
                    max={todayISO()}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-medium text-[#1E3A2B] focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">
                    Note (optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Add a little detail"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#D7E2D9] text-xs font-medium text-[#1E3A2B] focus:outline-none bg-white resize-none"
                  />
                </div>

                {formError && (
                  <p className="text-xs font-semibold text-[#B4491F] bg-[#FBE9E2] rounded-lg px-3 py-2">
                    {formError}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-1/2 py-2 px-3 rounded-xl text-xs font-semibold text-[#576B5D] bg-[#FAF8F5] hover:bg-black/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 px-3 rounded-xl text-xs font-bold text-white bg-[#224431] hover:bg-[#163323] shadow-xs cursor-pointer"
                  >
                    Save expense
                  </button>
                </div>

                <p className="text-[11px] text-[#869689] text-center">
                  Required: amount, description, and category.
                </p>
              </form>
            )}
          </div>

          {/* Card: left to spend today */}
          <div
            className={`rounded-2xl p-5 border ${
              overToday ? "bg-[#FBE9E2] border-[#F2C9B8]" : "bg-[#FEF7EC] border-[#FDE5C5]"
            }`}
          >
            <p className="text-sm font-bold text-[#1E3A2B]">
              {overToday
                ? `${formatRupiah(-leftToday)} over today's limit`
                : `${formatRupiah(leftToday)} left to spend today`}
            </p>
            <p className="text-xs text-[#826949] mt-1">
              {overToday
                ? `You've spent ${formatRupiah(spentToday)} of your ${formatRupiah(dailyLimit)} daily limit.`
                : dailyLimit === 0
                  ? "Your balance is used up until the next allowance."
                  : `You've used ${todayPercent}% of your ${formatRupiah(dailyLimit)} daily limit.`}
            </p>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM BANNER */}
      <div className="bg-[#EBF1EC] rounded-2xl p-5 border border-[#DCE5DE] flex items-center justify-between text-xs text-[#526658]">
        <p>
          <strong className="text-[#1E3A2B] font-bold">Good records. Better recommendations.</strong>{" "}
          Your budget and AI guidance are only as accurate as the expenses you record.
        </p>
      </div>
    </div>
  );
}
