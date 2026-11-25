"use client";

import React, { useState } from "react";
import { X, Check, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useFinance, todayISO, type TransactionType } from "@/context/FinanceContext";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
}

const INCOME_CATEGORIES = [
  "Monthly Salary",
  "Allowance / Uang Bulanan",
  "Side Job / Freelance",
  "Bonus & Rewards",
  "Investment Return",
  "Gift",
  "Other Income",
];

export default function AddTransactionModal({
  isOpen,
  onClose,
  defaultType = "expense",
}: AddTransactionModalProps) {
  const { categories, addTransaction } = useFinance();

  const [txType, setTxType] = useState<TransactionType>(defaultType);
  const [amountStr, setAmountStr] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [incomeCategory, setIncomeCategory] = useState(INCOME_CATEGORIES[0]);
  const [date, setDate] = useState(() => todayISO());
  const [note, setNote] = useState("");
  const [addToIncome, setAddToIncome] = useState(false);
  const [error, setError] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const activeExpenseCategory = categories.some((c) => c.name === category)
    ? category
    : categories[0]?.name ?? "";

  const resetForm = () => {
    setAmountStr("");
    setName("");
    setNote("");
    setError("");
    setDate(todayISO());
    setAddToIncome(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = parseInt(amountStr.replace(/[^0-9]/g, ""), 10);

    if (!cleanAmount || cleanAmount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    if (!name.trim()) {
      setError(txType === "expense" ? "Please enter a description for the expense." : "Please enter the income source.");
      return;
    }

    if (txType === "expense" && !activeExpenseCategory) {
      setError("Please add at least one budget pocket in Monthly Budget first.");
      return;
    }

    const chosenCategory = txType === "expense" ? activeExpenseCategory : incomeCategory;

    const result = addTransaction({
      name: name.trim(),
      amount: cleanAmount,
      category: chosenCategory,
      date,
      note: note.trim() || undefined,
      type: txType,
      addToIncome: txType === "income" ? addToIncome : false,
    });

    if (!result.ok) {
      setError(result.error || "Could not save this transaction.");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#DCE4DD] animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F0]">
          <div>
            <h3 className="text-base font-bold text-[#1E3A2B]">Record Transaction</h3>
            <p className="text-xs text-[#718576]">Log your everyday cash flow with precision.</p>
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
            <p className="text-sm font-bold text-[#1E3A2B]">
              {txType === "expense" ? "Expense Recorded!" : "Income Added!"}
            </p>
            <p className="text-xs text-[#6B8071] mt-1">
              {txType === "expense"
                ? "Pocket budget and total balance updated."
                : "Total balance increased successfully."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            
            {/* Top Toggle: [ Expense ] & [ Income ] */}
            <div className="grid grid-cols-2 p-1 bg-[#F0F4F1] rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setTxType("expense");
                  setError("");
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  txType === "expense"
                    ? "bg-white text-[#B4491F] shadow-xs"
                    : "text-[#627768] hover:text-[#1E3A2B]"
                }`}
              >
                <ArrowDownCircle className="w-4 h-4" />
                <span>Expense (Pengeluaran)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTxType("income");
                  setError("");
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  txType === "income"
                    ? "bg-white text-[#20743E] shadow-xs"
                    : "text-[#627768] hover:text-[#1E3A2B]"
                }`}
              >
                <ArrowUpCircle className="w-4 h-4" />
                <span>Income (Pemasukan)</span>
              </button>
            </div>

            {/* Amount Input */}
            <div>
              <label className="text-[11px] font-bold text-[#677C6D] uppercase tracking-wider block mb-1">
                {txType === "expense" ? "Expense Amount *" : "Income Amount *"}
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
                  className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-lg font-extrabold focus:outline-none bg-[#FAF8F5] ${
                    txType === "expense"
                      ? "border-[#D5E1D7] text-[#1E3A2B] focus:border-[#B4491F]"
                      : "border-[#CDE7D5] text-[#20743E] focus:border-[#20743E]"
                  }`}
                />
              </div>
            </div>

            {/* Description / Source */}
            <div>
              <label className="text-[11px] font-bold text-[#677C6D] uppercase tracking-wider block mb-1">
                {txType === "expense" ? "What was it for? *" : "Income Source / Title *"}
              </label>
              <input
                type="text"
                required
                placeholder={txType === "expense" ? "e.g. Lunch at campus" : "e.g. Freelance Web Design"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E1D7] text-xs font-semibold text-[#1E3A2B] focus:outline-none focus:border-[#224431] bg-white"
              />
            </div>

            {/* Category / Source Type */}
            <div>
              <label className="text-[11px] font-bold text-[#677C6D] uppercase tracking-wider block mb-1">
                {txType === "expense" ? "Budget Pocket Category *" : "Income Category *"}
              </label>
              {txType === "expense" ? (
                <select
                  value={activeExpenseCategory}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E1D7] text-xs font-semibold text-[#1E3A2B] focus:outline-none focus:border-[#224431] bg-white cursor-pointer"
                >
                  {categories.length === 0 && <option value="">No budget pockets yet</option>}
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} {c.group ? `(${c.group})` : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={incomeCategory}
                  onChange={(e) => setIncomeCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E1D7] text-xs font-semibold text-[#1E3A2B] focus:outline-none focus:border-[#224431] bg-white cursor-pointer"
                >
                  {INCOME_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Income Specific Option: Add to Monthly Allowance */}
            {txType === "income" && (
              <div className="p-3 bg-[#E7F6EC] rounded-xl border border-[#CDEED5] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#20743E]">Add to Monthly Budget Pool</p>
                  <p className="text-[10px] text-[#557B60]">
                    Increases your total monthly allowance budget directly.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={addToIncome}
                  onChange={(e) => setAddToIncome(e.target.checked)}
                  className="w-4 h-4 accent-[#20743E] rounded cursor-pointer"
                />
              </div>
            )}

            {/* Date */}
            <div>
              <label className="text-[11px] font-bold text-[#677C6D] uppercase tracking-wider block mb-1">
                Transaction Date
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
                placeholder="Add optional notes or receipt details"
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
                className={`w-1/2 py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-colors shadow-sm cursor-pointer ${
                  txType === "expense"
                    ? "bg-[#224431] hover:bg-[#163323]"
                    : "bg-[#20743E] hover:bg-[#15592E]"
                }`}
              >
                {txType === "expense" ? "Save Expense" : "Save Income"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// Backward compatibility alias
export { AddTransactionModal as AddExpenseModal };
