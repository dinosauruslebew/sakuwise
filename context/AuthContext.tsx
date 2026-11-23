"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface AuthResponse {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginWithEmail: (email: string, pass: string, remember?: boolean) => Promise<AuthResponse>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<AuthResponse>;
  loginWithGoogle: (customData?: Partial<User>) => Promise<void>;
  logout: () => void;
}

const DEFAULT_USERS_DB: Record<string, { name: string; passwordHash: string; role: string }> = {
  "najwa.finance@student.ac.id": {
    name: "Najwa",
    passwordHash: "password123",
    role: "Student account",
  },
  "najwa@sakuwise.id": {
    name: "Najwa",
    passwordHash: "password123",
    role: "Student account",
  },
  "admin@sakuwise.id": {
    name: "Admin Sakuwise",
    passwordHash: "admin123",
    role: "Akun Sakuwise",
  },
  "lia@sakuwise.id": {
    name: "Lia",
    passwordHash: "password123",
    role: "Student account",
  },
  "husen@sakuwise.id": {
    name: "Husen",
    passwordHash: "password123",
    role: "Student account",
  },
  "christ@sakuwise.id": {
    name: "Christ",
    passwordHash: "password123",
    role: "Student account",
  },
};

// Demo accounts live only in the local store. If Supabase rejects them, fall back to the local login.
const DEMO_LOGIN_EMAILS = ["najwa.finance@student.ac.id", "najwa@sakuwise.id"];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // true: session survives closing the browser (localStorage); false: only this browser session (sessionStorage)
  const rememberRef = useRef(true);
  const router = useRouter();

  // Load existing session & registered accounts from localStorage
  useEffect(() => {
    // Deferred so state is not set synchronously in the effect body
    const timer = setTimeout(() => {
      try {
        // 1. Load active session
        const stored =
          sessionStorage.getItem("sakuwise_auth_user") ?? localStorage.getItem("sakuwise_auth_user");
        if (stored) {
          setUser(JSON.parse(stored));
        }

        // 2. Initialize registered accounts DB in localStorage if not set
        // Merge built-in accounts into the saved list: missing ones are added, existing ones are kept
        const storedAccounts = localStorage.getItem("sakuwise_registered_accounts");
        const savedDb = storedAccounts ? JSON.parse(storedAccounts) : {};
        localStorage.setItem(
          "sakuwise_registered_accounts",
          JSON.stringify({ ...DEFAULT_USERS_DB, ...savedDb })
        );
      } catch (e) {
        console.error("Failed to load auth session", e);
      } finally {
        setIsLoading(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const getAccountsDb = () => {
    try {
      const stored = localStorage.getItem("sakuwise_registered_accounts");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_USERS_DB;
  };

  const saveSession = (userData: User) => {
    setUser(userData);
    try {
      const key = "sakuwise_auth_user";
      const target = rememberRef.current ? localStorage : sessionStorage;
      const other = rememberRef.current ? sessionStorage : localStorage;
      target.setItem(key, JSON.stringify(userData));
      other.removeItem(key);
    } catch (e) {
      console.error(e);
    }
  };

  // 1. Email & Password Login
  const loginWithEmail = async (
    email: string,
    pass: string,
    remember = true
  ): Promise<AuthResponse> => {
    rememberRef.current = remember;
    setIsLoading(true);

    // If Supabase is configured with valid credentials, try Supabase Auth first
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: pass,
        });

        if (error && !DEMO_LOGIN_EMAILS.includes(email.trim().toLowerCase())) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const u: User = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || email.split("@")[0],
            email: data.user.email || email,
            role: "Personal account",
          };
          saveSession(u);
          setIsLoading(false);
          router.push("/dashboard");
          return { success: true };
        }
      } catch (err: unknown) {
        console.warn("Supabase auth failed, trying local store...", err);
      }
    }

    // Standard Credentials validation (Simulation / Local DB)
    await new Promise((r) => setTimeout(r, 400));
    const normalizedEmail = email.trim().toLowerCase();
    const accounts = getAccountsDb();

    if (!normalizedEmail || !pass) {
      setIsLoading(false);
      return { success: false, error: "Email dan kata sandi wajib diisi." };
    }

    const account = accounts[normalizedEmail];
    if (!account) {
      setIsLoading(false);
      return {
        success: false,
        error: "Email belum terdaftar. Silakan daftar akun baru terlebih dahulu.",
      };
    }

    if (account.passwordHash !== pass) {
      setIsLoading(false);
      return {
        success: false,
        error: "Kata sandi salah. Silakan periksa kembali kata sandi Anda.",
      };
    }

    // Login success
    const loggedUser: User = {
      id: `usr_${Date.now()}`,
      name: account.name || "Najwa",
      email: normalizedEmail,
      role: account.role || "Student account",
    };

    saveSession(loggedUser);
    setIsLoading(false);
    router.push("/dashboard");
    return { success: true };
  };

  // 2. Email & Password Sign Up
  const signUpWithEmail = async (
    name: string,
    email: string,
    pass: string
  ): Promise<AuthResponse> => {
    setIsLoading(true);

    if (!name.trim()) {
      setIsLoading(false);
      return { success: false, error: "Nama lengkap wajib diisi." };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      setIsLoading(false);
      return { success: false, error: "Format email tidak valid." };
    }

    if (pass.length < 6) {
      setIsLoading(false);
      return { success: false, error: "Kata sandi minimal 6 karakter." };
    }

    // If Supabase is configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password: pass,
          options: {
            data: { full_name: name.trim() },
          },
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const u: User = {
            id: data.user.id,
            name: name.trim(),
            email: normalizedEmail,
            role: "Personal account",
          };
          saveSession(u);
          setIsLoading(false);
          router.push("/dashboard");
          return { success: true };
        }
      } catch (err: unknown) {
        console.warn("Supabase signup fallback...", err);
      }
    }

    // Standard Credentials registration (Local DB)
    await new Promise((r) => setTimeout(r, 450));
    const accounts = getAccountsDb();

    if (accounts[normalizedEmail]) {
      setIsLoading(false);
      return {
        success: false,
        error: "Email sudah terdaftar. Silakan masuk menggunakan kata sandi Anda.",
      };
    }

    // Register new user
    accounts[normalizedEmail] = {
      name: name.trim(),
      passwordHash: pass,
      role: "Personal account",
    };

    try {
      localStorage.setItem("sakuwise_registered_accounts", JSON.stringify(accounts));
    } catch (e) {
      console.error(e);
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      role: "Personal account",
    };

    saveSession(newUser);
    setIsLoading(false);
    router.push("/dashboard");
    return { success: true };
  };

  // 3. Google OAuth Login
  const loginWithGoogle = async (customData?: Partial<User>) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const loggedUser: User = {
      id: "google_10928374",
      name: "Najwa",
      email: "najwa.finance@student.ac.id",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      role: "Student account",
      ...customData,
    };

    saveSession(loggedUser);
    setIsLoading(false);
    router.push("/dashboard");
  };

  // 4. Logout
  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("sakuwise_auth_user");
      sessionStorage.removeItem("sakuwise_auth_user");
      rememberRef.current = true;
    } catch (e) {
      console.error(e);
    }
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithEmail,
        signUpWithEmail,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
