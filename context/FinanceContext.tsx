'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

// ---------- Types ----------

export type TransactionType = 'expense' | 'income';
export type BudgetGroup = 'needs' | 'wants' | 'savings';

export interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string; // YYYY-MM-DD (local date)
  note?: string;
  type?: TransactionType;
  createdAt: number;
}

export interface BudgetCategory {
  id: string;
  name: string;
  desc: string;
  budget: number;
  group?: BudgetGroup;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  category: string;
  paid: boolean;
  paidDate?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  subtitle: string;
  current: number;
  target: number;
  deadline: string;
  color: string;
}

export interface FinanceData {
  income: number;
  nextAllowanceDate: string;
  categories: BudgetCategory[];
  transactions: Transaction[];
  bills: Bill[];
  goals: SavingsGoal[];
}

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export interface NewTransaction {
  name: string;
  category: string;
  amount: number;
  date?: string;
  note?: string;
  type?: TransactionType;
  addToIncome?: boolean;
}

export interface NewCategory {
  name: string;
  desc?: string;
  budget: number;
  group?: BudgetGroup;
}

export interface NewBill {
  name: string;
  amount: number;
  dueDate: string;
  category: string;
}

export interface NewGoal {
  title: string;
  subtitle?: string;
  target: number;
  current?: number;
  deadline?: string;
}

export interface CategoryStat extends BudgetCategory {
  group: BudgetGroup;
  spent: number;
  remaining: number;
  percent: number;
  over: boolean;
}

export interface DayTotal {
  date: string;
  day: string;
  total: number;
  isToday: boolean;
}

export interface BillStatus extends Bill {
  daysUntil: number;
  overdue: boolean;
}

export interface FinanceSummary {
  today: string;
  periodStart: string;
  nextAllowanceDate: string;
  daysLeft: number;
  totalSpent: number;
  totalExtraIncome: number;
  effectiveIncome: number;
  remaining: number;
  percentSpent: number;
  percentRemaining: number;
  spentToday: number;
  balanceAtDayStart: number;
  dailyLimit: number;
  leftToday: number;
  totalBudget: number;
  unallocated: number;
  categoryStats: CategoryStat[];
  last7Days: DayTotal[];
  periodTransactions: Transaction[];
  bills: BillStatus[];
  dueSoonBills: BillStatus[];
  // Group breakdowns for 50/30/20
  groupStats: {
    needs: { budget: number; spent: number; percent: number; ratio: number };
    wants: { budget: number; spent: number; percent: number; ratio: number };
    savings: { budget: number; spent: number; percent: number; ratio: number };
  };
}

// ---------- Date and format helpers ----------

const STORAGE_KEY = 'sakuwise_finance_v1';
const DEMO_EMAILS: string[] = [];
const PLACEHOLDER_DATE = '2000-01-01';

