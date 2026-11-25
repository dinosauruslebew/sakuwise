"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import GoogleIcon from "@/components/GoogleIcon";
import HeroDashboardMockup from "@/components/HeroDashboardMockup";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck, 
} from "lucide-react";

export default function LoginPage() {
  const { loginWithEmail, signUpWithEmail, loginWithGoogle, isLoading } = useAuth();
  const pathname = usePathname();

  const [mode, setMode] = useState<"login" | "signup">(() =>
    pathname === "/signup" ? "signup" : "login"
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
      setErrorMessage("Please enter your email and password.");
      return;
    }

    if (mode === "login") {
      const emailValue = identifier.includes("@")
        ? identifier.trim()
        : `${identifier.trim().toLowerCase()}@sakuwise.id`;

      const res = await loginWithEmail(emailValue, password);
      if (!res.success && res.error) {
        setErrorMessage(res.error);
      }
    } else {
      const emailValue = identifier.includes("@")
        ? identifier.trim()
        : `${identifier.trim().toLowerCase()}@sakuwise.id`;

      const res = await signUpWithEmail(name || identifier.split("@")[0], emailValue, password);
      if (!res.success && res.error) {
        setErrorMessage(res.error);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-2 text-[#1E3A2B]">
      
      {/* ================= LEFT COLUMN: FORM LOGIN ================= */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-14 max-w-xl mx-auto w-full lg:max-w-none">
        
        {/* Top: Logo Sakuwise (Enlarged & Prominent) */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-block transition-transform duration-200 hover:scale-[1.01]">
            <Logo size="lg" />
          </Link>
          {/* Mobile Back to Home Link */}
          <Link
            href="/"
            className="lg:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B6D60] hover:text-[#1E3A2B]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>

        {/* Center: Main Login Form */}
        <div className="my-auto py-8 sm:py-10 max-w-md w-full mx-auto">
          
          {/* Header Title */}
          <div className="mb-7">
            <span className="text-[11px] font-bold text-[#7A8E80] tracking-widest uppercase block mb-1.5">
              {mode === "login" ? "WELCOME BACK" : "START YOUR JOURNEY"}
            </span>
            <h1 className="text-3xl sm:text-[34px] font-extrabold text-[#1E3A2B] tracking-tight leading-tight">
              {mode === "login" ? "Sign in to Sakuwise" : "Create your Sakuwise account"}
            </h1>
            <p className="mt-2 text-sm text-[#5B6D60] leading-relaxed">
              {mode === "login"
                ? "Continue your smart financial journey."
                : "Take charge of your personal finances with clarity."}
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* 1. Official Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold text-[#1E3A2B] bg-white border border-[#D5E1D7] hover:bg-[#FAF8F5] hover:border-[#B7C7B9] shadow-2xs hover:shadow transition-all duration-200 cursor-pointer disabled:opacity-60 mb-5 group"
          >
            <GoogleIcon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-105" />
            <span>Sign in with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8ECE8]" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-medium text-[#7A8E80]">
              or continue with email
            </span>
          </div>

          {/* 2. Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name for Signup */}
            {mode === "signup" && (
              <div>
                <label className="text-xs font-bold text-[#1E3A2B] block mb-1.5">
                  Full name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#8C9E91] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#D5E1D7] text-xs sm:text-sm font-medium text-[#1E3A2B] focus:outline-none focus:border-[#224431] focus:ring-1 focus:ring-[#224431] bg-[#FAF8F5]/60 focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email / Username field */}
            <div>
              <label className="text-xs font-bold text-[#1E3A2B] block mb-1.5">
                Email or username
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#8C9E91] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Enter email or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#D5E1D7] text-xs sm:text-sm font-medium text-[#1E3A2B] focus:outline-none focus:border-[#224431] focus:ring-1 focus:ring-[#224431] bg-[#FAF8F5]/60 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="text-xs font-bold text-[#1E3A2B] block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C9E91] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#D5E1D7] text-xs sm:text-sm font-medium text-[#1E3A2B] focus:outline-none focus:border-[#224431] focus:ring-1 focus:ring-[#224431] bg-[#FAF8F5]/60 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C9E91] hover:text-[#1E3A2B] focus:outline-none cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Options Row: Remember me & Forgot password */}
            {mode === "login" && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#CBD8CE] text-[#224431] accent-[#224431] cursor-pointer"
                  />
                  <span className="text-xs text-[#5B6D60]">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert("Please sign up for a new account or use Google Sign In.")}
                  className="text-xs text-[#224431] font-semibold hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#224431] hover:bg-[#183526] transition-all duration-200 shadow-sm hover:shadow active:scale-[0.99] cursor-pointer disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="mt-6 text-center">
            {mode === "login" ? (
              <p className="text-xs text-[#5B6D60]">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrorMessage(null);
                  }}
                  className="font-bold text-[#224431] hover:underline cursor-pointer"
                >
                  Sign up for free
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#5B6D60]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMessage(null);
                  }}
                  className="font-bold text-[#224431] hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>

          {/* Privacy & Trust Badge */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-[#788C7E]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#20743E]" />
            <span>Encrypted password & secure OAuth authorization</span>
          </div>

        </div>

        {/* Bottom: Left Footer Links & Copyright */}
        <div className="pt-6 border-t border-[#F0F4F1] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A8E80] gap-3">
          <div className="flex items-center gap-4">
            <a href="#privasi" className="hover:text-[#1E3A2B] transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#syarat" className="hover:text-[#1E3A2B] transition-colors">
              Terms of Service
            </a>
          </div>
          <p>© 2026 Sakuwise. All rights reserved.</p>
        </div>

      </div>

      {/* ================= RIGHT COLUMN: VISUAL SHOWCASE ================= */}
      <div className="hidden lg:flex flex-col justify-between bg-[#FAF8F5] border-l border-[#EBEFEA] p-10 lg:p-14 relative overflow-hidden">
        
        {/* Top Right: Link Back to Home */}
        <div className="flex justify-end">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#5B6D60] hover:text-[#1E3A2B] transition-colors py-2 px-3.5 rounded-lg hover:bg-black/[0.03]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to home</span>
          </Link>
        </div>

        {/* Center: Showcase Card & Headlines */}
        <div className="my-auto max-w-lg w-full mx-auto py-6">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF3E2] border border-[#FDE5C5] text-xs font-bold text-[#9A5B15] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E08C38]" />
            <span>One smart move every day.</span>
          </div>

          {/* Headline Text */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A2B] tracking-tight leading-tight">
            Smart money, <br />
            peaceful life.
          </h2>

          <p className="mt-2.5 text-sm text-[#5B6D60] leading-relaxed mb-6">
            All your pockets, plans, and goals in one place.
          </p>

          {/* Hero Card Preview Mockup (Clean, 0 collisions) */}
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
