"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import HeroDashboardMockup from "@/components/HeroDashboardMockup";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const { loginWithEmail, signUpWithEmail, isLoading } = useAuth();

  const pathname = usePathname();
  const [mode, setMode] = useState<"login" | "signup">(
    pathname === "/signup" ? "signup" : "login",
  );
  const [identifier, setIdentifier] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim() || !password) {
      setErrorMessage("Silakan isi semua data yang diperlukan.");
      return;
    }

    if (mode === "login") {
      // Support login via email or username
      const emailValue = identifier.includes("@")
        ? identifier.trim()
        : `${identifier.trim().toLowerCase()}@sakuwise.id`;

      const res = await loginWithEmail(emailValue, password, rememberMe);
      if (!res.success && res.error) {
        setErrorMessage(res.error);
      }
    } else {
      // Sign Up mode
      const emailValue = identifier.includes("@")
        ? identifier.trim()
        : `${identifier.trim().toLowerCase()}@sakuwise.id`;

      const res = await signUpWithEmail(name || identifier.split("@")[0], emailValue, password);
      if (!res.success && res.error) {
        setErrorMessage(res.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-2 text-[#1E3A2B]">
      
      {/* ================= LEFT COLUMN: FORM LOGIN ================= */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-16 max-w-xl mx-auto w-full lg:max-w-none">
        
        {/* Top: Logo Sakuwise */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-block transition-transform duration-200 hover:scale-[1.01]">
            <Logo size="md" />
          </Link>
          {/* Mobile Back Link */}
          <Link
            href="/"
            className="lg:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B6D60] hover:text-[#1E3A2B]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>
        </div>

        {/* Center: Main Login Form */}
        <div className="my-auto py-8 sm:py-12 max-w-md w-full mx-auto">
          
          {/* Header Title */}
          <div className="mb-8">
            <span className="text-[11px] font-bold text-[#7A8E80] tracking-widest uppercase block mb-1.5">
              {mode === "login" ? "SELAMAT DATANG KEMBALI" : "MULAI PERJALANANMU"}
            </span>
            <h1 className="text-3xl sm:text-[34px] font-extrabold text-[#1E3A2B] tracking-tight leading-tight">
              {mode === "login" ? "Masuk ke Sakuwise" : "Daftar Akun Sakuwise"}
            </h1>
            <p className="mt-2 text-sm text-[#5B6D60] leading-relaxed">
              {mode === "login"
                ? "Lanjutkan rencana baik untuk keuanganmu."
                : "Kelola keuangan pribadi lebih terarah tanpa biaya."}
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div role="alert" className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Form Credentials */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name field only in signup mode */}
            {mode === "signup" && (
              <div>
                <label htmlFor="name" className="text-xs font-bold text-[#1E3A2B] block mb-1.5">
                  Nama lengkap
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#8C9E91] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="name"
                    name="name"
                    autoComplete="name"
                    type="text"
                    required
                    placeholder="Contoh: Najwa"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#D5E1D7] text-base sm:text-sm font-medium text-[#1E3A2B] focus:outline-none focus:border-[#224431] focus:ring-2 focus:ring-[#224431]/40 bg-[#FAF8F5]/60 focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email / Username field */}
            <div>
              <label htmlFor="identifier" className="text-xs font-bold text-[#1E3A2B] block mb-1.5">
                Email atau nama pengguna
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#8C9E91] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="identifier"
                  name="identifier"
                  autoComplete="username"
                  type="text"
                  required
                  placeholder="Masukkan email atau nama pengguna"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#D5E1D7] text-base sm:text-sm font-medium text-[#1E3A2B] focus:outline-none focus:border-[#224431] focus:ring-2 focus:ring-[#224431]/40 bg-[#FAF8F5]/60 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="text-xs font-bold text-[#1E3A2B] block mb-1.5">
                Kata sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C9E91] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  name="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#D5E1D7] text-base sm:text-sm font-medium text-[#1E3A2B] focus:outline-none focus:border-[#224431] focus:ring-2 focus:ring-[#224431]/40 bg-[#FAF8F5]/60 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C9E91] hover:text-[#1E3A2B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#224431] rounded cursor-pointer"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Options Row: Ingat saya & Lupa kata sandi */}
            {mode === "login" && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#CBD8CE] text-[#224431] accent-[#224431] cursor-pointer"
                  />
                  <span className="text-xs text-[#5B6D60]">Ingat saya</span>
                </label>
                <button
                  type="button"
                  onClick={() => setErrorMessage("Fitur atur ulang kata sandi belum tersedia. Jika lupa, daftar dengan email baru.")}
                  className="text-xs text-[#224431] font-semibold hover:underline cursor-pointer"
                >
                  Lupa kata sandi?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#224431] hover:bg-[#183526] transition-all duration-200 shadow-sm hover:shadow active:scale-[0.99] cursor-pointer disabled:opacity-70 mt-3"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : mode === "login" ? (
                "Masuk"
              ) : (
                "Daftar Sekarang"
              )}
            </button>
          </form>

          {/* Toggle Login / Sign Up */}
          <div className="mt-6 text-center">
            {mode === "login" ? (
              <p className="text-xs text-[#5B6D60]">
                Belum punya akun?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrorMessage(null);
                  }}
                  className="font-bold text-[#224431] hover:underline cursor-pointer"
                >
                  Daftar gratis
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#5B6D60]">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMessage(null);
                  }}
                  className="font-bold text-[#224431] hover:underline cursor-pointer"
                >
                  Masuk di sini
                </button>
              </p>
            )}
          </div>

        </div>

        {/* Bottom: Left Footer Links & Copyright */}
        <div className="pt-6 border-t border-[#F0F4F1] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A8E80] gap-3">
          <div className="flex items-center gap-4">
            <span>Kebijakan Privasi</span>
            <span>•</span>
            <span>Syarat & Ketentuan</span>
          </div>
          <p>© 2026 Sakuwise. Semua hak dilindungi.</p>
        </div>

      </div>

      {/* ================= RIGHT COLUMN: VISUAL SHOWCASE ================= */}
      <div className="hidden lg:flex flex-col justify-between bg-[#FAF8F5] border-l border-[#EBEFEA] p-10 lg:p-14 relative overflow-hidden">
        
        {/* Top Right: Link Kembali ke Beranda */}
        <div className="flex justify-end">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#5B6D60] hover:text-[#1E3A2B] transition-colors py-2 px-3 rounded-lg hover:bg-black/[0.03]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke beranda</span>
          </Link>
        </div>

        {/* Center: Showcase Hero Card & Headlines */}
        <div className="my-auto max-w-lg w-full mx-auto py-6">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF3E2] border border-[#FDE5C5] text-xs font-bold text-[#9A5B15] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E08C38]" />
            <span>Satu langkah bijak setiap hari.</span>
          </div>

          {/* Headline Text */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A2B] tracking-tight leading-tight">
            Uang lebih terarah. <br />
            Hidup lebih tenang.
          </h2>

          <p className="mt-2.5 text-sm text-[#5B6D60] leading-relaxed mb-8">
            Semua saku, rencana, dan tujuanmu di satu tempat.
          </p>

          {/* Hero Card Preview Mockup */}
          <div className="w-full">
            <HeroDashboardMockup />
          </div>

        </div>

        {/* Bottom Right: Tagline */}
        <div className="flex justify-start pt-6 border-t border-[#EBEFEA]/70">
          <span className="text-xs text-[#7A8E80] font-medium tracking-tight">
            Manage your money, wisely.
          </span>
        </div>

      </div>

    </div>
  );
}
