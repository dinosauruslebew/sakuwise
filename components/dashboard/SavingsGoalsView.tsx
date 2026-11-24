"use client";

import React, { useState } from "react";
import { Plus, Target, Check, Sparkles } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function SavingsGoalsView() {
  const { goals, addSavingsGoal, depositToGoal } = useData();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState("");

  // New goal form state
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(depositAmount.replace(/[^0-9]/g, ""), 10);
    if (!selectedGoalId || isNaN(val) || val <= 0) return;

    depositToGoal(selectedGoalId, val);
    setDepositAmount("");
    setSelectedGoalId(null);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTarget = parseInt(newTarget.replace(/[^0-9]/g, ""), 10);
    if (!newTitle.trim() || isNaN(cleanTarget) || cleanTarget <= 0) return;

    addSavingsGoal({
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || "Target Tabungan",
      target: cleanTarget,
      deadline: newDeadline.trim() || "Akhir Tahun",
      color: "bg-[#244833]",
    });

    setNewTitle("");
    setNewSubtitle("");
    setNewTarget("");
    setNewDeadline("");
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs gap-4">
        <div>
          <h2 className="text-base font-bold text-[#1E3A2B]">Target Tabungan Impian</h2>
          <p className="text-xs text-[#6F8273]">
            Saku terproteksi otomatis memisahkan dana impianmu dari pengeluaran harian.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#224431] hover:bg-[#163323] transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Target Baru</span>
        </button>
      </div>

      {/* Goals Grid OR Empty State */}
      {goals.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#E7EDE7] shadow-2xs flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-[#E8EFEA] text-[#244833] flex items-center justify-center mb-3">
            <Target className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h3 className="text-sm font-bold text-[#1E3A2B]">Belum ada target tabungan impian</h3>
          <p className="text-xs text-[#718576] max-w-sm mt-1 leading-relaxed">
            Buat target tabungan seperti Dana Darurat, Laptop Baru, atau Liburan untuk mulai mengumpulkan dana secara terarah.
          </p>
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="mt-5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#224431] hover:bg-[#163323] transition-colors cursor-pointer shadow-xs"
          >
            + Buat Target Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((g) => {
            const percent = Math.min(100, Math.round((g.current / g.target) * 100));
            return (
              <div
                key={g.id}
                className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1E3A2B]">{g.title}</span>
                    <span className="text-xs font-bold text-[#E08C38] bg-[#FEF3E2] px-2 py-0.5 rounded-full">
                      {percent}%
                    </span>
                  </div>
                  <p className="text-[11px] text-[#718576] mt-0.5">{g.subtitle}</p>

                  <div className="mt-5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-extrabold text-[#1E3A2B]">
                        Rp{g.current.toLocaleString("id-ID")}
                      </span>
                      <span className="text-xs text-[#718576]">
                        / Rp{g.target.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#EBF0EC] overflow-hidden mt-2">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${g.color || "bg-[#244833]"}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#718576]">
                      <span>Target: {g.deadline}</span>
                      <span>Sisa: Rp{Math.max(0, g.target - g.current).toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-[#F2F5F2]">
                  <button
                    type="button"
                    onClick={() => setSelectedGoalId(g.id)}
                    className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-[#244833] bg-[#E8EFEA] hover:bg-[#DCE6DF] transition-colors cursor-pointer"
                  >
                    + Tambah Tabungan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create Goal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#DCE4DD]">
            <h3 className="text-sm font-bold text-[#1E3A2B]">Buat Target Tabungan Baru</h3>
            <p className="text-xs text-[#718576] mt-0.5 mb-4">
              Tentukan target impian dan nominal yang ingin kamu capai.
            </p>

            <form onSubmit={handleCreateGoal} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-[#677C6D] block mb-1">
                  Nama Target
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Laptop Baru / Liburan"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-semibold text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#677C6D] block mb-1">
                  Keterangan Singkat
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Untuk skripsi & produktivitas"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-semibold text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#677C6D] block mb-1">
                  Target Nominal (Rp)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 5.000.000"
                  value={newTarget}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setNewTarget(raw ? parseInt(raw, 10).toLocaleString("id-ID") : "");
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-semibold text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#677C6D] block mb-1">
                  Tenggat Waktu / Target Tercapai
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Desember 2026"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-semibold text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
                />
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
                  Simpan Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Quick Deposit */}
      {selectedGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#DCE4DD]">
            <h3 className="text-sm font-bold text-[#1E3A2B]">Tambah Tabungan</h3>
            <p className="text-xs text-[#718576] mt-0.5 mb-4">
              Sisihkan sebagian dana langsung ke target tabunganmu.
            </p>

            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[#677C6D] block mb-1">
                  Nominal Tambahan (Rp)
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Contoh: 100.000"
                  value={depositAmount}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setDepositAmount(raw ? parseInt(raw, 10).toLocaleString("id-ID") : "");
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-base font-extrabold text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGoalId(null)}
                  className="w-1/2 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 text-xs font-bold text-white bg-[#224431] hover:bg-[#163323] rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Simpan Tabungan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
