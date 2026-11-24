"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import OverviewView from "@/components/dashboard/OverviewView";
import MonthlyBudgetView from "@/components/dashboard/MonthlyBudgetView";
import ExpensesView from "@/components/dashboard/ExpensesView";
import AIAssistantView from "@/components/dashboard/AIAssistantView";
import BillsView from "@/components/dashboard/BillsView";
import SavingsGoalsView from "@/components/dashboard/SavingsGoalsView";
import SettingsView from "@/components/dashboard/SettingsView";
import HelpView from "@/components/dashboard/HelpView";
import AddExpenseModal from "@/components/dashboard/AddExpenseModal";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { transactions, totalSpent, addExpense } = useData();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("November 2026");

  // Optional: Redirect to login if user is completely unauthenticated and not loading
  useEffect(() => {
    if (!authLoading && !user) {
      // If no session exists, route to /login
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleSaveExpense = (newExpense: {
    name: string;
    amount: number;
    category: any;
    time: string;
    note?: string;
  }) => {
    addExpense(newExpense);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case "budget":
        return <MonthlyBudgetView />;
      case "expenses":
        return (
          <ExpensesView
            transactions={transactions}
            onAddExpense={handleSaveExpense}
            totalSpent={totalSpent}
          />
        );
      case "ai":
        return <AIAssistantView />;
      case "bills":
        return <BillsView />;
      case "savings":
        return <SavingsGoalsView />;
      case "settings":
        return <SettingsView />;
      case "help":
        return <HelpView />;
      default:
        return (
          <OverviewView
            onSwitchTab={setActiveTab}
            onOpenAddExpense={() => setAddExpenseModalOpen(true)}
            transactions={transactions}
            totalSpent={totalSpent}
          />
        );
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#224431] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">
      {/* 1. Sidebar Navigation (Left) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* 2. Main Content Area (Right) */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onOpenAddExpense={() => setAddExpenseModalOpen(true)}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* 3. Global Add Expense Modal */}
      <AddExpenseModal
        isOpen={addExpenseModalOpen}
        onClose={() => setAddExpenseModalOpen(false)}
        onSaveExpense={handleSaveExpense}
      />
    </div>
  );
}
