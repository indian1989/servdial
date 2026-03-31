// frontend/src/pages/BusinessDetails.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
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

  const [showPopup, setShowPopup] = useState(false);
  const [leadData, setLeadData] = useState({ name: "", phone: "" });

  const lat = business?.location?.coordinates?.[1];
  const lng = business?.location?.coordinates?.[0];

  // ✅ WHATSAPP FIX (GLOBAL)
  const whatsappNumber = (business.whatsapp || business.phone)?.replace(/\D/g, "");

  // ================= TRACKING =================
  const handleCallClick = () => {
    API.put(`/business/${business._id}/phone`).catch(() => {});
  };

  const handleWhatsappClick = () => {
    API.put(`/business/${business._id}/whatsapp`).catch(() => {});
  };

  // ================= LEAD =================
  const handleLeadSubmit = async (e) => {
    e.preventDefault();

    if (!leadData.name || !leadData.phone) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/leads", {
        businessId: business._id,
        ...leadData
      });

      alert("Request sent!");
      setShowPopup(false);
      setLeadData({ name: "", phone: "" });

    } catch {
      alert("Error submitting request");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-28">

      <TrackBusinessView businessId={business._id} />

      {/* ================= HERO ================= */}
      <div className="relative h-64 md:h-96 mb-6">
        <img
          src={business.images?.[0] || "/no-image.png"}
          alt={business.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-2xl md:text-4xl font-bold">{business.name}</h1>

          <p className="text-sm mt-1">
            {business.categoryId?.name || business.category || "General"} • {business.city}
          </p>

          <div className="flex gap-2 mt-2">
            <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs">
              ⭐ {business.averageRating || "New"}
            </span>

            {business.isVerified && (
              <span className="bg-green-500 text-xs px-2 py-1 rounded">
                ✔ Verified
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">

        {/* ================= CLAIM ================= */}
        {!business.isClaimed && user && (
          <Link
            to={`/claim-business/${business._id}`}
            className="block mb-4 bg-yellow-400 text-black text-center py-2 rounded-lg font-semibold"
          >
            Claim This Business
          </Link>
        )}

        {/* ================= ADDRESS ================= */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 text-sm">
          📍 {business.address || business.city}
        </div>

        {/* ================= DESCRIPTION ================= */}
        {business.description && (
          <div className="bg-white p-4 rounded-xl shadow mb-6">
            <h2 className="font-semibold mb-2">About</h2>
            <p className="text-gray-600 text-sm">{business.description}</p>
          </div>
        )}

        {/* ================= MAP ================= */}
        {lat && lng && (
          <div className="h-72 rounded overflow-hidden mb-8">
            <MapContainer center={[lat, lng]} zoom={15} style={{ height: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[lat, lng]} icon={markerIcon}>
                <Popup>{business.name}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* ================= REVIEWS ================= */}
        <div className="grid md:grid-cols-3 gap-6">
          <RatingBreakdown reviews={reviews} />

          <div className="md:col-span-2">
            <ReviewsList reviews={reviews} refresh={refresh} />
            {user && <ReviewForm businessId={business._id} refresh={refresh} />}
          </div>
        </div>

        {/* ================= SIMILAR ================= */}
        {similar.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-3">Similar Businesses</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similar.map((biz) => (
                <BusinessCard key={biz._id} business={biz} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= MOBILE STICKY CTA ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex gap-2 z-50">

        {business.phone && (
          <a
            href={`tel:${business.phone}`}
            onClick={handleCallClick}
            className="flex-1 bg-blue-600 text-white py-2 rounded text-center text-sm"
          >
            📞 Call
          </a>
        )}

        {whatsappNumber && (
          <a
            href={`https://wa.me/91${whatsappNumber}`}
            onClick={handleWhatsappClick}
            className="flex-1 bg-green-600 text-white py-2 rounded text-center text-sm"
          >
            💬 WhatsApp
          </a>
        )}

        <button
          onClick={() => setShowPopup(true)}
          className="flex-1 bg-black text-white py-2 rounded text-sm"
        >
          Get Deal
        </button>

      </div>

      {/* ================= POPUP ================= */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form onSubmit={handleLeadSubmit} className="bg-white p-5 rounded-xl w-80 space-y-3">
            <h2 className="font-semibold">Get Best Deal</h2>

            <input
              type="text"
              placeholder="Your Name"
              className="w-full border p-2 rounded"
              value={leadData.name}
              onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
            />

            <input
              type="tel"
              placeholder="Phone"
              className="w-full border p-2 rounded"
              value={leadData.phone}
              onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
            />

            <button className="bg-black text-white w-full py-2 rounded">
              Submit
            </button>

            <button type="button" onClick={() => setShowPopup(false)} className="text-xs">
              Cancel
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default BusinessDetails;