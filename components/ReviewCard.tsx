import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Review } from "@/lib/types";

interface ReviewCardProps {
  review: Review;
  onReply: () => void;
}

export default function ReviewCard({ review, onReply }: ReviewCardProps) {
  // Format date en français
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
  };

  // Obtenir l'icône de la plateforme
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "google":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            className="fill-current text-gray-500"
          >
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
        );
      case "facebook":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            className="fill-current text-gray-500"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        );
      case "trustpilot":
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            className="fill-current text-gray-500"
          >
            <path d="M20.36 12H10.8l-2.4 7.2H4.8l9.6-19.2L20.36 12z" />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className="fill-current text-gray-500"
          >
            <path d="M10 20.5c0-.829-.672-1.5-1.5-1.5s-1.5.671-1.5 1.5c0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5zm3.5-1.5c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zm4.5-5H10v-1h8v1zm-1-4H9V1h8v9z" />
          </svg>
        );
    }
  };

  // Obtenir la couleur du badge de la plateforme
  const getPlatformBadgeColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "google":
        return "bg-red-50 text-red-700";
      case "facebook":
        return "bg-blue-50 text-blue-700";
      case "trustpilot":
        return "bg-green-50 text-green-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-medium">
              {review.author.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-medium">{review.author}</h3>
            <div className="flex items-center text-xs text-gray-500 mt-0.5">
              <span>{formatDate(review.date)}</span>
              <span className="mx-2">•</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getPlatformBadgeColor(review.platform)}`}>
                {getPlatformIcon(review.platform)}
                {review.platform.charAt(0).toUpperCase() + review.platform.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`h-4 w-4 ${
                i < review.rating ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>

      <p className="mt-4 text-gray-700">{review.content}</p>
      
      <div className="mt-5 flex justify-end">
        <button
          onClick={onReply}
          className="rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
        >
          Répondre
        </button>
      </div>
    </div>
  );
}
