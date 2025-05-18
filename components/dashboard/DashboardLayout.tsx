"use client";

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const supabase = createClientComponentClient();
  
  // Handle user sign out
  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    // Render just the content without a second sidebar
    <div className="w-full">
      {children}
    </div>
  );
}
