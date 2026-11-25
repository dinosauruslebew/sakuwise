"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  BookOpen,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Mail,
  Sparkles,
  Shield,
  Smartphone,
  TrendingUp,
  Wallet,
  Target,
} from "lucide-react";

const faqs = [
  {
    q: "How do I split my money into multiple budget pockets?",
    a: "Open the 'Monthly Budget' tab and click '+ Add category' to create a new pocket. Enter the pocket name (e.g. Groceries, Transport, Entertainment) and allocate the budget amount. Sakuwise will automatically calculate your remaining unallocated balance.",
  },
  {
    q: "Is my financial data secure on Sakuwise?",
    a: "Yes, all data is encrypted using industry-standard AES-256 protocols. Your data is never sold to third parties. You can also export or wipe all your stored data anytime from the Settings page.",
  },
  {
    q: "How does the Sakuwise AI Assistant work?",
    a: "The AI Assistant analyzes your recorded spending patterns and provides personalized, actionable financial advice. It only reads the transaction records you choose to track—it never connects to any external bank accounts without your explicit consent.",
  },
  {
    q: "Can I track multiple sources of income?",
    a: "Absolutely! Under Monthly Budget, you can set up allowance or income streams from multiple sources. Sakuwise combines them seamlessly into one consolidated summary view.",
  },
  {
    q: "How do I set up recurring bills and reminders?",
    a: "Go to the 'Bills & Reminders' tab, click '+ Add Bill', and specify the bill name, due date, and amount. Sakuwise will track upcoming due dates and display an automated countdown on your Overview dashboard.",
  },
  {
    q: "Is there a mobile app for Sakuwise?",
    a: "Sakuwise is built as a Progressive Web App (PWA) optimized for mobile browsers. Open sakuwise.id on your phone and tap 'Add to Home Screen' for an instant app experience. Dedicated iOS and Android native apps are also in development.",
  },
];

const guides = [
  {
    icon: Wallet,
    title: "50/30/20 Budgeting Pocket Rule",
    desc: "Allocate 50% for essentials, 30% for lifestyle wants, and 20% for savings.",
    color: "bg-[#E8EFEA]",
    iconColor: "text-[#244833]",
  },
  {
    icon: TrendingUp,
    title: "How to Read Expense Charts",
    desc: "Understand daily and monthly spending trends to make smarter money decisions.",
    color: "bg-[#FEF3E2]",
    iconColor: "text-[#9A5B15]",
  },
  {
    icon: Target,
    title: "Effective Savings Target Strategy",
    desc: "Break down large financial goals into consistent, manageable contributions.",
    color: "bg-[#EAE8F2]",
    iconColor: "text-[#4B3B70]",
  },
  {
    icon: Smartphone,
    title: "Using Sakuwise on Your Phone",
    desc: "Install as a PWA on your home screen for quick single-tap access on the go.",
    color: "bg-[#F5EFE6]",
    iconColor: "text-[#71542B]",
  },
];

export default function HelpView() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactSent, setContactSent] = useState(false);
  const [contactMsg, setContactMsg] = useState("");

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMsg.trim()) return;
    setContactSent(true);
    setContactMsg("");
    setTimeout(() => setContactSent(false), 4000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200 max-w-5xl">

      {/* Header Banner */}
      <div className="bg-[#EBF1EC] rounded-2xl p-6 sm:p-8 border border-[#DCE5DE] flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#244833] text-white flex items-center justify-center flex-shrink-0">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#1E3A2B]">
            Sakuwise Help & Support Center
          </h2>
          <p className="text-xs text-[#596D5F] mt-0.5">
            Have questions? Find answers below, or get in touch with our support team directly.
          </p>
        </div>
      </div>

      {/* Quick Guide Cards */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-[#4D7A5E]" />
          <h3 className="text-sm font-bold text-[#1E3A2B]">Quick Guides</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guides.map((g, i) => {
            const Icon = g.icon;
            return (
              <button
                key={i}
                type="button"
                onClick={() => alert(`The "${g.title}" guide will be available soon!`)}
                className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#E7EDE7] shadow-2xs hover:border-[#B8CEBC] hover:shadow-md transition-all text-left group cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl ${g.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-5 h-5 ${g.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1E3A2B] leading-snug">{g.title}</p>
                  <p className="text-[11px] text-[#718576] mt-0.5 leading-relaxed">{g.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9BAD9F] flex-shrink-0 mt-0.5 group-hover:text-[#1E3A2B] transition-colors" />
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-4 h-4 text-[#4D7A5E]" />
          <h3 className="text-sm font-bold text-[#1E3A2B]">Frequently Asked Questions</h3>
        </div>
        <div className="bg-white rounded-2xl border border-[#E7EDE7] shadow-2xs overflow-hidden divide-y divide-[#F2F5F2]">
          {faqs.map((f, i) => (
            <div key={i}>
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              >
                <span className="text-xs font-semibold text-[#1E3A2B] leading-snug">
                  {f.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#7B8E81] flex-shrink-0 transition-transform duration-200 ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-xs text-[#596D5F] leading-relaxed bg-[#FAFCFA] border-t border-[#F0F4F0]">
                  <p className="pt-3">{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Send Message */}
        <div className="bg-white rounded-2xl p-6 border border-[#E7EDE7] shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-[#4D7A5E]" />
            <h3 className="text-sm font-bold text-[#1E3A2B]">Send a Message to Sakuwise Team</h3>
          </div>
          <p className="text-xs text-[#718576] mb-4">
            We typically respond within 24 hours on business days.
          </p>

          {contactSent ? (
            <div className="p-4 rounded-xl bg-[#E7F6EC] border border-[#C6E6D0] text-xs text-[#20743E] font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E08C38]" />
              Message sent! We will reply to your registered email shortly. Thank you, {user?.name || "there"}!
            </div>
          ) : (
            <form onSubmit={handleContact} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#677C6D] uppercase tracking-wider block mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your question or issue in detail..."
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#D7E2D9] text-xs text-[#1E3A2B] placeholder:text-gray-400 focus:outline-none focus:border-[#224431] bg-[#FAF8F5] resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#224431] hover:bg-[#163323] transition-colors cursor-pointer"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Other contact options */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-[#E7EDE7] shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E8EFEA] flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-[#244833]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1E3A2B]">Email Support</p>
                <a
                  href="mailto:support@sakuwise.id"
                  className="text-xs text-[#4D7A5E] hover:underline font-medium"
                >
                  support@sakuwise.id
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E7EDE7] shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FEF3E2] flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-[#9A5B15]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1E3A2B]">Privacy & Security</p>
                <p className="text-xs text-[#718576]">AES-256 encrypted storage</p>
              </div>
            </div>
          </div>

          <div className="bg-[#EBF1EC] rounded-2xl p-5 border border-[#DCE5DE]">
            <div className="flex items-start gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#E08C38] fill-[#E08C38] flex-shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-[#1E3A2B]">Try AI Assistant</p>
            </div>
            <p className="text-[11px] text-[#596D5F] leading-relaxed">
              Ask Sakuwise AI directly for personalized financial budgeting advice anytime.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
