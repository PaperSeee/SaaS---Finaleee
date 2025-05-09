"use client";

import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useState, useRef, useEffect } from "react";

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "en", label: t("language.english"), flag: "🇬🇧" },
    { code: "fr", label: t("language.french"), flag: "🇫🇷" },
    { code: "nl", label: t("language.dutch"), flag: "🇳🇱" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors hover:bg-gray-50"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-base">{currentLanguage?.flag}</span>
        <span className="hidden sm:inline">{currentLanguage?.label}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 ${
                language === lang.code ? "bg-gray-50 font-medium text-blue-600" : "text-gray-700"
              }`}
            >
              <span className="mr-2 text-base">{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
