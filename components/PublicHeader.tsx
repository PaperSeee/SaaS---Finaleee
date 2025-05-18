"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { CustomLogo } from "./CustomLogo";
import { useAuth } from "@/contexts/AuthContext";

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Handle scroll effect for transparent to solid header transition
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Initial check in case page is loaded already scrolled
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    return pathname?.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center" prefetch={false}>
              <CustomLogo width={120} height={40} />
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="flex-1 flex justify-center">
            <ul className="flex items-center space-x-1 lg:space-x-6">
              <li>
                <Link
                  href="/features"
                  prefetch={false}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive("/features")
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {t("header.features")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  prefetch={false}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive("/pricing")
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {t("header.pricing")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  prefetch={false}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive("/contact")
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {t("header.contact")}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right side - auth buttons */}
          <div className="flex items-center gap-2 lg:gap-4">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                prefetch={false}
                className="inline-flex items-center justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                {t("header.dashboard")}
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  prefetch={false}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  {t("header.signIn")}
                </Link>
                <Link
                  href="/auth/register"
                  prefetch={false}
                  className="inline-flex items-center justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors hidden sm:inline-flex"
                >
                  {t("header.getStarted")}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">
                {isMenuOpen ? "Close menu" : "Open menu"}
              </span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3 border-t border-gray-200 bg-white shadow-lg">
          <Link
            href="/features"
            prefetch={false}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/features")
                ? "text-blue-600 bg-blue-50"
                : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            {t("header.features")}
          </Link>
          <Link
            href="/pricing"
            prefetch={false}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/pricing")
                ? "text-blue-600 bg-blue-50"
                : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            {t("header.pricing")}
          </Link>
          <Link
            href="/contact"
            prefetch={false}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/contact")
                ? "text-blue-600 bg-blue-50"
                : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            {t("header.contact")}
          </Link>

          {/* Mobile-specific items */}
          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="flex items-center justify-between px-3">
              <div className="flex items-center"></div>
              {!isAuthenticated && (
                <Link
                  href="/auth/register"
                  prefetch={false}
                  className="inline-flex items-center justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors sm:hidden"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("header.getStarted")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Aucun changement nécessaire ici. Vérifiez l'importation et l'utilisation du composant dans vos pages/layouts.
