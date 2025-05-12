"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function AddPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { user } = useAuth();

  // Get search params
  const placeIdParam = searchParams.get("placeId");
  const nameParam = searchParams.get("name");

  const [name, setName] = useState(nameParam || "");
  const [googleUrl, setGoogleUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [placeId, setPlaceId] = useState(placeIdParam || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [placeIdStatus, setPlaceIdStatus] = useState<{
    status: "idle" | "searching" | "found" | "not-found";
    placeId?: string;
    businessInfo?: { name: string; rating: number; reviewCount: number };
  }>({
    status: placeIdParam ? "found" : "idle",
    placeId: placeIdParam || undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!user) {
      setError("You must be logged in to add a business");
      setLoading(false);
      return;
    }
    
    if (!name.trim()) {
      setError("Business name is required");
      setLoading(false);
      return;
    }
    
    try {
      const { data, error: insertError } = await supabase
        .from('companies')
        .insert({
          name: name.trim(),
          google_url: googleUrl.trim(),
          facebook_url: facebookUrl.trim(),
          place_id: placeId.trim() || null,
          user_id: user.id
        })
        .select();
      
      if (insertError) throw insertError;
      
      setSuccess("Business added successfully!");
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to add business. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Add New Business</h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter business details to start collecting reviews
          </p>
        </div>
        
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-4 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Business Name
            </label>
            <input
              id="name"
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Enter business name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-md">
            <label htmlFor="placeId" className="block text-sm font-medium text-blue-700">
              Google Place ID
              <span className="ml-2 text-xs font-normal text-blue-600">
                (<Link href="/dashboard/find-place-id" className="text-blue-700 hover:text-blue-600 hover:underline">Find my Place ID</Link>)
              </span>
            </label>
            <input
              id="placeId"
              type="text"
              className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white"
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              placeholder="Ex: ChIJN1t_tDeuEmsRUsoyG83frY4"
            />
            <p className="mt-1 text-xs text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
              Place ID is required to automatically retrieve Google reviews
            </p>
          </div>
          
          <div>
            <label htmlFor="googleUrl" className="block text-sm font-medium">
              Google Business URL
            </label>
            <input
              id="googleUrl"
              type="url"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="https://g.page/your-business"
              value={googleUrl}
              onChange={(e) => setGoogleUrl(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500">
              URL to your Google Business profile (optional if Place ID is provided)
            </p>
          </div>
          
          <div>
            <label htmlFor="facebookUrl" className="block text-sm font-medium">
              Facebook Page URL
            </label>
            <input
              id="facebookUrl"
              type="url"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="https://facebook.com/your-business"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500">
              URL to your Facebook business page (optional)
            </p>
          </div>
          
          <div className="flex items-center space-x-4 pt-4">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:bg-blue-300"
            >
              {loading ? "Creating..." : "Create Business"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
