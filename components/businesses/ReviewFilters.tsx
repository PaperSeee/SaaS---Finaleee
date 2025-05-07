import { useState } from "react";
import { Platform } from "@/lib/types";

interface FiltersState {
  platform: Platform | "all";
  rating: number;
  dateFrom: string;
  dateTo: string;
}

interface ReviewFiltersProps {
  filters: FiltersState;
  setFilters: (filters: FiltersState) => void;
}

export default function ReviewFilters({ filters, setFilters }: ReviewFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      platform: e.target.value as Platform | "all",
    });
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      rating: parseInt(e.target.value),
    });
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      dateFrom: e.target.value,
    });
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      dateTo: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      platform: "all",
      rating: 0,
      dateFrom: "",
      dateTo: "",
    });
  };

  return (
    <div className="rounded-lg border bg-background p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Filters</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          {isExpanded ? "Hide filters" : "Show filters"}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="platform" className="block text-sm font-medium">
              Platform
            </label>
            <select
              id="platform"
              value={filters.platform}
              onChange={handlePlatformChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="all">All Platforms</option>
              <option value="google">Google</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium">
              Rating
            </label>
            <select
              id="rating"
              value={filters.rating}
              onChange={handleRatingChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="0">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div>
            <label htmlFor="dateFrom" className="block text-sm font-medium">
              From Date
            </label>
            <input
              id="dateFrom"
              type="date"
              value={filters.dateFrom}
              onChange={handleDateFromChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="dateTo" className="block text-sm font-medium">
              To Date
            </label>
            <input
              id="dateTo"
              type="date"
              value={filters.dateTo}
              onChange={handleDateToChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
