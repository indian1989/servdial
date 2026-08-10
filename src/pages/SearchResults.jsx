// src/pages/SearchResults.jsx

import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";

import API from "../api/axios";

import BusinessCard from "../components/business/BusinessCard";
import SmartSearchBar from "../components/search/SmartSearchBar";
import {
  formatCityLocation,
} from "../utils/addressHelper";

import useFilters from "../hooks/useFilters";
import { useCity } from "../context/CityContext";

import {
  MapContainer,
  TileLayer,
  Marker,
} from "react-leaflet";

import L from "leaflet";

import {
  Phone,
  MessageCircle,
  X,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

/* =========================================================
🌍 DEFAULT MAP LOCATION
========================================================= */

const DEFAULT_MAP_CENTER = [20.5937, 78.9629];

/* =========================================================
📍 LEAFLET MARKER
========================================================= */

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* =========================================================
🧼 SAFE STRING
========================================================= */

const safeString = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return String(value).trim();
};

/* =========================================================
🏠 FORMAT BUSINESS ADDRESS
========================================================= */

const getBusinessAddress = (business) => {
  if (!business) return "";

  const address = business.address;

  /* Structured address */

  if (
    address &&
    typeof address === "object"
  ) {
    return [
      address.street,
      address.area,
      address.landmark,
      business.cityId?.name,
      business.cityName,
      business.district,
      business.state,
      business.pincode,
    ]
      .filter(Boolean)
      .map(safeString)
      .filter(Boolean)
      .join(", ");
  }

  /* Legacy string address */

  if (
    typeof address === "string" &&
    address.trim()
  ) {
    return [
      address,
      business.cityId?.name,
      business.cityName,
      business.district,
      business.state,
      business.pincode,
    ]
      .filter(Boolean)
      .map(safeString)
      .filter(Boolean)
      .join(", ");
  }

  return [
    business.cityId?.name,
    business.cityName,
    business.district,
    business.state,
    business.pincode,
  ]
    .filter(Boolean)
    .map(safeString)
    .filter(Boolean)
    .join(", ");
};

/* =========================================================
🌍 WORLDWIDE PHONE NORMALIZER
========================================================= */

const normalizePhoneForWhatsApp = (business) => {
  const raw =
    business?.whatsapp ||
    business?.phone ||
    "";

  const value = safeString(raw);

  if (!value) {
    return "";
  }

  /*
   * Existing international number.
   *
   * Example:
   * +919876543210
   * +447911123456
   * +14155552671
   */

  if (value.startsWith("+")) {
    return value.replace(/\D/g, "");
  }

  /*
   * Do NOT assume India here.
   *
   * Backend should ideally store
   * internationally formatted numbers.
   */

  return value.replace(/\D/g, "");
};

/* =========================================================
🔎 SEARCH RESULTS
========================================================= */

