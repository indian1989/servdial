import { useEffect, useState } from "react";
import { Star, Phone, MapPin, BadgeCheck, MessageCircle } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

const PopularBusinesses = ({ city }) => {
  const navigate = useNavigate();

  const [businesses, setBusinesses] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // -----------------------------
  // GET USER LOCATION
  // -----------------------------
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setUserLocation(null);
      }
    );
  }, []);

  // -----------------------------
  // FETCH BUSINESSES
  // -----------------------------
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await API.get(`/businesses/popular?city=${city}`);
        setBusinesses(res.data);
      } catch {
        setBusinesses([]);
      }
    };

    fetchBusinesses();
  }, [city]);

  // -----------------------------
  // GOOGLE DISTANCE CALCULATION
  // -----------------------------
  const getDistance = (lat, lng) => {
    if (!userLocation) return null;

    const R = 6371;
    const dLat = ((lat - userLocation.lat) * Math.PI) / 180;
    const dLng = ((lng - userLocation.lng) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLocation.lat * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (R * c).toFixed(1);
  };

  const markerIcon = new L.Icon({
    iconUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
  });

  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">

      {/* TITLE */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">
            Popular Businesses Near You
          </h2>
          <p className="text-gray-500 text-sm">
            Trusted local businesses in {city}
          </p>
        </div>

        <button
          onClick={() => navigate(`/search?city=${city}`)}
          className="text-blue-600 text-sm font-medium"
        >
          View All
        </button>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {businesses.map((biz) => {
          const distance = getDistance(biz.latitude, biz.longitude);

          return (
            <div
              key={biz._id}
              className={`border rounded-xl overflow-hidden hover:shadow-lg transition bg-white ${
                biz.isPremium ? "border-yellow-400" : ""
              }`}
            >

              {/* IMAGE */}
              <img
                src={biz.images?.[0]}
                alt={biz.name}
                className="w-full h-40 object-cover"
              />

              <div className="p-4">

                {/* NAME */}
                <div className="flex items-center gap-2">
                  <h3
                    className="font-semibold cursor-pointer"
                    onClick={() =>
                      navigate(`/business/${biz.slug}`)
                    }
                  >
                    {biz.name}
                  </h3>

                  {biz.verified && (
                    <BadgeCheck
                      size={18}
                      className="text-blue-500"
                    />
                  )}
                </div>

                {/* CATEGORY */}
                <p className="text-sm text-gray-500">
                  {biz.category}
                </p>

                {/* RATING */}
                <div className="flex items-center mt-2 text-sm">
                  <Star
                    size={16}
                    className="text-yellow-500 mr-1"
                  />
                  {biz.rating || "4.5"} ({biz.reviews || 20})
                </div>

                {/* ADDRESS */}
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin size={14} className="mr-1" />
                  {biz.city}
                </div>

                {/* DISTANCE */}
                {distance && (
                  <p className="text-xs text-gray-400 mt-1">
                    {distance} km away
                  </p>
                )}

                {/* ACTIONS */}
                <div className="flex gap-2 mt-4">

                  <a
                    href={`tel:${biz.phone}`}
                    className="flex-1 flex items-center justify-center gap-1 border rounded-lg py-2 hover:bg-gray-50"
                  >
                    <Phone size={16} />
                    Call
                  </a>

                  <a
                    href={`https://wa.me/${biz.phone}`}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-1 border rounded-lg py-2 hover:bg-gray-50"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </a>
                </div>

                {/* MAP */}
                {biz.latitude && (
                  <div className="mt-4 rounded-lg overflow-hidden h-40">

                    <MapContainer
                      center={[biz.latitude, biz.longitude]}
                      zoom={15}
                      scrollWheelZoom={false}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      <Marker
                        position={[
                          biz.latitude,
                          biz.longitude,
                        ]}
                        icon={markerIcon}
                      >
                        <Popup>{biz.name}</Popup>
                      </Marker>

                    </MapContainer>

                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PopularBusinesses;