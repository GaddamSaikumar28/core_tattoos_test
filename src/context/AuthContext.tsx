"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { 
  createCustomer, 
  createCustomerAccessToken, 
  getCustomer, 
  recoverCustomerPassword,
  deleteCustomerAccessToken,
  updateCustomerProfile,
  Customer 
} from "@/src/lib/shopify";
import { useCart } from "@/src/context/CartContext";

const TOKEN_KEY = "shopify_customer_token";
declare global {
  interface Window {
    _learnq: any[];
  }
}

interface AuthContextType {
  customer: Customer | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (firstName: string, lastName: string, email: string, password: string, acceptsMarketing?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  recoverPassword: (email: string) => Promise<boolean>;
  subscribeLoggedInUser: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // We grab the cart context to link the cart to the user upon login
  const { linkCartToUser } = useCart();

  // Initialize session on load
  useEffect(() => {
    async function initAuth() {
      const token = Cookies.get(TOKEN_KEY);
      if (token) {
        try {
          const fetchedCustomer = await getCustomer(token);
          if (fetchedCustomer) {
            setCustomer(fetchedCustomer);
            await linkCartToUser(token);
            if (typeof window !== "undefined") {
              window._learnq = window._learnq || [];
              window._learnq.push(['identify', {
                '$email': fetchedCustomer.email,
                '$first_name': fetchedCustomer.firstName,
                '$last_name': fetchedCustomer.lastName
              }]);
            }
          } else {
            Cookies.remove(TOKEN_KEY);
          }
        } catch (error) {
          Cookies.remove(TOKEN_KEY);
        }
      }
      setIsLoading(false);
    }
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const tokenData = await createCustomerAccessToken({ email, password });
      if (tokenData?.accessToken) {
        // 1. Store Token
        Cookies.set(TOKEN_KEY, tokenData.accessToken, { expires: 14 }); // 14 days
        
        // 2. Fetch Customer Details
        const fetchedCustomer = await getCustomer(tokenData.accessToken);
        setCustomer(fetchedCustomer);

        // 3. Link existing guest cart to the newly logged-in user!
        await linkCartToUser(tokenData.accessToken);
        if (typeof window !== "undefined") {
          window._learnq = window._learnq || [];
          window._learnq.push(['identify', {
            '$email': fetchedCustomer.email,
            '$first_name': fetchedCustomer.firstName,
            '$last_name': fetchedCustomer.lastName
          }]);
        }
        toast.success(`Welcome back, ${fetchedCustomer.firstName}!`);
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || "Invalid email or password");
      return false;
    }
  };

  const signup = async (firstName: string, lastName: string, email: string, password: string, acceptsMarketing = false) => {
    try {
      // 1. Create Account in Shopify
      await createCustomer({ firstName, lastName, email, password, acceptsMarketing });
      
      // 2. Automatically log them in after creation
      const success = await login(email, password);
      if (success) {
        toast.success("Account created successfully!");
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      return false;
    }
  };

  const logout = async () => {
    try {
      const token = Cookies.get(TOKEN_KEY);
      if (token) await deleteCustomerAccessToken(token);
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      Cookies.remove(TOKEN_KEY);
      setCustomer(null);
      toast.info("You have been logged out");
      // Optional: Refresh page to clear cart state or redirect to home
      window.location.href = "/";
    }
  };

  const recoverPassword = async (email: string) => {
    try {
      await recoverCustomerPassword(email);
      toast.success("Password recovery email sent. Please check your inbox.");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to send recovery email");
      return false;
    }
  };

  const subscribeLoggedInUser = async () => {
    const token = Cookies.get(TOKEN_KEY);
    if (!token || !customer) return false;

    try {
      const result = await updateCustomerProfile(token, { acceptsMarketing: true });
      if (result.customer) {
        setCustomer(result.customer); 
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || "Failed to update subscription status");
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ customer, isLoading, login, signup, logout, recoverPassword, subscribeLoggedInUser}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}