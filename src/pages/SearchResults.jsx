// src/pages/SearchResults.jsx

import { useEffect, useState, useRef } from "react";
import API from "../api/axios";

import BusinessCard from "../components/business/BusinessCard";
import SmartSearchBar from "../components/search/SmartSearchBar";

import useFilters from "../hooks/useFilters";
import { useCity } from "../context/CityContext";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { Phone, MessageCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const SearchResults = () => {
  const { filters, updateFilter } = useFilters();
  const { city, loadingCity } = useCity();
  const navigate = useNavigate();

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState("list"); // list | map
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const syncedCity = useRef(false);

  // ================= CITY SYNC =================
  useEffect(() => {
    if (!syncedCity.current && city) {
      updateFilter("city", city);
      syncedCity.current = true;
    }
  }, [city]);

  // ================= GEO LOCATION =================
  useEffect(() => {
    if (!filters.lat && !filters.lng) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          updateFilter("lat", pos.coords.latitude);
          updateFilter("lng", pos.coords.longitude);
        },
        (err) => {
          console.warn("Location denied, using fallback");
        }
      );
    }
  }, []);

  // ================= FETCH =================
  useEffect(() => {
    if (loadingCity) return;

    const fetchBusinesses = async () => {
      try {
        setLoading(true);

        const params = {
          ...filters,
          ...(filters.lat && filters.lng
  ? {
      lat: filters.lat,
      lng: filters.lng,
      distance: filters.distance || 10, // ✅ default 10km
    }
  : {}),
        };

        const res = await API.get("/business/search", { params });
        console.log("Businesses:", res.data.businesses);

        setBusinesses(res.data.businesses || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [filters, loadingCity]);

  // ================= ACTIONS =================
  const handleCall = (phone) => {
    if (!phone) return;
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (b) => {
    const num = (b.whatsapp || b.phone || "").replace(/\D/g, "");
    if (num) window.open(`https://wa.me/91${num}`, "_blank");
  };

  const handleView = async (b) => {
  try {
    await API.post(`/business/${b._id}/click`, {
      keyword: filters.q || "",
      city: filters.city || ""
    });
  } catch (err) {
    console.warn("Click tracking failed");
  }

  navigate(`/business/${b.slug || b._id}`);
};

  // ================= MAP CENTER FIX =================
  const mapCenter =
    filters.lat && filters.lng
      ? [filters.lat, filters.lng]
      : [28.61, 77.2]; // fallback only

  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      {/* ================= SEARCH BAR ================= */}
      <div className="bg-white sticky top-0 z-50 px-3 py-3 shadow-sm">

        <SmartSearchBar
          query={filters.q}
          setQuery={(v) => updateFilter("q", v)}
          onSearch={(v) => updateFilter("q", v)}
        />

        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            📍 {filters.city || "Detecting location..."}
          </p>

          <button
            onClick={() =>
              setViewMode(viewMode === "list" ? "map" : "list")
            }
            className="text-xs px-3 py-1 bg-blue-600 text-white rounded-full"
          >
            {viewMode === "list" ? "Map View" : "List View"}
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-3 py-4">

        {/* LIST */}
        {viewMode === "list" && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            {businesses.map((biz) => (
              <BusinessCard key={biz._id} business={biz} />
            ))}
          </div>
        )}

        {/* MAP VIEW */}
        {viewMode === "map" && (
          <div className="h-[75vh] mt-4 rounded-xl overflow-hidden">

            <MapContainer
              center={mapCenter}
              zoom={filters.lat && filters.lng ? 14 : 11}
              key={`${mapCenter[0]}-${mapCenter[1]}`} // force refresh fix
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {businesses.map((b) => {
                const lat = b.location?.coordinates?.[1];
                const lng = b.location?.coordinates?.[0];

                if (!lat || !lng) return null;

                return (
                  <Marker
                    key={b._id}
                    position={[lat, lng]}
                    icon={markerIcon}
                    eventHandlers={{
                      click: async () => {
  try {
    await API.post(`/business/${b._id}/click`, {
      keyword: filters.q || "",
      city: filters.city || ""
    });
  } catch (err) {}

  setSelectedBusiness(b);
},
                    }}
                  />
                );
              })}
            </MapContainer>

          </div>
        )}
      </div>

      {/* ================= BOTTOM SHEET ================= */}
      {selectedBusiness && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl rounded-t-2xl p-4 z-50">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-800">
              {selectedBusiness.name}
            </h3>

            <button onClick={() => setSelectedBusiness(null)}>
              <X size={18} />
            </button>
          </div>

          {/* INFO */}
          <p className="text-xs text-gray-500 mb-3">
            {selectedBusiness.address || selectedBusiness.city}
          </p>

          {/* ACTIONS */}
          <div className="flex gap-2">

            <button
              onClick={() => handleCall(selectedBusiness.phone)}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-1"
            >
              <Phone size={16} /> Call
            </button>

            <button
              onClick={() => handleWhatsApp(selectedBusiness)}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-1"
            >
              <MessageCircle size={16} /> WhatsApp
            </button>

          </div>

          <button
            onClick={() => handleView(selectedBusiness)}
            className="w-full mt-2 text-sm text-blue-600"
          >
            View Full Details →
          </button>

        </div>
      )}

    </div>
  );
};

export default SearchResults;