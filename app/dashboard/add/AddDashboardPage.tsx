"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function AddDashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { user } = useAuth();

  // récup params
  const placeidParam = searchParams.get("placeId");
  const nameParam = searchParams.get("name");

  const [name, setName] = useState(nameParam || "");
  const [googleUrl, setGoogleUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [placeId, setPlaceId] = useState(placeidParam || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeIdStatus, setPlaceIdStatus] = useState<{
    status: "idle" | "searching" | "found" | "not-found";
    placeId?: string;
    businessInfo?: { name: string; rating: number; reviewCount: number };
  }>({
    status: placeidParam ? "found" : "idle",
    placeId: placeidParam || undefined,
  });

  // ...existing fetchPlaceId, extractBusinessNameFromUrl, useEffect(verifyPlaceId), handleSubmit...
  // copiez ici tout le code client présent dans l'ancien page.tsx
  // en vous assurant de ne pas importer DashboardLayout

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* ...existing form JSX from AddCompany fonction... */}
    </div>
  );
}
