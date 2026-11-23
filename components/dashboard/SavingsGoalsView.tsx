"use client";

import React, { useState } from "react";
import { Plus, Check, Trash2 } from "lucide-react";
import { useFinance, formatRupiah } from "@/context/FinanceContext";

function toAmount(str: string): number {
  return parseInt(str.replace(/[^0-9]/g, ""), 10);
}

function formatInput(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10).toLocaleString("id-ID") : "";
}

export default function SavingsGoalsView() {
  const { goals, addGoal, depositToGoal, deleteGoal } = useFinance();

  // Create-goal form
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [targetStr, setTargetStr] = useState("");
  const [startStr, setStartStr] = useState("");
  const [deadline, setDeadline] = useState("");
  const [addError, setAddError] = useState("");

  // Deposit modal
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositError, setDepositError] = useState("");

  const selectedGoal = goals.find((g) => g.id === selectedGoalId) || null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const result = addGoal({
      title,
      subtitle,
      target: toAmount(targetStr),
      current: startStr ? toAmount(startStr) : 0,
      deadline,
    });
    if (!result.ok) {
      setAddError(result.error || "Could not create this goal.");
      return;
    }
    setTitle("");
    setSubtitle("");
    setTargetStr("");
    setStartStr("");
    setDeadline("");
    setAddError("");
    setShowAdd(false);
  };

  const closeDeposit = () => {
    setSelectedGoalId(null);
    setDepositAmount("");
    setDepositError("");
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId) return;
    const result = depositToGoal(selectedGoalId, toAmount(depositAmount));
    if (!result.ok) {
      setDepositError(result.error || "Could not save this deposit.");
      return;
    }
    closeDeposit();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete the goal "${name}"? This cannot be undone.`)) {
      deleteGoal(id);
    }
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
          onClick={() => setShowAdd((v) => !v)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#224431] hover:bg-[#163323] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAdd ? "Tutup" : "Buat Target Baru"}</span>
        </button>
      </div>

      {/* Create goal form */}
      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-4">
              <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">Nama target *</label>
              <input
                type="text"
                required
                placeholder="e.g. New laptop fund"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-medium text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
              />
            </div>
            <div className="sm:col-span-4">
              <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">Deskripsi</label>
              <input
                type="text"
                placeholder="Optional"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-medium text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
              />
            </div>
            <div className="sm:col-span-4">
              <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">Tenggat</label>
              <input
                type="text"
                placeholder="e.g. Mar 2027"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-medium text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
              />
            </div>
            <div className="sm:col-span-6">
              <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">Nominal target *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1E3A2B]">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  placeholder="0"
                  value={targetStr}
                  onChange={(e) => setTargetStr(formatInput(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-bold text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
                />
              </div>
            </div>
            <div className="sm:col-span-6">
              <label className="text-[11px] font-semibold text-[#667A6C] block mb-1">
                Tabungan awal (opsional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1E3A2B]">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={startStr}
                  onChange={(e) => setStartStr(formatInput(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-bold text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
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
              Simpan target
            </button>
          </div>
        </form>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-[#E7EDE7] shadow-2xs text-center text-xs text-[#718576]">
          Belum ada target tabungan. Buat target pertamamu, misalnya laptop baru atau dana darurat.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((g) => {
            const percent = Math.min(100, Math.round((g.current / g.target) * 100));
            const reached = g.current >= g.target;
            const left = Math.max(0, g.target - g.current);
            return (
              <div
                key={g.id}
                className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#1E3A2B]">{g.title}</span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                        reached ? "text-[#20743E] bg-[#E7F6EC]" : "text-[#E08C38] bg-[#FEF3E2]"
                      }`}
                    >
                      {reached && <Check className="w-3 h-3 stroke-[3]" />}
                      {percent}%
                    </span>
                  </div>
                  {g.subtitle && <p className="text-[11px] text-[#718576] mt-0.5">{g.subtitle}</p>}

                  <div className="mt-5">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-xl font-extrabold text-[#1E3A2B]">{formatRupiah(g.current)}</span>
                      <span className="text-xs text-[#718576]">/ {formatRupiah(g.target)}</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#EBF0EC] overflow-hidden mt-2">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${g.color}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#718576]">
                      <span>{g.deadline ? `Target: ${g.deadline}` : "No deadline"}</span>
                      <span>{reached ? "Target tercapai!" : `Sisa: ${formatRupiah(left)}`}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-[#F2F5F2] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedGoalId(g.id)}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-[#244833] bg-[#E8EFEA] hover:bg-[#DCE6DF] transition-colors cursor-pointer"
                  >
                    + Tambah Tabungan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(g.id, g.title)}
                    className="p-2 rounded-lg text-gray-300 hover:text-[#B4491F] hover:bg-[#FBE9E2] transition-colors cursor-pointer"
                    aria-label={`Delete ${g.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Deposit Modal */}
      {selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#DCE4DD]">
            <h3 className="text-sm font-bold text-[#1E3A2B]">Tambah Tabungan</h3>
            <p className="text-xs text-[#718576] mt-0.5 mb-4">
              Sisihkan sebagian allowance ke &quot;{selectedGoal.title}&quot;.
            </p>

            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[#677C6D] block mb-1">
                  Nominal Tambahan (Rp)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  autoFocus
                  placeholder="Contoh: 50.000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(formatInput(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#D7E2D9] text-base font-extrabold text-[#1E3A2B] focus:outline-none focus:border-[#224431]"
                />
              </div>

              {depositError && (
                <p className="text-xs font-semibold text-[#B4491F] bg-[#FBE9E2] rounded-lg px-3 py-2">
                  {depositError}
                </p>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeDeposit}
                  className="w-1/2 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 text-xs font-bold text-white bg-[#224431] rounded-xl shadow-xs cursor-pointer"
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
