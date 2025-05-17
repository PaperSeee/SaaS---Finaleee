"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AddDashboardPage() {
  const searchParams = useSearchParams();

  // récup params
  const placeidParam = searchParams.get("placeId");
  const nameParam = searchParams.get("name");

  const [name, setName] = useState(nameParam || "");
  const [placeId, setPlaceId] = useState(placeidParam || "");
  const [placeIdStatus, setPlaceIdStatus] = useState<{
    status: "idle" | "searching" | "found" | "not-found";
    placeId?: string;
    businessInfo?: { name: string; rating: number; reviewCount: number };
  }>({
    status: placeidParam ? "found" : "idle",
    placeId: placeidParam || undefined,
  });

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* ...existing form JSX... */}
    </div>
  );
}
