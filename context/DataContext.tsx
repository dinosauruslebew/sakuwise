"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface Transaction {
  id: string;
  name: string;
  time: string;
  category: "Food & drinks" | "Transport" | "Academic needs" | "Personal" | "Accommodation" | "Emergency fund" | string;
  amount: number;
  note?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  desc: string;
  budget: number;
  spent: number;
}

export interface BillItem {
  id: string;
  day: number;
  name: string;
  due: string;
  amount: number;
  status: "Upcoming" | "Paid";
  category: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  subtitle: string;
  current: number;
  target: number;
  color: string;
  deadline: string;
}

interface UserFinancialData {
  allowance: number;
  transactions: Transaction[];
  categories: BudgetCategory[];
  bills: BillItem[];
  goals: SavingsGoal[];
}

interface DataContextType {
  allowance: number;
  transactions: Transaction[];
  categories: BudgetCategory[];
  bills: BillItem[];
  goals: SavingsGoal[];
  totalSpent: number;
  remainingBalance: number;
  dailySpendingLimit: number;
  daysRemaining: number;
  isInitialLoad: boolean;
  addExpense: (expense: Omit<Transaction, "id">) => void;
  deleteExpense: (id: string) => void;
  updateAllowance: (amount: number) => void;
  updateCategoryBudget: (id: string, budget: number) => void;
  addCategory: (name: string, budget: number, desc?: string) => void;
  addBill: (bill: Omit<BillItem, "id">) => void;
  toggleBillStatus: (id: string) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, "id" | "current">) => void;
  depositToGoal: (goalId: string, amount: number) => void;
  resetToSampleData: () => void;
}

