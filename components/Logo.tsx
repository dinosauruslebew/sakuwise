"use client";

import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  isDark?: boolean;
  size?: "sm" | "md" | "lg";
  taglineClassName?: string;
  showTagline?: boolean;
}

export default function Logo({
  className = "",
  size = "md",
}: LogoProps) {
  const sizeClasses = {
    sm: "h-8 sm:h-9",
    md: "h-10 sm:h-11",
    lg: "h-12 sm:h-14",
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
