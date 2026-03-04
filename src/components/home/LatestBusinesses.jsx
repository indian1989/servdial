import { FaStar } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import PaidFeatureNotice from "../common/PaidFeatureNotice";

const LatestBusinesses = ({ businesses = [] }) => {
  const { user } = useContext(AuthContext);
  const userRole = user?.role || "user";

  const isAdmin = userRole === "admin" || userRole === "superadmin";

  return (
    <section className="py-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          Latest Businesses
        </h2>

        {businesses.length === 0 && (
          <p className="text-center text-gray-500">
            No latest businesses available.
          </p>
        )}

        {businesses.length > 0 && isAdmin ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {businesses.map((business) => (
              <div
                key={business._id || business.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={business.image || "https://via.placeholder.com/400x250"}
                  alt={business.name}
                  className="w-full h-48 object-cover"
                />

                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2 truncate">
                    {business.name}
                  </h3>

                  <p className="text-sm text-gray-500 mb-1 truncate">
                    {business.category}
                  </p>

                  <p className="text-sm text-gray-500 mb-3 truncate">
                    {business.location}
                  </p>

                  <div className="flex items-center mb-4">
                    <FaStar className="text-yellow-400 mr-2" />
                    <span className="text-sm font-medium">{business.rating}</span>
                  </div>

                  <button
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    aria-label={`View details of ${business.name}`}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <PaidFeatureNotice />
        )}
      </div>
    </section>
  );
};

export default LatestBusinesses;