import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from '@/contexts/ThemeContext';
import PublicHeader from '@/components/PublicHeader'
import Footer from '@/components/Footer'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kritiqo - Customer Review Management",
  description: "Centralize and manage all your customer reviews in one place",
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-gray-50 to-blue-50`}
      >
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              <div className="flex min-h-screen flex-col">
                {/* The PublicHeader will only appear on non-dashboard pages */}
                <PublicHeader />
                <div className="flex-grow pt-16 md:pt-20">
                  {children}
                </div>
                <Footer />
              </div>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
