"use client";

import React from "react";
import {
  CalendarDays,
  BarChart3,
  Target,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface FeaturesSectionProps {
  onSelectFeature?: (featureId: string) => void;
}

export default function FeaturesSection({ onSelectFeature }: FeaturesSectionProps) {
  const features = [
    {
      id: "automated-pockets",
      icon: CalendarDays,
      title: "Automated Pocket Budgeting",
      description:
        "Separate funds for essentials, lifestyle, and savings. Every single rupiah has its purpose.",
      cta: "Explore Budget Pockets",
      badge: "Budgeting Core",
    },
    {
      id: "realtime-insights",
      icon: BarChart3,
      title: "Real-time Expense Insights",
      description:
        "See exactly where your money goes through clear visuals. Make informed decisions with confidence.",
      cta: "Understand your cash flow",
      badge: "Instant Insights",
    },
    {
      id: "dream-goals",
      icon: Target,
      title: "Dream Savings Goals",
      description:
        "Vacations, new tech, or emergency buffer. Build great habits, one day at a time.",
      cta: "Reach your goals",
      badge: "Goal Tracker",
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-14 sm:mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-[#6E8172]">
            More Organized, More at Peace.
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#1E3A2B] tracking-tight mt-2.5 leading-tight">
            One platform, complete control.
          </h2>
          <p className="text-base sm:text-lg text-[#55695C] mt-3.5 leading-relaxed">
            From daily essentials to future ambitions, organize your entire financial life with clarity.
          </p>
        </div>

        {/* 3 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-7 sm:p-8 border border-[#E7EDE7] hover:border-[#CCDBCF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(30,58,43,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Icon Box */}
                  <div className="w-12 h-12 rounded-xl bg-[#EDF4EF] flex items-center justify-center text-[#224431] group-hover:bg-[#224431] group-hover:text-white transition-colors duration-300 mb-6">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-[#1E3A2B] tracking-tight group-hover:text-[#163323] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#5B6D60] leading-relaxed mt-3">
                    {item.description}
                  </p>
                </div>

                {/* Bottom CTA Link */}
                <div className="pt-7 mt-6 border-t border-[#F2F5F2] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onSelectFeature && onSelectFeature(item.id)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E3A2B] hover:text-[#0E2016] group/btn transition-colors cursor-pointer"
                  >
                    <span>{item.cta}</span>
                    <ArrowRight className="w-4 h-4 text-[#758A7A] group-hover/btn:text-[#1E3A2B] group-hover/btn:translate-x-1 transition-all duration-200" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Ownership Trust Banner */}
        <div className="mt-14 sm:mt-16 flex items-center justify-center gap-2 text-xs sm:text-sm text-[#617465] font-medium text-center">
          <ShieldCheck className="w-4 h-4 text-[#20743E] stroke-[2.5]" />
          <span>Your data remains private and secure. Your financial future in your own hands.</span>
        </div>

      </div>
    </section>
  );
}
