import { useContext } from "react";
import { CityContext } from "../../context/CityContext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import BusinessCard from "../business/BusinessCard";

const FeaturedBusinesses = ({ businesses = [], loading = false }) => {
  const { user } = useContext(AuthContext);
  const { selectedCity } = useContext(CityContext);
  const navigate = useNavigate();
  const isAdmin = ["admin", "superadmin"].includes(user?.role);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-60 sm:h-64 md:h-72 bg-gray-200 animate-pulse rounded-xl shadow" />
        ))}
      </div>
    );
  }

  if (!businesses.length) {
  return (
    <p className="text-gray-500 text-center">
      No featured businesses found in{" "}
      <span className="font-semibold">
        {selectedCity?.name ?? "this city"}
      </span>
      . Try refreshing or selecting another city.
    </p>
  );
}

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {businesses.map((b) => (
        <BusinessCard
          key={b._id}
          business={b}
          onClick={() => navigate(`/business/${b.slug}`)}
          showCallButton
        />
      ))}

      {isAdmin && (
        <p className="mt-4 text-xs text-gray-400 italic col-span-full">
          Admin view
        </p>
      )}
    </div>
  );
};

export default FeaturedBusinesses;