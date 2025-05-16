import { useState } from "react";
import Link from "next/link";
import { CustomLogo } from "@/components/CustomLogo";
import { useAuth } from "@/contexts/AuthContext";

export default function PublicHeader() {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center" prefetch={false}>
            <CustomLogo width={120} height={40} />
          </Link>
          <nav className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/pricing" className="text-base font-medium text-gray-600 hover:text-gray-900">Tarifs</Link>
            <Link href="/faq"     className="text-base font-medium text-gray-600 hover:text-gray-900">FAQ</Link>
            <Link href="/contact" className="text-base font-medium text-gray-600 hover:text-gray-900">Contact</Link>
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="ml-8 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="text-base font-medium text-gray-600 hover:text-gray-900">
                  Se connecter
                </Link>
                <Link
                  href="/auth/register"
                  className="ml-8 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  Essayer gratuitement
                </Link>
              </>
            )}
          </nav>
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <span className="sr-only">Ouvrir le menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="absolute inset-x-0 top-full z-40 bg-white border-t border-gray-100 shadow-md md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">Tarifs</Link>
            <Link href="/faq"     className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">FAQ</Link>
            <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">Contact</Link>
            {isAuthenticated ? (
              <Link href="/dashboard" className="block px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Dashboard</Link>
            ) : (
              <>
                <Link href="/auth/login"    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">Se connecter</Link>
                <Link href="/auth/register" className="block px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Essayer gratuitement</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
