"use client";

import React, { useEffect, useRef, useState } from "react";
import { Menu, Calendar, Plus, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useFinance, formatRupiah, parseISODate, isDemoAccount } from "@/context/FinanceContext";
import { loadPrefs, PREFS_EVENT, type Preferences } from "@/lib/preferences";

interface HeaderProps {
  activeTab: string;
  onOpenAddExpense: () => void;
  onOpenMobileSidebar: () => void;
}

function dueText(daysUntil: number): string {
  if (daysUntil < 0) return `Overdue by ${-daysUntil} ${daysUntil === -1 ? "day" : "days"}`;
  if (daysUntil === 0) return "Due today";
  if (daysUntil === 1) return "Due tomorrow";
  return `Due in ${daysUntil} days`;
}

export default function Header({
  activeTab,
  onOpenAddExpense,
  onOpenMobileSidebar,
}: HeaderProps) {
  const { user } = useAuth();
  const { summary } = useFinance();
  const { today, periodStart, dueSoonBills } = summary;
  const userName = user?.name || "Najwa";
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Close the notification dropdown on outside click or Escape
  useEffect(() => {
    if (!bellOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBellOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [bellOpen]);

  // Notification preferences from Settings; refreshed whenever they are saved
  const [prefs, setPrefs] = useState<Preferences>(() => loadPrefs(user?.email));
  useEffect(() => {
    const refresh = () => setPrefs(loadPrefs(user?.email));
    window.addEventListener(PREFS_EVENT, refresh);
    return () => window.removeEventListener(PREFS_EVENT, refresh);
  }, [user?.email]);

  const budgetWarnings = prefs.budgetAlerts
    ? summary.categoryStats.filter((c) => c.budget > 0 && c.percent >= 85)
    : [];
  const showDailyReminder = prefs.dailyReminder && summary.spentToday === 0;
  const notificationCount =
    dueSoonBills.length + budgetWarnings.length + (showDailyReminder ? 1 : 0);

  const monthLabel = parseISODate(periodStart).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const todayLabel = parseISODate(today).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

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
      case "settings":
        return "MY WORKSPACE / SETTINGS";
      case "help":
        return "MY WORKSPACE / HELP";
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
      case "settings":
        return {
          title: "Make it yours.",
          subtitle: "Manage your account and preferences.",
        };
      case "help":
        return {
          title: "We're here to help.",
          subtitle: "Answers to common questions about SakuWise.",
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

        <span className="text-xs font-bold text-[#1E3A2B]">Sakuwise Workspace</span>

        <button
          type="button"
          onClick={onOpenAddExpense}
          className="p-2 rounded-xl bg-[#244833] text-white text-xs font-semibold flex items-center gap-1"
          aria-label="Add expense"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Main Header Container */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Breadcrumb & Title */}
        <div>
          <p className="text-[11px] font-bold tracking-widest uppercase text-[#738777]">
            {getBreadcrumb()}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2B] tracking-tight mt-1">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-[#5C7063] mt-0.5">{subtitle}</p>
        </div>

        {/* Right: Status Pills, Date, Notifications, Month, and Action Button */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Sample Data Pill */}
          <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium text-[#496251] bg-[#E8EFEA] border border-[#D5E1D7]">
            {isDemoAccount(user?.email) ? "Sample data" : "Your data"}
          </span>

          {/* Current Date */}
          <span className="hidden xl:inline-block text-xs font-medium text-[#718576]">
            {todayLabel}
          </span>

          {/* Notification Bell */}
          <div className="relative" ref={bellRef}>
            <button
              type="button"
              onClick={() => setBellOpen((v) => !v)}
              className="relative w-9 h-9 rounded-xl bg-white border border-[#DDE6DF] flex items-center justify-center text-[#55695B] hover:text-[#1E3A2B] hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
              title="Notifications"
              aria-label="Notifications"
              aria-expanded={bellOpen}
            >
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#E08C38] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                  {notificationCount}
                </span>
              )}
            </button>

            {bellOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-[#E1E9E2] shadow-xl p-4 z-40">
                <p className="text-xs font-bold text-[#1E3A2B] mb-2">Reminders</p>
                {notificationCount === 0 ? (
                  <p className="text-xs text-[#718576]">No reminders right now.</p>
                ) : (
                  <ul className="space-y-2">
                    {showDailyReminder && (
                      <li className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E9EFEA]">
                        <p className="text-xs font-bold text-[#1E3A2B]">Log today&apos;s spending</p>
                        <p className="text-[11px] text-[#718576]">No expenses recorded yet today.</p>
                      </li>
                    )}
                    {budgetWarnings.map((c) => (
                      <li key={c.id} className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E9EFEA]">
                        <p className="text-xs font-bold text-[#1E3A2B]">{c.name} budget</p>
                        <p className={`text-[11px] ${c.over ? "text-[#B4491F] font-semibold" : "text-[#718576]"}`}>
                          {c.over ? "Over budget" : `${c.percent}% used`} Â· {formatRupiah(c.spent)} of {formatRupiah(c.budget)}
                        </p>
                      </li>
                    ))}
                    {dueSoonBills.map((b) => (
                      <li
                        key={b.id}
                        className="flex items-center justify-between gap-3 p-2 rounded-xl bg-[#FAF8F5] border border-[#E9EFEA]"
                      >
                        <div>
                          <p className="text-xs font-bold text-[#1E3A2B]">{b.name}</p>
                          <p
                            className={`text-[11px] ${
                              b.overdue ? "text-[#B4491F] font-semibold" : "text-[#718576]"
                            }`}
                          >
                            {dueText(b.daysUntil)}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#1E3A2B]">{formatRupiah(b.amount)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Current period month */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#DDE6DF] shadow-2xs text-xs font-bold text-[#1E3A2B]">
            <Calendar className="w-3.5 h-3.5 text-[#5B7664]" />
            <span>{monthLabel}</span>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={onOpenAddExpense}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#224431] hover:bg-[#163324] shadow-sm hover:shadow active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add expense</span>
          </button>
        </div>
      </div>
    </header>
  );
}
