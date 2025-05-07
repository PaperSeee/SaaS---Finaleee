"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function AddBusiness() {
  const [name, setName] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, send data to API endpoint
      console.log("Creating business:", { name, googleUrl, facebookUrl });
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating business:", error);
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
              URL to your Google Business profile (optional)
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
