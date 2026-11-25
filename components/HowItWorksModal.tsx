"use client";

import React, { useState } from "react";
import { X, CheckCircle2, Wallet, PieChart, Sparkles, ArrowRight } from "lucide-react";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      step: "01",
      icon: Wallet,
      title: "Organize Money into Dedicated Pockets",
      desc: "When your income or allowance arrives, divide it across clear pockets: Essentials, Bills, Lifestyle, and Savings. No more mixed-up funds.",
      tip: "The 50/30/20 rule is automatically recommended for effortless planning.",
      mockVisual: (
        <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E3EAE4] space-y-2.5">
          <div className="flex justify-between items-center text-xs font-semibold text-[#1E3A2B]">
            <span>Essentials Pocket</span>
            <span className="text-[#20743E]">Rp 4.500.000 (50%)</span>
          </div>
          <div className="w-full bg-[#E5EDE7] h-2 rounded-full overflow-hidden">
            <div className="bg-[#224431] h-full w-1/2 rounded-full" />
          </div>
          <div className="flex justify-between items-center text-xs font-semibold text-[#1E3A2B] pt-2">
            <span>Lifestyle & Entertainment</span>
            <span className="text-[#E08C38]">Rp 2.700.000 (30%)</span>
          </div>
          <div className="w-full bg-[#E5EDE7] h-2 rounded-full overflow-hidden">
            <div className="bg-[#E08C38] h-full w-[30%] rounded-full" />
          </div>
        </div>
      ),
    },
    {
      step: "02",
      icon: PieChart,
      title: "Track & Be Mindful of Spending",
      desc: "Every expense deducts directly from its pocket. You instantly see your remaining daily allowance without stress or guesswork.",
      tip: "Gentle alerts remind you when any pocket approaches 85% of its limit.",
      mockVisual: (
        <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E3EAE4] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 text-xs font-bold">
              🍔
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-[#1E3A2B]">Coffee & Breakfast</p>
              <p className="text-[10px] text-gray-500">Food & Drinks • Today</p>
            </div>
            <span className="text-xs font-bold text-red-600">-Rp 45.000</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800 text-xs font-bold">
              ⚡
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-[#1E3A2B]">Electricity Bill</p>
              <p className="text-[10px] text-gray-500">Bills & Utilities • Yesterday</p>
            </div>
            <span className="text-xs font-bold text-red-600">-Rp 200.000</span>
          </div>
        </div>
      ),
    },
    {
      step: "03",
      icon: Sparkles,
      title: "Achieve Your Goals Without Pressure",
      desc: "Lock dream savings in protected goal pockets. Watch them compound steadily week after week until your milestone is reached.",
      tip: "Pocket Lock protects savings from impulsive day-to-day spending.",
      mockVisual: (
        <div className="bg-[#1E3A2B] text-white p-4 rounded-xl space-y-3 shadow-md">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold">🎯 Japan Trip Fund</span>
            <span className="text-[#E08C38] font-bold">85%</span>
          </div>
          <div className="w-full bg-[#12241A] h-2 rounded-full overflow-hidden">
            <div className="bg-[#E08C38] h-full w-[85%] rounded-full" />
          </div>
          <p className="text-[11px] text-emerald-100/70">
            Collected Rp 17.000.000 of Rp 20.000.000 target. Just 2 months to go!
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#DEE6DF] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EBEFEA] bg-[#FAF8F5]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#738777]">
              Quick Guide
            </span>
            <h3 className="text-lg font-bold text-[#1E3A2B]">
              How Sakuwise Works
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Tabs */}
        <div className="flex border-b border-[#EBEFEA] bg-[#F7F5F0]">
          {steps.map((s, idx) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`flex-1 py-3 px-3 text-center text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                activeStep === idx
                  ? "bg-white text-[#1E3A2B] border-b-2 border-[#1E3A2B]"
                  : "text-[#6E8172] hover:text-[#1E3A2B]"
              }`}
            >
              <span>Step {s.step}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E8EFEA] text-[#224431] flex items-center justify-center flex-shrink-0">
              {React.createElement(steps[activeStep].icon, {
                className: "w-6 h-6 stroke-[2]",
              })}
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#1E3A2B]">
                {steps[activeStep].title}
              </h4>
              <p className="text-sm text-[#5B6D60] mt-1.5 leading-relaxed">
                {steps[activeStep].desc}
              </p>
            </div>
          </div>

          {/* Interactive Mock preview */}
          <div className="mt-6">{steps[activeStep].mockVisual}</div>

          {/* Pro-Tip Box */}
          <div className="mt-5 p-3.5 rounded-xl bg-[#FEF7EC] border border-[#FDE6C8] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#92400E] leading-relaxed">
              <strong className="font-semibold">Smart Tip: </strong>
              {steps[activeStep].tip}
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-[#FAF8F5] border-t border-[#EBEFEA] flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              setActiveStep((prev) => (prev > 0 ? prev - 1 : prev))
            }
            disabled={activeStep === 0}
            className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeStep === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-[#1E3A2B] hover:bg-black/5"
            }`}
          >
            Back
          </button>

          {activeStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setActiveStep((prev) => prev + 1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#224431] hover:bg-[#163323] px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#224431] hover:bg-[#163323] px-5 py-2 rounded-xl transition-all shadow cursor-pointer"
            >
              <span>Start Using Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
