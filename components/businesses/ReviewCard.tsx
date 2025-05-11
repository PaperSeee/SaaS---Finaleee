import { Review } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { memo } from 'react';
import Image from 'next/image';

interface ReviewCardProps {
  review: Review;
  onReply: () => void;
}

// Memoize the component to prevent unnecessary re-renders
export default memo(function ReviewCard({ review, onReply }: ReviewCardProps) {
  // Afficher la date relative si disponible, sinon calculer à partir de la date
  const displayDate = review.relativeTimeDescription || 
    formatDistanceToNow(new Date(review.date), { 
      addSuffix: true,
      locale: fr 
    });

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow transition-shadow hover:shadow-md">
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-2">
          {review.profilePhoto ? (
            <div className="mr-3 flex-shrink-0">
              <Image 
                src={review.profilePhoto} 
                alt={`Photo de ${review.author}`} 
                width={40}
                height={40}
                className="rounded-full"
                loading="lazy"
              />
            </div>
          ) : null}
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
              <div>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {review.author}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-xs text-gray-500 whitespace-nowrap">{displayDate}</span>
                  {review.language && (
                    <span className="ml-1 text-xs text-gray-500">({review.language})</span>
                  )}
                </div>
              </div>
              
              <div className="mt-1 sm:mt-0">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {review.platform === "google" ? "Google" : "Facebook"}
                </span>
              </div>
            </div>
            
            <div className="mt-3 text-sm text-gray-700 whitespace-pre-line">
              {review.content}
            </div>
            
            {review.response && (
              <div className="mt-4 rounded-md bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-700">Votre réponse:</p>
                <p className="mt-1 text-sm text-gray-600 break-words">{review.response.content}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {formatDistanceToNow(new Date(review.response.date), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </p>
              </div>
            )}
            
            {!review.response && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={onReply}
                  className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-500"
                >
                  <svg
                    className="mr-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                  </svg>
                  Répondre
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
