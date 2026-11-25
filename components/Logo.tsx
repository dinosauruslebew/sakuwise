"use client";

import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  isDark?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Logo({
  className = "",
  size = "md",
}: LogoProps) {
  // Enhanced, prominent logo dimensions for crisp readability
  const sizeClasses = {
    sm: "h-10 sm:h-11",
    md: "h-12 sm:h-14",
    lg: "h-14 sm:h-16",
    xl: "h-20 sm:h-24",
  };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <Image
        src="/logo.png"
        alt="Sakuwise - Manage your money, wisely"
        width={826}
        height={302}
        priority
        className={`${sizeClasses[size]} w-auto object-contain transition-transform duration-200 hover:scale-[1.02]`}
      />
    </div>
  );
}
