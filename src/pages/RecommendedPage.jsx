import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import BusinessCard from "../components/business/BusinessCard";

const RecommendedPage = () => {
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city");

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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Recommended Businesses
      </h1>

      {loading ? (
        <div className="grid md:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-72 bg-gray-200 animate-pulse rounded-2xl" />
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

export default RecommendedPage;