import { useEffect, useState } from "react";
import API from "../../api/axios";

const ProviderReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await API.get("/reviews/provider");
      setReviews(res.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Reviews</h1>

      {loading && <p>Loading reviews...</p>}

      {!loading && reviews.length === 0 && (
        <p>No reviews received yet.</p>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="border p-4 rounded bg-white">
            <h3 className="font-semibold">
              {review.business?.name}
            </h3>

            <p className="text-yellow-500">
              ⭐ {review.rating} / 5
            </p>

            <p className="text-gray-700">
              {review.comment}
            </p>

            <p className="text-sm text-gray-500">
              — {review.user?.name || "Anonymous"}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              {new Date(review.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProviderReviews;