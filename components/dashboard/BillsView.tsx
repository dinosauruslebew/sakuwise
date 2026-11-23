"use client";

import React, { useState } from "react";
import { Plus, Check, Trash2, Undo2 } from "lucide-react";
import {
  useFinance,
  formatRupiah,
  formatShortDate,
  parseISODate,
  addDays,
  type BillStatus,
} from "@/context/FinanceContext";

const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function dueLabel(b: BillStatus): string {
  if (b.paid) return `Paid ${b.paidDate ? formatShortDate(b.paidDate) : ""}`.trim();
  const date = formatShortDate(b.dueDate);
  if (b.daysUntil < 0) return `Overdue by ${-b.daysUntil} ${b.daysUntil === -1 ? "day" : "days"} (${date})`;
  if (b.daysUntil === 0) return `Due ${date} - Today`;
  if (b.daysUntil === 1) return `Due ${date} - Tomorrow`;
  return `Due ${date} - In ${b.daysUntil} days`;
}

export default function BillsView() {
  const { categories, addBill, setBillPaid, deleteBill, addTransaction, summary } = useFinance();
  const { today, bills } = summary;

  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [amountStr, setAmountStr] = useState("");
  const [dueDate, setDueDate] = useState(() => addDays(today, 7));
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const activeCategory = categories.some((c) => c.name === category)
    ? category
    : categories[0]?.name ?? "";

  const unpaid = bills.filter((b) => !b.paid);
  const unpaidTotal = unpaid.reduce((acc, b) => acc + b.amount, 0);
  const overdueCount = unpaid.filter((b) => b.overdue).length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(amountStr.replace(/[^0-9]/g, ""), 10);
    const result = addBill({ name, amount, dueDate, category: activeCategory });
    if (!result.ok) {
      setError(result.error || "Could not add this bill.");
      return;
    }
    setName("");
    setAmountStr("");
    setDueDate(addDays(today, 7));
    setError("");
    setShowAdd(false);
  };

  const handleMarkPaid = (b: BillStatus) => {
    setBillPaid(b.id, true);
    const record = window.confirm(
      `Marked "${b.name}" as paid.\n\nAlso record ${formatRupiah(b.amount)} as an expense in ${b.category}? Choose Cancel if you already logged it.`
    );
    if (record) {
      addTransaction({
        name: b.name,
        amount: b.amount,
        category: b.category,
        date: today,
        note: "Bill payment",
      });
    }
  };

  const handleDelete = (b: BillStatus) => {
    if (window.confirm(`Delete "${b.name}"? This cannot be undone.`)) {
      deleteBill(b.id);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs gap-4">
        <div>
          <h2 className="text-base font-bold text-[#1E3A2B]">Tagihan &amp; Pengingat Rutin</h2>
          <p className="text-xs text-[#6F8273]">
            {unpaid.length === 0
              ? "Semua tagihan sudah lunas. Mantap!"
              : `${unpaid.length} tagihan belum dibayar, total ${formatRupiah(unpaidTotal)}.`}
            {overdueCount > 0 ? ` ${overdueCount} sudah lewat jatuh tempo.` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd((v) => !v)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#224431] hover:bg-[#163323] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAdd ? "Tutup" : "Tambah Tagihan"}</span>
        </button>
      </div>

      {/* Add bill form */}
      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-4">
              <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">Nama tagihan *</label>
              <input
                type="text"
                required
                placeholder="e.g. Wi-Fi subscription"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-medium text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">Nominal *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1E3A2B]">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  placeholder="0"
                  value={amountStr}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setAmountStr(raw ? parseInt(raw, 10).toLocaleString("id-ID") : "");
                  }}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-bold text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">Jatuh tempo *</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-medium text-[#1E3A2B] focus:outline-none focus:border-[#224431] bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">Kategori</label>
              <select
                value={activeCategory}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-medium text-[#1E3A2B] focus:outline-none bg-white cursor-pointer"
              >
                {categories.length === 0 && <option value="">No categories</option>}
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-xs font-semibold text-[#B4491F] bg-[#FBE9E2] rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#224431] hover:bg-[#163323] cursor-pointer"
            >
              Simpan tagihan
            </button>
          </div>
        </form>
      )}

      {/* Bills Grid */}
      {bills.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-[#E7EDE7] shadow-2xs text-center text-xs text-[#718576]">
          Belum ada tagihan. Tambahkan tagihan rutin seperti Wi-Fi, kos, atau langganan.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {bills.map((b) => {
            const due = parseISODate(b.dueDate);
            return (
              <div
                key={b.id}
                className={`bg-white rounded-2xl p-6 border shadow-2xs flex flex-col gap-4 ${
                  b.overdue ? "border-[#F2C9B8]" : "border-[#E7EDE7]"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-extrabold text-sm flex-shrink-0 ${
                        b.paid
                          ? "bg-[#E7F6EC] text-[#20743E]"
                          : b.overdue
                            ? "bg-[#FBE9E2] text-[#B4491F]"
                            : "bg-[#E8EFEA] text-[#1E3A2B]"
                      }`}
                    >
                      <span>{due.getDate()}</span>
                      <span className="text-[9px] uppercase font-bold text-[#718576]">
                        {MONTH_ABBR[due.getMonth()]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1E3A2B]">{b.name}</p>
                      <p
                        className={`text-xs mt-0.5 ${
                          b.overdue ? "text-[#B4491F] font-semibold" : "text-[#718576]"
                        }`}
                      >
                        {dueLabel(b)}
                      </p>
                      <span className="inline-block mt-1 text-[11px] font-medium bg-[#FAF8F5] border border-[#E4ECE4] px-2 py-0.5 rounded-md text-[#55695C]">
                        {b.category}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-extrabold text-[#1E3A2B]">{formatRupiah(b.amount)}</p>
                    <span
                      className={`inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        b.paid
                          ? "bg-[#E7F6EC] text-[#20743E]"
                          : b.overdue
                            ? "bg-[#FBE9E2] text-[#B4491F]"
                            : "bg-[#FEF3E2] text-[#9A5B15]"
                      }`}
                    >
                      {b.paid ? "Paid" : b.overdue ? "Overdue" : "Upcoming"}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F2F5F2] flex items-center justify-between gap-3">
                  {b.paid ? (
                    <button
                      type="button"
                      onClick={() => setBillPaid(b.id, false)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#576B5D] hover:text-[#1E3A2B] cursor-pointer"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Tandai belum lunas</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleMarkPaid(b)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#224431] hover:bg-[#163323] px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Tandai lunas</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(b)}
                    className="p-1.5 rounded-md text-gray-300 hover:text-[#B4491F] hover:bg-[#FBE9E2] transition-colors cursor-pointer"
                    aria-label={`Delete ${b.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
