"use client";

import React from "react";
import { Menu, Calendar, Plus, Bell, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  activeTab: string;
  onOpenAddExpense: () => void;
  onOpenMobileSidebar: () => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

export default function Header({
  activeTab,
  onOpenAddExpense,
  onOpenMobileSidebar,
  selectedMonth,
  setSelectedMonth,
}: HeaderProps) {
  const { user } = useAuth();
  const userName = user?.name || user?.email?.split("@")[0] || "kamu";

  const getBreadcrumb = () => {
    switch (activeTab) {
      case "budget":
        return "MY WORKSPACE / MONTHLY BUDGET";
      case "expenses":
        return "MY WORKSPACE / EXPENSES";
      case "ai":
        return "MY WORKSPACE / AI ASSISTANT";
      case "bills":
        return "MY WORKSPACE / BILLS & REMINDERS";
      case "savings":
        return "MY WORKSPACE / SAVINGS GOALS";
      default:
        return "MY WORKSPACE / OVERVIEW";
    }
  };

  const getTitleAndSubtitle = () => {
    switch (activeTab) {
      case "budget":
        return {
          title: "Give every rupiah a purpose.",
          subtitle: "Plan your essentials first. Leave room for the things you love.",
        };
      case "expenses":
        return {
          title: "Small expenses. Clearer picture.",
          subtitle: "Keep track of your daily spending, one transaction at a time.",
        };
      case "ai":
        return {
          title: "Sakuwise AI Companion.",
          subtitle: `Smart financial insights tailored for ${userName}.`,
        };
      case "bills":
        return {
          title: "Never miss a due date.",
          subtitle: "Keep recurring expenses under control and on schedule.",
        };
      case "savings":
        return {
          title: "Small steps, big dreams.",
          subtitle: "Track your funds and turn ambitions into reality.",
        };
      default:
        return {
          title: "A little planning. A lot more peace.",
          subtitle: `Here's where your money stands this month, ${userName}.`,
        };
    }
  };

  const { title, subtitle } = getTitleAndSubtitle();

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8ECE8] px-4 sm:px-8 py-5">
      {/* Mobile Top Bar */}
      <div className="flex md:hidden items-center justify-between pb-3 mb-3 border-b border-gray-200/60">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-xl text-[#1E3A2B] hover:bg-black/5"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="text-xs font-bold text-[#1E3A2B]">
          Sakuwise Workspace
        </span>

        <button
          type="button"
          onClick={onOpenAddExpense}
          className="p-2 rounded-xl bg-[#244833] text-white text-xs font-semibold flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Main Header Container */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Left: Breadcrumb & Title */}
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#738777]">
            {getBreadcrumb()}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2B] tracking-tight mt-1">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-[#5C7063] mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* Right: Status Pills, Date, Month Picker, and Action Button */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          
          {/* Sample Data Pill */}
          <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium text-[#496251] bg-[#E8EFEA] border border-[#D5E1D7]">
            Sample data
          </span>

          {/* Current Date */}
          <span className="hidden xl:inline-block text-xs font-medium text-[#718576]">
            Tuesday, 17 Nov 2026
          </span>

          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              className="w-9 h-9 rounded-xl bg-white border border-[#DDE6DF] flex items-center justify-center text-[#55695B] hover:text-[#1E3A2B] hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
              title="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E08C38] ring-2 ring-white" />
            </button>
          </div>

          {/* Month Picker Dropdown */}
          <div className="relative">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#DDE6DF] shadow-2xs text-xs font-bold text-[#1E3A2B]">
              <Calendar className="w-3.5 h-3.5 text-[#5B7664]" />
              <span>{selectedMonth}</span>
            </div>
          </div>

          {/* Primary Action Button */}
          {activeTab === "budget" ? (
            <button
              type="button"
              onClick={() => alert("Perubahan anggaran tersimpan!")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#224431] hover:bg-[#163324] shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save budget</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAddExpense}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#224431] hover:bg-[#163324] shadow-sm hover:shadow active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add expense</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
