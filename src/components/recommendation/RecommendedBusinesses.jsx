import { useEffect, useState } from "react";
import API from "../../api/axios";
import BusinessCard from "../business/BusinessCard";

const RecommendedBusinesses = ({ city }) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    if (!city) return;

    try {
      setLoading(true);
      setError(null);

      const res = await API.get("/recommendations", {
        params: { city },
      });

      // ✅ FIX: API RETURNS ARRAY NOW
      setBusinesses(res.data || []);
    } catch (err) {
      console.error("🔥 Recommendation error:", err);
      setError("Failed to load recommendations");
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [city]);

  if (!loading && businesses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-center">
        <h2 className="text-xl font-semibold text-gray-600">
          No recommendations available
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-center">
        <h2 className="text-xl font-semibold text-red-500">{error}</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Recommended for You
      </h2>

      {loading ? (
        <div className="grid md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-72 bg-gray-200 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-4 gap-6">
          {businesses.map((biz) => (
            <BusinessCard key={biz._id} business={biz} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedBusinesses;