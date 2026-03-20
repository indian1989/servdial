import { useEffect, useState } from "react";
import API from "../../api/axios";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap
} from "react-leaflet";

import L from "leaflet";
import { useDropzone } from "react-dropzone";
import { FaStar } from "react-icons/fa";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "leaflet/dist/leaflet.css";

import Select from "react-select";

// ============================
// FIX LEAFLET ICON
// ============================
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png"
});

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// ============================
// CITY → DISTRICT → STATE MAP
// ============================
const cityDataMap = {
  Muzaffarpur: { district: "Muzaffarpur", state: "Bihar" },
  Patna: { district: "Patna", state: "Bihar" },
  Delhi: { district: "New Delhi", state: "Delhi" },
  Mumbai: { district: "Mumbai", state: "Maharashtra" }
};

// ============================
// MAP CONTROLLER
// ============================
const MapController = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(location, 13);
  }, [location, map]);
  return null;
};

// ============================
// LOCATION PICKER
// ============================
const LocationPicker = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
};

// ============================
// IMAGE UPLOADER
// ============================
const ImageUploader = ({ images, setImages, multiple = false }) => {
  const uploadFile = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "servdial");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dkz4ihfuv/image/upload",
      { method: "POST", body: data }
    );
    const json = await res.json();
    return json.secure_url;
  };

  const onDrop = async (acceptedFiles) => {
    try {
      const uploaded = await Promise.all(
        acceptedFiles.map((file) => uploadFile(file))
      );
      const valid = uploaded.filter(Boolean);
      if (!valid.length) return;
      setImages(multiple ? [...images, ...valid] : valid);
    } catch {
      alert("Image upload failed");
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple });

  return (
    <div {...getRootProps()} className="border p-4 rounded cursor-pointer text-center">
      <input {...getInputProps()} />
      <p>Drag & drop or click to upload</p>

      <div className="flex gap-2 mt-2 flex-wrap">
        {images.map((img, i) => (
          <div key={i} className="relative">
            <img src={img} className="w-20 h-20 object-cover rounded" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeImage(i);
              }}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================
// BUSINESS PREVIEW
// ============================
const BusinessPreview = ({ data, logo, images, location }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <div className="border p-4 rounded bg-white shadow w-full md:w-1/2">
      <div className="flex gap-4 items-center">
        {logo ? (
          <img src={logo} className="w-16 h-16 rounded object-cover" />
        ) : (
          <div className="w-16 h-16 bg-gray-200 flex items-center justify-center">Logo</div>
        )}

        <div>
          <h2 className="font-bold text-lg">{data.name || "Business Name"}</h2>
          <p>{data.city?.label || "City"}</p>
          <p>{data.category?.label || "Category"}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => <FaStar key={i} className="text-yellow-400" />)}
          </div>
        </div>
      </div>

      <p className="mt-2 text-gray-600">{data.description || "Description preview"}</p>

      <div className="flex gap-2 mt-3 flex-wrap">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-20 h-20 cursor-pointer object-cover rounded"
            onClick={() => { setIndex(i); setIsOpen(true); }}
          />
        ))}
      </div>

      {isOpen && images.length > 0 && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={images.map((img) => ({ src: img }))}
          index={index}
        />
      )}

      <div className="mt-3">
        <h3 className="font-semibold">Business Hours:</h3>
        <ul>
          {Object.entries(data.businessHours || {}).map(([day, info]) => (
            <li key={day}>
              {day}:{" "}
              {info.closed
                ? "Closed"
                : info.open24
                  ? "Open 24 hours"
                  : `${info.open} - ${info.close}`}
            </li>
          ))}
        </ul>
      </div>

      <div className="h-40 mt-3">
        <MapContainer center={location} zoom={13} style={{ height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={location} icon={markerIcon}>
            <Popup>{data.name || "Business"}</Popup>
          </Marker>
          <MapController location={location} />
        </MapContainer>
      </div>
    </div>
  );
};

