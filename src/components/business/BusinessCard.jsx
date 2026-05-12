import { Link, useLocation } from "react-router-dom";
import {
  Phone,
  MapPin,
  Star,
  MessageCircle,
  Eye,
  BadgeCheck,
} from "lucide-react";

import { memo } from "react";
import API from "../../api/axios";
import { toBusinessListDTO } from "../../dto/businessDTO";

const BusinessCard = ({ business }) => {
  if (!business) return null;

  const location = useLocation();
  const b = toBusinessListDTO(business) || {};

  const {
    _id,
    slug,
    name = "Business",
    image,
    categoryName,
    cityName,
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

  // HARD GUARD
  if (!_id || !slug || !citySlug || !categorySlug) {
    return null;
  }

  const cleanNumber = (whatsapp || phone || "").replace(/\D/g, "");

  const handleBusinessClick = async () => {
    try {
      const keyword =
        new URLSearchParams(location.search).get("q") || "";

      await API.post(`/businesses/${_id}/view`, {
        keyword,
      });
    } catch {}
  };

  const handleCall = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!phone) return;

    window.location.href = `tel:${phone}`;

    try {
      await API.put(`/businesses/${_id}/phone`);
    } catch {}
  };

  const handleWhatsApp = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!cleanNumber) return;

    window.open(
      `https://wa.me/${cleanNumber}`,
      "_blank"
    );

    try {
      await API.put(`/businesses/${_id}/whatsapp`);
    } catch {}
  };

  return (
    <Link
      to={`/${citySlug}/${categorySlug}/${slug}`}
      onClick={handleBusinessClick}
      className="
        group
        bg-white
        rounded-3xl
        overflow-hidden
        border border-gray-200
        hover:border-blue-200
        hover:shadow-2xl
        transition-all
        duration-300
        flex flex-col
        h-full
      "
    >
      {/* IMAGE */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img
          src={
            image ||
            "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200"
          }
          alt={name}
          className="
            w-full
            h-full
            object-cover
            group-hover:scale-110
            transition-transform
            duration-500
          "
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* TOP BADGES */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {isFeatured && (
            <span className="bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full shadow">
              ⭐ Featured
            </span>
          )}

          {isVerified && (
            <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow">
              <BadgeCheck size={12} />
              Verified
            </span>
          )}
        </div>

        {/* DISTANCE */}
        {distance != null && (
          <div className="absolute bottom-3 right-3">
            <span className="bg-black/70 backdrop-blur text-white text-xs px-3 py-1 rounded-full">
              {distance} km away
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-1">

        {/* NAME */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition">
            {name}
          </h2>

          {rating > 0 && (
            <div className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-semibold shrink-0">
              <Star size={12} className="fill-yellow-400 mr-1" />
              {rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* CATEGORY */}
        <p className="text-sm text-blue-600 font-medium mt-1">
          {categoryName}
        </p>

        {/* LOCATION */}
        <div className="flex items-center text-sm text-gray-500 mt-3">
          <MapPin size={15} className="mr-1 shrink-0" />
          <span className="line-clamp-1">
            {cityName}
          </span>
        </div>

        {/* REVIEWS */}
        <div className="mt-3 text-sm text-gray-500">
          {reviewCount > 0 ? (
            <span>
              {reviewCount} review
              {reviewCount > 1 ? "s" : ""}
            </span>
          ) : (
            <span>No reviews yet</span>
          )}
        </div>

        {/* STATS */}
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-400 border-t pt-3">
          <div className="flex items-center gap-1">
            <Eye size={14} />
            {views}
          </div>

          <div>
            📞 {phoneClicks}
          </div>

          <div>
            💬 {whatsappClicks}
          </div>
        </div>

        <div className="flex-grow" />

        {/* ACTIONS */}
        <div className="grid grid-cols-2 gap-3 mt-5">

          {phone ? (
            <button
              onClick={handleCall}
              className="
                flex items-center justify-center gap-2
                bg-blue-600 hover:bg-blue-700
                text-white text-sm font-medium
                py-3 rounded-xl
                transition
              "
            >
              <Phone size={16} />
              Call
            </button>
          ) : (
            <div />
          )}

          {cleanNumber ? (
            <button
              onClick={handleWhatsApp}
              className="
                flex items-center justify-center gap-2
                bg-green-600 hover:bg-green-700
                text-white text-sm font-medium
                py-3 rounded-xl
                transition
              "
            >
              <MessageCircle size={16} />
              WhatsApp
            </button>
          ) : (
            <div />
          )}

        </div>
      </div>
    </Link>
  );
};

export default memo(BusinessCard);