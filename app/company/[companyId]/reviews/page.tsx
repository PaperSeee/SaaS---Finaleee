import { Review } from "@/lib/types";

export default async function CompanyReviewsPage({ params }: { params: { companyId: string } }) {
  const { companyId } = params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/reviews/${companyId}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching reviews: ${response.status}`);
    }

    const data = await response.json();
    const { companyName, reviews } = data;

    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">{companyName} Reviews</h1>

        {reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review: Review) => (
              <div key={review.id} className="border p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  {review.profilePhoto && (
                    <img
                      src={review.profilePhoto}
                      alt={review.author}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{review.author}</h3>
                    <div className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="mb-2">Rating: {review.rating}/5</div>
                <p className="text-gray-700">{review.content}</p>

                {review.response && (
                  <div className="mt-3 pl-4 border-l-2 border-gray-300">
                    <p className="text-sm font-medium">Response:</p>
                    <p className="text-sm text-gray-600">
                      {review.response.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews found for this company.</p>
        )}
      </div>
    );
  } catch (error) {
    console.error("Failed to load reviews:", error);
    return <div>Error loading reviews. Please try again later.</div>;
  }
}