// ============================
// MAIN COMPONENT
// ============================
const AddBusiness = () => {
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [location, setLocation] = useState([26.1209, 85.3647]);
  const [logo, setLogo] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHours, setShowHours] = useState(false);

  const user = JSON.parse(localStorage.getItem("servdial_user"));
  const daysOfWeek = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: null,
    city: null,
    district: "",
    state: "",
    address: "",
    phone: "",
    whatsapp: "",
    website: "",
    businessHours: daysOfWeek.reduce((acc, day) => {
      acc[day] = { open: "09:00", close: "18:00", closed: false, open24: false };
      return acc;
    }, {})
  });

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, cityRes] = await Promise.all([
          API.get("/categories"),
          API.get("/cities")
        ]);

        setCategories(
          (catRes.data?.categories || []).map(c => ({ value: c._id, label: c.name }))
        );
        setCities(
          (cityRes.data?.cities || []).map(c => ({ value: c._id, label: c.name }))
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // AUTO FILL DISTRICT + STATE
  useEffect(() => {
    if (form.city) {
      const selectedCity = cities.find(c => c.value === form.city.value);
      if (!selectedCity) return;

      const cityName = selectedCity.label;

      if (cityDataMap[cityName]) {
        setForm(prev => ({
          ...prev,
          district: cityDataMap[cityName].district,
          state: cityDataMap[cityName].state
        }));
      } else {
        setForm(prev => ({ ...prev, district: "", state: "" }));
      }
    }
  }, [form.city, cities]);

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation([pos.coords.latitude, pos.coords.longitude]),
      () => alert("Location permission denied")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post(
        "/provider/business",
        {
          ...form,
          category: form.category?.value,
          city: form.city?.value,
          logo,
          images,
          location: { type: "Point", coordinates: [location[1], location[0]] }
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      alert("Business submitted successfully");
    } catch (err) {
      console.error(err);
      alert("Error submitting business");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:flex gap-6">
      <form onSubmit={handleSubmit} className="space-y-4 md:w-1/2">
        <h1 className="text-2xl font-bold">Add Business</h1>

        <input
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Business Name *"
          className="w-full border p-2"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="w-full border p-2"
        />

        <Select
          name="category"
          options={categories}
          value={form.category}
          onChange={(val) => setForm({ ...form, category: val })}
          placeholder="Select Category *"
          isSearchable
        />

        <Select
          name="city"
          options={cities}
          value={form.city}
          onChange={(val) => setForm({ ...form, city: val })}
          placeholder="Select City *"
          isSearchable
        />

        <input
          name="district"
          value={form.district}
          onChange={(e) => setForm({ ...form, district: e.target.value })}
          placeholder="District * (auto or type manually)"
          className="w-full border p-2"
        />

        <input
          name="state"
          value={form.state}
          readOnly
          placeholder="State (auto)"
          className="w-full border p-2 bg-gray-100"
        />

        <input
          name="address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Address *"
          className="w-full border p-2"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Phone *"
          className="w-full border p-2"
        />

        <input
          name="whatsapp"
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          placeholder="WhatsApp"
          className="w-full border p-2"
        />

        <input
          name="website"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          placeholder="Website"
          className="w-full border p-2"
        />

        {/* ==================== COLLAPSIBLE BUSINESS HOURS ==================== */}
        <button
          type="button"
          onClick={() => setShowHours(!showHours)}
          className="w-full bg-gray-200 p-2 rounded text-left"
        >
          {showHours ? "▼ Hide Business Hours" : "► Show Business Hours"}
        </button>

        {showHours && (
          <div className="border p-2 rounded mt-2">
            {daysOfWeek.map((day) => {
              const dayInfo = form.businessHours[day];
              return (
                <div key={day} className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="w-24">{day}</span>
                  <input
                    type="time"
                    value={dayInfo.open}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        businessHours: {
                          ...prev.businessHours,
                          [day]: { ...prev.businessHours[day], open: e.target.value }
                        }
                      }))
                    }
                    disabled={dayInfo.closed || dayInfo.open24}
                    className="border p-1"
                  />
                  <input
                    type="time"
                    value={dayInfo.close}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        businessHours: {
                          ...prev.businessHours,
                          [day]: { ...prev.businessHours[day], close: e.target.value }
                        }
                      }))
                    }
                    disabled={dayInfo.closed || dayInfo.open24}
                    className="border p-1"
                  />
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={dayInfo.open24}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          businessHours: {
                            ...prev.businessHours,
                            [day]: { ...prev.businessHours[day], open24: e.target.checked, closed: false }
                          }
                        }))
                      }
                    />
                    24h
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={dayInfo.closed}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          businessHours: {
                            ...prev.businessHours,
                            [day]: { ...prev.businessHours[day], closed: e.target.checked, open24: false }
                          }
                        }))
                      }
                    />
                    Closed
                  </label>
                </div>
              );
            })}
          </div>
        )}

        <div>
          <label className="font-semibold">Logo</label>
          <ImageUploader images={logo ? [logo] : []} setImages={(img) => setLogo(img[0])} />
        </div>

        <div>
          <label className="font-semibold">Images</label>
          <ImageUploader images={images} setImages={setImages} multiple />
        </div>

        <div className="h-64 space-y-2">
          <button
            type="button"
            onClick={getUserLocation}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            📍 Use My Location
          </button>

          <MapContainer center={location} zoom={13} style={{ height: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={location} icon={markerIcon}>
              <Popup>Selected Location</Popup>
            </Marker>
            <LocationPicker setLocation={setLocation} />
            <MapController location={location} />
          </MapContainer>
        </div>

        <button disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded w-full">
          {loading ? "Submitting..." : "Submit Business"}
        </button>
      </form>

      <BusinessPreview data={form} logo={logo} images={images} location={location} />
    </div>
  );
};

export default AddBusiness;