"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, Send, Bot, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useFinance, formatRupiah } from "@/context/FinanceContext";

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  time: string;
  isError?: boolean;
}

const nowTime = () =>
  new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

const CHAT_STORAGE_KEY = "sakuwise_ai_chat";
const MAX_SAVED_MESSAGES = 50;

function isChatMessage(v: unknown): v is ChatMessage {
  if (!v || typeof v !== "object") return false;
  const m = v as Record<string, unknown>;
  return (
    typeof m.id === "string" &&
    (m.sender === "ai" || m.sender === "user") &&
    typeof m.text === "string" &&
    typeof m.time === "string"
  );
}

export default function AIAssistantView() {
  const { user } = useAuth();
  const { summary, income, transactions, goals } = useFinance();
  const userName = user?.name || "kamu";
  const storageKey = user?.email ? `${CHAT_STORAGE_KEY}:${user.email}` : null;

  // Compact snapshot of the user's real finance data, sent to the server as context for the AI
  const financeContext = useMemo(
    () => ({
      today: summary.today,
      monthlyAllowance: income,
      nextAllowanceDate: summary.nextAllowanceDate,
      daysLeftUntilNextAllowance: summary.daysLeft,
      totalSpentThisPeriod: summary.totalSpent,
      remainingBalance: summary.remaining,
      dailySpendingLimit: summary.dailyLimit,
      spentToday: summary.spentToday,
      leftToday: summary.leftToday,
      totalBudgetAllocated: summary.totalBudget,
      unallocatedAllowance: summary.unallocated,
      categories: summary.categoryStats.map((c) => ({
        name: c.name,
        budget: c.budget,
        spent: c.spent,
        remaining: c.remaining,
        overBudget: c.over,
      })),
      last7DaysSpending: summary.last7Days.map((d) => ({ date: d.date, total: d.total })),
      recentTransactions: transactions.slice(0, 20).map((t) => ({
        name: t.name,
        category: t.category,
        amount: t.amount,
        date: t.date,
      })),
      unpaidBills: summary.bills
        .filter((b) => !b.paid)
        .map((b) => ({
          name: b.name,
          amount: b.amount,
          dueDate: b.dueDate,
          daysUntilDue: b.daysUntil,
          overdue: b.overdue,
        })),
      savingsGoals: goals.map((g) => ({
        title: g.title,
        current: g.current,
        target: g.target,
        deadline: g.deadline,
      })),
    }),
    [summary, income, transactions, goals]
  );

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      sender: "ai",
      text: `Halo ${userName}! Saya asisten finansial SakuWise. Sejauh ini kamu sudah menghabiskan ${formatRupiah(
        summary.totalSpent
      )} dari uang saku ${formatRupiah(income)}. Batas pengeluaran harianmu sekarang ${formatRupiah(
        summary.dailyLimit
      )} untuk ${summary.daysLeft} hari ke depan. Ada yang ingin kamu diskusikan?`,
      time: nowTime(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  // Load saved chat history for this account (deferred so setState is not called synchronously in the effect)
  useEffect(() => {
    if (!storageKey) return;
    const timer = setTimeout(() => {
      let saved: ChatMessage[] = [];
      try {
        const raw = localStorage.getItem(storageKey);
        const parsed: unknown = raw ? JSON.parse(raw) : [];
        if (Array.isArray(parsed)) saved = parsed.filter(isChatMessage);
      } catch {
        saved = []; // corrupted or unavailable storage: start with an empty history
      }
      setMessages((prev) => [...prev.filter((m) => m.id === "welcome"), ...saved]);
      setLoadedKey(storageKey);
    }, 0);
    return () => clearTimeout(timer);
  }, [storageKey]);

  // Save history after every change (the welcome message and error messages are not saved)
  useEffect(() => {
    if (!storageKey || loadedKey !== storageKey) return;
    try {
      const toSave = messages
        .filter((m) => m.id !== "welcome" && !m.isError)
        .slice(-MAX_SAVED_MESSAGES);
      localStorage.setItem(storageKey, JSON.stringify(toSave));
    } catch {
      // storage full or blocked: keep working without saving
    }
  }, [messages, storageKey, loadedKey]);

  const clearHistory = () => {
    if (!window.confirm("Hapus seluruh riwayat chat dengan asisten AI?")) return;
    setMessages((prev) => prev.filter((m) => m.id === "welcome"));
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: trimmed,
      time: nowTime(),
    };
    const history = [...messages, userMsg];
    setMessages(history);
    setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history
            .filter((m) => !m.isError)
            .map((m) => ({ role: m.sender === "user" ? "user" : "model", text: m.text })),
          context: financeContext,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };

      if (!res.ok || !data.reply) {
        throw new Error(data.error || "Gagal mendapatkan jawaban dari asisten AI.");
      }

      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, sender: "ai", text: data.reply as string, time: nowTime() },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          sender: "ai",
          text: e instanceof Error ? e.message : "Terjadi kesalahan. Coba lagi nanti.",
          time: nowTime(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(inputMessage);
  };

  const quickQuestions = [
    "Bagaimana evaluasi pengeluaran saya bulan ini?",
    "Kategori mana yang hampir melebihi budget?",
    "Simulasikan jika saya belanja Rp100.000 hari ini",
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-[#EBF1EC] rounded-2xl p-6 border border-[#DCE5DE] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#244833] text-white flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1E3A2B]">SakuWise AI Smart Advisor</h3>
            <p className="text-xs text-[#596D5F]">
              Didukung Gemini. Ringkasan keuanganmu (tanpa email atau data akun) dikirim ke layanan AI
              hanya saat kamu mengirim pesan.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={clearHistory}
          className="flex-shrink-0 flex items-center gap-1.5 text-[11px] font-medium text-[#596D5F] hover:text-[#1E3A2B] hover:bg-[#DCE5DE] px-3 py-1.5 rounded-full transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Hapus riwayat
        </button>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E7EDE7] shadow-2xs flex flex-col h-[520px]">
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m) => {
            const isAi = m.sender === "ai";
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isAi ? "justify-start" : "justify-end"}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-full bg-[#244833] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-lg rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isAi
                      ? m.isError
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-[#FAF8F5] text-[#1E3A2B] border border-[#E7EDE7]"
                      : "bg-[#244833] text-white"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <span
                    className={`text-[11px] block mt-1.5 ${
                      isAi ? "text-[#7B8F80]" : "text-emerald-200/80"
                    }`}
                  >
                    {m.time}
                  </span>
                </div>

                {!isAi && (
                  <div className="w-8 h-8 rounded-full bg-[#E08C38] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-[#244833] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
              <div className="rounded-2xl p-4 text-xs sm:text-sm bg-[#FAF8F5] text-[#596D5F] border border-[#E7EDE7] flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Sedang menganalisis keuanganmu...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Suggestions */}
        <div className="py-3 flex items-center gap-2 overflow-x-auto border-t border-[#F2F5F2]">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              type="button"
              disabled={loading}
              onClick={() => void sendMessage(q)}
              className="flex-shrink-0 text-[11px] font-medium text-[#244833] bg-[#E8EFEA] hover:bg-[#DCE6DF] px-3 py-1.5 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <form onSubmit={handleSend} className="relative flex items-center gap-2 pt-2">
          <input
            type="text"
            placeholder="Tanyakan rekomendasi atau hitung pengeluaran..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
            className="flex-1 bg-[#FAF8F5] border border-[#D7E2D9] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#1E3A2B] placeholder:text-gray-400 focus:outline-none focus:border-[#224431] disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="p-3 rounded-xl bg-[#224431] text-white hover:bg-[#163323] transition-colors shadow-xs cursor-pointer flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
