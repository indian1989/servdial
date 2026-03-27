import { useEffect, useState, useMemo } from "react";
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
import "leaflet/dist/leaflet.css";
import Select from "react-select";

// ================= ICON FIX =================
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

// ================= MAP =================
const MapController = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(location, 13);
  }, [location]);
  return null;
};

const LocationPicker = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
};

// ================= IMAGE =================
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

  const onDrop = async (files) => {
    const uploaded = await Promise.all(files.map(uploadFile));
    const valid = uploaded.filter(Boolean);
    if (!valid.length) return;

    setImages(multiple ? [...images, ...valid] : valid);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple });

  return (
    <div {...getRootProps()} className="border p-4 rounded text-center cursor-pointer">
      <input {...getInputProps()} />
      <p>Upload</p>

      <div className="flex gap-2 mt-2 flex-wrap">
        {images.map((img, i) => (
          <img key={i} src={img} className="w-20 h-20 object-cover rounded" />
        ))}
      </div>
    </div>
  );
};

// ================= MAIN =================
const AddBusiness = () => {
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [location, setLocation] = useState([26.1209, 85.3647]);
  const [logo, setLogo] = useState("");
  const [images, setImages] = useState([]);

  const user = JSON.parse(localStorage.getItem("servdial_user"));

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: null,
    city: null,
    district: "",
    state: "",
    address: "",
    phone: ""
  });

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, cityRes] = await Promise.all([
          API.get("/categories"),
          API.get("/cities")
        ]);

        // ✅ USE FLAT LIST (IMPORTANT)
        const cats = catRes.data?.flatCategories || [];

        setCategories(
          cats.map((c) => ({
            value: c._id,
            label: c.name
          }))
        );

        const cts = cityRes.data?.cities || [];

        setCities(
          cts.map((c) => ({
            value: c._id,
            label: `${c.name}, ${c.state}`,
            district: c.district,
            state: c.state
          }))
        );

      } catch (err) {
        console.error("FETCH ERROR:", err);
      }
    };

    fetchData();
  }, []);

  // ================= AUTO FILL =================
  useEffect(() => {
    if (form.city) {
      setForm((prev) => ({
        ...prev,
        district: form.city.district || "",
        state: form.city.state || ""
      }));
    }
  }, [form.city]);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

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

    alert("Success");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:flex gap-6">
      <form onSubmit={handleSubmit} className="space-y-4 md:w-1/2">

        <input
          placeholder="Business Name"
          className="border p-2 w-full"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* CATEGORY */}
        <Select
          options={categories}
          value={form.category}
          onChange={(v) => setForm({ ...form, category: v })}
          placeholder="Select Category"
          isSearchable
        />

        {/* CITY */}
        <Select
          options={cities}
          value={form.city}
          onChange={(v) => setForm({ ...form, city: v })}
          placeholder="Select City"
          isSearchable
        />

        <input value={form.district} readOnly className="border p-2 w-full" />
        <input value={form.state} readOnly className="border p-2 w-full" />

        {/* LOGO */}
        <ImageUploader
          images={logo ? [logo] : []}
          setImages={(img) => setLogo(img[0] || "")}
        />

        {/* MAP */}
        <div className="h-64">
          <MapContainer center={location} zoom={13} style={{ height: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={location} icon={markerIcon} />
            <LocationPicker setLocation={setLocation} />
            <MapController location={location} />
          </MapContainer>
        </div>

        <button className="bg-blue-600 text-white px-6 py-2 rounded w-full">
          Submit
        </button>

      </form>
    </div>
  );
};

export default AddBusiness;