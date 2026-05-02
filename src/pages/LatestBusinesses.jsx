import { useEffect, useState } from "react";
import API from "../api/axios";
import { useCity } from "../context/CityContext";
import BusinessCard from "../components/business/BusinessCard";

const LatestBusinesses = () => {
  const { city } = useCity();

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!city?.slug) return;

    const fetchBusinesses = async () => {
      setLoading(true);

      try {
        const res = await API.get("/businesses/latest", {
          params: {
            city: city.slug, // ✅ ID-FIRST FLOW
            limit: 12,
          },
        });

        setBusinesses(res?.data?.data || []);
      } catch (err) {
        console.error("❌ Latest fetch error:", err);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [city]);

  return (
    <section className="max-w-7xl mx-auto px-4 mt-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">
          Latest Businesses in {city?.name || "your area"}
        </h1>
        <p className="text-gray-500 mt-2">
          Newly added businesses on ServDial
        </p>
      </div>

      {/* ================= LOADING ================= */}
      {loading ? (
        <div className="text-center py-10 text-gray-400 animate-pulse">
          Loading latest businesses...
        </div>
      ) : businesses.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          No businesses found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((biz) => (
            <BusinessCard key={biz._id} business={biz} />
          ))}
        </div>
      )}
    </section>
  );
};

export default LatestBusinesses;