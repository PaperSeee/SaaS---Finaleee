"use client";

import { useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  actionButton?: ReactNode;
  showNotifications?: boolean;
}

export default function DashboardLayout({ 
  children, 
  title = "Dashboard",
  actionButton = null,
  showNotifications = true 
}: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Automatically close the mobile menu when changing pages
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  // Get page title based on current path
  useEffect(() => {
    if (!title || title === "Dashboard") {
      const path = pathname?.split('/').pop();
      if (path) {
        // Convert pathname to title (e.g. "reviews" -> "Reviews")
        const pageTitle = path.charAt(0).toUpperCase() + path.slice(1);
        document.title = `${pageTitle} | Kritiqo`;
      } else {
        document.title = "Dashboard | Kritiqo";
      }
    } else {
      document.title = `${title} | Kritiqo`;
    }
  }, [pathname, title]);
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navigation */}
        <Header 
          title={title} 
          showNotifications={showNotifications}
          actionButton={actionButton}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-0">
          {children}
        </main>
      </div>
    </div>
  );
}
