"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Currency, Role, User } from "@/lib/types";
import { useRouter } from "next/navigation";

// Define the shape of the auth context
interface AuthContextType {
  updateStorage: ({
    role,
    currency,
  }: Partial<{ role: Role; currency: Currency }>) => void;
  logout: () => void;
  isAuthenticated: boolean;
  role: Role | null;
  currency: Currency | null;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the AuthProvider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role | null>(null);
  const [currency, setCurrency] = useState<Currency | null>(null);
  const router = useRouter();

  // Function to handle login
  const updateStorage = ({
    role,
    currency,
  }: Partial<{ role: Role; currency: Currency }>) => {
    if (role) setRole(role);
    if (currency) setCurrency(currency);
    // Optionally store the user in localStorage or cookies for persistence
    //TODO: incript and decrypt this value
    localStorage.setItem("user", JSON.stringify({ role, currency: currency }));
  };

  // Function to handle logout
  const logout = () => {
    setRole(null);
    // Remove user from localStorage
    localStorage.removeItem("user");
    // Optionally redirect to the login page after logout
    // router.push("/login");
  };

  // Check for the user in localStorage on initial load to persist session
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setRole(parsedUser.role);
      setCurrency(parsedUser.currency);
    }
  }, []);

  const value = {
    updateStorage,
    logout,
    isAuthenticated: !!role,
    role,
    currency,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
