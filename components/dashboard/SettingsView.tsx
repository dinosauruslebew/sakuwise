"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Check, Shield, Bell, Moon, Smartphone } from "lucide-react";

export default function SettingsView() {
  const { user } = useAuth();
  const [currency, setCurrency] = useState("IDR (Rupiah - Rp)");
  const [dailyReminder, setDailyReminder] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDE7] shadow-2xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-[#1E3A2B]">Pengaturan Akun & Preferensi</h2>
          <p className="text-xs text-[#718576]">Sesuaikan pengalaman pengelolaan keuanganmu di Sakuwise.</p>
        </div>

        {/* Profile info */}
        <div className="pt-4 border-t border-[#F2F5F2] flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#244833] text-white text-lg font-bold flex items-center justify-center">
            {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "S"}
          </div>
          <div>
            <p className="text-sm font-bold text-[#1E3A2B]">{user?.name || user?.email?.split("@")[0] || "Pengguna Sakuwise"}</p>
            <p className="text-xs text-[#718576]">{user?.email || "Akun Terdaftar"}</p>
            <span className="inline-block mt-1 text-[10px] font-semibold bg-[#E8EFEA] text-[#244833] px-2.5 py-0.5 rounded-full">
              {user?.role || "Personal account"} · Autentikasi Terverifikasi
            </span>
          </div>
        </div>

        {/* Currency & Locale */}
        <div className="pt-4 border-t border-[#F2F5F2] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#677C6D]">Mata Uang & Regional</h3>
          <div>
            <label className="text-xs font-semibold text-[#1E3A2B] block mb-1">Mata Uang Default</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full sm:w-72 px-3 py-2 rounded-xl border border-[#D7E2D9] text-xs font-semibold text-[#1E3A2B] bg-[#FAF8F5]"
            >
              <option value="IDR (Rupiah - Rp)">IDR (Indonesian Rupiah - Rp)</option>
              <option value="USD ($)">USD (US Dollar - $)</option>
              <option value="SGD ($)">SGD (Singapore Dollar - S$)</option>
            </select>
          </div>
        </div>

        {/* Notifications */}
        <div className="pt-4 border-t border-[#F2F5F2] space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#677C6D]">Pengingat & Notifikasi</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#1E3A2B]">Pengingat Catat Harian</p>
              <p className="text-[11px] text-[#718576]">Kirim notifikasi ramah setiap jam 20:00 untuk mencatat sisa pengeluaran.</p>
            </div>
            <input
              type="checkbox"
              checked={dailyReminder}
              onChange={(e) => setDailyReminder(e.target.checked)}
              className="w-4 h-4 accent-[#224431] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#1E3A2B]">Peringatan Anggaran 85%</p>
              <p className="text-[11px] text-[#718576]">Beri tahu saat saku makan atau belanja sudah menipis.</p>
            </div>
            <input
              type="checkbox"
              checked={budgetAlerts}
              onChange={(e) => setBudgetAlerts(e.target.checked)}
              className="w-4 h-4 accent-[#224431] cursor-pointer"
            />
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
