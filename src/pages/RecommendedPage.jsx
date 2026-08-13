import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import BusinessCard from "../components/business/BusinessCard";

const RecommendedPage = () => {
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city");

  const formattedCity = city
  ? (() => {
    const [cityName, district, state] = city
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1));

    return `${cityName}, ${district}, ${state}`;
    })()
    : "";

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/recommendations", {
          params: { city },
        });

        setBusinesses(res.data?.data || []);
      } catch (err) {
        console.error("Recommendation page error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Recommended Businesses
          </h1>

          <p className="text-gray-600 mt-3">
            {formattedCity
            ? `Top recommended businesses in ${formattedCity}`
            : "Discover top local businesses near you"}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-72 bg-white rounded-2xl shadow-sm animate-pulse"
              />
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
            <div className="text-5xl mb-4">📍</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No recommendations found
            </h2>
            <p className="text-gray-500">
              Try another city or check back later.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{businesses.length}</span> recommended businesses
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {businesses.map((biz) => (
                <BusinessCard key={biz._id} business={biz} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecommendedPage;