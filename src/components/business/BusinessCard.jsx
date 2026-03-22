import { Link } from "react-router-dom";
import { Phone, MapPin, Star } from "lucide-react";

const BusinessCard = ({ business }) => {
  return (
    <Link
      to={`/business/${business._id}`}
      className="group bg-white rounded-2xl overflow-hidden border hover:shadow-xl transition-all duration-300"
    >
      {/* IMAGE */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={
            business.image ||
            "https://via.placeholder.com/400x250?text=ServDial"
          }
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />

        {/* OVERLAY BADGES */}
        <div className="absolute top-2 left-2 flex gap-2">
          {business.isFeatured && (
            <span className="bg-yellow-400 text-xs px-2 py-1 rounded-full font-medium">
              Featured
            </span>
          )}
          {business.isVerified && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Verified
            </span>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        {/* NAME */}
        <h2 className="text-md font-semibold text-gray-800 line-clamp-1">
          {business.name}
        </h2>

        {/* CATEGORY */}
        <p className="text-sm text-gray-500">
          {business.category}
        </p>

        {/* LOCATION */}
        <div className="flex items-center text-xs text-gray-400 mt-1">
          <MapPin size={14} className="mr-1" />
          {business.city}
        </div>

        {/* RATING */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center text-sm font-medium">
            <Star size={14} className="text-yellow-500 mr-1" />
            {business.rating || "New"}
          </div>

          {/* DISTANCE */}
          {business.distance && (
            <span className="text-xs text-gray-400">
              {business.distance} km
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="flex gap-2 mt-4">
          {business.phone && (
            <a
              href={`tel:${business.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1 text-sm bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 transition"
            >
              <Phone size={14} />
              Call
            </a>
          )}

          <button
            onClick={(e) => e.stopPropagation()}
            className="flex-1 text-sm border py-1.5 rounded-lg hover:bg-gray-100 transition"
          >
            View
          </button>
        </div>
      </div>
    </Link>
  );
};

export default BusinessCard;