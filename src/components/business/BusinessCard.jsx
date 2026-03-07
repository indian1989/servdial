import { Link } from "react-router-dom";

const BusinessCard = ({ business }) => {
  return (
    <Link
      to={`/business/${business._id}`}
      className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition duration-300"
    >
      {/* Image */}
      {business.image && (
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-44 object-cover"
        />
      )}

      {/* Content */}
      <div className="p-4">

        {/* Business Name */}
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          {business.name}
        </h2>

        {/* Category */}
        <p className="text-sm text-gray-500">
          {business.category}
        </p>

        {/* Rating */}
        <p className="text-yellow-500 text-sm mt-1">
          ⭐ {business.rating || "New"}
        </p>

        {/* Phone */}
        {business.phone && (
          <p className="text-blue-600 text-sm mt-2">
            📞 {business.phone}
          </p>
        )}

        {/* Address */}
        {business.address && (
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            📍 {business.address}
          </p>
        )}

      </div>
    </Link>
  );
};

export default BusinessCard;