const DEFAULT_CATEGORIES: BudgetCategory[] = [
  { id: "food", name: "Food & drinks", desc: "Meals, snacks & coffee", budget: 0, spent: 0 },
  { id: "transport", name: "Transport", desc: "Commutes & trips", budget: 0, spent: 0 },
  { id: "academic", name: "Academic needs", desc: "Books, printing & supplies", budget: 0, spent: 0 },
  { id: "accommodation", name: "Accommodation", desc: "Rent, utilities & Wi-Fi", budget: 0, spent: 0 },
  { id: "personal", name: "Personal", desc: "Laundry, social & self-care", budget: 0, spent: 0 },
  { id: "emergency", name: "Emergency fund", desc: "For the unexpected", budget: 0, spent: 0 },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [allowance, setAllowance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>(DEFAULT_CATEGORIES);
  const [bills, setBills] = useState<BillItem[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  // Storage key uniquely tied to active user ID
  const storageKey = user ? `sakuwise_data_${user.id}` : null;

  // Load user data on auth change
  useEffect(() => {
    if (!storageKey) {
      // Empty state when logged out
      setAllowance(0);
      setTransactions([]);
      setCategories(DEFAULT_CATEGORIES);
      setBills([]);
      setGoals([]);
      setIsInitialLoad(false);
      return;
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed: UserFinancialData = JSON.parse(stored);
        setAllowance(parsed.allowance || 0);
        setTransactions(parsed.transactions || []);
        setCategories(parsed.categories && parsed.categories.length > 0 ? parsed.categories : DEFAULT_CATEGORIES);
        setBills(parsed.bills || []);
        setGoals(parsed.goals || []);
      } else {
        // Brand new user: clean slate with 0 balance
        setAllowance(0);
        setTransactions([]);
        setCategories(DEFAULT_CATEGORIES);
        setBills([]);
        setGoals([]);
      }
    } catch (err) {
      console.error("Error loading user financial data:", err);
    } finally {
      setIsInitialLoad(false);
    }
  }, [storageKey]);

  // Persist whenever state changes
  const persistData = (
    newAllowance: number,
    newTransactions: Transaction[],
    newCategories: BudgetCategory[],
    newBills: BillItem[],
    newGoals: SavingsGoal[]
  ) => {
    if (!storageKey) return;
    try {
      const dataToSave: UserFinancialData = {
        allowance: newAllowance,
        transactions: newTransactions,
        categories: newCategories,
        bills: newBills,
        goals: newGoals,
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    } catch (err) {
      console.error("Error saving user financial data:", err);
    }
  };

  // Add Expense & update category spent
  const addExpense = (newExpense: Omit<Transaction, "id">) => {
    const item: Transaction = {
      ...newExpense,
      id: `tx-${Date.now()}`,
    };
    const updatedTransactions = [item, ...transactions];

    // Update matching category spent
    const updatedCategories = categories.map((cat) => {
      if (cat.name.toLowerCase() === newExpense.category.toLowerCase()) {
        return { ...cat, spent: cat.spent + newExpense.amount };
      }
      return cat;
    });

    setTransactions(updatedTransactions);
    setCategories(updatedCategories);
    persistData(allowance, updatedTransactions, updatedCategories, bills, goals);
  };

  // Delete Expense
  const deleteExpense = (id: string) => {
    const target = transactions.find((t) => t.id === id);
    if (!target) return;

    const updatedTransactions = transactions.filter((t) => t.id !== id);
    const updatedCategories = categories.map((cat) => {
      if (cat.name.toLowerCase() === target.category.toLowerCase()) {
        return { ...cat, spent: Math.max(0, cat.spent - target.amount) };
      }
      return cat;
    });

    setTransactions(updatedTransactions);
    setCategories(updatedCategories);
    persistData(allowance, updatedTransactions, updatedCategories, bills, goals);
  };

  // Update Monthly Allowance
  const updateAllowance = (amount: number) => {
    setAllowance(amount);
    persistData(amount, transactions, categories, bills, goals);
  };

  // Update Category Budget
  const updateCategoryBudget = (catId: string, budgetAmount: number) => {
    const updated = categories.map((cat) => (cat.id === catId ? { ...cat, budget: budgetAmount } : cat));
    setCategories(updated);
    persistData(allowance, transactions, updated, bills, goals);
  };

  // Add New Category
  const addCategory = (name: string, budget: number, desc: string = "New Budget Pocket") => {
    const newCat: BudgetCategory = {
      id: `cat-${Date.now()}`,
      name,
      desc,
      budget,
      spent: 0,
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    persistData(allowance, transactions, updated, bills, goals);
  };

  // Add Bill
  const addBill = (newBill: Omit<BillItem, "id">) => {
    const item: BillItem = {
      ...newBill,
      id: `bill-${Date.now()}`,
    };
    const updated = [...bills, item];
    setBills(updated);
    persistData(allowance, transactions, categories, updated, goals);
  };

  // Toggle Bill Paid
  const toggleBillStatus = (id: string) => {
    const updated = bills.map((b) =>
      b.id === id ? { ...b, status: (b.status === "Paid" ? "Upcoming" : "Paid") as BillItem["status"] } : b
    );
    setBills(updated);
    persistData(allowance, transactions, categories, updated, goals);
  };

  // Add Savings Goal
  const addSavingsGoal = (newGoal: Omit<SavingsGoal, "id" | "current">) => {
    const item: SavingsGoal = {
      ...newGoal,
      id: `goal-${Date.now()}`,
      current: 0,
    };
    const updated = [...goals, item];
    setGoals(updated);
    persistData(allowance, transactions, categories, bills, updated);
  };

  // Deposit to Goal
  const depositToGoal = (goalId: string, amount: number) => {
    const updated = goals.map((g) => (g.id === goalId ? { ...g, current: g.current + amount } : g));
    setGoals(updated);
    persistData(allowance, transactions, categories, bills, updated);
  };

  // Reset to initial sample data for demonstration if user requests
  const resetToSampleData = () => {
    const sampleAllowance = 3000000;
    const sampleTransactions: Transaction[] = [
      { id: "tx-1", name: "Lunch at campus", time: "Today · 12:30", category: "Food & drinks", amount: 28000 },
      { id: "tx-2", name: "Afternoon coffee", time: "Today · 09:15", category: "Food & drinks", amount: 17000 },
      { id: "tx-3", name: "Ride to campus", time: "16 Nov · 07:45", category: "Transport", amount: 18000 },
      { id: "tx-4", name: "Dinner with friends", time: "16 Nov · 18:30", category: "Food & drinks", amount: 35000 },
      { id: "tx-5", name: "Course textbook", time: "15 Nov · 14:20", category: "Academic needs", amount: 75000 },
      { id: "tx-6", name: "Printing assignment", time: "15 Nov · 10:00", category: "Academic needs", amount: 12000 },
      { id: "tx-7", name: "Laundry", time: "14 Nov · 17:00", category: "Personal", amount: 30000 },
    ];
    const sampleCategories: BudgetCategory[] = [
      { id: "food", name: "Food & drinks", desc: "Meals, snacks & coffee", budget: 900000, spent: 510000 },
      { id: "transport", name: "Transport", desc: "Commutes & trips", budget: 300000, spent: 180000 },
      { id: "academic", name: "Academic needs", desc: "Books, printing & supplies", budget: 350000, spent: 125000 },
      { id: "accommodation", name: "Accommodation", desc: "Rent, utilities & Wi-Fi", budget: 1000000, spent: 800000 },
      { id: "personal", name: "Personal", desc: "Laundry, social & self-care", budget: 300000, spent: 100000 },
      { id: "emergency", name: "Emergency fund", desc: "For the unexpected", budget: 150000, spent: 25000 },
    ];
    const sampleBills: BillItem[] = [
      { id: "b1", day: 20, name: "Wi-Fi subscription", due: "Due 20 Nov · 3 days left", amount: 100000, status: "Upcoming", category: "Accommodation" },
      { id: "b2", day: 25, name: "Boarding house / Rent", due: "Due 25 Nov · 8 days left", amount: 800000, status: "Upcoming", category: "Accommodation" },
    ];
    const sampleGoals: SavingsGoal[] = [
      { id: "g1", title: "New laptop fund", subtitle: "For thesis & productivity", current: 450000, target: 1500000, color: "bg-[#244833]", deadline: "March 2027" },
    ];

    setAllowance(sampleAllowance);
    setTransactions(sampleTransactions);
    setCategories(sampleCategories);
    setBills(sampleBills);
    setGoals(sampleGoals);
    persistData(sampleAllowance, sampleTransactions, sampleCategories, sampleBills, sampleGoals);
  };

  // Calculations
  const totalSpent = transactions.reduce((acc, t) => acc + t.amount, 0);
  const remainingBalance = allowance - totalSpent;
  const daysRemaining = 14;
  const dailySpendingLimit = remainingBalance > 0 ? Math.round(remainingBalance / daysRemaining) : 0;

  return (
    <DataContext.Provider
      value={{
        allowance,
        transactions,
        categories,
        bills,
        goals,
        totalSpent,
        remainingBalance,
        dailySpendingLimit,
        daysRemaining,
        isInitialLoad,
        addExpense,
        deleteExpense,
        updateAllowance,
        updateCategoryBudget,
        addCategory,
        addBill,
        toggleBillStatus,
        addSavingsGoal,
        depositToGoal,
        resetToSampleData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
