"use client";

import React, { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Platform, PLATFORM_CONFIGS } from "@/lib/types";
import FacebookConnector from "@/components/businesses/FacebookConnector";

interface BusinessForm {
  name: string;
  platforms: Record<Platform, boolean>;
  platformData: {
    google: {
      placeId: string;
      url: string;
      verified: boolean;
      verificationStatus: "idle" | "searching" | "found" | "not-found";
      businessInfo?: { name: string; rating: number; reviewCount: number };
    };
    facebook: { pageId: string; url: string };
    trustpilot: { businessId: string; url: string };
    yelp: { businessId: string; url: string };
  };
}

export default function AddPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardLayout>
        <AddPageContent />
      </DashboardLayout>
    </Suspense>
  );
}

function AddPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { user } = useAuth();

  // Get search paramsss
  const placeIdParam = searchParams.get("placeId") || "";
  const nameParam = searchParams.get("name") || "";

  // Initialize form state with all platformss
  const [form, setForm] = useState<BusinessForm>({
    name: nameParam,
    platforms: {
      google: true, // Default to Google enabled
      facebook: false,
      trustpilot: false,
      yelp: false,
    },
    platformData: {
      google: {
        placeId: placeIdParam,
        url: "",
        verified: false,
        verificationStatus: placeIdParam ? "found" : "idle",
      },
      facebook: { pageId: "", url: "" },
      trustpilot: { businessId: "", url: "" },
      yelp: { businessId: "", url: "" },
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Verify Google Place ID
  const updatePlatformData = (
    platform: Platform,
    field: string,
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      platformData: {
        ...prev.platformData,
        [platform]: {
          ...prev.platformData[platform],
          [field]: value,
        },
      },
    }));
  };

  // on hoiste et on wrap en useCallback pour la cohérence des deps
  const verifyGooglePlaceId = useCallback(
    async (placeId: string) => {
      if (!placeId.trim()) {
        updatePlatformData("google", "verificationStatus", "idle");
        return;
      }
      updatePlatformData("google", "verificationStatus", "searching");
      try {
        const res = await fetch(
          `/api/google-reviews?place_id=${encodeURIComponent(placeId)}&preview=true`
        );
        const data = await res.json();
        if (res.ok && data.business) {
          updatePlatformData("google", "verificationStatus", "found");
          updatePlatformData("google", "verified", true);
          updatePlatformData("google", "businessInfo", {
            name: data.business.name,
            rating: data.business.averageRating,
            reviewCount: data.business.reviewCount,
          });
          if (!form.name) {
            setForm((prev) => ({ ...prev, name: data.business.name }));
          }
        } else {
          updatePlatformData("google", "verificationStatus", "not-found");
          updatePlatformData("google", "verified", false);
        }
      } catch {
        updatePlatformData("google", "verificationStatus", "not-found");
        updatePlatformData("google", "verified", false);
      }
    },
    [form.name]
  );

  // Add debounce effect to verify Google Place ID when user types
  useEffect(() => {
    const id = form.platformData.google.placeId;
    if (form.platforms.google && id) {
      const t = setTimeout(() => verifyGooglePlaceId(id), 800);
      return () => clearTimeout(t);
    }
  }, [form.platformData.google.placeId, form.platforms.google, verifyGooglePlaceId]);

  // Add state for Facebook page
  const [selectedFacebookPage, setSelectedFacebookPage] = useState<{
    id: string;
    name: string;
    access_token: string;
  } | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user) {
      setError("You must be logged in to add a business");
      setLoading(false);
      return;
    }
    if (!form.name.trim()) {
      setError("Business name is required");
      setLoading(false);
      return;
    }
    // Check that at least one platform is enabled
    if (!Object.values(form.platforms).some(Boolean)) {
      setError("You must enable at least one platform");
      setLoading(false);
      return;
    }

    // Check that required platform IDs are provided when enabled
    for (const plat of Object.keys(form.platforms) as Platform[]) {
      if (form.platforms[plat] && PLATFORM_CONFIGS[plat].idRequired) {
        const idField =
          plat === "google"
            ? "placeId"
            : plat === "facebook"
            ? "pageId"
            : "businessId";

        if (!form.platformData[plat][idField]) {
          setError(
            `${PLATFORM_CONFIGS[plat].name} ${PLATFORM_CONFIGS[plat].idFieldName} is required`
          );
          setLoading(false);
          return;
        }
      }
    }

    try {
      // Prepare the business data for insertion
      const payload = {
        name: form.name.trim(),
        user_id: user.id,

        // For backward compatibility, map the Google Place ID to place_id field
        place_id: form.platforms.google
          ? form.platformData.google.placeId.trim()
          : null,

        // Add URLs for each platform where available
        google_url: form.platforms.google
          ? form.platformData.google.url.trim()
          : null,
        facebook_url: form.platforms.facebook
          ? form.platformData.facebook.url.trim()
          : null,

        // Add Facebook page data if available
        facebook_page_id: selectedFacebookPage?.id || null,
        facebook_page_name: selectedFacebookPage?.name || null,
        // Note: We store the access token in a separate table for security
      };

      console.log("Inserting business with data:", payload);

      // Insert the business into the database
      const { data, error: insertError } = await supabase
        .from("companies")
        .insert(payload)
        .select();

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        // Log detailed error information for debugging
        console.error(
          "Error details:",
          JSON.stringify(insertError, Object.getOwnPropertyNames(insertError))
        );
        throw insertError;
      }

      console.log("Business added successfully with ID:", data?.[0]?.id);
      setSuccess("Business added successfully!");

      // If we have a Facebook page with an access token, store it separately
      if (selectedFacebookPage && data?.[0]?.id) {
        const { error: fbError } = await supabase
          .from("facebook_pages")
          .insert({
            company_id: data[0].id,
            user_id: user.id,
            fb_page_id: selectedFacebookPage.id,
            fb_page_name: selectedFacebookPage.name,
            fb_page_access_token: selectedFacebookPage.access_token,
            created_at: new Date().toISOString(),
          });

        if (fbError) {
          console.error("Error saving Facebook page details:", fbError);
          // Continue anyway since the business was created
        }
      }

      // Redirect after a short delay
      setTimeout(() => router.push("/dashboard/businesses"), 1500);
    } catch (err: any) {
      console.error("Error adding business:", err);

      // Try to extract meaningful error information
      let errorMessage = "Failed to add business. Please try again.";

      if (err) {
        if (err.message) {
          errorMessage = err.message;
        } else if (err.error_description) {
          errorMessage = err.error_description;
        } else if (err.details) {
          errorMessage = err.details;
        } else if (typeof err === "object") {
          // Try to stringify the error object for more details
          try {
            const errorObj = JSON.stringify(err, Object.getOwnPropertyNames(err));
            errorMessage = `Database error: ${errorObj}`;
          } catch (jsonErr) {
            console.error("Error stringifying error:", jsonErr);
          }
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle platform toggle
  const handlePlatformToggle = (platform: Platform) => {
    setForm((prev) => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: !prev.platforms[platform],
      },
    }));
  };

  // Handle input changes for platform data
  const handlePlatformInputChange = (
    platform: Platform,
    field: string,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      platformData: {
        ...prev.platformData,
        [platform]: {
          ...prev.platformData[platform],
          [field]: value,
        },
      },
    }));
  };

  // Handle Facebook page selection
  const handleFacebookPageSelected = (page: {
    id: string;
    name: string;
    access_token: string;
  }) => {
    setSelectedFacebookPage(page);
    handlePlatformInputChange("facebook", "pageId", page.id);
    handlePlatformInputChange(
      "facebook",
      "url",
      `https://facebook.com/${page.id}`
    );
    if (!form.platforms.facebook) handlePlatformToggle("facebook");
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Add New Business</h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter business details to start collecting reviews from multiple platforms
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.707 7.293z"
                  clipRule="evenodd"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        {/* Business Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Business Name
          </label>
          <input
            id="name"
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
            placeholder="Enter business name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        {/* Platform Selection - Modified UI */}
        <div>
          <h2 className="text-base font-medium text-gray-900 mb-3">
            Review Platforms
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Google - Always available */}
            <div
              className={`relative rounded-lg border p-4 cursor-pointer ${
                form.platforms.google
                  ? "bg-blue-50 border-blue-300"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => handlePlatformToggle("google")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Google</h3>
                    <p className="text-xs text-gray-500">
                      Import reviews from Google Places
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={form.platforms.google}
                  onChange={() => handlePlatformToggle("google")}
                />
              </div>
            </div>

            {/* Facebook - Available */}
            <div
              className={`relative rounded-lg border p-4 cursor-pointer ${
                form.platforms.facebook
                  ? "bg-indigo-50 border-indigo-300"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => handlePlatformToggle("facebook")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-indigo-600"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      Facebook
                    </h3>
                    <p className="text-xs text-gray-500">
                      Import reviews from Facebook
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={form.platforms.facebook}
                  onChange={() => handlePlatformToggle("facebook")}
                />
              </div>
            </div>

            {/* Trustpilot - Coming Soon */}
            <div className="relative rounded-lg border p-4 bg-gray-50 border-gray-200 opacity-75 cursor-not-allowed">
              <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg text-white">
                COMING SOON
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      Trustpilot
                    </h3>
                    <p className="text-xs text-gray-500">
                      Integration coming soon
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-gray-400 focus:ring-gray-400"
                  disabled
                />
              </div>
            </div>

            {/* Yelp - Coming Soon */}
            <div className="relative rounded-lg border p-4 bg-gray-50 border-gray-200 opacity-75 cursor-not-allowed">
              <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg text-white">
                COMING SOON
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-red-600"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M21.111 18.226c-.094.275-.329.5-.62.5H18.5a.5.5 0 01-.481-.362l-1.907-6.57H12.5a.5.5 0 010-1h3.826c.5 0 1.023.465.957.97l1.28 4.099 1.738-8.836a.5.5 0 01.497-.387 12.204 12.204 0 01-.636 11.323l-.051.263zM3.5 12.5h2.999a.5.5 0 010 1H3.5a.5.5 0 010-1zm3-4h2.999a.5.5 0 010 1H6.5a.5.5 0 010-1zm3 8h2.999a.5.5 0 010 1H9.5a.5.5 0 010-1zm0-4h2.999a.5.5 0 010 1H9.5a.5.5 0 010-1zm0-4h2.999a.5.5 0 010 1H9.5a.5.5 0 010-1z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      Yelp
                    </h3>
                    <p className="text-xs text-gray-500">
                      Integration coming soon
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-gray-400 focus:ring-gray-400"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        {/* Google-specific fields */}
        {form.platforms.google && (
          <div className="border rounded-lg p-5 bg-blue-50 space-y-4">
            <h3 className="text-base font-medium text-blue-700 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
              </svg>
              Google Business Settings
            </h3>

            <div className="bg-white rounded-md border border-blue-200 p-4">
              <label
                htmlFor="googlePlaceId"
                className="block text-sm font-medium text-blue-700"
              >
                Google Place ID
                <span className="ml-2 text-xs font-normal text-blue-600">
                  (
                  <Link
                    href="/dashboard/find-place-id"
                    className="text-blue-700 hover:text-blue-600 hover:underline"
                  >
                    Find my Place ID
                  </Link>
                  )
                </span>
              </label>
              <input
                id="googlePlaceId"
                type="text"
                className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                value={form.platformData.google.placeId}
                onChange={(e) =>
                  handlePlatformInputChange("google", "placeId", e.target.value)
                }
                placeholder="Ex: ChIJN1t_tDeuEmsRUsoyG83frY4"
                required={PLATFORM_CONFIGS.google.idRequired}
              />
              <p className="mt-1 text-xs text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 inline mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                    clipRule="evenodd"
                  />
                </svg>
                Required to automatically retrieve Google reviews
              </p>

              {form.platformData.google.verificationStatus === "searching" && (
                <div className="mt-2 flex items-center text-blue-600">
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-blue-600 rounded-full border-t-transparent"></div>
                  <span className="text-sm">Verifying Place ID...</span>
                </div>
              )}

              {form.platformData.google.verificationStatus === "found" &&
                form.platformData.google.businessInfo && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-md p-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-green-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Business found!
                        </h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>{form.platformData.google.businessInfo.name}</p>
                          <p className="flex items-center mt-1">
                            <span className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.round(
                                      form.platformData.google.businessInfo!.rating
                                    )
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="ml-1 text-sm">
                                {form.platformData.google.businessInfo.rating}
                              </span>
                            </span>
                            <span className="mx-2">•</span>
                            <span>
                              {form.platformData.google.businessInfo.reviewCount}{" "}
                              reviews
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {form.platformData.google.verificationStatus === "not-found" && (
                <div className="mt-2 text-sm text-red-600">
                  This Place ID doesn't seem valid or couldn't be found.
                </div>
              )}
            </div>

            <div className="bg-white rounded-md border border-blue-200 p-4">
              <label
                htmlFor="googleUrl"
                className="block text-sm font-medium text-blue-700"
              >
                Google Business URL (Optional)
              </label>
              <input
                id="googleUrl"
                type="url"
                className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                value={form.platformData.google.url}
                onChange={(e) => handlePlatformInputChange("google", "url", e.target.value)}
                placeholder="https://g.page/your-business"
              />
              <p className="mt-1 text-xs text-blue-600">
                URL to your Google Business profile
              </p>
            </div>
          </div>
        )}

        {/* Facebook-specific fields */}
        {form.platforms.facebook && (
          <div className="border rounded-lg p-5 bg-indigo-50 space-y-4">
            <h3 className="text-base font-medium text-indigo-700 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook Settings
            </h3>

            <div className="bg-white rounded-md border border-indigo-200 p-4">
              {selectedFacebookPage ? (
                <div className="mb-4 p-3 bg-indigo-50 border border-indigo-100 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-indigo-800">
                        {selectedFacebookPage.name}
                      </h4>
                      <p className="text-xs text-indigo-600 mt-1">
                        Connected Facebook Page
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-indigo-600 hover:text-indigo-800"
                      onClick={() => setSelectedFacebookPage(null)}
                    >
                      <span className="sr-only">Remove</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="facebookUrl"
                    className="block text-sm font-medium text-indigo-700"
                  >
                    Connect your Facebook Page
                  </label>
                  <p className="text-xs text-indigo-600 mt-1 mb-3">
                    Connect your Facebook Page to import reviews and respond
                    directly from Kritiqo.
                  </p>
                  <FacebookConnector
                    userId={user?.id || ""}
                    onPageSelected={handleFacebookPageSelected}
                  />
                </div>
              )}

              <div className="mt-4">
                <label
                  htmlFor="facebookUrl"
                  className="block text-sm font-medium text-indigo-700"
                >
                  Facebook Page URL (Optional)
                </label>
                <input
                  id="facebookUrl"
                  type="url"
                  className="mt-1 block w-full rounded-md border-indigo-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                  value={form.platformData.facebook.url}
                  onChange={(e) => handlePlatformInputChange("facebook", "url", e.target.value)}
                  placeholder="https://facebook.com/your-business"
                />
                <p className="mt-1 text-xs text-indigo-600">
                  URL to your Facebook business page
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Trustpilot - Removed input fields, replaced with Coming Soon message */}
        {form.platforms.trustpilot && (
          <div className="border rounded-lg p-5 bg-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-700 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-green-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                </svg>
                Trustpilot Integration
              </h3>
              <span className="bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                COMING SOON
              </span>
            </div>

            <div className="bg-white rounded-md border border-gray-200 p-6 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <h4 className="text-lg font-medium text-gray-700 mb-2">
                Trustpilot Integration Coming Soon
              </h4>
              <p className="text-gray-500 text-sm">
                We're working on integrating Trustpilot reviews into our platform.
                This feature will be available soon!
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-4 pt-4">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            onClick={() => router.push("/dashboard/businesses")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !form.name || !Object.values(form.platforms).some(Boolean)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:bg-blue-300"
          >
            {loading ? "Creating..." : "Create Business"}
          </button>
        </div>
      </form>
    </div>
  );
}
