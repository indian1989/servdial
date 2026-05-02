import { useNavigate } from "react-router-dom";
import BusinessCard from "../business/BusinessCard";

const NearbyBusinesses = ({
  businesses = [],
  userLocation = null,
  loading = false,
}) => {
  const navigate = useNavigate();

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-60 sm:h-64 md:h-72 bg-gray-200 animate-pulse rounded-xl shadow"
          />
        ))}
      </div>
    );
  }

  // ================= LOCATION NOT AVAILABLE =================
  if (!userLocation?.lat || !userLocation?.lng) {
    return (
      <div className="text-center text-gray-500 py-10">
        Enable location to see nearby businesses
      </div>
    );
  }

  // ================= NO DATA =================
  if (!businesses.length) {
    return (
      <div className="text-center text-gray-500 py-10">
        No nearby businesses found in your area
      </div>
    );
  }

  // ================= DATA =================
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {businesses.map((b) => (
        <BusinessCard
          key={b._id}
          business={b}
          onClick={() => navigate(`/business/${b.slug}`)} // ✅ FIXED ROUTE
          showCallButton
          userLocation={userLocation}
        />
      ))}
    </div>
  );
};

export default NearbyBusinesses;