import React, { useState } from "react";
// Path: src/pages/admin/businesses/AddBusiness.jsx
import { addBusiness } from "../../api/adminAPI";
import { uploadImage } from "../../services/CloudinaryService";
import Loader from "../../components/common/Loader";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// ============== Leaflet Map ==============
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DEFAULT_POSITION = [20.5937, 78.9629]; // India center
const DEFAULT_ZOOM = 5;

// Fix Leaflet default marker issue in Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationPicker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return null;
};

export { LocationPicker, DEFAULT_POSITION, DEFAULT_ZOOM };

// ============== Add Business ===========
const AddBusiness = () => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(DEFAULT_POSITION);
  const [businessData, setBusinessData] = useState({
    name: "",
    category: "",
    address: "",
    city: "",
    district: "",
    state: "",
    phone: "",
    description: "",
  });

  // ================= SUBMIT FORM =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, category, city, district, state, phone } = businessData;
    if (!name || !category || !city || !district || !state || !phone || !images.length) {
      return alert("Please fill all required fields and upload at least one image.");
    }

    const payload = {
      ...businessData,
      images,
      location: {
        type: "Point",
        coordinates: [location[1], location[0]], // [lng, lat]
      },
    };

    setLoading(true);
    try {
      await addBusiness(payload);
      alert("Business added successfully!");
      setBusinessData({
        name: "",
        category: "",
        address: "",
        city: "",
        district: "",
        state: "",
        phone: "",
        description: "",
      });
      setImages([]);
      setLocation(DEFAULT_POSITION);
    } catch (err) {
      console.error(err);
      alert("Failed to add business.");
    } finally {
      setLoading(false);
    }
  };

  // ================= RENDER =================
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Business</h2>

      {loading && <Loader />}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          type="text"
          placeholder="Business Name *"
          value={businessData.name}
          onChange={(e) => setBusinessData({ ...businessData, name: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Category *"
          value={businessData.category}
          onChange={(e) => setBusinessData({ ...businessData, category: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Address"
          value={businessData.address}
          onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="City *"
          value={businessData.city}
          onChange={(e) => setBusinessData({ ...businessData, city: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="District *"
          value={businessData.district}
          onChange={(e) => setBusinessData({ ...businessData, district: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="State *"
          value={businessData.state}
          onChange={(e) => setBusinessData({ ...businessData, state: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Phone *"
          value={businessData.phone}
          onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <textarea
          placeholder="Description"
          value={businessData.description}
          onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />

        <div>
          <label className="block mb-2 font-semibold">Upload Images *</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="border px-3 py-2 rounded w-full"
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            {images.map((img, idx) => (
              <img key={idx} src={img} alt="Business" className="h-20 w-20 object-cover rounded" />
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2 font-semibold">Pick Location *</label>
          <MapContainer
            center={location}
            zoom={DEFAULT_ZOOM}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            />
            <LocationPicker position={location} setPosition={setLocation} />
          </MapContainer>
          <p className="mt-2 text-sm text-gray-600">Click on map to set business location.</p>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Business
        </button>
      </form>
    </div>
  );
};

export default AddBusiness;