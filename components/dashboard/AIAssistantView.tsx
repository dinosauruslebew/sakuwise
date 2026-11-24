"use client";

import React, { useState } from "react";
import { Sparkles, Send, Bot, User as UserIcon, Lightbulb, TrendingDown, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";

export default function AIAssistantView() {
  const { user } = useAuth();
  const { allowance, totalSpent, dailySpendingLimit, remainingBalance, daysRemaining } = useData();
  const userName = user?.name || user?.email?.split("@")[0] || "Teman Sakuwise";

  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "ai",
      text: `Halo ${userName}! Saya asisten finansial Sakuwise kamu. Berdasarkan catatan bulan ini, kamu memiliki total pengeluaran Rp${totalSpent.toLocaleString("id-ID")} dari allowance Rp${allowance.toLocaleString("id-ID")}. Sisa limit harianmu adalah Rp${dailySpendingLimit.toLocaleString("id-ID")}/hari untuk ${daysRemaining} hari ke depan. Ada yang ingin kamu diskusikan?`,
      time: "10:30",
    },
    {
      id: "2",
      sender: "user",
      text: "Bagaimana cara menjaga pengeluaran harian agar tidak melebihi sisa allowance?",
      time: "10:31",
    },
    {
      id: "3",
      sender: "ai",
      text: `Rekomendasi bijak dari AI Sakuwise:\n\n1. 🍱 Prioritaskan Kebutuhan Pokok: Usahakan belanja makan harian tetap di bawah Rp${Math.max(25000, Math.round(dailySpendingLimit * 0.4)).toLocaleString("id-ID")} per hari.\n2. ☕ Hindari Impulse Buying: Sebelum checkout jajan online, tunda 24 jam untuk memastikan apakah itu kebutuhan atau sekadar keinginan.\n3. 🎯 Monitor Rutin: Setiap malam sebelum tidur, pastikan transaksi hari ini sudah tercatat agar limit harian besok terhitung akurat!`,
      time: "10:31",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: inputMessage,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");

    // Simulate smart AI reply tailored to user's real balance
    setTimeout(() => {
      const aiReply = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `Analisis cerdas untuk pertanyaanmu: Dengan sisa saldo Rp${remainingBalance.toLocaleString("id-ID")}, rencanamu dapat terwujud jika kamu menjaga pengeluaran discretionary (hiburan & jajan) tetap terukur minggu ini. Konsistensi kecil setiap hari berdampak besar untuk ketenangan finansialmu!`,
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 700);
  };

  const quickQuestions = [
    "Bagaimana evaluasi pengeluaran mingguan saya?",
    "Apakah tabungan saya berada di jalur yang tepat?",
    "Tips hemat makan harian tanpa tersiksa",
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
            <h3 className="text-base font-bold text-[#1E3A2B]">
              Sakuwise AI Smart Advisor
            </h3>
            <p className="text-xs text-[#596D5F]">
              Didukung model analisis pengeluaran personal yang terisolasi dan privat.
            </p>
          </div>
        </div>
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
                      ? "bg-[#FAF8F5] text-[#1E3A2B] border border-[#E7EDE7]"
                      : "bg-[#244833] text-white"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <span
                    className={`text-[10px] block mt-1.5 ${
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
        </div>

        {/* Quick Suggestions */}
        <div className="py-3 flex items-center gap-2 overflow-x-auto border-t border-[#F2F5F2]">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInputMessage(q)}
              className="flex-shrink-0 text-[11px] font-medium text-[#244833] bg-[#E8EFEA] hover:bg-[#DCE6DF] px-3 py-1.5 rounded-full transition-colors cursor-pointer"
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
            className="flex-1 bg-[#FAF8F5] border border-[#D7E2D9] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#1E3A2B] placeholder:text-gray-400 focus:outline-none focus:border-[#224431]"
          />
          <button
            type="submit"
            className="p-3 rounded-xl bg-[#224431] text-white hover:bg-[#163323] transition-colors shadow-xs cursor-pointer flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
