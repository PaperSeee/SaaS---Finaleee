"use client";

import { useState, useEffect, memo } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import LanguageSelector from "@/components/LanguageSelector";
import { HomeIcon, BuildingOfficeIcon, ChartBarIcon, MagnifyingGlassIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Memoize the DashboardLayout component to prevent unnecessary re-renders
const DashboardLayout = memo(({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoading, signOut } = useAuth();
  const pathname = usePathname();

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile sidebar when navigating
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-gray-900">Authentication required</h2>
          <p className="mt-2 text-gray-500">Please log in to access this section</p>
          <div className="mt-6">
            <Link
              href="/auth/login"
              className="block w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-4 text-center font-medium text-white shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Entreprises", href: "/dashboard/businesses", icon: BuildingOfficeIcon },
    { name: "Statistiques", href: "/dashboard/stats", icon: ChartBarIcon },
    { name: "Trouver mon Place ID", href: "/dashboard/find-place-id", icon: MagnifyingGlassIcon },
    { name: "Paramètres", href: "/dashboard/settings", icon: Cog6ToothIcon },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-72 md:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
            <Sidebar isMobile={true} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm lg:shadow-none border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                type="button"
                className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="ml-2 text-xl font-semibold text-gray-900 md:hidden">
                Kritiqo
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="flex text-gray-400 hover:text-gray-500 focus:outline-none">
                  <span className="sr-only">View notifications</span>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">2</span>
                </button>
              </div>

              <LanguageSelector />
              
              <div className="hidden md:block h-6 w-px bg-gray-200"></div>
              
              <div className="relative ml-3 md:hidden">
                <button
                  onClick={() => signOut()}
                  className="flex items-center rounded-full bg-gray-100 p-1 text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Sign out</span>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
});

export default DashboardLayout;
