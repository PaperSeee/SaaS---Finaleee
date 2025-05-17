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

  // temporaire : on commente tout le formulaire bloquant
  return (
    <div className="px-4 py-6">
      Add Business page temporarily disabled.
    </div>
  );
}
