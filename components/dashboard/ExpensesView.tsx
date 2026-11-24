"use client";

import React, { useState } from "react";
import { Download, Search, Check, Receipt } from "lucide-react";
import { Transaction } from "./OverviewView";
import { useData } from "@/context/DataContext";

interface ExpensesViewProps {
  transactions: Transaction[];
  onAddExpense: (expense: Omit<Transaction, "id">) => void;
  totalSpent: number;
}

export default function ExpensesView({
  transactions,
  onAddExpense,
  totalSpent,
}: ExpensesViewProps) {
  const { allowance, remainingBalance, dailySpendingLimit } = useData();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Right side panel form state
  const [amountInput, setAmountInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [categoryInput, setCategoryInput] = useState<Transaction["category"]>("Food & drinks");
  const [dateInput, setDateInput] = useState("Hari ini · 12:00");
  const [noteInput, setNoteInput] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const percentSpent = allowance > 0 ? Math.min(100, Math.round((totalSpent / allowance) * 100)) : 0;

  const categoryBadges: Record<string, { bg: string; text: string }> = {
    "Food & drinks": { bg: "bg-[#FEF1E1]", text: "text-[#9A5B15]" },
    Transport: { bg: "bg-[#E3EFE7]", text: "text-[#245235]" },
    "Academic needs": { bg: "bg-[#E9EDE9]", text: "text-[#425748]" },
    Personal: { bg: "bg-[#F5EFE6]", text: "text-[#71542B]" },
    Accommodation: { bg: "bg-[#EAE8F2]", text: "text-[#4B3B70]" },
    "Emergency fund": { bg: "bg-[#F8EFEA]", text: "text-[#7D452B]" },
  };

  const handlePanelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = parseInt(amountInput.replace(/[^0-9]/g, ""), 10);
    if (!descInput.trim() || isNaN(cleanAmount) || cleanAmount <= 0) return;

    onAddExpense({
      name: descInput.trim(),
      amount: cleanAmount,
      category: categoryInput,
      time: `Hari ini · ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`,
      note: noteInput.trim() || undefined,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setAmountInput("");
      setDescInput("");
      setNoteInput("");
    }, 1200);
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      alert("Belum ada data transaksi untuk diekspor.");
      return;
    }
    const headers = ["ID", "Nama Transaksi", "Kategori", "Nominal", "Waktu"];
    const rows = transactions.map((t) => [
      t.id,
      `"${t.name.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      t.amount,
      `"${t.time}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sakuwise_transaksi_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "all" || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

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
            Target anggaran bulanan
          </p>
        </div>

        <div className="bg-[#FFF9F0] rounded-2xl p-6 border border-[#FBEAD4] shadow-2xs">
          <p className="text-xs font-semibold text-[#8F7249]">Spent this month</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2B] tracking-tight mt-1.5">
            Rp{totalSpent.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-[#8F7249] mt-2 font-medium">
            {percentSpent}% dari jatah bulananmu
          </p>
        </div>

        <div className="bg-[#224431] text-white rounded-2xl p-6 border border-[#2D583F] shadow-md">
          <p className="text-xs font-medium text-[#B4CEBD]">Remaining balance</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5">
            Rp{remainingBalance.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-[#A1BFA9] mt-2">
            {allowance > 0 ? `${Math.max(0, 100 - percentSpent)}% tersisa untuk 14 hari ke depan` : "Atur allowance untuk pantau sisa"}
          </p>
        </div>
      </div>

      {/* 2. MAIN TRANSACTIONS TABLE & ADD EXPENSE SIDEBAR FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Your spending, all in one place */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDE7] shadow-2xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#F0F4F0] gap-2">
            <div>
              <h3 className="text-base font-bold text-[#1E3A2B]">
                Your spending, all in one place
              </h3>
              <p className="text-xs text-[#718576]">
                Setiap catatan pengeluaran membantumu memahami pola belanja secara lebih bijak.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3A2B] hover:text-[#0F2218] transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>Export CSV</span>
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Filters row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-5">
            <div className="sm:col-span-6 relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari transaksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D9E3DC] text-xs font-medium text-[#1E3A2B] placeholder:text-gray-400 focus:outline-none focus:border-[#224431]"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D9E3DC] text-xs font-medium text-[#1E3A2B] focus:outline-none bg-white cursor-pointer"
              >
                <option value="all">Semua kategori</option>
                <option value="Food & drinks">Food & drinks</option>
                <option value="Transport">Transport</option>
                <option value="Academic needs">Academic needs</option>
                <option value="Personal">Personal</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Emergency fund">Emergency fund</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <select className="w-full px-3 py-2 rounded-xl border border-[#D9E3DC] text-xs font-medium text-[#1E3A2B] focus:outline-none bg-white cursor-pointer">
                <option>Bulan ini</option>
                <option>Semua periode</option>
              </select>
            </div>
          </div>

          {/* Table OR Empty State */}
          {filteredTransactions.length === 0 ? (
            <div className="py-12 px-4 text-center rounded-2xl bg-[#FAF8F5] border border-dashed border-[#DCE4DD] flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-[#E8EFEA] text-[#244833] flex items-center justify-center mb-3">
                <Receipt className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h4 className="text-sm font-bold text-[#1E3A2B]">Belum ada transaksi ditemukan</h4>
              <p className="text-xs text-[#718576] max-w-sm mt-1 leading-relaxed">
                {searchTerm || selectedCategory !== "all"
                  ? "Tidak ada transaksi yang cocok dengan filter pencarianmu."
                  : "Tambahkan pengeluaran pertamamu lewat formulir di sisi kanan."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#F0F4F0] text-[10px] font-bold uppercase tracking-wider text-[#7A8E80]">
                    <th className="pb-3">Transaction</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F8F5]">
                  {filteredTransactions.map((t) => {
                    const badgeStyle = categoryBadges[t.category] || {
                      bg: "bg-gray-100",
                      text: "text-gray-700",
                    };
                    return (
                      <tr key={t.id} className="group hover:bg-[#FAF8F5] transition-colors">
                        <td className="py-3.5 pr-4">
                          <p className="font-semibold text-[#1E3A2B]">{t.name}</p>
                          <p className="text-[10px] text-[#7E9184]">{t.time}</p>
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

          {/* Pagination & Note */}
          <div className="mt-5 pt-4 border-t border-[#F0F4F0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#718576] gap-3">
            <span>Menampilkan {filteredTransactions.length} dari {transactions.length} transaksi</span>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-[#FAF8F5] border border-[#E9EFEA] text-xs text-[#6B7E70]">
            Penting: Catat juga pengeluaran uang tunai / receh harian agar catatan keuanganmu selalu akurat.
          </div>
        </div>

        {/* Right Column: Add an expense Form & Daily Limit Widget */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Card: Add an expense */}
          <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs">
            <h3 className="text-sm font-bold text-[#1E3A2B]">Add an expense</h3>
            <p className="text-xs text-[#718576] mt-0.5 mb-4">
              Catat pengeluaran baru langsung ke alokasi sakumu.
            </p>

            {savedSuccess ? (
              <div className="py-8 text-center bg-[#E7F6EC] rounded-xl border border-[#CDEED5] animate-in fade-in duration-200">
                <Check className="w-6 h-6 text-[#20743E] mx-auto mb-1 stroke-[3]" />
                <p className="text-xs font-bold text-[#20743E]">Pengeluaran Berhasil Disimpan!</p>
              </div>
            ) : (
              <form onSubmit={handlePanelSubmit} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">
                    Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1E3A2B]">
                      Rp
                    </span>
                    <input
                      type="text"
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
                    placeholder="Contoh: Makan siang di kampus"
                    value={descInput}
                    onChange={(e) => setDescInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-medium text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value as Transaction["category"])}
                    className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-medium text-[#1E3A2B] focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="Food & drinks">Food & drinks</option>
                    <option value="Transport">Transport</option>
                    <option value="Academic needs">Academic needs</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Personal">Personal</option>
                    <option value="Emergency fund">Emergency fund</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={dateInput}
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
                    placeholder="Catatan tambahan (opsional)"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#D7E2D9] text-xs font-medium text-[#1E3A2B] focus:outline-none bg-white resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAmountInput("");
                      setDescInput("");
                    }}
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

                <p className="text-[10px] text-[#869689] text-center">
                  Required: amount, description, and category.
                </p>
              </form>
            )}
          </div>

          {/* Card: Daily Limit Reminder */}
          <div className="bg-[#FEF7EC] rounded-2xl p-5 border border-[#FDE5C5]">
            <p className="text-sm font-bold text-[#1E3A2B]">
              Rp{dailySpendingLimit.toLocaleString("id-ID")} limit belanja harian
            </p>
            <p className="text-xs text-[#826949] mt-1">
              Jaga pengeluaran harianmu dalam angka ini agar allowance bertahan sampai akhir bulan.
            </p>
          </div>

        </div>

      </div>

      {/* 3. BOTTOM BANNER */}
      <div className="bg-[#EBF1EC] rounded-2xl p-5 border border-[#DCE5DE] flex items-center justify-between text-xs text-[#526658]">
        <p>
          <strong className="text-[#1E3A2B] font-bold">Catatan rapi. Rekomendasi lebih presisi.</strong>{" "}
          Data alokasi dan AI Sakuwise bekerja optimal saat kamu rutin mencatat setiap transaksi.
        </p>
      </div>

    </div>
  );
}
