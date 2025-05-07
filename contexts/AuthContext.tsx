"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{
    error: any;
    data: any;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: any;
    data: any;
  }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active session
    const getSession = async () => {
      setIsLoading(true);
      
      try {
        const { data: { session: activeSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        setSession(activeSession);
        setUser(activeSession?.user ?? null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up a user with email and password
  const signUp = async (email: string, password: string) => {
    try {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Désactiver la confirmation par email pour le développement local
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            email_confirm: true  // Indication que l'email est déjà confirmé
          }
        }
      });
      return { data: response.data, error: response.error };
    } catch (error) {
      console.error("Error signing up:", error);
      return { data: null, error };
    }
  };

  // Sign in a user with email and password
  const signIn = async (email: string, password: string) => {
    try {
      // D'abord, vérifier si l'utilisateur existe mais n'est pas confirmé
      const { data: userData } = await supabase.auth.admin.getUserByEmail(email);
      
      // Si l'utilisateur existe mais n'est pas confirmé, forcer la confirmation
      if (userData?.user && !userData.user.email_confirmed_at) {
        // Forcer la confirmation de l'utilisateur en mode dev
        await supabase.auth.admin.updateUserById(
          userData.user.id,
          { email_confirmed: true }
        );
      }
      
      // Maintenant tenter de se connecter normalement
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { data: response.data, error: response.error };
    } catch (error) {
      console.error("Error signing in:", error);
      return { data: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
