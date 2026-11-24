"use client";

import React, { useState } from "react";
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

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case "budget":
        return <MonthlyBudgetView />;
      case "expenses":
        return <ExpensesView />;
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
          />
        );
    }
  };

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
      />
    </div>
  );
}
