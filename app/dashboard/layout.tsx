"use client";

import React, { useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { user, signOut } = useAuth();
  
  // Keep sign out functionality for the dashboard
  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
      {/* Main content area with single scrollbar */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header with mobile menu button */}
        <Header onSidebarOpen={() => setIsMobileMenuOpen(true)} />
        
        {/* Page content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
