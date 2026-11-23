"use client";

import React from "react";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import {
  useFinance,
  formatRupiah,
  formatShortDate,
  describeDate,
  parseISODate,
} from "@/context/FinanceContext";

interface OverviewViewProps {
  onSwitchTab: (tab: string) => void;
  onOpenAddExpense: () => void;
}

const categoryBadges: Record<string, { bg: string; text: string }> = {
  "Food & drinks": { bg: "bg-[#FEF1E1]", text: "text-[#9A5B15]" },
  Transport: { bg: "bg-[#E3EFE7]", text: "text-[#245235]" },
  "Academic needs": { bg: "bg-[#E9EDE9]", text: "text-[#425748]" },
  Personal: { bg: "bg-[#F5EFE6]", text: "text-[#71542B]" },
  Accommodation: { bg: "bg-[#EAE8F2]", text: "text-[#4B3B70]" },
  "Emergency fund": { bg: "bg-[#F8EFEA]", text: "text-[#7D452B]" },
};

function dueLabel(daysUntil: number, dueDate: string): string {
  const date = formatShortDate(dueDate);
  if (daysUntil < 0) return `Overdue since ${date}`;
  if (daysUntil === 0) return `Due ${date} Â· Today`;
  if (daysUntil === 1) return `Due ${date} Â· Tomorrow`;
  return `Due ${date} Â· In ${daysUntil} days`;
}

