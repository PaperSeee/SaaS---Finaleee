"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, Transition } from "@headlessui/react";
import ThemeToggle from "./ThemeToggle";
import { CustomLogo } from "./CustomLogo";
import Image from 'next/image';

interface HeaderProps {
  onSidebarOpen?: () => void;
}

export default function Header({ onSidebarOpen }: HeaderProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };
  
  const getInitials = () => {
    if (user?.user_metadata?.name) {
      const names = user.user_metadata.name.split(' ');
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
      }
      return user.user_metadata.name.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || "U";
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Search for:", searchQuery);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Mobile hamburger menu */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                className="-ml-2 p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={onSidebarOpen}
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
            
            {/* Logo - shown on mobile only */}
            <div className="flex lg:hidden items-center ml-2">
              <Link href="/dashboard" prefetch={false}>
                <CustomLogo width={100} height={32} />
              </Link>
            </div>

            {/* Search bar - shown on lg screens */}
            <div className="hidden lg:flex lg:items-center lg:ml-6">
              <form onSubmit={handleSearch} className="relative w-full max-w-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          </div>
          
          {/* Right section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search button - shown on mobile only */}
            <button
              type="button"
              className="p-2 lg:hidden text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => {/* Toggle mobile search */}}
            >
              <span className="sr-only">Search</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
            
            {/* Notifications dropdown */}
            <div className="relative">
              <button
                type="button"
                className="p-1.5 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="sr-only">View notifications</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {/* Notification badge */}
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>
            </div>
            
            {/* Theme toggle */}
            <ThemeToggle />
            
            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-1">
              <div>
                <Menu.Button className="flex items-center rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="sr-only">Open user menu</span>
                  {user?.user_metadata?.avatar_url ? (
                    <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-white ring-2 ring-gray-100">
                      <Image
                        src={user.user_metadata.avatar_url}
                        alt="User avatar"
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-medium text-white">
                      {getInitials()}
                    </div>
                  )}
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.user_metadata?.name || "Utilisateur"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/dashboard/profile"
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } block px-4 py-2 text-sm text-gray-700`}
                        prefetch={false}
                      >
                        Mon profil
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/dashboard/settings"
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } block px-4 py-2 text-sm text-gray-700`}
                        prefetch={false}
                      >
                        Paramètres
                      </Link>
                    )}
                  </Menu.Item>
                  <div className="border-t border-gray-100">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className={`${
                            active ? 'bg-gray-50' : ''
                          } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                        >
                          Déconnexion
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
      
      {/* Mobile search - hidden by default */}
      <div className="hidden p-2 border-t border-gray-200 lg:hidden">
        <form onSubmit={handleSearch} className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
    </header>
  );
}
