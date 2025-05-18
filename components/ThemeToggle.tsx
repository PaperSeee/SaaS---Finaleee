"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Only render the toggle after component has mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  return (
    <div className="relative flex items-center gap-2">
      
      <div className="absolute right-0 top-full mt-2 w-36 origin-top-right rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800" 
           style={{ display: 'none' }} // Hidden by default, add dropdown logic if needed
      >
        <button
          onClick={() => setTheme("light")}
          className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm ${
            theme === "light" ? "bg-gray-100 dark:bg-gray-700" : ""
          }`}
        >
          <SunIcon className="h-4 w-4" />
          Light
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm ${
            theme === "dark" ? "bg-gray-100 dark:bg-gray-700" : ""
          }`}
        >
          <MoonIcon className="h-4 w-4" />
          Dark
        </button>
        <button
          onClick={() => setTheme("system")}
          className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm ${
            theme === "system" ? "bg-gray-100 dark:bg-gray-700" : ""
          }`}
        >
          <ComputerIcon className="h-4 w-4" />
          System
        </button>
      </div>
    </div>
  );
}

function SunIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
  );
}

function MoonIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
      />
    </svg>
  );
}

function ComputerIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
      />
    </svg>
  );
}
