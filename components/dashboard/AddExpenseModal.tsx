"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { useFinance, todayISO } from "@/context/FinanceContext";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
  const { categories, addTransaction } = useFinance();

  const [amountStr, setAmountStr] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(() => todayISO());
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  // Fall back to the first category if none is chosen yet or the chosen one was deleted
  const activeCategory = categories.some((c) => c.name === category)
    ? category
    : categories[0]?.name ?? "";

  const resetForm = () => {
    setAmountStr("");
    setName("");
    setNote("");
    setError("");
    setDate(todayISO());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = parseInt(amountStr.replace(/[^0-9]/g, ""), 10);

    if (!activeCategory) {
      setError("Add a budget category first in Monthly Budget.");
      return;
    }

    const result = addTransaction({
      name,
      amount: cleanAmount,
      category: activeCategory,
      date,
      note,
    });

    if (!result.ok) {
      setError(result.error || "Could not save this expense.");
      return;
    }

    setError("");
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      resetForm();
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#DCE4DD] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F0]">
          <div>
            <h3 className="text-base font-bold text-[#1E3A2B]">Add an expense</h3>
            <p className="text-xs text-[#718576]">A few seconds now. More clarity later.</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-black/5"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#E7F6EC] text-[#20743E] flex items-center justify-center mb-3">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <p className="text-sm font-bold text-[#1E3A2B]">Pengeluaran Berhasil Dicatat!</p>
            <p className="text-xs text-[#6B8071] mt-1">Saldo dan batas harian telah diperbarui.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Amount input */}
            <div>
              <label className="text-[11px] font-bold text-[#677C6D] uppercase tracking-wider block mb-1">
                Amount *
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
                  placeholder="0"
                  value={amountStr}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setAmountStr(raw ? parseInt(raw, 10).toLocaleString("id-ID") : "");
                  }}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[#D5E1D7] text-lg font-extrabold text-[#1E3A2B] focus:outline-none focus:border-[#224431] focus:ring-1 focus:ring-[#224431] bg-[#FAF8F5]"
                />
              </div>
            </div>

            {/* What was it for */}
            <div>
              <label className="text-[11px] font-bold text-[#677C6D] uppercase tracking-wider block mb-1">
                What was it for? *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lunch at campus"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E1D7] text-xs font-semibold text-[#1E3A2B] focus:outline-none focus:border-[#224431] bg-white"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-[11px] font-bold text-[#677C6D] uppercase tracking-wider block mb-1">
                Category *
              </label>
              <select
                value={activeCategory}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E1D7] text-xs font-semibold text-[#1E3A2B] focus:outline-none focus:border-[#224431] bg-white cursor-pointer"
              >
                {categories.length === 0 && <option value="">No categories yet</option>}
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-[11px] font-bold text-[#677C6D] uppercase tracking-wider block mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                max={todayISO()}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D5E1D7] text-xs font-medium text-[#1E3A2B] focus:outline-none bg-white"
              />
            </div>

            {/* Note */}
            <div>
              <label className="text-[11px] font-bold text-[#677C6D] uppercase tracking-wider block mb-1">
                Note (optional)
              </label>
              <textarea
                rows={2}
                placeholder="Add a little detail"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D5E1D7] text-xs font-medium text-[#1E3A2B] focus:outline-none bg-white resize-none"
              />
            </div>

            {error && (
              <p className="text-xs font-semibold text-[#B4491F] bg-[#FBE9E2] rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="w-1/2 py-2.5 px-4 rounded-xl text-xs font-semibold text-[#4F6253] bg-[#FAF8F5] hover:bg-black/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#224431] hover:bg-[#163323] transition-colors shadow-sm cursor-pointer"
              >
                Save expense
              </button>
            </div>

            <p className="text-[11px] text-center text-[#7E8F82]">
              Required: amount, description, and category.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
