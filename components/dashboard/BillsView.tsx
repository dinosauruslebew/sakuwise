"use client";

import React, { useState } from "react";
import { Plus, Check, Bell, Calendar } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function BillsView() {
  const { bills, addBill, toggleBillStatus } = useData();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [billName, setBillName] = useState("");
  const [billDay, setBillDay] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [billCategory, setBillCategory] = useState("Accommodation");

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = parseInt(billAmount.replace(/[^0-9]/g, ""), 10);
    const dayNum = parseInt(billDay, 10) || 1;
    if (!billName.trim() || isNaN(cleanAmount) || cleanAmount <= 0) return;

    addBill({
      name: billName.trim(),
      day: dayNum,
      amount: cleanAmount,
      due: `Jatuh tempo ${dayNum} Nov 2026`,
      status: "Upcoming",
      category: billCategory,
    });

    setBillName("");
    setBillDay("");
    setBillAmount("");
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs gap-4">
        <div>
          <h2 className="text-base font-bold text-[#1E3A2B]">Tagihan & Pengingat Rutin</h2>
          <p className="text-xs text-[#6F8273]">
            Otomatis sinkronkan dengan saku anggaran agar tidak ada denda keterlambatan.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#224431] hover:bg-[#163323] transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Tagihan</span>
        </button>
      </div>

      {/* Bills Grid OR Empty State */}
      {bills.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#E7EDE7] shadow-2xs flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-[#E8EFEA] text-[#244833] flex items-center justify-center mb-3">
            <Bell className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h3 className="text-sm font-bold text-[#1E3A2B]">Belum ada tagihan rutin</h3>
          <p className="text-xs text-[#718576] max-w-sm mt-1 leading-relaxed">
            Catat tagihan langganan internet, listrik, kos, atau cicilan agar Sakuwise dapat mengingatkanmu sebelum tanggal jatuh tempo.
          </p>
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="mt-5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#224431] hover:bg-[#163323] transition-colors cursor-pointer shadow-xs"
          >
            + Tambah Tagihan Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {bills.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-extrabold text-sm flex-shrink-0 ${
                    b.status === "Paid"
                      ? "bg-[#E7F6EC] text-[#20743E]"
                      : "bg-[#E8EFEA] text-[#1E3A2B]"
                  }`}
                >
                  <span>{b.day}</span>
                  <span className="text-[9px] uppercase font-bold text-[#718576]">Nov</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1E3A2B]">{b.name}</p>
                  <p className="text-xs text-[#718576] mt-0.5">{b.due}</p>
                  <span className="inline-block mt-1 text-[10px] font-medium bg-[#FAF8F5] border border-[#E4ECE4] px-2 py-0.5 rounded-md text-[#55695C]">
                    {b.category}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-base font-extrabold text-[#1E3A2B]">
                  Rp{b.amount.toLocaleString("id-ID")}
                </p>
                <button
                  type="button"
                  onClick={() => toggleBillStatus(b.id)}
                  className={`inline-block mt-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                    b.status === "Paid"
                      ? "bg-[#E7F6EC] text-[#20743E] hover:bg-[#D4EEDC]"
                      : "bg-[#FEF3E2] text-[#9A5B15] hover:bg-[#FDE4C2]"
                  }`}
                  title="Klik untuk ubah status pembayaran"
                >
                  {b.status === "Paid" ? "✓ Sudah Dibayar" : "⏳ Belum Dibayar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Bill */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#DCE4DD]">
            <h3 className="text-sm font-bold text-[#1E3A2B]">Tambah Tagihan Rutin</h3>
            <p className="text-xs text-[#718576] mt-0.5 mb-4">
              Pengingat tanggal jatuh tempo dan nominal tagihan.
            </p>

            <form onSubmit={handleAddBill} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-[#677C6D] block mb-1">
                  Nama Tagihan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Langganan Wi-Fi / Kos"
                  value={billName}
                  onChange={(e) => setBillName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-semibold text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#677C6D] block mb-1">
                  Tanggal Jatuh Tempo (Tanggal 1–31)
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  required
                  placeholder="Contoh: 20"
                  value={billDay}
                  onChange={(e) => setBillDay(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-semibold text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#677C6D] block mb-1">
                  Nominal Tagihan (Rp)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 250.000"
                  value={billAmount}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setBillAmount(raw ? parseInt(raw, 10).toLocaleString("id-ID") : "");
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-semibold text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#677C6D] block mb-1">
                  Kategori
                </label>
                <select
                  value={billCategory}
                  onChange={(e) => setBillCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-semibold text-[#1E3A2B] bg-white cursor-pointer"
                >
                  <option value="Accommodation">Accommodation (Tempat Tinggal)</option>
                  <option value="Personal">Personal (Langganan Pribadi)</option>
                  <option value="Academic needs">Academic needs (Pendidikan)</option>
                  <option value="Transport">Transport (Kendaraan)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="w-1/2 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 text-xs font-bold text-white bg-[#224431] hover:bg-[#163323] rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Simpan Tagihan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
