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
    slug,
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

  // ✅ SAFE SLUG
  const safeSlug = slug || _id;
  if (!safeSlug) return null;

  // ✅ WHATSAPP NUMBER FIX (IMPORTANT)
  const whatsappNumber = (business.whatsapp || phone)?.replace(/\D/g, "");

  const getKeywordFromURL = () => {
    const params = new URLSearchParams(location.search);
    return params.get("q") || "";
  };

  // ================= TRACK CLICK =================
  const handleBusinessClick = async () => {
    try {
      const keyword = getKeywordFromURL();

      await API.post(`/business/${_id}/click`, {
        keyword,
        city: city || businessCity || null,
      });
    } catch (err) {
      console.error("Click tracking failed:", err);
    }
  };

  // ================= CALL =================
  const handleCall = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!phone) return;

    window.location.href = `tel:${phone}`;
    API.put(`/business/${_id}/phone`).catch(() => {});
  };

  // ================= WHATSAPP =================
  const handleWhatsApp = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!whatsappNumber) return;

    window.open(`https://wa.me/91${whatsappNumber}`, "_blank");
    API.put(`/business/${_id}/whatsapp`).catch(() => {});
  };

  return (
    <Link
      to={`/business/${safeSlug}`}
      onClick={handleBusinessClick}
      className="group bg-white rounded-2xl overflow-hidden border hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* ================= IMAGE ================= */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={image || "https://via.placeholder.com/400x250?text=ServDial"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* BADGES */}
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

      {/* ================= CONTENT ================= */}
      <div className="p-4 flex flex-col flex-1">

        <h2 className="text-md font-semibold text-gray-800 line-clamp-1">
          {name}
        </h2>

        <p className="text-sm text-gray-500">{category}</p>

        <div className="flex items-center text-xs text-gray-400 mt-1">
          <MapPin size={14} className="mr-1" />
          {businessCity}
        </div>

        {/* ================= RATING ================= */}
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

        {/* ================= ACTION BUTTONS ================= */}
        <div className="flex gap-2 mt-4">

          {/* CALL */}
          {phone && (
            <button
              onClick={handleCall}
              className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Phone size={16} /> Call
            </button>
          )}

          {/* WHATSAPP */}
          {whatsappNumber && (
            <button
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white text-sm py-2 rounded-lg hover:bg-green-700 transition"
            >
              <MessageCircle size={16} /> WhatsApp
            </button>
          )}

        </div>

      </div>
    </Link>
  );
};

export default BusinessCard;