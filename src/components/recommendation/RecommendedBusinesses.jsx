import { useEffect, useState } from "react";
import API from "../../api/axios";
import { Link } from "react-router-dom";

const RecommendedBusinesses = ({ city }) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH RECOMMENDATIONS =================
  const fetchRecommendations = async () => {
    if (!city) return;

    try {
      setLoading(true);
      const res = await API.get("/recommendations", { params: { city } });
      setBusinesses(res?.data || []);
    } catch (err) {
      console.error("Recommendation error:", err);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD =================
  useEffect(() => {
    fetchRecommendations();
  }, [city]);

  // ================= EMPTY =================
  if (!loading && businesses.length === 0) return null;

  // ================= UI =================
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Recommended for You</h2>

      {/* Loading skeleton */}
      {loading ? (
        <div className="grid md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-60 sm:h-64 md:h-72 bg-gray-200 animate-pulse rounded-xl shadow"
            />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-4 gap-6">
          {businesses.map((biz) => (
            <Link
              key={biz._id}
              to={`/business/${biz._id}`}
              className="border rounded-lg overflow-hidden hover:shadow-md transition"
            >
              <img
                src={biz.image || biz.logo || "/no-image.png"}
                alt={biz.name}
                className="h-36 w-full object-cover"
              />
              <div className="p-3">
                <h3 className="font-semibold text-sm">{biz.name}</h3>
                <p className="text-xs text-gray-500">📍 {biz.city}</p>
                <p className="text-yellow-500 text-sm">⭐ {biz.rating || 0}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedBusinesses;