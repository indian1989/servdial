import React, { memo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const BusinessCard = ({ business, userRole }) => {
  const {
    name,
    category,
    city,
    address,
    phone,
    description,
    images = [],
    location,
    paidServices = {},
  } = business;

  // Check if any paid feature is restricted
  const isPaidRestricted =
    !["admin", "superadmin"].includes(userRole) &&
    Object.values(paidServices).some(Boolean);

  const mapAvailable =
    location?.coordinates?.length === 2 &&
    !isNaN(location.coordinates[0]) &&
    !isNaN(location.coordinates[1]);

  return (
    <div className="border rounded p-4 shadow-md mb-4 bg-white">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-sm text-gray-600">{category} | {city}</p>

      {images[0] ? (
        <img
          src={images[0]}
          alt={name}
          className="w-full h-48 object-cover mt-2 rounded"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 mt-2 rounded flex items-center justify-center text-gray-500">
          No Image Available
        </div>
      )}

      <p className="mt-2">{description}</p>
      <p className="mt-1 font-medium">Phone: {phone}</p>
      <p className="mt-1 font-medium">Address: {address}</p>

      {mapAvailable && (
        <MapContainer
          center={[location.coordinates[1], location.coordinates[0]]}
          zoom={13}
          style={{ height: "200px", width: "100%", marginTop: "10px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker position={[location.coordinates[1], location.coordinates[0]]}>
            <Popup>{name}</Popup>
          </Marker>
        </MapContainer>
      )}

      {isPaidRestricted && (
        <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 font-semibold rounded">
          This feature will be available soon
        </div>
      )}
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export default memo(BusinessCard);