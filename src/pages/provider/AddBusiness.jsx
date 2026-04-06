// frontend/src/pages/provider/AddBusiness.jsx
import { useEffect, useState, useMemo } from "react";
import API from "../../api/axios";

import {
  MapContainer,
  TileLayer,
  Marker,
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
      <p className="text-sm text-gray-600">Upload {multiple ? "Images" : "Logo"}</p>

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
  const [detectingLocation, setDetectingLocation] = useState(false);

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
    phone: "",
    boost: false,
    whatsapp: "",
    tags: ""
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // ================= PROFILE STRENGTH =================
  const completionScore = useMemo(() => {
    let score = 0;

    if (form.name) score += 10;
    if (form.description) score += 15;
    if (form.category) score += 10;
    if (form.city) score += 10;
    if (form.address) score += 10;
    if (form.phone) score += 10;
    if (logo) score += 10;
    if (images.length) score += 10;
    if (form.tags) score += 15;

    return score;
  }, [form, logo, images]);

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, cityRes] = await Promise.all([
          API.get("/categories"),
          API.get("/cities")
        ]);

        setCategories(
          (catRes.data?.flatCategories || []).map((c) => ({
            value: c._id,
            label: c.name
          }))
        );

        setCities(
          (cityRes.data?.cities || []).map((c) => ({
            value: c._id,
            label: `${c.name}, ${c.state}`,
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

  // ================= LOCATION =================
  const detectLocation = () => {
    if (!navigator.geolocation) return;

    setDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation([pos.coords.latitude, pos.coords.longitude]);
        setDetectingLocation(false);
      },
      () => {
        setDetectingLocation(false);
        alert("Location permission denied");
      }
    );
  };

  // ================= AI =================
  const generateAITags = async () => {
    if (!form.name) return alert("Enter business name first");

    try {
      setAiLoading(true);

      const res = await API.post("/ai/generate-tags", {
        name: form.name,
        category: form.category?.label
      });

      setForm((prev) => ({
        ...prev,
        tags: res.data.tags.join(", "),
        description: res.data.description || prev.description
      }));

    } catch {
      alert("AI failed");
    } finally {
      setAiLoading(false);
    }
  };

  // ================= DUPLICATE =================
  const checkDuplicate = async () => {
    if (!form.name || !form.city) return;

    try {
      const res = await API.get(
        `/business/check-duplicate?name=${form.name}&city=${form.city.value}`
      );

      setDuplicateWarning(res.data.exists ? "⚠️ Similar business exists" : null);
    } catch {}
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/provider/business",
        {
          ...form,
          category: form.category?.value,
          city: form.city?.value,
          boost: form.boost,
          logo,
          images,
          tags: form.tags
            ? form.tags.split(",").map((t) => t.trim())
            : [],
          location: {
            type: "Point",
            coordinates: [location[1], location[0]]
          }
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      alert("Business Added Successfully");
    } catch {
      alert("Failed");
    }
  };

  // ================= UI =================
  return (
    <div className="max-w-7xl mx-auto p-6 md:flex gap-6">

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} className="space-y-4 md:w-1/2">

        <input
          placeholder="Business Name *"
          onBlur={checkDuplicate}
          className="border p-2 w-full"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {duplicateWarning && <p className="text-red-500 text-sm">{duplicateWarning}</p>}

        <textarea
          placeholder="Description *"
          className="border p-2 w-full"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <Select
          options={categories}
          value={form.category}
          onChange={(v) => setForm({ ...form, category: v })}
          placeholder="Category *"
        />

        <input
          placeholder="Address *"
          className="border p-2 w-full"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <Select
          options={cities}
          value={form.city}
          onChange={(v) => {
            setForm({ ...form, city: v });
            setTimeout(checkDuplicate, 300);
          }}
          placeholder="City *"
        />

        <input value={form.district} readOnly placeholder="District" className="border p-2 w-full" />
        <input value={form.state} readOnly placeholder="State" className="border p-2 w-full" />

        <input
          placeholder="Phone *"
          className="border p-2 w-full"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

       {/* BOOST OPTION */}
<div className="flex items-center justify-between border p-3 rounded">
  <div>
    <p className="font-medium text-sm">🚀 Boost Listing</p>
    <p className="text-xs text-gray-500">
      Rank higher & get more visibility
    </p>
  </div>

  <input
    type="checkbox"
    checked={form.boost}
    onChange={(e) =>
      setForm({ ...form, boost: e.target.checked })
    }
  />
</div>

        <input
          placeholder="WhatsApp"
          className="border p-2 w-full"
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
        />

        <input
          placeholder="Tags"
          className="border p-2 w-full"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />

        <button type="button" onClick={generateAITags} className="text-blue-600 text-sm">
          {aiLoading ? "Generating..." : "✨ Generate with AI"}
        </button>

        <ImageUploader images={logo ? [logo] : []} setImages={(img) => setLogo(img[0] || "")} />
        <ImageUploader images={images} setImages={setImages} multiple />

        <button type="button" onClick={detectLocation} className="bg-black text-white px-3 py-1 rounded">
          {detectingLocation ? "Detecting..." : "📍 Use My Location"}
        </button>

        <div className="h-64">
          <MapContainer center={location} zoom={13} style={{ height: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={location} icon={markerIcon} />
            <LocationPicker setLocation={setLocation} />
            <MapController location={location} />
          </MapContainer>
        </div>

        <div className="bg-gray-100 p-3 rounded text-sm">
          Profile Strength: <b>{completionScore}%</b>
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={() => setShowPreview(true)} className="bg-gray-800 text-white px-4 py-2 rounded w-1/2">
            Preview
          </button>

          <button className="bg-blue-600 text-white px-4 py-2 rounded w-1/2">
            Submit
          </button>
        </div>

      </form>

      {/* ================= PREVIEW ================= */}
      <div className="md:w-1/2 bg-white p-4 rounded shadow sticky top-4 h-fit">
        <div className="md:w-1/2 bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg mb-2">{form.name || "Business Name"}</h2>
          <p className="text-sm text-gray-600">{form.description || "Description"}</p>
          
          <p className="text-sm mt-2">{form.address || "Address"}</p>

          {logo && <img src={logo} className="w-20 h-20 mt-2" />}
          <div className="flex gap-2 mt-2 flex-wrap">
            {images.map((img, i) => (
              <img key={i} src={img} className="w-16 h-16 rounded" />
            ))}
          </div>
        </div>
    </div>
    </div>
  );
};

export default AddBusiness;