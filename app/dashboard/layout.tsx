import React, { type ReactNode } from "react";
import { FinanceProvider } from "@/context/FinanceContext";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <FinanceProvider>{children}</FinanceProvider>
    </AuthGuard>
  );
}
