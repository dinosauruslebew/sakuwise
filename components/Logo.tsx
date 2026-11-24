"use client";

import React from "react";

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
    sm: "h-9 sm:h-10",
    md: "h-11 sm:h-12",
    lg: "h-13 sm:h-15",
    xl: "h-16 sm:h-20",
  };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <Image
        src="/logo.png"
        alt="Sakuwise - Manage your money, wisely"
        width={826}
        height={302}
        className={`${sizeClasses[size]} w-auto object-contain transition-transform duration-200 hover:scale-[1.02]`}
      />
    </div>
  );
}
