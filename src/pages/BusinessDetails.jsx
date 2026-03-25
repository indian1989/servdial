import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

import EnquiryForm from "../components/enquiry/EnquiryForm";
import ReviewForm from "../components/reviews/ReviewForm";
import ReviewsList from "../components/reviews/ReviewsList";
import RatingBreakdown from "../components/reviews/RatingBreakdown";
import TrackBusinessView from "../components/analytics/TrackBusinessView";
import BusinessCard from "../components/business/BusinessCard";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const BusinessDetails = () => {
  const { id } = useParams();

  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);

  const user = JSON.parse(localStorage.getItem("servdial_user"));

  // ================= FETCH =================
  const fetchBusiness = async () => {
    try {
      const res = await API.get(`/business/${id}`);

      setBusiness(res.data.business);
      setReviews(res.data.reviews || []);

      if (res.data.business?.category?._id) {
        fetchSimilar(res.data.business.category._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSimilar = async (categoryId) => {
    try {
      const res = await API.get("/business/similar", {
        params: { category: categoryId }
      });

      setSimilar(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, [id]);

  if (!business) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  const lat = business?.location?.coordinates?.[1];
  const lng = business?.location?.coordinates?.[0];

  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      <TrackBusinessView businessId={business._id} />

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          {/* IMAGE */}
          <div className="relative">
            <img
              src={business.image || "/no-image.png"}
              className="w-full h-64 object-cover rounded-xl"
            />

            {business.isVerified && (
              <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                Verified
              </span>
            )}
          </div>

          {/* INFO */}
          <div className="md:col-span-2">

            <h1 className="text-3xl font-bold mb-2">
              {business.name}
            </h1>

            <p className="text-gray-500 mb-2">
              {business.category?.name}
            </p>

            {/* RATING */}
            <p className="text-yellow-500 font-medium mb-2">
              ⭐ {business.rating || "New"}
              {business.reviewCount && (
                <span className="text-gray-400 text-sm ml-2">
                  ({business.reviewCount} reviews)
                </span>
              )}
            </p>

            <p className="text-gray-600 mb-4">
              {business.description}
            </p>

            {/* CTA BUTTONS */}
            <div className="flex gap-3 flex-wrap">

              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  onClick={() =>
                    API.post("/analytics/call", { business: business._id })
                  }
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                  Call Now
                </a>
              )}

              {business.whatsapp && (
                <a
                  href={`https://wa.me/${business.whatsapp}`}
                  onClick={() =>
                    API.post("/analytics/whatsapp", { business: business._id })
                  }
                  className="bg-green-600 text-white px-5 py-2 rounded-lg"
                >
                  WhatsApp
                </a>
              )}

              {business.website && (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-gray-800 text-white px-5 py-2 rounded-lg"
                >
                  Website
                </a>
              )}
            </div>

            {/* ENQUIRY */}
            <div className="mt-6">
              <EnquiryForm businessId={business._id} />
            </div>

          </div>
        </div>

        {/* GALLERY */}
        {business.images?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {business.images.map((img, i) => (
              <img key={i} src={img} className="h-40 w-full object-cover rounded-xl" />
            ))}
          </div>
        )}

        {/* MAP + DETAILS */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">

          <div>
            <h2 className="text-xl font-semibold mb-3">Location</h2>

            <p className="text-gray-600">{business.address}</p>
            <p className="text-gray-500">{business.city}</p>

            <h3 className="font-semibold mt-6 mb-2">Opening Hours</h3>
            <p className="text-gray-600">
              {business.openingHours || "Not Provided"}
            </p>
          </div>

          <div className="h-80 rounded overflow-hidden">
            {lat && lng && (
              <MapContainer center={[lat, lng]} zoom={15} style={{ height: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[lat, lng]} icon={markerIcon}>
                  <Popup>{business.name}</Popup>
                </Marker>
              </MapContainer>
            )}
          </div>
        </div>

        {/* REVIEWS */}
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <RatingBreakdown reviews={reviews} />

          <div className="md:col-span-2">
            <ReviewsList reviews={reviews} refresh={fetchBusiness} />

            {user && (
              <ReviewForm
                businessId={business._id}
                refresh={fetchBusiness}
              />
            )}
          </div>
        </div>

        {/* SIMILAR */}
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

      {/* 🔥 STICKY MOBILE CTA */}
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