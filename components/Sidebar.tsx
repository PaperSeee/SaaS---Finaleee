"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isMobile = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Ajouter entreprise", href: "/dashboard/add" },
    { name: "Paramètres", href: "/dashboard/settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className={`flex flex-col ${isMobile ? "h-full" : "h-screen"}`}>
      {/* Header/Logo */}
      <div className="flex flex-shrink-0 items-center px-4 py-5">
        <span className="text-xl font-bold text-blue-600">Kritiqo</span>
        {isMobile && (
          <button
            onClick={onClose}
            className="ml-auto text-gray-500 hover:text-gray-700"
            aria-label="Close menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="mt-5 flex-1 space-y-1 px-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={isMobile ? onClose : undefined}
            className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive(item.href)
                ? "bg-blue-100 text-blue-900"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* User info and logout */}
      <div className="border-t border-gray-200 p-4">
        <div className="group flex items-center">
          <div className="mr-3 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 truncate max-w-[160px]">
              {user?.email || "Utilisateur"}
            </p>
            <button
              onClick={handleSignOut}
              className="mt-1 text-xs text-gray-500 hover:text-gray-900"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
