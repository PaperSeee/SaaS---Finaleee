"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ReviewFilters from "@/components/businesses/ReviewFilters";
import ReviewCard from "@/components/businesses/ReviewCard";
import { Review, Platform, FilterOptions, Business } from "@/lib/types";

type FiltersState = FilterOptions;

export default async function Page() {
  // Récupération safe de l'`id`
  const params = useParams();
  const businessId = Array.isArray(params.id) ? params.id[0] : params.id!;

  const router = useRouter();
  const { user } = useAuth();

  const [business, setBusiness] = useState<Business>({
    name: "Chargement…",
    rating: 0,
    reviewCount: 0,
    averageRating: 0
  });

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FiltersState>({
    platform: "all",
    rating: 0,
    dateFrom: "",
    dateTo: "",
    sortBy: "date_desc",
    hasResponse: null
  });

  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState<string>("");
  const [currentReviewPlatform, setCurrentReviewPlatform] = useState<Platform | "">("");
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState<{
    loading: boolean;
    error?: string;
    success?: string;
  }>({ loading: false });

  const [limitationsWarning, setLimitationsWarning] = useState<string | null>(null);

  const supabase = createClientComponentClient();

  // Filtrage mémoïsé
  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      if (filters.platform !== "all" && r.platform !== filters.platform) return false;
      if (filters.rating > 0 && r.rating !== filters.rating) return false;
      if (filters.dateFrom && new Date(r.date) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(r.date) > new Date(filters.dateTo)) return false;
      return true;
    });
  }, [reviews, filters]);

  // Extraction du Place ID depuis l’URL
  const extractPlaceIdFromUrl = useCallback(async (googleUrl: string, companyId: string): Promise<string | null> => {
    if (!googleUrl) return null;
    let placeId: string | null = null;

    // … votre logique d’extraction …

    if (placeId) {
      const { error } = await supabase
        .from("companies")
        .update({ place_id: placeId })
        .eq("id", companyId);
      if (error) console.error("MAJ Place ID :", error);
    }
    return placeId;
  }, [supabase]);

  // Chargement des données business + avis
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Récupérer l’entreprise
        const { data: companyData, error: companyError } = await supabase
          .from("companies")
          .select("*")
          .eq("id", businessId)
          .eq("user_id", user.id)
          .single();

        if (companyError || !companyData) {
          throw new Error(companyError?.message || "Entreprise non trouvée");
        }

        // 2) Place ID
        let placeId = companyData.place_id;
        if (!placeId && companyData.google_url) {
          placeId = await extractPlaceIdFromUrl(companyData.google_url, companyData.id);
        }
        if (!placeId) {
          setError("Aucun Place ID trouvé pour cette entreprise.");
          setBusiness({ name: companyData.name, rating: 0, reviewCount: 0, averageRating: 0 });
          return;
        }

        // 3) Appel à votre API d’avis
        const qp = new URLSearchParams({ place_id: placeId });
        if (filters.platform !== "all") qp.append("platform", filters.platform);
        if (filters.rating > 0) qp.append("rating", String(filters.rating));
        if (filters.dateFrom) qp.append("dateFrom", filters.dateFrom);
        if (filters.dateTo) qp.append("dateTo", filters.dateTo);
        if (filters.sortBy !== "date_desc") qp.append("sortBy", filters.sortBy);
        if (filters.hasResponse != null) qp.append("hasResponse", String(filters.hasResponse));

        const res = await fetch(`/api/google-reviews?${qp.toString()}`);
        if (!res.ok) {
          const err = (await res.json()) as { message?: string };
          throw new Error(err.message || res.statusText);
        }
        const json = await res.json() as {
          business?: { rating?: number; reviewCount?: number; averageRating?: number };
          reviews?: Review[];
          limitations?: { message?: string };
        };

        setBusiness({
          name: companyData.name,
          rating: json.business?.rating || 0,
          reviewCount: json.business?.reviewCount || 0,
          averageRating: json.business?.averageRating || 0
        });
        setReviews(json.reviews || []);
        setLimitationsWarning(json.limitations?.message || null);

      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [businessId, user, filters, supabase, extractPlaceIdFromUrl]);

  // Gestion des réponses
  const handleReply = useCallback((id: string, platform: Platform) => {
    setCurrentReviewId(id);
    setCurrentReviewPlatform(platform);
    setReplyText("");
    setReplyStatus({ loading: false });
    setReplyModalOpen(true);
  }, []);

  const closeReplyModal = useCallback(() => {
    setReplyModalOpen(false);
    setCurrentReviewId("");
    setCurrentReviewPlatform("");
    setReplyText("");
  }, []);

  const submitReply = async () => {
    if (!replyText.trim()) return;
    setReplyStatus({ loading: true });
    try {
      const res = await fetch("/api/reviews/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: currentReviewId,
          platform: currentReviewPlatform,
          message: replyText,
          businessId
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur envoi");
      setReplyStatus({ loading: false, success: "Réponse envoyée !" });
      setTimeout(closeReplyModal, 2000);
    } catch (e: any) {
      setReplyStatus({ loading: false, error: e.message });
    }
  };

  return (
    <DashboardLayout>
      {/* …  votre JSX inchangé … */}
    </DashboardLayout>
  );
}
