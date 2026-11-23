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
    q: "Bagaimana cara membagi uang ke beberapa saku anggaran?",
    a: "Buka tab 'Monthly budget', lalu klik '+ Add category' untuk membuat saku baru. Masukkan nama saku (misal: Makan, Transport, Hiburan) dan tentukan alokasi rupiahnya. Sakuwise akan otomatis menghitung sisa anggaran yang belum dialokasikan.",
  },
  {
    q: "Apakah data keuangan saya aman di Sakuwise?",
    a: "Ya, semua data dienkripsi menggunakan standar AES-256. Data kamu tidak pernah dijual ke pihak ketiga. Kamu juga bisa mengekspor atau menghapus semua data kapan saja dari halaman Settings.",
  },
  {
    q: "Bagaimana AI Assistant Sakuwise bekerja?",
    a: "AI Assistant menganalisis pola pengeluaranmu dan memberikan saran personal berbasis data. AI hanya membaca catatan transaksi yang kamu input — tidak terhubung ke rekening bank manapun tanpa izin eksplisit.",
  },
  {
    q: "Bisakah saya menggunakan Sakuwise untuk lebih dari satu sumber pemasukan?",
    a: "Tentu! Di Monthly Budget, kamu bisa mengatur allowance dari beberapa sumber. Sakuwise menggabungkan semuanya menjadi satu tampilan total yang rapi.",
  },
  {
    q: "Bagaimana cara mengatur pengingat tagihan?",
    a: "Buka tab 'Bills & reminders', klik '+ Tambah Tagihan', masukkan nama tagihan, tanggal jatuh tempo, dan nominal. Sakuwise akan menampilkan hitungan mundur otomatis di halaman Overview.",
  },
  {
    q: "Apakah ada versi mobile app Sakuwise?",
    a: "Sakuwise saat ini tersedia sebagai Progressive Web App (PWA) yang bisa diinstal di smartphone kamu. Buka sakuwise.id di browser HP, lalu pilih 'Add to Home Screen'. Versi native iOS/Android sedang dalam pengembangan.",
  },
];

const guides = [
  {
    icon: Wallet,
    title: "Metode Saku Anggaran 50/30/20",
    desc: "Alokasikan 50% kebutuhan pokok, 30% keinginan, 20% tabungan.",
    color: "bg-[#E8EFEA]",
    iconColor: "text-[#244833]",
  },
  {
    icon: TrendingUp,
    title: "Cara Membaca Grafik Pengeluaran",
    desc: "Pahami tren harian dan bulanan untuk keputusan lebih bijak.",
    color: "bg-[#FEF3E2]",
    iconColor: "text-[#9A5B15]",
  },
  {
    icon: Target,
    title: "Strategi Target Tabungan Efektif",
    desc: "Pecah target besar menjadi kontribusi kecil yang konsisten.",
    color: "bg-[#EAE8F2]",
    iconColor: "text-[#4B3B70]",
  },
  {
    icon: Smartphone,
    title: "Menggunakan Sakuwise di HP",
    desc: "Instal sebagai PWA untuk akses cepat tanpa buka browser.",
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
            Pusat Bantuan & Dukungan Sakuwise
          </h2>
          <p className="text-xs text-[#596D5F] mt-0.5">
            Ada pertanyaan? Temukan jawabannya di sini, atau hubungi tim kami langsung.
          </p>
        </div>
      </div>

      {/* Quick Guide Cards */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-[#4D7A5E]" />
          <h3 className="text-sm font-bold text-[#1E3A2B]">Panduan Cepat</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guides.map((g, i) => {
            const Icon = g.icon;
            return (
              <button
                key={i}
                type="button"
                onClick={() => alert(`Panduan "${g.title}" akan tersedia segera!`)}
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
          <h3 className="text-sm font-bold text-[#1E3A2B]">Pertanyaan yang Sering Diajukan</h3>
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
            <h3 className="text-sm font-bold text-[#1E3A2B]">Kirim Pesan ke Tim Sakuwise</h3>
          </div>
          <p className="text-xs text-[#718576] mb-4">
            Kami akan membalas dalam 1×24 jam di hari kerja.
          </p>

          {contactSent ? (
            <div className="p-4 rounded-xl bg-[#E7F6EC] border border-[#C6E6D0] text-xs text-[#20743E] font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E08C38]" />
              Pesan terkirim! Kami akan membalas segera. Terima kasih, {user?.name || "Kamu"}!
            </div>
          ) : (
            <form onSubmit={handleContact} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#677C6D] uppercase tracking-wider block mb-1">
                  Pesan
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Deskripsikan masalah atau pertanyaanmu..."
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#D7E2D9] text-xs text-[#1E3A2B] placeholder:text-gray-400 focus:outline-none focus:border-[#224431] bg-[#FAF8F5] resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#224431] hover:bg-[#163323] transition-colors cursor-pointer"
              >
                Kirim Pesan
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
                  href="mailto:halo@sakuwise.id"
                  className="text-xs text-[#4D7A5E] hover:underline font-medium"
                >
                  halo@sakuwise.id
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
                <p className="text-xs font-bold text-[#1E3A2B]">Privasi & Keamanan</p>
                <p className="text-xs text-[#718576]">Data dienkripsi AES-256</p>
              </div>
            </div>
          </div>

          <div className="bg-[#EBF1EC] rounded-2xl p-5 border border-[#DCE5DE]">
            <div className="flex items-start gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#E08C38] fill-[#E08C38] flex-shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-[#1E3A2B]">Coba AI Assistant</p>
            </div>
            <p className="text-[11px] text-[#596D5F] leading-relaxed">
              Tanyakan langsung ke AI Sakuwise untuk saran pengelolaan keuanganmu yang personal.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
