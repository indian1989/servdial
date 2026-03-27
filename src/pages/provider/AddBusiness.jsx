// SERVDIAL_CONTINUE_RAHMAT_V2 (FINAL FIXED)

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
// MAP CONTROLLER
// ============================
const MapController = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(location, 13);
  }, [location]);
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
    const uploaded = await Promise.all(acceptedFiles.map(uploadFile));
    const valid = uploaded.filter(Boolean);

    if (!valid.length) return;

    setImages(multiple ? [...images, ...valid] : valid);
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
// MAIN COMPONENT
// ============================
const AddBusiness = () => {
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [location, setLocation] = useState([26.1209, 85.3647]);
  const [logo, setLogo] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("servdial_user"));

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
    website: ""
  });

  // ============================
  // FETCH DATA (FIXED)
  // ============================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await API.get("/categories");
        const cityRes = await API.get("/cities");

        const cats = catRes.data?.categories || [];
        const cts = cityRes.data?.cities || [];

        setCategories(
          cats.map((c) => ({
            value: c._id,
            label: c.name
          }))
        );

        // IMPORTANT FIX: include district & state
        setCities(
          cts.map((c) => ({
            value: c._id,
            label: c.name,
            district: c.district,
            state: c.state
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // ============================
  // AUTO FILL DISTRICT + STATE (FIXED)
  // ============================
  useEffect(() => {
    if (form.city) {
      setForm((prev) => ({
        ...prev,
        district: form.city.district || "",
        state: form.city.state || ""
      }));
    }
  }, [form.city]);

  // ============================
  // SUBMIT
  // ============================
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
          location: {
            type: "Point",
            coordinates: [location[1], location[0]]
          }
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
          placeholder="Business Name *"
          className="w-full border p-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* CATEGORY */}
        <Select
          options={categories}
          value={form.category}
          onChange={(val) => setForm({ ...form, category: val })}
          placeholder="Select Category *"
          isSearchable
          noOptionsMessage={() => "No category found"}
        />

        {/* CITY */}
        <Select
          options={cities}
          value={form.city}
          onChange={(val) => setForm({ ...form, city: val })}
          placeholder="Select City *"
          isSearchable
          noOptionsMessage={() => "No city found"}
        />

        <input
          value={form.district}
          placeholder="District"
          className="w-full border p-2"
          readOnly
        />

        <input
          value={form.state}
          placeholder="State"
          className="w-full border p-2"
          readOnly
        />

        <input
          placeholder="Address *"
          className="w-full border p-2"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <input
          placeholder="Phone *"
          className="w-full border p-2"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        {/* LOGO */}
        <div>
          <label className="font-semibold">Logo</label>
          <ImageUploader
            images={logo ? [logo] : []}
            setImages={(img) => setLogo(img[0] || "")}
          />
        </div>

        {/* IMAGES */}
        <div>
          <label className="font-semibold">Images</label>
          <ImageUploader images={images} setImages={setImages} multiple />
        </div>

        {/* MAP */}
        <div className="h-64">
          <MapContainer center={location} zoom={13} style={{ height: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={location} icon={markerIcon}>
              <Popup>Selected Location</Popup>
            </Marker>
            <LocationPicker setLocation={setLocation} />
            <MapController location={location} />
          </MapContainer>
        </div>

        <button className="bg-blue-600 text-white px-6 py-2 rounded w-full">
          {loading ? "Submitting..." : "Submit Business"}
        </button>

      </form>
    </div>
  );
};

export default AddBusiness;