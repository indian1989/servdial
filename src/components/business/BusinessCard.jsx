import { Link, useLocation } from "react-router-dom";
import { Phone, MapPin, Star, MessageCircle } from "lucide-react";
import { memo } from "react";

import API from "../../api/axios";
import { toBusinessDTO } from "../../dto/businessDTO";

const BusinessCard = ({ business }) => {
  if (!business) return null;

  const location = useLocation();

  // ✅ SAFE DTO
  const b = toBusinessDTO(business) || {};

  const {
    _id,
    slug,
    name = "Business",
    image,
    categoryName = "",
    cityName = "",
    citySlug,
    categorySlug,
    rating = 0,
    reviewCount = 0,
    phone,
    whatsapp,
    isFeatured,
    isVerified,
    distance,
    views = 0,
    phoneClicks = 0,
    whatsappClicks = 0,
  } = b;

  if (!_id || !slug) return null;

  // ✅ SAFE ROUTING (STRICT)
  const safeCitySlug = citySlug || "india";
  const safeCategorySlug = categorySlug || "services";

  // ✅ CLEAN PHONE
  const cleanNumber = (whatsapp || phone || "").replace(/\D/g, "");

  // ================= CLICK TRACK =================
  const handleBusinessClick = async () => {
    try {
      const keyword =
        new URLSearchParams(location.search).get("q") || "";

      await API.post(`/businesses/${_id}/click`, { keyword });
    } catch {}
  };

  // ================= CALL =================
  const handleCall = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!phone) return;

    window.location.href = `tel:${phone}`;

    try {
      await API.put(`/businesses/${_id}/phone`);
    } catch {}
  };

  // ================= WHATSAPP =================
  const handleWhatsApp = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!cleanNumber) return;

    window.open(`https://wa.me/${cleanNumber}`, "_blank");

    try {
      await API.put(`/businesses/${_id}/whatsapp`);
    } catch {}
  };

  return (
    <Link
      to={`/${safeCitySlug}/${safeCategorySlug}/${slug}`}
      onClick={handleBusinessClick}
      className="group bg-white rounded-2xl overflow-hidden border hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* IMAGE */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={
            image ||
            "https://via.placeholder.com/400x250?text=ServDial"
          }
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* BADGES */}
        <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
          {isFeatured && (
            <span className="bg-yellow-400 text-xs px-2 py-1 rounded-full font-semibold">
              ⭐ Featured
            </span>
          )}

          {isVerified && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              ✔ Verified
            </span>
          )}

          {distance != null && (
            <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {distance} km
            </span>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-md font-semibold text-gray-800 line-clamp-1">
          {name}
        </h2>

        <p className="text-sm text-gray-500">{categoryName}</p>

        <div className="flex items-center text-xs text-gray-400 mt-1">
          <MapPin size={14} className="mr-1" />
          {cityName}
        </div>

        {/* RATING */}
        <div className="flex items-center mt-3 text-sm">
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
          ) : (
            <span className="text-gray-400 text-xs">
              No ratings
            </span>
          )}
        </div>

        {/* ANALYTICS */}
        <div className="text-xs text-gray-400 mt-1 flex gap-3">
          <span>👁 {views}</span>
          <span>📞 {phoneClicks}</span>
          <span>💬 {whatsappClicks}</span>
        </div>

        <div className="flex-grow" />

        {/* ACTIONS */}
        <div className="flex gap-2 mt-4">
          {phone && (
            <button
              onClick={handleCall}
              className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700"
            >
              <Phone size={16} /> Call
            </button>
          )}

          {cleanNumber && (
            <button
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white text-sm py-2 rounded-lg hover:bg-green-700"
            >
              <MessageCircle size={16} /> WhatsApp
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default memo(BusinessCard);