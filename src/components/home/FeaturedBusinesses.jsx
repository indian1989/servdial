// src/components/home/FeaturedBusinesses.jsx
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const FeaturedBusinesses = ({ businesses = [], loading = false }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const currentUserRole = user?.role || "user";
  const isAdmin = currentUserRole === "admin" || currentUserRole === "superadmin";

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-60 bg-gray-200 animate-pulse rounded-xl shadow"
          />
        ))}
      </div>
    );
  }

  // Empty state
  if (!businesses || businesses.length === 0) {
    return (
      <p className="text-gray-500 text-center">
        No featured businesses found in this city.
      </p>
    );
  }

  // Render business cards
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {businesses.map((business) => {
        let locationText = "Unknown location";
        if (business.location) {
          if (business.location.coordinates) {
            locationText = `${business.location.coordinates[1]}, ${business.location.coordinates[0]}`;
          } else if (typeof business.location === "string") {
            locationText = business.location;
          } else if (business.location.name) {
            locationText = business.location.name;
          }
        }

        return (
          <div
            key={business._id || business.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden cursor-pointer"
            onClick={() => navigate(`/business/${business._id}`)}
          >
            <img
              src={business.image || "https://via.placeholder.com/400x250"}
              alt={business.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-2">{business.name}</h3>
              <p className="text-sm text-gray-500 mb-1">{business.category}</p>
              <p className="text-sm text-gray-500 mb-3">{locationText}</p>
              {isAdmin && (
                <p className="mt-2 text-xs text-gray-400 italic">
                  Admin view
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeaturedBusinesses;