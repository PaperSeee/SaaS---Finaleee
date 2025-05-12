import React from "react";
import { Review, Platform, PLATFORM_CONFIGS } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import Image from 'next/image';

interface ReviewCardProps {
  review: Review;
  onReply: () => void;
}

export default function ReviewCard({ review, onReply }: ReviewCardProps) {
  // Format display date
  const formattedDate = formatDate(review.date);
  
  // Generate star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Generate platform badge with appropriate styling based on the platform
  const getPlatformBadge = (platform: Platform) => {
    const config = PLATFORM_CONFIGS[platform];
    const badgeClass = `flex items-center rounded-full bg-${config.color}-50 text-xs text-${config.color}-700 px-2 py-0.5`;
    
    // Platform-specific icon components
    const icons = {
      google: (
        <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 11h8.53c.12.71.19 1.43.19 2.17 0 5.71-3.83 9.83-8.72 9.83-5 0-9-4.03-9-9s4-9 9-9c2.45 0 4.66.98 6.3 2.62L15.59 6c-1.05-1-2.45-1.67-4.09-1.67-3.45 0-6.3 2.79-6.3 6.25s2.85 6.25 6.3 6.25c3.14 0 5.2-1.37 5.74-4H12V11z" />
        </svg>
      ),
      facebook: (
        <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      trustpilot: (
        <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.36 12H10.8l-2.4 7.2H4.8l9.6-19.2L20.36 12z" />
        </svg>
      ),
      yelp: (
        <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.16 12.5c-.41-.72-1.12-1.24-1.92-1.43-.8-.19-1.65.03-2.29.59l-2.36 2.11c-.12-.26-.22-.52-.22-.79 0-.75.42-1.46.42-2.21 0-1.19-.87-2.19-2.03-2.38-.14-.02-.28-.03-.43-.03-.24 0-.47.03-.7.08-.77.17-1.42.63-1.85 1.28-.43.65-.59 1.45-.45 2.2l.85 4.31c-.31-.12-.6-.3-.84-.53-.57-.55-.87-1.31-.83-2.08.03-.76.39-1.49.97-1.98.11-.1.14-.26.06-.39-.07-.13-.22-.2-.37-.17-.78.14-1.49.55-2.03 1.16-.54.61-.84 1.37-.84 2.17 0 .88.34 1.72.95 2.34.61.62 1.43.96 2.31.96h.12l5.36-.55c.12-.01.24-.04.35-.08.78-.28 1.34-.92 1.53-1.72.18-.77 0-1.6-.5-2.2l-.27-.47c-.04-.07-.02-.17.05-.22l2.97-2.1c.14-.1.29-.15.44-.15.12 0 .24.03.35.09.26.15.43.4.46.69.03.29-.07.58-.29.77l-3.64 3.25c-.04.04-.06.09-.06.14 0 .06.02.11.06.14.04.04.09.06.14.06.06 0 .11-.02.14-.05l3.64-3.25c.39-.35.63-.83.67-1.34.04-.52-.12-1.03-.45-1.43z" />
        </svg>
      )
    };

    return (
      <span className={badgeClass}>
        {icons[platform]}
        {config.name}
      </span>
    );
  };

  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between">
          <div className="flex items-start">
            {review.profilePhoto ? (
              <Image 
                src={review.profilePhoto} 
                alt={review.author} 
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
            ) : (
              <div className="h-10 w-10 rounded-full mr-3 bg-gray-200 flex items-center justify-center text-gray-500">
                {review.author.charAt(0).toUpperCase()}
              </div>
            )}
            
            <div>
              <div className="font-medium text-gray-900">{review.author}</div>
              <div className="text-sm text-gray-500 mt-0.5 flex items-center flex-wrap gap-2">
                <time dateTime={review.date}>{String(formattedDate)}</time>
                <span className="hidden sm:inline">•</span> 
                {getPlatformBadge(review.platform)}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {renderStars(review.rating)}
          </div>
        </div>
        <div className="mt-4 text-gray-700 whitespace-pre-line">
          {review.content}
        </div>
        
        {review.response && (
          <div className="mt-4 pl-4 border-l-2 border-blue-200">
            <div className="text-sm font-medium text-blue-700">Your response:</div>
            <div className="mt-1 text-sm text-gray-600">
              {review.response.content}
            </div>
            <div className="mt-1 text-xs text-gray-400">
              {String(formatDate(review.response.date))}
            </div>
          </div>
        )}
        
        {!review.response && (
          <div className="mt-4">
            <button
              onClick={onReply}
              className="inline-flex items-center rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Reply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
