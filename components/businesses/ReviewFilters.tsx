import { useState } from "react";
import { FilterOptions, Platform, PLATFORM_CONFIGS } from "@/lib/types";

interface ReviewFiltersProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  availablePlatforms?: Platform[];
  showGoogleLimitationWarning?: boolean;
}

export default function ReviewFilters({ 
  filters, 
  setFilters, 
  availablePlatforms = ["google", "facebook", "trustpilot", "yelp"],
  showGoogleLimitationWarning = true 
}: ReviewFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Update filter values
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) || 0 : 
              name === "hasResponse" ? value === "yes" ? true : value === "no" ? false : null : 
              value,
    }));
  };

  // Reset all filters
  const handleReset = () => {
    setFilters({
      platform: "all",
      rating: 0,
      dateFrom: "",
      dateTo: "",
      sortBy: "date_desc",
      hasResponse: null
    });
  };

  return (
    <div className="w-full">
      {showGoogleLimitationWarning && filters.platform === "google" && (
        <div className="mb-4 rounded-md bg-amber-50 border border-amber-200 p-4 text-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-amber-700">
                <span className="font-medium">Google Places API Limitation:</span> Google only allows displaying a limited number of reviews (max 5). To see all your reviews, visit your Google Business profile directly.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <div className="flex flex-wrap gap-3">
          {/* Platform Filter */}
          <div className="w-full sm:w-auto">
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
              Platform
            </label>
            <select
              id="platform"
              name="platform"
              value={filters.platform}
              onChange={handleFilterChange}
              className="w-full sm:w-auto rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="all">All Platforms</option>
              {availablePlatforms.map(platform => (
                <option key={platform} value={platform}>
                  {PLATFORM_CONFIGS[platform].name}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div className="w-full sm:w-auto">
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <select
              id="rating"
              name="rating"
              value={filters.rating}
              onChange={handleFilterChange}
              className="w-full sm:w-auto rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="0">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="w-full sm:w-auto">
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="w-full sm:w-auto rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="rating_desc">Highest Rating</option>
              <option value="rating_asc">Lowest Rating</option>
            </select>
          </div>

          {/* Has Response Filter */}
          <div className="w-full sm:w-auto">
            <label htmlFor="hasResponse" className="block text-sm font-medium text-gray-700 mb-1">
              Response Status
            </label>
            <select
              id="hasResponse"
              name="hasResponse"
              value={filters.hasResponse === true ? "yes" : filters.hasResponse === false ? "no" : "all"}
              onChange={handleFilterChange}
              className="w-full sm:w-auto rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="all">All Reviews</option>
              <option value="yes">Responded</option>
              <option value="no">Not Responded</option>
            </select>
          </div>
        </div>

        <div className="flex items-center mt-4 sm:mt-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            {isExpanded ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Less Filters
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                More Filters
              </>
            )}
          </button>
          
          <button
            onClick={handleReset}
            className="ml-6 text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="pt-3 border-t border-gray-200 mt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {Object.values(filters).some(value => 
        (typeof value === 'string' && value !== 'all' && value !== '') || 
        (typeof value === 'number' && value !== 0) ||
        (value !== null && typeof value === 'boolean')
      ) && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">Active filters:</span>
          {filters.platform !== "all" && (
            <span className={`inline-flex items-center rounded-full bg-${PLATFORM_CONFIGS[filters.platform as Platform].color}-100 px-2.5 py-0.5 text-xs font-medium text-${PLATFORM_CONFIGS[filters.platform as Platform].color}-800`}>
              Platform: {PLATFORM_CONFIGS[filters.platform as Platform].name}
            </span>
          )}
          {filters.rating > 0 && (
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
              Rating: {filters.rating}★
            </span>
          )}
          {filters.dateFrom && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              From: {new Date(filters.dateFrom).toLocaleDateString()}
            </span>
          )}
          {filters.dateTo && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              To: {new Date(filters.dateTo).toLocaleDateString()}
            </span>
          )}
          {filters.hasResponse !== null && (
            <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
              {filters.hasResponse ? 'Responded' : 'Not Responded'}
            </span>
          )}
          {filters.sortBy !== 'date_desc' && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
              Sort: {filters.sortBy.replace('_', ' ')}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
