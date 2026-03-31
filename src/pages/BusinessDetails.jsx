// frontend/src/pages/BusinessDetails.jsx

import TrackBusinessView from "../components/analytics/TrackBusinessView";
import ReviewForm from "../components/reviews/ReviewForm";
import ReviewsList from "../components/reviews/ReviewsList";
import RatingBreakdown from "../components/reviews/RatingBreakdown";
import BusinessCard from "../components/business/BusinessCard";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import L from "leaflet";
import API from "../api/axios";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const BusinessDetails = ({ business, reviews = [], similar = [], refresh }) => {

  const user = JSON.parse(localStorage.getItem("servdial_user"));

  const lat = business?.location?.coordinates?.[1];
  const lng = business?.location?.coordinates?.[0];

  // ================= TRACKING =================
  const handleCallClick = () => {
    API.post(`/business/${business._id}/call`).catch(() => {});
  };

  const handleWhatsappClick = () => {
    API.post(`/business/${business._id}/whatsapp`).catch(() => {});
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      {/* ✅ FIXED TRACKING */}
      <TrackBusinessView businessId={business._id} />

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ================= BREADCRUMB ================= */}
        <div className="text-sm text-gray-500 mb-4">
          Home / {business.city} / {business.categoryId?.name || business.category || "General"} / {business.name}
        </div>

        {/* ================= HEADER ================= */}
        <div className="grid md:grid-cols-3 gap-6 mb-10 bg-white p-6 rounded-xl shadow">

          {/* IMAGE */}
          <div className="relative">
            <img
              src={business.images?.[0] || "/no-image.png"}
              alt={business.name}
              className="w-full h-64 object-cover rounded-xl"
            />

            {business.isVerified && (
              <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                ✔ Verified
              </span>
            )}

            {business.isFeatured && (
              <span className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded">
                ⭐ Featured
              </span>
            )}
          </div>

          {/* INFO */}
          <div className="md:col-span-2">

            <h1 className="text-3xl font-bold mb-2">{business.name}</h1>

            <p className="text-gray-500 mb-2">
              {business.categoryId?.name || business.category || "General"}
            </p>

            {/* ⭐ RATING */}
            <p className="text-yellow-500 font-medium mb-2">
              ⭐ {business.averageRating || "New"}
              {business.totalReviews > 0 && (
                <span className="text-gray-400 text-sm ml-2">
                  ({business.totalReviews} reviews)
                </span>
              )}
            </p>

            {/* 📍 ADDRESS */}
            <p className="text-gray-600 mb-3">
              📍 {business.address || business.city}
            </p>

            {/* 🔥 TRUST BADGES */}
            <div className="flex gap-2 flex-wrap mb-4">
              {business.isVerified && (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                  Verified Business
                </span>
              )}
              <span className="bg-gray-100 text-xs px-2 py-1 rounded">
                Fast Response
              </span>
            </div>

            {/* ================= CTA ================= */}
            <div className="flex gap-3 flex-wrap">

              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  onClick={handleCallClick}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                  📞 Call Now
                </a>
              )}

              {business.whatsapp && (
                <a
                  href={`https://wa.me/${business.whatsapp}`}
                  onClick={handleWhatsappClick}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                >
                  💬 WhatsApp
                </a>
              )}

              <button className="bg-black text-white px-5 py-2 rounded-lg">
                Get Best Deal
              </button>
            </div>

          </div>
        </div>

        {/* ================= DESCRIPTION ================= */}
        {business.description && (
          <div className="bg-white p-6 rounded-xl shadow mb-8">
            <h2 className="text-xl font-semibold mb-3">About</h2>
            <p className="text-gray-600">{business.description}</p>
          </div>
        )}

        {/* ================= SERVICES ================= */}
        {business.services?.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow mb-8">
            <h2 className="text-xl font-semibold mb-3">Services</h2>

            <div className="flex flex-wrap gap-2">
              {business.services.map((s, i) => (
                <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ================= MAP ================= */}
        {lat && lng && (
          <div className="h-80 rounded overflow-hidden mb-10">
            <MapContainer center={[lat, lng]} zoom={15} style={{ height: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[lat, lng]} icon={markerIcon}>
                <Popup>{business.name}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* ================= REVIEWS ================= */}
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <RatingBreakdown reviews={reviews} />

          <div className="md:col-span-2">
            <ReviewsList reviews={reviews} refresh={refresh} />

            {user && (
              <ReviewForm businessId={business._id} refresh={refresh} />
            )}
          </div>
        </div>

        {/* ================= SIMILAR ================= */}
        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">
              Similar Businesses
            </h2>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similar.map((biz) => (
                <BusinessCard key={biz._id} business={biz} />
              ))}
            </div>
            </div>
        )}

      </div>

      {/* ================= MOBILE CTA ================= */}
      {business.phone && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex gap-3 z-50 md:hidden">
          <a
            href={`tel:${business.phone}`}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-center"
          >
            Call Now
          </a>

          {business.whatsapp && (
            <a
              href={`https://wa.me/${business.whatsapp}`}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg text-center"
            >
              WhatsApp
            </a>
          )}
        </div>
      )}

    </div>
  );
};

export default BusinessDetails;