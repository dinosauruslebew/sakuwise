"use client";

import React, { useEffect, useRef, useState } from "react";
import Logo from "../Logo";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutGrid,
  CalendarDays,
  Receipt,
  Sparkles,
  Bell,
  Target,
  SlidersHorizontal,
  HelpCircle,
  LogOut,
  ChevronUp,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close the profile dropdown on outside click or Escape
  useEffect(() => {
    if (!profileDropdownOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileDropdownOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [profileDropdownOpen]);

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "budget", label: "Monthly budget", icon: CalendarDays },
    { id: "expenses", label: "Expenses", icon: Receipt },
    { id: "ai", label: "AI assistant", icon: Sparkles },
    { id: "bills", label: "Bills & reminders", icon: Bell },
    { id: "savings", label: "Savings goals", icon: Target },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const displayName = user?.name || "Najwa";
  const displayRole = user?.role || "Student account";

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container: Fixed height with flex-col & overflow management */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 h-screen max-h-screen bg-[#FAF8F5] border-r border-[#E8ECE8] flex flex-col justify-between p-4 sm:p-5 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* 1. Header & Navigation Section (Scrollable if viewport is short) */}
        <div className="flex flex-col min-h-0 flex-1">
          {/* Logo Sakuwise Resmi */}
          <div className="flex-shrink-0 pt-1 pb-5 px-1">
            <Logo size="md" />
          </div>

          {/* Navigation Menu with independent smooth scroll */}
          <nav className="flex-1 overflow-y-auto space-y-1 pr-1 -mr-1 py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-[#E5ECE6] text-[#1E3A2B] shadow-2xs font-bold"
                      : "text-[#586C5E] hover:text-[#1E3A2B] hover:bg-black/[0.03]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-[#1E3A2B] stroke-[2.5]" : "text-[#7B8E81] stroke-[2]"
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* 2. Bottom Section: Motivation, Settings, Help & Profile (Always Pinned & Fully Visible) */}
        <div className="flex-shrink-0 pt-3 border-t border-[#EDF1EE] space-y-3 bg-[#FAF8F5]">
          
          {/* Motivational Card */}
          <div className="bg-[#EBF1EC] rounded-xl p-3 border border-[#DCE5DE]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-md bg-white/80 flex items-center justify-center text-[#244833]">
                <Sparkles className="w-3 h-3 text-[#E08C38] fill-[#E08C38]" />
              </div>
              <p className="text-[11px] font-bold text-[#1E3A2B] leading-tight">
                Your future self will thank you.
              </p>
            </div>
            <p className="text-[11px] text-[#5C7063] leading-tight">
              A little saved goes a long way.
            </p>
          </div>

          {/* Settings & Help */}
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#586C5E] hover:text-[#1E3A2B] hover:bg-black/[0.03] transition-colors cursor-pointer ${
                activeTab === "settings" ? "bg-[#E5ECE6] text-[#1E3A2B] font-bold" : ""
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#7B8E81]" />
              <span>Settings</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("help")}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#586C5E] hover:text-[#1E3A2B] hover:bg-black/[0.03] transition-colors cursor-pointer ${
                activeTab === "help" ? "bg-[#E5ECE6] text-[#1E3A2B] font-bold" : ""
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#7B8E81]" />
              <span>Help & support</span>
            </button>
          </div>

          {/* Active User Profile & Logout (Pinned and perfectly visible on all screens) */}
          <div className="relative pt-1" ref={profileRef}>
            {profileDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-xl border border-[#DCE4DD] p-2 space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-150 z-30">
                <div className="px-3 py-2 border-b border-[#F0F4F1]">
                  <p className="text-xs font-bold text-[#1E3A2B]">{displayName}</p>
                  <p className="text-[11px] text-[#718275] truncate">
                    {user?.email || "najwa.finance@student.ac.id"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-white/70 hover:bg-white border border-[#E5ECE5] transition-all text-left cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#244833] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-inner">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1E3A2B] truncate group-hover:text-[#12281C]">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-[#718275] truncate">
                    {displayRole}
                  </p>
                </div>
              </div>
              <ChevronUp
                className={`w-3.5 h-3.5 text-[#7B8E81] transition-transform flex-shrink-0 ${
                  profileDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

        </div>
      </aside>
    </>
  );
}
