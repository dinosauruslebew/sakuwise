import React from "react";
import { Lock, Shield, EyeOff, KeyRound } from "lucide-react";

export default function SecuritySection() {
  const securityPillars = [
    {
      icon: Lock,
      title: "Bank-Grade Encryption",
      desc: "All transaction data is encrypted with AES-256 standard and state-of-the-art SSL/TLS protocols.",
    },
    {
      icon: EyeOff,
      title: "Uncompromised Privacy",
      desc: "We never sell your personal data or transaction history to any third party under any circumstances.",
    },
    {
      icon: KeyRound,
      title: "Secure Authentication",
      desc: "Protected with Google OAuth, encrypted credentials, and secure multi-factor session protocols.",
    },
    {
      icon: Shield,
      title: "Regulatory Compliance",
      desc: "Built in adherence to personal data protection regulations and digital financial privacy standards.",
    },
  ];

  return (
    <section id="security" className="py-20 bg-[#F3F6F3] border-y border-[#E4ECE4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#6E8172]">
            Maximum Protection
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A2B] tracking-tight mt-2.5">
            Your financial security is our highest priority.
          </h2>
          <p className="text-base text-[#55695C] mt-3">
            Sakuwise is architected with privacy-first principles, ensuring all your financial records stay safe and protected.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityPillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-[#E1E9E2] shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E8EFEA] text-[#224431] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-[#1E3A2B]">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5B6D60] mt-2 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