export default function OverviewView({ onSwitchTab, onOpenAddExpense }: OverviewViewProps) {
  const { income, transactions, goals, summary } = useFinance();
  const {
    today,
    daysLeft,
    totalSpent,
    remaining,
    percentSpent,
    percentRemaining,
    spentToday,
    balanceAtDayStart,
    dailyLimit,
    leftToday,
    categoryStats,
    last7Days,
    bills,
    nextAllowanceDate,
  } = summary;

  const nextDate = parseISODate(nextAllowanceDate);
  const nextAllowanceLabel = `${formatShortDate(nextAllowanceDate)} ${nextDate.getFullYear()}`;

  const recent = transactions.slice(0, 5);
  const upcomingBills = bills.filter((b) => !b.paid).slice(0, 2);
  const goal = goals[0];
  const goalPercent = goal ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;

  // Daily limit progress for today
  const todayPercent =
    dailyLimit > 0 ? Math.min(100, Math.round((spentToday / dailyLimit) * 100)) : spentToday > 0 ? 100 : 0;
  const overToday = leftToday < 0;

  // 7-day chart scaled to the busiest day
  const maxDay = Math.max(1, ...last7Days.map((d) => d.total));

  // Insight about the category that needs the most attention
  const insightPool = categoryStats.filter((c) => c.budget > 0);
  const focus = [...insightPool].sort((a, b) => b.percent - a.percent)[0];
  let insightTitle = "Start by adding a budget category.";
  let insightBody =
    "Once your budget and expenses are recorded, SakuWise can give you guidance here.";
  if (focus) {
    const perDay = Math.max(0, Math.floor(focus.remaining / daysLeft));
    if (focus.over) {
      insightTitle = `${focus.name} is over budget.`;
      insightBody = `You've spent ${formatRupiah(focus.spent)} against a ${formatRupiah(focus.budget)} plan. Consider moving some budget from another category or pausing this one.`;
    } else {
      insightTitle =
        focus.percent >= 80
          ? `${focus.name} is almost used up.`
          : `Your ${focus.name.toLowerCase()} budget is doing well.`;
      insightBody = `You've used ${focus.percent}% of your ${focus.name.toLowerCase()} budget. Keep it around ${formatRupiah(perDay)} a day to stay within your ${formatRupiah(focus.budget)} plan.`;
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. TOP SUMMARY CARDS (3 CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Monthly allowance */}
        <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs">
          <p className="text-xs font-medium text-[#718576]">Monthly allowance</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2B] tracking-tight mt-1.5">
            {formatRupiah(income)}
          </p>
          <p className="text-xs text-[#7D9183] mt-2">Next allowance Â· {nextAllowanceLabel}</p>
        </div>

        {/* Card 2: Spent this month */}
        <div className="bg-[#FFF9F0] rounded-2xl p-6 border border-[#FBEAD4] shadow-2xs">
          <p className="text-xs font-medium text-[#8F7249]">Spent this month</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2B] tracking-tight mt-1.5">
            {formatRupiah(totalSpent)}
          </p>
          <p className="text-xs text-[#8F7249] mt-2 font-medium">
            {percentSpent}% of your monthly allowance
          </p>
        </div>

        {/* Card 3: Remaining balance */}
        <div className="bg-[#224431] text-white rounded-2xl p-6 border border-[#2D583F] shadow-md">
          <p className="text-xs font-medium text-[#B4CEBD]">Remaining balance</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5">
            {formatRupiah(remaining)}
          </p>
          <p className="text-xs text-[#A1BFA9] mt-2">
            {remaining < 0
              ? "You've gone over your allowance"
              : `${percentRemaining}% left for the next ${daysLeft} ${daysLeft === 1 ? "day" : "days"}`}
          </p>
        </div>
      </div>

      {/* 2. MIDDLE ROW (DAILY LIMIT & AI ASSISTANT WIDGET) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Daily limit */}
        <div className="lg:col-span-7 bg-[#E8EFEA] rounded-2xl p-6 sm:p-7 border border-[#DCE6DE] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#1E3A2B]">Your everyday money, made simple</h2>
              <span className="text-[11px] font-semibold text-[#8B5820] bg-[#FEF3E2] px-2.5 py-0.5 rounded-full">
                {daysLeft} {daysLeft === 1 ? "day" : "days"} to go
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              {/* Daily spending limit figure */}
              <div className="sm:col-span-6">
                <span className="text-[11px] font-bold text-[#6D8072] uppercase tracking-wider">
                  DAILY SPENDING LIMIT
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-[#1E3A2B] tracking-tight mt-0.5">
                  {formatRupiah(dailyLimit)}
                </p>
                <p className="text-xs text-[#5C7063] mt-1 font-medium">
                  {formatRupiah(Math.max(0, balanceAtDayStart))} remaining Ã· {daysLeft}{" "}
                  {daysLeft === 1 ? "day" : "days"}
                </p>

                {/* Progress bar today */}
                <div className="mt-4 pt-3 border-t border-[#D5E1D7]">
                  <p
                    className={`text-xs font-semibold ${overToday ? "text-[#B4491F]" : "text-[#244833]"}`}
                  >
                    {overToday
                      ? `${formatRupiah(spentToday)} spent today Â· ${formatRupiah(-leftToday)} over the limit`
                      : `${formatRupiah(spentToday)} spent today Â· ${formatRupiah(leftToday)} left`}
                  </p>
                  <div className="w-full h-2 rounded-full bg-white/70 overflow-hidden mt-1.5">
                    <div
                      className={`h-full rounded-full transition-all ${overToday ? "bg-[#D2642F]" : "bg-[#244833]"}`}
                      style={{ width: `${todayPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 7-Days Chart */}
              <div className="sm:col-span-6 bg-white/50 backdrop-blur-xs rounded-xl p-3 border border-white/60">
                <p className="text-[11px] font-medium text-[#687C6D] mb-3 text-right">Your last 7 days</p>
                <div className="flex items-end justify-between gap-1.5 h-20 px-1">
                  {last7Days.map((d) => (
                    <div
                      key={d.date}
                      className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
                      title={`${formatShortDate(d.date)}: ${formatRupiah(d.total)}`}
                    >
                      <div
                        style={{ height: `${d.total > 0 ? Math.max(8, Math.round((d.total / maxDay) * 100)) : 4}%` }}
                        className={`w-full max-w-[20px] rounded-t-sm transition-all ${
                          d.isToday ? "bg-[#E08C38]" : d.total > 0 ? "bg-[#4D7A5E]" : "bg-[#CFDDD3]"
                        }`}
                      />
                      <span className="text-[11px] text-[#6F8274] font-medium">{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#697C6E] mt-4 pt-3 border-t border-[#D6E2D8]">
            Keep daily spending within this limit to make your allowance last.
          </p>
        </div>

        {/* Right: AI insight */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDE7] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#244833] text-white flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3 h-3" />
              </div>
              <span className="text-xs font-bold text-[#244833]">A little help from SakuWise</span>
            </div>

            <h3 className="text-lg font-bold text-[#1E3A2B] tracking-tight">{insightTitle}</h3>
            <p className="text-xs text-[#55695B] leading-relaxed mt-2">{insightBody}</p>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => onSwitchTab("ai")}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F2EFE8] border border-[#E4ECE4] text-xs font-semibold text-[#1E3A2B] flex items-center justify-between transition-colors group cursor-pointer"
              >
                <span>How can I stretch my allowance?</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#677A6C] group-hover:text-[#1E3A2B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#F2F5F2] flex items-center justify-between">
            <button
              type="button"
              onClick={() => onSwitchTab("ai")}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#1E3A2B] hover:underline cursor-pointer"
            >
              <span>Ask your AI assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-[#7E8F82]">Guidance based on your recorded expenses.</span>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW (RECENT TRANSACTIONS & COMING UP SOON) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Recent Transactions */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-7 border border-[#E7EDE7] shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-[#1E3A2B]">The little things add up</h3>
              <p className="text-xs text-[#718576]">Recent transactions</p>
            </div>
            <button
              type="button"
              onClick={() => onSwitchTab("expenses")}
              className="text-xs font-semibold text-[#1E3A2B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {recent.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-xs text-[#718576]">No expenses recorded yet.</p>
              <button
                type="button"
                onClick={onOpenAddExpense}
                className="mt-3 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#224431] hover:bg-[#163323] cursor-pointer"
              >
                Add your first expense
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#F0F4F0] text-[11px] font-bold uppercase tracking-wider text-[#7A8E80]">
                    <th className="pb-3 font-semibold">Transaction</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F8F5]">
                  {recent.map((t) => {
                    const badgeStyle = categoryBadges[t.category] || {
                      bg: "bg-gray-100",
                      text: "text-gray-700",
                    };
                    return (
                      <tr key={t.id} className="group hover:bg-[#FAF8F5] transition-colors">
                        <td className="py-3 pr-4">
                          <p className="font-semibold text-[#1E3A2B] text-xs">{t.name}</p>
                          <p className="text-[11px] text-[#7D9183]">{describeDate(t.date, today)}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${badgeStyle.bg} ${badgeStyle.text}`}
                          >
                            {t.category}
                          </span>
                        </td>
                        <td className="py-3 text-right font-bold text-[#1E3A2B]">
                          -{formatRupiah(t.amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Coming up soon & Savings Goals Widget */}
        <div className="lg:col-span-4 space-y-5">
          {/* Coming up soon (Bills) */}
          <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#1E3A2B]">Coming up soon</h3>
              <button
                type="button"
                onClick={() => onSwitchTab("bills")}
                className="text-xs font-semibold text-[#1E3A2B] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>All bills</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {upcomingBills.length === 0 ? (
              <p className="text-xs text-[#718576]">No unpaid bills. Nice and clear.</p>
            ) : (
              <div className="space-y-3.5">
                {upcomingBills.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E9EFEA]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl font-extrabold text-xs flex items-center justify-center flex-shrink-0 ${
                          b.overdue ? "bg-[#FBE9E2] text-[#B4491F]" : "bg-[#E8EFEA] text-[#1E3A2B]"
                        }`}
                      >
                        {parseISODate(b.dueDate).getDate()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1E3A2B]">{b.name}</p>
                        <p className={`text-[11px] ${b.overdue ? "text-[#B4491F]" : "text-[#718576]"}`}>
                          {dueLabel(b.daysUntil, b.dueDate)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#1E3A2B]">{formatRupiah(b.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Savings goal widget */}
          <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs">
            <h3 className="text-sm font-bold text-[#1E3A2B]">A little closer to your goals</h3>
            {goal ? (
              <>
                <p className="text-xs text-[#718576] mt-0.5">{goal.title}</p>
                <div className="mt-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-[#1E3A2B]">{formatRupiah(goal.current)}</span>
                    <span className="text-xs text-[#718576]">of {formatRupiah(goal.target)}</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-[#EBF0EC] overflow-hidden mt-2">
                    <div
                      className="bg-[#244833] h-full rounded-full transition-all"
                      style={{ width: `${goalPercent}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-[#6C8072]">{goalPercent}% saved Â· separate from allowance</span>
                    <button
                      type="button"
                      onClick={() => onSwitchTab("savings")}
                      className="font-bold text-[#244833] hover:underline cursor-pointer"
                    >
                      Add savings +
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-2">
                <p className="text-xs text-[#718576]">You haven&apos;t set a savings goal yet.</p>
                <button
                  type="button"
                  onClick={() => onSwitchTab("savings")}
                  className="mt-2 text-xs font-bold text-[#244833] hover:underline cursor-pointer"
                >
                  Create a goal +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
