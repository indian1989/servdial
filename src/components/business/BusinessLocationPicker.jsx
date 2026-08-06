// src/components/business/BusinessLocationPicker.jsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ChangeView({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center?.length === 2) {
      map.setView(center, 16);
    }
  }, [center, map]);

  return null;
}

const BusinessLocationPicker = ({ value, onChange }) => {
  // value expected: [lng, lat]
  const initialLat = value?.[1] || 25.6905702;
  const initialLng = value?.[0] || 85.2090351;

  const [position, setPosition] = useState({
    lat: initialLat,
    lng: initialLng,
  });

  useEffect(() => {
    if (value?.length === 2) {
      setPosition({
        lat: value[1],
        lng: value[0],
      });
    }
  }, [value]);

  const handleDragEnd = (e) => {
    const marker = e.target;
    const latlng = marker.getLatLng();

    const next = {
      lat: latlng.lat,
      lng: latlng.lng,
    };

    setPosition(next);

    onChange?.([next.lng, next.lat]);
  };

  const handleMapClick = (e) => {
    const next = {
      lat: e.latlng.lat,
      lng: e.latlng.lng,
    };

    setPosition(next);

    onChange?.([next.lng, next.lat]);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl overflow-hidden border">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={16}
          style={{ height: "320px", width: "100%" }}
          whenCreated={(map) => {
            map.on("click", handleMapClick);
          }}
        >
          <ChangeView center={[position.lat, position.lng]} />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={[position.lat, position.lng]}
            draggable={true}
            eventHandlers={{
              dragend: handleDragEnd,
            }}
          />
        </MapContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-600">
            Latitude
          </label>

          <input
            type="number"
            step="any"
            value={position.lat}
            onChange={(e) => {
              const lat = Number(e.target.value);

              setPosition((p) => ({ ...p, lat }));

              onChange?.([position.lng, lat]);
            }}
            className="border rounded-xl p-3 w-full mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            Longitude
          </label>

          <input
            type="number"
            step="any"
            value={position.lng}
            onChange={(e) => {
              const lng = Number(e.target.value);

              setPosition((p) => ({ ...p, lng }));

              onChange?.([lng, position.lat]);
            }}
            className="border rounded-xl p-3 w-full mt-1"
          />
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Marker ko drag karke ya map par click karke exact business location set karein.
      </p>
    </div>
  );
};

export default BusinessLocationPicker;