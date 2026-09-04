import { Link, useLocation } from "react-router-dom";
import {
  Phone,
  MapPin,
  Star,
  MessageCircle,
  Eye,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";

import { memo, useState } from "react";
import API from "../../api/axios";
import { toBusinessListDTO } from "../../dto/businessDTO";
import { getBusinessStatus } from "../../utils/getBusinessStatus";
import { getDistance } from "../../utils/getDistance";
import {
  formatCityLocation,
} from "../../utils/addressHelper";

const BusinessCard = ({ business }) => {
  if (!business) return null;

  const location = useLocation();

  const [
  isCallChooserOpen,
  setIsCallChooserOpen
] = useState(false);

const b = toBusinessListDTO(business) || {};


const businessStatus = getBusinessStatus(b);

// User GPS coordinates
const userLat = Number(localStorage.getItem("user_lat"));
const userLng = Number(localStorage.getItem("user_lng"));

// Business coordinates
const businessLng = b.location?.coordinates?.[0];
const businessLat = b.location?.coordinates?.[1];

// Real distance
const realDistance =
  userLat && userLng && businessLat && businessLng
    ? getDistance(userLat, userLng, businessLat, businessLng)
    : null;

  const {
    _id,
    slug,
    name = "Business",
    image,
    logo,
    images,
    categoryName,

    area,
    cityName,
    citySlug,
    district,
    state,
    categorySlug,
    rating = 0,
    reviewCount = 0,
    phone,
    landline,
    whatsapp,
    isFeatured,
    isVerified,
    plan,
    isTrustedPartner,
    isPremiumPartner,
    distance,
    views = 0,
    phoneClicks = 0,
    whatsappClicks = 0,
  } = b;

  const businessImage =
  image ||
  logo ||
  (Array.isArray(images) && images.length > 0 ? images[0] : null) ||
  "/no-image.png";

  const displayLocation = formatCityLocation(
  area,
  cityName,
  state
);

  // HARD GUARD
  if (!_id || !slug || !citySlug || !categorySlug) {
    return null;
  }

  // =========================================================
// CONTACT AVAILABILITY
// FINAL SERVIDAL RULE
//
// Mobile only       → Call → mobile
// Landline only     → Call → landline
// Mobile + Landline → Choose number
// Neither           → No Call button
//
// WhatsApp available → WhatsApp → whatsapp only
// WhatsApp absent    → No WhatsApp button
// =========================================================

const mobileNumber =
  phone?.toString().trim() || "";

const landlineNumber =
  landline?.toString().trim() || "";

const whatsappNumber =
  whatsapp?.toString().trim() || "";

const hasMobile =
  Boolean(mobileNumber);

const hasLandline =
  Boolean(landlineNumber);

const hasCall =
  hasMobile || hasLandline;

const hasWhatsApp =
  Boolean(whatsappNumber);

const cleanWhatsApp =
  whatsappNumber.replace(/\D/g, "");


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

  if (!hasCall) return;

  // Mobile + Landline → chooser
  if (hasMobile && hasLandline) {
    setIsCallChooserOpen(true);
    return;
  }

  // Mobile only
  if (hasMobile) {
    window.location.href =
      `tel:${mobileNumber}`;
  }

  // Landline only
  else if (hasLandline) {
    window.location.href =
      `tel:${landlineNumber}`;
  }

  try {
    await API.post(
      `/businesses/analytics/${_id}`,
      {
        type: "call",
      }
    );
  } catch {}
};

 const handleWhatsApp = async (e) => {
  e.preventDefault();
  e.stopPropagation();

  // WhatsApp must use ONLY DB whatsapp
  if (!hasWhatsApp || !cleanWhatsApp) {
    return;
  }

  const finalWhatsApp =
    cleanWhatsApp.startsWith("91")
      ? cleanWhatsApp
      : `91${cleanWhatsApp}`;

  window.open(
    `https://wa.me/${finalWhatsApp}`,
    "_blank"
  );

  try {
    await API.post(
      `/businesses/analytics/${_id}`,
      {
        type: "whatsapp",
      }
    );
  } catch {}
};

  return (
    <>
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
          src={businessImage}
          alt={name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/no-image.png";
          }}
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

           {plan === "trusted" && (
    <span className="bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
      🛡 Trusted
    </span>
  )}

  {plan === "premium" && (
    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-semibold px-3 py-1 rounded-full shadow">
      👑 Premium
    </span>
  )}

        </div>

      {/* OPEN STATUS BADGE */}

      {businessStatus && ( <div className=
      {` absolute bottom-3 left-3
      z-20 inline-flex items-center gap-1
      px-3 py-1 rounded-full text-xs
      font-semibold shadow-lg backdrop-blur-sm ${
        businessStatus.status === "open" ?
      "bg-green-500/90 text-white" :
        "bg-red-500/90 text-white" } `} >
      <span>
        {businessStatus.status === "open" ? "🟢" : "🔴"}

      </span>
      {businessStatus.text}
      </div>
      )}


     {/* DISTANCE BADGE */}

{realDistance != null && (
  <div className="absolute bottom-3 right-3 z-20">
    <span
      className={`
        backdrop-blur
        text-xs
        px-3
        py-1
        rounded-full
        shadow-lg
        font-semibold
        flex
        items-center
        gap-1
        whitespace-nowrap
        ${
          realDistance < 0.3
            ? "bg-green-500/90 text-white"
            : "bg-black/70 text-white"
        }
      `}
    >
      📍{" "}
      {realDistance < 0.3 ? "Nearby" : realDistance < 1 ? `${Math.round(realDistance * 1000)} m away` : `${realDistance.toFixed(1)} km away`}
    </span>
  </div>
)}
</div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-1">

        {/* NAME */}
        <div className="flex items-center justify-between gap-2">

  <div className="flex items-center gap-1.5 min-w-0">

    <h2
  className="
    text-lg
    font-bold
    text-gray-900
    leading-tight
    line-clamp-2
    break-words
    group-hover:text-blue-600
    transition
  "
>
  {name}
</h2>

    {/* TRUSTED / PREMIUM SHIELD */}
    {isVerified && plan === "trusted" && (
      <ShieldCheck
        size={18}
        strokeWidth={2.5}
        className="text-purple-600 shrink-0"
        title="Trusted Business"
      />
    )}

    {isVerified && plan === "premium" && (
      <ShieldCheck
        size={18}
        strokeWidth={2.5}
        className="text-yellow-500 shrink-0"
        title="Premium Partner"
      />
    )}

  </div>

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
          {displayLocation}
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

        {/* =========================================================
    BUSINESS STATS — TEMPORARILY HIDDEN
    Tracking internally continues.
========================================================= */}

{/*
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
        */}

        <div className="flex-grow" />

        {/* ACTIONS */}
        <div className="grid grid-cols-2 gap-3 mt-5">

          {hasCall ? (
  <button
    type="button"
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

         {hasWhatsApp ? (
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

    {/* =========================================================
    CALL NUMBER CHOOSER
========================================================= */}

{isCallChooserOpen && (
  <div
    className="
      fixed
      inset-0
      z-[100]
      flex
      items-end
      sm:items-center
      justify-center
      bg-black/60
      backdrop-blur-sm
      px-4
    "
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      setShowCallChooser(false);
    }}
  >

    <div
      className="
        w-full
        max-w-md
        bg-white
        rounded-2xl
        shadow-2xl
        p-5
        sm:p-6
      "
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >

      {/* HEADER */}

      <div className="flex items-center gap-3 mb-5">

        <div
          className="
            w-11
            h-11
            rounded-full
            bg-blue-100
            text-blue-600
            flex
            items-center
            justify-center
            flex-shrink-0
          "
        >
          <Phone size={21} />
        </div>

        <div>

          <h3
            className="
              text-lg
              font-bold
              text-gray-900
            "
          >
            Choose number
          </h3>

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Select how you want to call
          </p>

        </div>

      </div>

      {/* MOBILE */}

      {hasMobile && (
        <button
          type="button"
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();

            setShowCallChooser(false);

            window.location.href =
              `tel:${mobileNumber}`;

            try {
              await API.post(
                `/businesses/analytics/${_id}`,
                {
                  type: "call",
                }
              );
            } catch {}
          }}
          className="
            w-full
            flex
            items-center
            justify-between
            gap-4
            px-4
            py-4
            mb-3
            rounded-xl
            border
            border-gray-200
            hover:border-blue-500
            hover:bg-blue-50
            transition
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              min-w-0
            "
          >

            <div
              className="
                w-10
                h-10
                rounded-full
                bg-blue-100
                text-blue-600
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              <Phone size={18} />
            </div>

            <div className="text-left min-w-0">

              <div
                className="
                  text-sm
                  font-semibold
                  text-gray-900
                "
              >
                Mobile
              </div>

              <div
                className="
                  text-sm
                  text-gray-500
                  truncate
                "
              >
                {mobileNumber}
              </div>

            </div>

          </div>

          <span
            className="
              text-blue-600
              text-sm
              font-semibold
              flex-shrink-0
            "
          >
            Call
          </span>

        </button>
      )}

      {/* LANDLINE */}

      {hasLandline && (
        <button
          type="button"
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();

            setShowCallChooser(false);

            window.location.href =
              `tel:${landlineNumber}`;

            try {
              await API.post(
                `/businesses/analytics/${_id}`,
                {
                  type: "call",
                }
              );
            } catch {}
          }}
          className="
            w-full
            flex
            items-center
            justify-between
            gap-4
            px-4
            py-4
            rounded-xl
            border
            border-gray-200
            hover:border-blue-500
            hover:bg-blue-50
            transition
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              min-w-0
            "
          >

            <div
              className="
                w-10
                h-10
                rounded-full
                bg-gray-100
                text-gray-700
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              <Phone size={18} />
            </div>

            <div className="text-left min-w-0">

              <div
                className="
                  text-sm
                  font-semibold
                  text-gray-900
                "
              >
                Landline
              </div>

              <div
                className="
                  text-sm
                  text-gray-500
                  truncate
                "
              >
                {landlineNumber}
              </div>

            </div>

          </div>

          <span
            className="
              text-blue-600
              text-sm
              font-semibold
              flex-shrink-0
            "
          >
            Call
          </span>

        </button>
      )}

      {/* CANCEL */}

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowCallChooser(false);
        }}
        className="
          w-full
          mt-4
          py-3
          rounded-xl
          bg-gray-100
          hover:bg-gray-200
          text-gray-700
          font-medium
          transition
        "
      >
        Cancel
      </button>

    </div>

  </div>
)}
</>
  );
};

export default memo(BusinessCard);