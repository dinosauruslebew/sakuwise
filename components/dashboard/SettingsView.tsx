"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useFinance, isDemoAccount } from "@/context/FinanceContext";
import { Check, RotateCcw } from "lucide-react";
import { loadPrefs, savePrefs, type Preferences } from "@/lib/preferences";

export default function SettingsView() {
  const { user } = useAuth();
  const { resetData } = useFinance();

  const demo = isDemoAccount(user?.email);
  const isGoogle = !!user?.id?.startsWith("google_");

  const [prefs, setPrefs] = useState<Preferences>(() => loadPrefs(user?.email));
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    savePrefs(user?.email, prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const message = demo
      ? "Kembalikan semua data ke data contoh? Transaksi, tagihan, dan target yang kamu ubah akan hilang."
      : "Hapus semua data keuanganmu (anggaran, transaksi, tagihan, dan target)? Tindakan ini tidak bisa dibatalkan.";
    if (window.confirm(message)) {
      resetData();
    }
  };

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDE7] shadow-2xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-[#1E3A2B]">Pengaturan Akun & Preferensi</h2>
          <p className="text-xs text-[#718576]">Sesuaikan pengalaman pengelolaan keuanganmu di SakuWise.</p>
        </div>

        {/* Profile info */}
        <div className="pt-4 border-t border-[#F2F5F2] flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#244833] text-white text-lg font-bold flex items-center justify-center">
            {user?.name?.charAt(0).toUpperCase() || "N"}
          </div>
          <div>
            <p className="text-sm font-bold text-[#1E3A2B]">{user?.name || "Najwa"}</p>
            <p className="text-xs text-[#718576]">{user?.email || "najwa.finance@student.ac.id"}</p>
            <span className="inline-block mt-1 text-[11px] font-semibold bg-[#E8EFEA] text-[#244833] px-2 py-0.5 rounded-full">
              {user?.role || "Student account"} Â· {isGoogle ? "Google OAuth" : "Email & kata sandi"}
            </span>
          </div>
        </div>

        {/* Currency & Locale */}
        <div className="pt-4 border-t border-[#F2F5F2] space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#677C6D]">Mata Uang & Regional</h3>
          <div>
            <p className="text-xs font-semibold text-[#1E3A2B] mb-1">Mata Uang</p>
            <p className="w-full sm:w-72 px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-semibold text-[#1E3A2B] bg-[#FAF8F5]">
              IDR (Indonesian Rupiah - Rp)
            </p>
            <p className="text-[11px] text-[#718576] mt-1">Saat ini SakuWise hanya mendukung Rupiah.</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="pt-4 border-t border-[#F2F5F2] space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#677C6D]">Pengingat & Notifikasi</h3>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#1E3A2B]">Pengingat Catat Harian</p>
              <p className="text-[11px] text-[#718576]">Pengingat untuk mencatat pengeluaran hari ini.</p>
            </div>
            <input
              type="checkbox"
              checked={prefs.dailyReminder}
              onChange={(e) => setPrefs((p) => ({ ...p, dailyReminder: e.target.checked }))}
              className="w-4 h-4 accent-[#224431] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#1E3A2B]">Peringatan Anggaran 85%</p>
              <p className="text-[11px] text-[#718576]">Beri tahu saat anggaran sebuah kategori hampir habis.</p>
            </div>
            <input
              type="checkbox"
              checked={prefs.budgetAlerts}
              onChange={(e) => setPrefs((p) => ({ ...p, budgetAlerts: e.target.checked }))}
              className="w-4 h-4 accent-[#224431] cursor-pointer"
            />
          </div>
        </div>

        {/* Data */}
        <div className="pt-4 border-t border-[#F2F5F2] space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#677C6D]">Data</h3>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#1E3A2B]">{demo ? "Reset ke data contoh" : "Hapus semua data keuangan"}</p>
              <p className="text-[11px] text-[#718576]">
                {demo
                  ? "Kembalikan transaksi, tagihan, dan target ke kondisi awal demo."
                  : "Mulai ulang dari nol. Data tersimpan di browser ini."}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#B3402A] bg-[#FDF1EE] hover:bg-[#FAE3DD] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {demo ? "Reset" : "Hapus"}
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-[#F2F5F2] flex items-center justify-between">
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#224431] hover:bg-[#163323] transition-colors shadow-xs cursor-pointer"
          >
            Simpan Perubahan
          </button>
          {saved && (
            <span className="text-xs text-[#20743E] font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Tersimpan!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