export function isDemoAccount(email?: string | null): boolean {
  return !!email && DEMO_EMAILS.includes(email.trim().toLowerCase());
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const GOAL_COLORS = ['bg-[#244833]', 'bg-[#E08C38]', 'bg-[#3D644C]', 'bg-[#6B8F71]'];

const pad = (n: number) => String(n).padStart(2, '0');
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export function defaultCategoryGroup(name: string): BudgetGroup {
  const n = name.toLowerCase();
  if (
    n.includes('food') ||
    n.includes('makan') ||
    n.includes('grocer') ||
    n.includes('transport') ||
    n.includes('bill') ||
    n.includes('tagihan') ||
    n.includes('accommodation') ||
    n.includes('rent') ||
    n.includes('kos') ||
    n.includes('academic') ||
    n.includes('kuliah') ||
    n.includes('utilit') ||
    n.includes('wifi') ||
    n.includes('electric') ||
    n.includes('water')
  ) {
    return 'needs';
  }
  if (
    n.includes('saving') ||
    n.includes('tabungan') ||
    n.includes('darurat') ||
    n.includes('emergency') ||
    n.includes('invest') ||
    n.includes('future')
  ) {
    return 'savings';
  }
  return 'wants';
}

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: string, n: number): string {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

export function diffDays(a: string, b: string): number {
  return Math.round((parseISODate(b).getTime() - parseISODate(a).getTime()) / 86400000);
}

function addMonths(iso: string, n: number): string {
  const base = parseISODate(iso);
  const first = new Date(base.getFullYear(), base.getMonth() + n, 1);
  const lastDay = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  first.setDate(Math.min(base.getDate(), lastDay));
  return toISODate(first);
}

export function formatRupiah(n: number): string {
  const sign = n < 0 ? '-' : '';
  return `${sign}Rp${Math.abs(n).toLocaleString('id-ID')}`;
}

export function formatShortDate(iso: string): string {
  const d = parseISODate(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function describeDate(iso: string, today: string): string {
  const diff = diffDays(today, iso);
  if (diff === 0) return 'Today';
  if (diff === -1) return 'Yesterday';
  return formatShortDate(iso);
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function resolvePeriod(base: string, today: string): { next: string; start: string } {
  let k = 0;
  let next = base;
  while (diffDays(today, next) <= 0 && k < 1200) {
    k += 1;
    next = addMonths(base, k);
  }
  return { next, start: addMonths(base, k - 1) };
}

// ---------- Seed (sample) data ----------

function createSeed(today: string): FinanceData {
  const t = parseISODate(today);
  const periodStart = toISODate(new Date(t.getFullYear(), t.getMonth(), 1));
  const nextAllowanceDate = toISODate(new Date(t.getFullYear(), t.getMonth() + 1, 1));

  const dateAgo = (n: number) => {
    const d = addDays(today, -n);
    return d < periodStart ? periodStart : d;
  };

  const rows: Array<[string, string, number, string, TransactionType?]> = [
    ['Lunch at campus', 'Food & drinks', 28000, dateAgo(0), 'expense'],
    ['Afternoon coffee', 'Food & drinks', 17000, dateAgo(0), 'expense'],
    ['Freelance Graphic Project', 'Side Job', 650000, dateAgo(1), 'income'],
    ['Ride to campus', 'Transport', 18000, dateAgo(1), 'expense'],
    ['Dinner with friends', 'Food & drinks', 35000, dateAgo(1), 'expense'],
    ['Course textbook', 'Academic needs', 75000, dateAgo(2), 'expense'],
    ['Printing assignment', 'Academic needs', 12000, dateAgo(2), 'expense'],
    ['Laundry', 'Personal', 30000, dateAgo(3), 'expense'],
    ['Weekly groceries', 'Food & drinks', 150000, dateAgo(4), 'expense'],
    ['Online ride', 'Transport', 22000, dateAgo(5), 'expense'],
    ['Boarding house rent', 'Accommodation', 800000, periodStart, 'expense'],
  ];

  const noon = 12 * 3600 * 1000;
  const transactions: Transaction[] = rows.map(([name, category, amount, date, type], i) => ({
    id: `tx-seed-${i + 1}`,
    name,
    category,
    amount,
    date,
    type: type || 'expense',
    createdAt: parseISODate(date).getTime() + noon + (rows.length - i) * 60000,
  }));

  return {
    income: 3000000,
    nextAllowanceDate,
    categories: [
      { id: 'food', name: 'Food & drinks', desc: 'Meals, snacks & coffee', budget: 900000, group: 'needs' },
      { id: 'transport', name: 'Transport', desc: 'Commutes & trips', budget: 300000, group: 'needs' },
      { id: 'academic', name: 'Academic needs', desc: 'Books, printing & supplies', budget: 350000, group: 'needs' },
      { id: 'accommodation', name: 'Accommodation', desc: 'Rent, utilities & Wi-Fi', budget: 1000000, group: 'needs' },
      { id: 'personal', name: 'Personal', desc: 'Laundry, social & self-care', budget: 300000, group: 'wants' },
      { id: 'emergency', name: 'Emergency fund', desc: 'For the unexpected', budget: 150000, group: 'savings' },
    ],
    transactions,
    bills: [
      { id: 'bill-seed-1', name: 'Wi-Fi subscription', amount: 100000, dueDate: addDays(today, 3), category: 'Accommodation', paid: false },
      { id: 'bill-seed-2', name: 'Spotify & Cloud Storage', amount: 55000, dueDate: addDays(today, 6), category: 'Personal', paid: false },
      { id: 'bill-seed-3', name: 'Electricity token', amount: 150000, dueDate: addDays(today, -10), category: 'Accommodation', paid: true, paidDate: addDays(today, -10) },
    ],
    goals: [
      { id: 'goal-seed-1', title: 'New laptop fund', subtitle: 'For thesis & productivity', current: 450000, target: 1500000, deadline: 'Mar 2027', color: GOAL_COLORS[0] },
      { id: 'goal-seed-2', title: 'Emergency savings', subtitle: '3 months of essentials', current: 1200000, target: 3000000, deadline: 'Dec 2026', color: GOAL_COLORS[1] },
      { id: 'goal-seed-3', title: 'Year-end trip', subtitle: 'Relaxed trip with friends', current: 650000, target: 1000000, deadline: 'Jan 2027', color: GOAL_COLORS[2] },
    ],
  };
}

function createBlank(today: string): FinanceData {
  const seed = createSeed(today);
  return {
    income: 0,
    nextAllowanceDate: seed.nextAllowanceDate,
    categories: seed.categories.map((c) => ({ ...c, budget: 0 })),
    transactions: [],
    bills: [],
    goals: [],
  };
}

function loadData(today: string, storageKey: string, demo: boolean): FinanceData {
  const seed = demo ? createSeed(today) : createBlank(today);
  try {
    const raw = localStorage.getItem(storageKey) ?? (demo ? localStorage.getItem(STORAGE_KEY) : null);
    if (raw) {
      const p = JSON.parse(raw) as Partial<FinanceData>;
      return {
        income: typeof p.income === 'number' ? p.income : seed.income,
        nextAllowanceDate: typeof p.nextAllowanceDate === 'string' ? p.nextAllowanceDate : seed.nextAllowanceDate,
        categories: Array.isArray(p.categories) ? p.categories : seed.categories,
        transactions: Array.isArray(p.transactions) ? p.transactions : seed.transactions,
        bills: Array.isArray(p.bills) ? p.bills : seed.bills,
        goals: Array.isArray(p.goals) ? p.goals : seed.goals,
      };
    }
  } catch (e) {
    console.error('Failed to load finance data', e);
  }
  return seed;
}

// ---------- Derived numbers ----------

function computeSummary(data: FinanceData, today: string): FinanceSummary {
  const { next, start: rawStart } = resolvePeriod(data.nextAllowanceDate, today);
  const periodStart = rawStart > today ? today : rawStart;
  const daysLeft = Math.max(1, diffDays(today, next));

  const periodTransactions = data.transactions.filter((t) => t.date >= periodStart && t.date < next);
  const expenseTransactions = periodTransactions.filter((t) => t.type !== 'income');
  const incomeTransactions = periodTransactions.filter((t) => t.type === 'income');

  const totalExtraIncome = sum(incomeTransactions.map((t) => t.amount));
  const effectiveIncome = data.income + totalExtraIncome;
  const totalSpent = sum(expenseTransactions.map((t) => t.amount));
  const remaining = effectiveIncome - totalSpent;
  const spentToday = sum(expenseTransactions.filter((t) => t.date === today).map((t) => t.amount));

  const balanceAtDayStart = remaining + spentToday;
  const dailyLimit = Math.max(0, Math.floor(balanceAtDayStart / daysLeft));
  const leftToday = dailyLimit - spentToday;

  const percentSpent = effectiveIncome > 0 ? Math.min(100, Math.max(0, Math.round((totalSpent / effectiveIncome) * 100))) : 0;
  const percentRemaining = effectiveIncome > 0 ? 100 - percentSpent : 0;

  const totalBudget = sum(data.categories.map((c) => c.budget));

  const categoryStats: CategoryStat[] = data.categories.map((c) => {
    const group = c.group || defaultCategoryGroup(c.name);
    const spent = sum(expenseTransactions.filter((t) => t.category === c.name).map((t) => t.amount));
    const percent = c.budget > 0 ? Math.round((spent / c.budget) * 100) : spent > 0 ? 100 : 0;
    return { ...c, group, spent, remaining: c.budget - spent, percent, over: spent > c.budget };
  });

  const last7Days: DayTotal[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const date = addDays(today, -i);
    last7Days.push({
      date,
      day: date.slice(8),
      total: sum(expenseTransactions.filter((t) => t.date === date).map((t) => t.amount)),
      isToday: i === 0,
    });
  }

  const bills: BillStatus[] = data.bills
    .map((b) => {
      const daysUntil = diffDays(today, b.dueDate);
      return { ...b, daysUntil, overdue: !b.paid && daysUntil < 0 };
    })
    .sort((a, b) => Number(a.paid) - Number(b.paid) || a.dueDate.localeCompare(b.dueDate));

  const dueSoonBills = bills.filter((b) => !b.paid && b.daysUntil <= 3);

  // Group Stats for 50/30/20 breakdown
  const needsBudget = sum(categoryStats.filter((c) => c.group === 'needs').map((c) => c.budget));
  const needsSpent = sum(categoryStats.filter((c) => c.group === 'needs').map((c) => c.spent));
  const wantsBudget = sum(categoryStats.filter((c) => c.group === 'wants').map((c) => c.budget));
  const wantsSpent = sum(categoryStats.filter((c) => c.group === 'wants').map((c) => c.spent));
  const savingsBudget = sum(categoryStats.filter((c) => c.group === 'savings').map((c) => c.budget));
  const savingsSpent = sum(categoryStats.filter((c) => c.group === 'savings').map((c) => c.spent));

  return {
    today,
    periodStart,
    nextAllowanceDate: next,
    daysLeft,
    totalSpent,
    totalExtraIncome,
    effectiveIncome,
    remaining,
    percentSpent,
    percentRemaining,
    spentToday,
    balanceAtDayStart,
    dailyLimit,
    leftToday,
    totalBudget,
    unallocated: data.income - totalBudget,
    categoryStats,
    last7Days,
    periodTransactions,
    bills,
    dueSoonBills,
    groupStats: {
      needs: {
        budget: needsBudget,
        spent: needsSpent,
        percent: needsBudget > 0 ? Math.round((needsSpent / needsBudget) * 100) : 0,
        ratio: data.income > 0 ? Math.round((needsBudget / data.income) * 100) : 50,
      },
      wants: {
        budget: wantsBudget,
        spent: wantsSpent,
        percent: wantsBudget > 0 ? Math.round((wantsSpent / wantsBudget) * 100) : 0,
        ratio: data.income > 0 ? Math.round((wantsBudget / data.income) * 100) : 30,
      },
      savings: {
        budget: savingsBudget,
        spent: savingsSpent,
        percent: savingsBudget > 0 ? Math.round((savingsSpent / savingsBudget) * 100) : 0,
        ratio: data.income > 0 ? Math.round((savingsBudget / data.income) * 100) : 20,
      },
    },
  };
}

// ---------- Context ----------

interface FinanceContextType extends FinanceData {
  ready: boolean;
  summary: FinanceSummary;
  setIncome: (amount: number) => ActionResult;
  setNextAllowanceDate: (iso: string) => ActionResult;
  applyAutoAllocation: (
    incomeAmount: number,
    preset?: '50/30/20' | '70/20/10' | '60/20/20' | 'custom',
    customPercentages?: { needs: number; wants: number; savings: number }
  ) => ActionResult;
  addTransaction: (input: NewTransaction) => ActionResult;
  deleteTransaction: (id: string) => void;
  addCategory: (input: NewCategory) => ActionResult;
  updateCategory: (
    id: string,
    patch: Partial<Pick<BudgetCategory, 'desc' | 'budget' | 'group'>>
  ) => ActionResult;
  deleteCategory: (id: string) => void;
  addBill: (input: NewBill) => ActionResult;
  setBillPaid: (id: string, paid: boolean) => void;
  deleteBill: (id: string) => void;
  addGoal: (input: NewGoal) => ActionResult;
  depositToGoal: (id: string, amount: number) => ActionResult;
  deleteGoal: (id: string) => void;
  resetData: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [today, setToday] = useState<string>(PLACEHOLDER_DATE);
  const [data, setData] = useState<FinanceData>(() => createSeed(PLACEHOLDER_DATE));
  const { user } = useAuth();
  const email = user?.email?.trim().toLowerCase() ?? null;
  const storageKey = email ? `${STORAGE_KEY}:${email}` : null;
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const ready = storageKey !== null && loadedKey === storageKey;

  useEffect(() => {
    if (!email || !storageKey) return;
    const timer = setTimeout(() => {
      const now = todayISO();
      setToday(now);
      setData(loadData(now, storageKey, isDemoAccount(email)));
      setLoadedKey(storageKey);
    }, 0);
    return () => clearTimeout(timer);
  }, [email, storageKey]);

  useEffect(() => {
    if (!ready || !storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save finance data', e);
    }
  }, [data, ready, storageKey]);

  useEffect(() => {
    const id = setInterval(() => {
      const now = todayISO();
      setToday((prev) => (prev === now ? prev : now));
    }, 60000);
    return () => clearInterval(id);
  }, []);

  const summary = useMemo(() => computeSummary(data, today), [data, today]);

  const sortedTransactions = useMemo(
    () => [...data.transactions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt),
    [data.transactions]
  );

  // ----- Actions -----

  const setIncome = (amount: number): ActionResult => {
    if (!Number.isFinite(amount) || amount <= 0) {
      return { ok: false, error: 'Monthly income must be greater than zero.' };
    }
    setData((prev) => ({ ...prev, income: Math.round(amount) }));
    return { ok: true };
  };

  const setNextAllowanceDate = (iso: string): ActionResult => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
      return { ok: false, error: 'Please choose a valid date.' };
    }
    setData((prev) => ({ ...prev, nextAllowanceDate: iso }));
    return { ok: true };
  };

  const applyAutoAllocation = (
    incomeAmount: number,
    preset: '50/30/20' | '70/20/10' | '60/20/20' | 'custom' = '50/30/20',
    customPercentages?: { needs: number; wants: number; savings: number }
  ): ActionResult => {
    if (!Number.isFinite(incomeAmount) || incomeAmount <= 0) {
      return { ok: false, error: 'Monthly income must be greater than zero.' };
    }

    let needsPct = 50;
    let wantsPct = 30;
    let savingsPct = 20;

    if (preset === '70/20/10') {
      needsPct = 70;
      wantsPct = 20;
      savingsPct = 10;
    } else if (preset === '60/20/20') {
      needsPct = 60;
      wantsPct = 20;
      savingsPct = 20;
    } else if (preset === 'custom' && customPercentages) {
      needsPct = customPercentages.needs;
      wantsPct = customPercentages.wants;
      savingsPct = customPercentages.savings;
    }

    const totalPct = needsPct + wantsPct + savingsPct;
    if (totalPct !== 100) {
      return { ok: false, error: 'Allocation percentages must total exactly 100%.' };
    }

    const cleanIncome = Math.round(incomeAmount);
    const needsTotal = Math.round((cleanIncome * needsPct) / 100);
    const wantsTotal = Math.round((cleanIncome * wantsPct) / 100);
    const savingsTotal = cleanIncome - needsTotal - wantsTotal; // exact 100% match

    setData((prev) => {
      let currentCategories = [...prev.categories];

      // Ensure default categories exist if empty
      if (currentCategories.length === 0) {
        currentCategories = [
          { id: uid('cat'), name: 'Food & drinks', desc: 'Meals, snacks & coffee', budget: 0, group: 'needs' },
          { id: uid('cat'), name: 'Accommodation', desc: 'Rent, utilities & bills', budget: 0, group: 'needs' },
          { id: uid('cat'), name: 'Personal & Lifestyle', desc: 'Hobbies & entertainment', budget: 0, group: 'wants' },
          { id: uid('cat'), name: 'Emergency fund', desc: 'Protected future buffer', budget: 0, group: 'savings' },
        ];
      }

      const needsCats = currentCategories.filter((c) => (c.group || defaultCategoryGroup(c.name)) === 'needs');
      const wantsCats = currentCategories.filter((c) => (c.group || defaultCategoryGroup(c.name)) === 'wants');
      const savingsCats = currentCategories.filter((c) => (c.group || defaultCategoryGroup(c.name)) === 'savings');

      const distribute = (cats: BudgetCategory[], totalAmount: number): Map<string, number> => {
        const m = new Map<string, number>();
        if (cats.length === 0) return m;
        const perCat = Math.floor(totalAmount / cats.length);
        const rem = totalAmount - perCat * cats.length;
        cats.forEach((c, idx) => {
          m.set(c.id, perCat + (idx === cats.length - 1 ? rem : 0));
        });
        return m;
      };

      const needsMap = distribute(needsCats, needsTotal);
      const wantsMap = distribute(wantsCats, wantsTotal);
      const savingsMap = distribute(savingsCats, savingsTotal);

      const updatedCategories = currentCategories.map((c) => {
        const grp = c.group || defaultCategoryGroup(c.name);
        let newBud = c.budget;
        if (grp === 'needs' && needsMap.has(c.id)) newBud = needsMap.get(c.id)!;
        if (grp === 'wants' && wantsMap.has(c.id)) newBud = wantsMap.get(c.id)!;
        if (grp === 'savings' && savingsMap.has(c.id)) newBud = savingsMap.get(c.id)!;
        return { ...c, group: grp, budget: newBud };
      });

      return {
        ...prev,
        income: cleanIncome,
        categories: updatedCategories,
      };
    });

    return { ok: true };
  };

  const addTransaction = (input: NewTransaction): ActionResult => {
    const name = input.name.trim();
    if (!name) return { ok: false, error: 'Description is required.' };
    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      return { ok: false, error: 'Amount must be greater than zero.' };
    }
    const txType = input.type || 'expense';
    const tx: Transaction = {
      id: uid('tx'),
      name,
      category: input.category,
      amount: Math.round(input.amount),
      date: input.date || today,
      note: input.note?.trim() || undefined,
      type: txType,
      createdAt: Date.now(),
    };

    setData((prev) => {
      let newIncome = prev.income;
      if (txType === 'income' && input.addToIncome) {
        newIncome += Math.round(input.amount);
      }
      return {
        ...prev,
        income: newIncome,
        transactions: [tx, ...prev.transactions],
      };
    });
    return { ok: true };
  };

  const deleteTransaction = (id: string) => {
    setData((prev) => ({ ...prev, transactions: prev.transactions.filter((t) => t.id !== id) }));
  };

  const addCategory = (input: NewCategory): ActionResult => {
    const name = input.name.trim();
    if (!name) return { ok: false, error: 'Category name is required.' };
    if (data.categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      return { ok: false, error: 'This category already exists.' };
    }
    if (!Number.isFinite(input.budget) || input.budget < 0) {
      return { ok: false, error: 'Budget cannot be negative.' };
    }
    const cat: BudgetCategory = {
      id: uid('cat'),
      name,
      desc: input.desc?.trim() || '',
      budget: Math.round(input.budget),
      group: input.group || defaultCategoryGroup(name),
    };
    setData((prev) => ({ ...prev, categories: [...prev.categories, cat] }));
    return { ok: true };
  };

  const updateCategory = (
    id: string,
    patch: Partial<Pick<BudgetCategory, 'desc' | 'budget' | 'group'>>
  ): ActionResult => {
    if (patch.budget !== undefined && (!Number.isFinite(patch.budget) || patch.budget < 0)) {
      return { ok: false, error: 'Budget cannot be negative.' };
    }
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === id
          ? {
              ...c,
              ...(patch.desc !== undefined ? { desc: patch.desc } : {}),
              ...(patch.budget !== undefined ? { budget: Math.round(patch.budget) } : {}),
              ...(patch.group !== undefined ? { group: patch.group } : {}),
            }
          : c
      ),
    }));
    return { ok: true };
  };

  const deleteCategory = (id: string) => {
    setData((prev) => ({ ...prev, categories: prev.categories.filter((c) => c.id !== id) }));
  };

  const addBill = (input: NewBill): ActionResult => {
    const name = input.name.trim();
    if (!name) return { ok: false, error: 'Bill name is required.' };
    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      return { ok: false, error: 'Amount must be greater than zero.' };
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.dueDate)) {
      return { ok: false, error: 'Please choose a due date.' };
    }
    const bill: Bill = {
      id: uid('bill'),
      name,
      amount: Math.round(input.amount),
      dueDate: input.dueDate,
      category: input.category,
      paid: false,
    };
    setData((prev) => ({ ...prev, bills: [...prev.bills, bill] }));
    return { ok: true };
  };

  const setBillPaid = (id: string, paid: boolean) => {
    setData((prev) => ({
      ...prev,
      bills: prev.bills.map((b) =>
        b.id === id ? { ...b, paid, paidDate: paid ? today : undefined } : b
      ),
    }));
  };

  const deleteBill = (id: string) => {
    setData((prev) => ({ ...prev, bills: prev.bills.filter((b) => b.id !== id) }));
  };

  const addGoal = (input: NewGoal): ActionResult => {
    const title = input.title.trim();
    if (!title) return { ok: false, error: 'Goal name is required.' };
    if (!Number.isFinite(input.target) || input.target <= 0) {
      return { ok: false, error: 'Target must be greater than zero.' };
    }
    const current = Math.max(0, Math.round(input.current ?? 0));
    setData((prev) => ({
      ...prev,
      goals: [
        ...prev.goals,
        {
          id: uid('goal'),
          title,
          subtitle: input.subtitle?.trim() || '',
          current,
          target: Math.round(input.target),
          deadline: input.deadline?.trim() || '',
          color: GOAL_COLORS[prev.goals.length % GOAL_COLORS.length],
        },
      ],
    }));
    return { ok: true };
  };

  const depositToGoal = (id: string, amount: number): ActionResult => {
    if (!Number.isFinite(amount) || amount <= 0) {
      return { ok: false, error: 'Amount must be greater than zero.' };
    }
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === id ? { ...g, current: g.current + Math.round(amount) } : g
      ),
    }));
    return { ok: true };
  };

  const deleteGoal = (id: string) => {
    setData((prev) => ({ ...prev, goals: prev.goals.filter((g) => g.id !== id) }));
  };

  const resetData = () => {
    setData(isDemoAccount(email) ? createSeed(today) : createBlank(today));
  };

  if (!ready) {
    return <div className='min-h-screen bg-[#FAF8F5]' />;
  }

  return (
    <FinanceContext.Provider
      value={{
        ...data,
        transactions: sortedTransactions,
        ready,
        summary,
        setIncome,
        setNextAllowanceDate,
        applyAutoAllocation,
        addTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        addBill,
        setBillPaid,
        deleteBill,
        addGoal,
        depositToGoal,
        deleteGoal,
        resetData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
