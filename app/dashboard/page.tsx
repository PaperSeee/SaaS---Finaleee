"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CompanyCard from "@/components/dashboard/CompanyCard";
import { useAuth } from "@/contexts/AuthContext";

type Company = {
  id: string;
  name: string;
  created_at: string;
  logo_url?: string;
  review_count?: number;
  average_rating?: number;
  user_id: string;
};

export default function Dashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchCompanies() {
      try {
        if (!user) return;
        
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
        
        setCompanies(data || []);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des entreprises:", err);
        setError(err.message || "Une erreur s'est produite lors de la récupération de vos entreprises");
      } finally {
        setLoading(false);
      }
    }
    
    fetchCompanies();
  }, [supabase, user]);

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Vos Entreprises</h1>
          <Link
            href="/dashboard/add"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Ajouter une entreprise
          </Link>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div 
                key={index} 
                className="h-40 animate-pulse rounded-lg border bg-gray-100 p-6"
              ></div>
            ))}
          </div>
        ) : companies.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-lg border bg-white p-6 text-center">
            <p className="text-gray-500">
              Vous n'avez pas encore ajouté d'entreprise.
            </p>
            <Link
              href="/dashboard/add"
              className="mt-4 inline-block rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
            >
              Ajouter votre première entreprise
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
