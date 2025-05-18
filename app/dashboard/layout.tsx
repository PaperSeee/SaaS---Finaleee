"use client";

import React, { useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';

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
      {/* Only one Sidebar component */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
      {/* Main content area with single scrollbar */}
      <main className="flex-1 overflow-auto">
        {/* Mobile menu button - only visible on small screens */}
        <div className="md:hidden sticky top-0 z-10 flex h-16 bg-white shadow">
          <button
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open sidebar"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex flex-1 items-center justify-between px-4">
            <div className="flex flex-1"></div>
            <div className="flex items-center">
              <div className="relative ml-3">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-medium text-blue-600">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Page content */}
        <div>
          {children}
        </div>
      </main>
    </div>
  );
}
