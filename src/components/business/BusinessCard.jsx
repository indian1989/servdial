// src/components/business/BusinessCard.jsx

import { Link, useLocation } from "react-router-dom";
import { Phone, MapPin, Star, MessageCircle } from "lucide-react";
import API from "../../api/axios";
import { useCity } from "../../context/CityContext";
import { normalizeBusiness } from "../../utils/normalizeBusiness";

const BusinessCard = ({ business }) => {
  if (!business) return null;

  const location = useLocation();
  const { city } = useCity();

  const b = normalizeBusiness(business);

  const {
    _id,
    name,
    image,
    category,
    city: businessCity,
    rating,
    reviewCount,
    phone,
    isFeatured,
    isVerified,
    distance,
    isNew,
  } = b;

  const getKeywordFromURL = () => {
    const params = new URLSearchParams(location.search);
    return params.get("q") || "";
  };

  const handleBusinessClick = async () => {
    try {
      const keyword = getKeywordFromURL();

      await API.post(`/business/${_id}/click`, {
        keyword,
        city: city || businessCity || null,
      });
    } catch {}
  };

  const handleCall = (e) => {
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    window.open(`https://wa.me/${phone}`, "_blank");
  };

  return (
    <Link
      to={`/business/${_id}`}
      onClick={handleBusinessClick}
      className="group bg-white rounded-2xl overflow-hidden border hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* IMAGE */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={image || "https://via.placeholder.com/400x250?text=ServDial"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
          {isFeatured && (
            <span className="bg-yellow-400 text-xs px-2 py-1 rounded-full font-semibold shadow">
              ⭐ Featured
            </span>
          )}

          {isVerified && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow">
              ✔ Verified
            </span>
          )}

          {isNew && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow">
              New
            </span>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-md font-semibold text-gray-800 line-clamp-1">
          {name}
        </h2>

        <p className="text-sm text-gray-500">{category}</p>

        <div className="flex items-center text-xs text-gray-400 mt-1">
          <MapPin size={14} className="mr-1" />
          {businessCity}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center text-sm font-medium text-gray-700">
            <Star size={14} className="text-yellow-500 mr-1" />

            {rating > 0 ? (
              <>
                {rating.toFixed(1)}
                {reviewCount > 0 && (
                  <span className="text-gray-400 text-xs ml-1">
                    ({reviewCount})
                  </span>
                )}
              </>
            ) : isNew ? (
              <span className="text-blue-500 text-xs font-semibold">
                New
              </span>
            ) : (
              <span className="text-gray-400 text-xs">
                No ratings
              </span>
            )}
          </div>

          {distance !== null && (
            <span className="text-xs text-gray-400">
              {distance} km
            </span>
          )}
        </div>

        <div className="flex-grow" />

        {/* ACTION BUTTONS (ALWAYS SAME) */}
        <div className="flex gap-2 mt-4">
          {phone && (
            <button
              onClick={handleCall}
              className="flex-1 flex items-center justify-center gap-1 text-sm bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              <Phone size={14} />
              Call
            </button>
          )}

          {phone && (
            <button
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-1 text-sm bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              <MessageCircle size={14} />
              WhatsApp
            </button>
          )}

          <button
            onClick={(e) => e.stopPropagation()}
            className="flex-1 text-sm border py-2 rounded-lg hover:bg-gray-100"
          >
            View
          </button>
        </div>
      </div>
    </Link>
  );
};

export default BusinessCard;