const SearchResults = () => {
  const {
    filters,
    updateFilter,
  } = useFilters();

  const {
    city,
    loadingCity,
  } = useCity();

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const [businesses, setBusinesses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [viewMode, setViewMode] =
    useState("list");

  const [
    selectedBusiness,
    setSelectedBusiness,
  ] = useState(null);

  /* =======================================================
  🔗 EXPLICIT URL VALUES
  ======================================================= */

  const urlQuery = safeString(
    searchParams.get("q")
  );

  const urlCity = safeString(
    searchParams.get("city")
  );

  const urlCategory = safeString(
    searchParams.get("category")
  );

  /* =======================================================
  🧠 EFFECTIVE QUERY
  ======================================================= */

const effectiveQuery = safeString(urlQuery || filters.q);

const effectiveCity = safeString(urlCity).toLowerCase();

const effectiveCategory =
  urlCategory ||
  (
    typeof filters.category === "object"
      ? safeString(filters.category?.slug)
      : safeString(filters.category)
  );

  /* =======================================================
  📍 EFFECTIVE CITY

  IMPORTANT:

  Detected city is NOT automatically
  used as search filter.

  Only explicit city is used.

  This fixes:

  /search?q=restaurant

  from becoming:

  /search?q=restaurant&city=hajipur...
  ======================================================= */

  /* =======================================================
  🔗 URL → FILTER SYNC
  ======================================================= */

    useEffect(() => { if (urlQuery && urlQuery !== filters.q) { updateFilter("q", urlQuery); } if ( urlCategory && urlCategory !== (typeof filters.category === "object" ? filters.category?.slug : filters.category) ) { updateFilter("category", urlCategory); } }, [urlQuery, urlCategory]);

  /* =======================================================
  📍 GEOLOCATION

  IMPORTANT:

  Coordinates may be collected for map/
  nearby functionality.

  They are NOT automatically converted
  into city search filtering.
  ======================================================= */

  useEffect(() => {

    if (
      filters.lat != null &&
      filters.lng != null
    ) {
      return;
    }

    if (
      typeof navigator === "undefined" ||
      !navigator.geolocation
    ) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {

        const lat =
          Number(
            position.coords.latitude
          );

        const lng =
          Number(
            position.coords.longitude
          );

        if (
          Number.isFinite(lat) &&
          Number.isFinite(lng)
        ) {
          updateFilter(
            "lat",
            lat
          );

          updateFilter(
            "lng",
            lng
          );
        }

      },
      () => {

        console.warn(
          "📍 Location permission unavailable."
        );

      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 300000,
      }
    );

  }, []);

  /* =======================================================
  🔎 FETCH SEARCH RESULTS

  Backend is SSOT for:

  - query intelligence
  - city parsing
  - category parsing
  - search filtering
  - ranking
  ======================================================= */

  useEffect(() => {

    if (loadingCity) {
      return;
    }

    let cancelled = false;

    const fetchBusinesses = async () => {

      try {

        setLoading(true);

        const params = {
          q:
            effectiveQuery || "",
        };

        /*
         * IMPORTANT:
         *
         * Send city ONLY when explicitly selected
         * through URL/filter.
         *
         * Do NOT send detected CityContext city.
         */

        if (effectiveCity) {
          params.city =
            effectiveCity;
        }

        if (effectiveCategory) {
          params.categorySlug =
            effectiveCategory;
        }

        /* =================================================
        🌍 OPTIONAL GEO FILTER
        ================================================= */

        const lat =
          Number(filters.lat);

        const lng =
          Number(filters.lng);

        /*
         * Only use coordinates when the user
         * has explicitly enabled a distance/
         * nearby search.
         *
         * Do not accidentally restrict
         * normal worldwide/category searches
         * to current GPS position.
         */

        const hasDistanceFilter =
          Number(filters.distance) > 0 &&
          (
            filters.nearby === true ||
            filters.useLocation === true
          );

        if (
          Number.isFinite(lat) &&
          Number.isFinite(lng) &&
          hasDistanceFilter
        ) {

          params.lat = lat;
          params.lng = lng;

          params.distance =
            Number(filters.distance);

        }

        /* =================================================
        🚀 API
        ================================================= */

        const response =
          await API.get(
            "/businesses/search",
            {
              params,
            }
          );

        if (cancelled) {
          return;
        }

        const data =
          response?.data?.data;

        setBusinesses(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        if (!cancelled) {

          console.error(
            "🔥 Search request failed:",
            error
          );

          setBusinesses([]);

        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }

    };

    fetchBusinesses();

    return () => {
      cancelled = true;
    };

  }, [
    loadingCity,
    effectiveQuery,
    effectiveCity,
    effectiveCategory,
    filters.lat,
    filters.lng,
    filters.distance,
    filters.nearby,
    filters.useLocation,
  ]);

  /* =======================================================
  🔗 SHAREABLE SEARCH URL

  IMPORTANT:

  Do NOT inject detected city.

  restaurant

  stays:

  /search?q=restaurant

  Explicit city:

  /search?q=restaurant&city=patna
  ======================================================= */

  /* =======================================================
  📞 CALL
  ======================================================= */

  const handleCall = (phone) => {

    const value =
      safeString(phone);

    if (!value) {
      return;
    }

    window.location.href =
      `tel:${value}`;

  };

  /* =======================================================
  💬 WHATSAPP
  ======================================================= */

  const handleWhatsApp =
    (business) => {

      const number =
        normalizePhoneForWhatsApp(
          business
        );

      if (!number) {
        return;
      }

      window.open(
        `https://wa.me/${number}`,
        "_blank",
        "noopener,noreferrer"
      );

    };

  /* =======================================================
  👁 BUSINESS VIEW
  ======================================================= */

  const trackBusinessView =
    async (business) => {

      if (!business?._id) {
        return;
      }

      try {

        await API.post(
          `/businesses/${business._id}/view`,
          {
            keyword:
              effectiveQuery || "",

            city:
              effectiveCity || "",
          }
        );

      } catch (error) {

        console.warn(
          "⚠️ Business view tracking failed."
        );

      }

    };

  /* =======================================================
  📄 OPEN BUSINESS
  ======================================================= */

  const handleView = async (business) => {
  await trackBusinessView(business);

  const citySlug =
    business.cityId?.slug ||
    business.citySlug;

  const categorySlug =
    business.categoryId?.slug ||
    business.categorySlug;

  const businessSlug =
    business.slug ||
    business._id;

  if (citySlug && categorySlug && businessSlug) {
    navigate(
      `/${citySlug}/${categorySlug}/${businessSlug}`
    );
    return;
  }

  // Safe fallback
  navigate(`/businesses/${businessSlug}`);
};

  /* =======================================================
  🗺️ MAP CENTER
  ======================================================= */

  const mapCenter =
    useMemo(() => {

      const lat =
        Number(filters.lat);

      const lng =
        Number(filters.lng);

      if (
        Number.isFinite(lat) &&
        Number.isFinite(lng)
      ) {

        return [
          lat,
          lng,
        ];

      }

      return DEFAULT_MAP_CENTER;

    }, [
      filters.lat,
      filters.lng,
    ]);

  /* =======================================================
  🏷️ SEO TITLE
  ======================================================= */

  const pageTitle =
    useMemo(() => {

      if (
        effectiveQuery &&
        effectiveCity
      ) {

        return `${effectiveQuery} in ${effectiveCity} | ServDial`;

      }

      if (effectiveQuery) {

        return `${effectiveQuery} | ServDial`;

      }

      if (effectiveCity) {

        return `Businesses in ${effectiveCity} | ServDial`;

      }

      return "Search Businesses & Services | ServDial";

    }, [
      effectiveQuery,
      effectiveCity,
    ]);

  /* =======================================================
  📝 SEO DESCRIPTION
  ======================================================= */

  const pageDescription =
    useMemo(() => {

      if (
        effectiveQuery &&
        effectiveCity
      ) {

        return `Find ${effectiveQuery} businesses and services in ${effectiveCity}. Compare local businesses, contact details, ratings and locations on ServDial.`;

      }

      if (effectiveQuery) {

        return `Find businesses and service providers for ${effectiveQuery}. Explore businesses, ratings, contact details and locations on ServDial.`;

      }

      if (effectiveCity) {

        return `Discover businesses and services in ${effectiveCity}. Find local businesses, contact details, ratings and locations on ServDial.`;

      }

      return "Search and discover businesses, services, shops and professionals on ServDial.";

    }, [
      effectiveQuery,
      effectiveCity,
    ]);

  /* =======================================================
  📍 DISPLAY LOCATION

  Display detected location only as context.
  It is NOT used as filter.
  ======================================================= */

 const displayCity = useMemo(() => { const source = city || ( typeof filters.city === "object" ? filters.city : null ); if (!source) { return "All locations"; } return formatCityLocation( source.name, source.district, source.state ); }, [ city, filters.city, ]);

  /* =======================================================
  🖥️ RENDER
  ======================================================= */

  return (

    <>

      {/* =================================================
      SEO
      ================================================= */}

      <Helmet>

        <title>
          {pageTitle}
        </title>

        <meta
          name="description"
          content={
            pageDescription
          }
        />

        <meta
          name="robots"
          content="index,follow"
        />

        <link
          rel="canonical"
          href={
            `${window.location.origin}/search${
              searchParams.toString()
                ? `?${searchParams.toString()}`
                : ""
            }`
          }
        />

        <meta
          property="og:title"
          content={
            pageTitle
          }
        />

        <meta
          property="og:description"
          content={
            pageDescription
          }
        />

        <meta
          property="og:type"
          content="website"
        />

      </Helmet>

      {/* =================================================
      SEARCH HEADER
      ================================================= */}

      <div className="bg-white sticky top-0 z-50 px-3 py-3 shadow-sm">

        <SmartSearchBar
        query={filters.q || ""}
        setQuery={(value) => updateFilter("q", value)}
        onSearch={(value) => { updateFilter("q", value);
          
          // 🔥 GLOBAL SEARCH: clear city filter
          
          updateFilter("city", "");
          }}
          />

        <div className="flex justify-between items-center mt-2">

          <p className="text-xs text-gray-500">

            📍{" "}

            {displayCity}

          </p>

          <button
            type="button"
            onClick={() =>
              setViewMode(
                (current) =>
                  current === "list"
                    ? "map"
                    : "list"
              )
            }
            className="text-xs px-3 py-1 bg-blue-600 text-white rounded-full"
          >

            {viewMode === "list"
              ? "Map View"
              : "List View"}

          </button>

        </div>

      </div>

      {/* =================================================
      RESULTS
      ================================================= */}

      <main className="max-w-7xl mx-auto px-3 py-4">

        {/* LOADING */}

        {loading && (

          <div className="py-12 text-center text-sm text-gray-500">

            Searching businesses...

          </div>

        )}

        {/* EMPTY */}

        {!loading &&
          businesses.length === 0 && (

            <div className="py-16 text-center">

              <h2 className="text-lg font-semibold text-gray-800">

                No businesses found

              </h2>

              <p className="mt-2 text-sm text-gray-500">

                Try another service, business name or location.

              </p>

            </div>

          )}

        {/* LIST */}

        {!loading &&
          viewMode === "list" &&
          businesses.length > 0 && (

            <section
              aria-label="Search results"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >

              {businesses.map(
                (business) => (

                  <BusinessCard
                    key={
                      business._id ||
                      business.id
                    }
                    business={
                      business
                    }
                  />

                )
              )}

            </section>

          )}

        {/* MAP */}

        {!loading &&
          viewMode === "map" && (

            <div className="h-[75vh] mt-4 rounded-xl overflow-hidden">

              <MapContainer
                center={
                  mapCenter
                }

                zoom={
                  Number.isFinite(
                    Number(filters.lat)
                  ) &&
                  Number.isFinite(
                    Number(filters.lng)
                  )
                    ? 14
                    : 5
                }

                key={`${mapCenter[0]}-${mapCenter[1]}`}

                style={{
                  height: "100%",
                  width: "100%",
                }}
              >

                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {businesses.map(
                  (business) => {

                    const lat =
                      Number(
                        business.location
                          ?.coordinates?.[1]
                      );

                    const lng =
                      Number(
                        business.location
                          ?.coordinates?.[0]
                      );

                    if (
                      !Number.isFinite(
                        lat
                      ) ||
                      !Number.isFinite(
                        lng
                      )
                    ) {
                      return null;
                    }

                    return (

                      <Marker
                        key={
                          business._id
                        }

                        position={[
                          lat,
                          lng,
                        ]}

                        icon={
                          markerIcon
                        }

                        eventHandlers={{
                          click: async () => {

                            await trackBusinessView(
                              business
                            );

                            setSelectedBusiness(
                              business
                            );

                          },
                        }}

                      />

                    );

                  }
                )}

              </MapContainer>

            </div>

          )}

      </main>

      {/* =================================================
      MAP BUSINESS BOTTOM SHEET
      ================================================= */}

      {selectedBusiness && (

        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl rounded-t-2xl p-4 z-[1000]">

          <div className="flex justify-between items-center mb-2">

            <h3 className="font-semibold text-gray-800">

              {
                selectedBusiness.name
              }

            </h3>

            <button
              type="button"
              aria-label="Close"
              onClick={() =>
                setSelectedBusiness(
                  null
                )
              }
            >

              <X size={18} />

            </button>

          </div>

          <p className="text-xs text-gray-500 mb-3">

            {
              getBusinessAddress(
                selectedBusiness
              )
            }

          </p>

          <div className="flex gap-2">

            {selectedBusiness.phone && (

              <button
                type="button"
                onClick={() =>
                  handleCall(
                    selectedBusiness.phone
                  )
                }
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-1"
              >

                <Phone size={16} />

                Call

              </button>

            )}

            {(selectedBusiness.whatsapp ||
              selectedBusiness.phone) && (

              <button
                type="button"
                onClick={() =>
                  handleWhatsApp(
                    selectedBusiness
                  )
                }
                className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-1"
              >

                <MessageCircle
                  size={16}
                />

                WhatsApp

              </button>

            )}

          </div>

          <button
            type="button"
            onClick={() =>
              handleView(
                selectedBusiness
              )
            }
            className="w-full mt-2 text-sm text-blue-600"
          >

            View Full Details →

          </button>

        </div>

      )}

    </>

  );

};

export default SearchResults;