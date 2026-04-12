import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Select from "react-select";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

import BusinessMediaManager from "../../components/BusinessMediaManager";
import BusinessHoursManager from "../../components/BusinessHoursManager";

// ================= ICON FIX =================
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ================= MAP PICKER =================
const LocationPicker = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const EditBusiness = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const [logo, setLogo] = useState("");
  const [images, setImages] = useState([]);
  const [businessHours, setBusinessHours] = useState(null);

  const [location, setLocation] = useState([26.1209, 85.3647]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: null,
    cityId: null,
    address: "",
    phone: "",
    whatsapp: "",
    website: "",
  });

  const user = JSON.parse(localStorage.getItem("servdial_user"));

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, cityRes, bizRes] = await Promise.all([
          API.get("/categories"),
          API.get("/cities"),
          API.get(`/business/${id}`),
        ]);

        setCategories(
          (catRes.data.categories || []).map((c) => ({
            value: c._id,
            label: c.name,
          }))
        );

        setCities(
          (cityRes.data.cities || []).map((c) => ({
            value: c._id,
            label: `${c.name} (${c.state})`,
            district: c.district,
            state: c.state,
          }))
        );

        const b = bizRes.data.business;

        setForm({
          name: b.name || "",
          description: b.description || "",
          categoryId: b.categoryId
            ? { value: b.categoryId._id, label: b.categoryId.name }
            : null,
          cityId: b.cityId
            ? { value: b.cityId._id, label: b.cityId.name }
            : null,
          address: b.address || "",
          phone: b.phone || "",
          whatsapp: b.whatsapp || "",
          website: b.website || "",
        });

        setLogo(b.logo || "");
        setImages(b.images || []);
        setBusinessHours(b.businessHours || null);

        if (b.location?.coordinates) {
          setLocation([
            b.location.coordinates[1],
            b.location.coordinates[0],
          ]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/business/${id}`, {
        ...form,
        categoryId: form.categoryId?.value,
        cityId: form.cityId?.value,
        logo,
        images,
        businessHours,
        location: {
          type: "Point",
          coordinates: [location[1], location[0]],
        },
        status: "pending",
      });

      alert("Business updated successfully!");
      navigate("/provider/dashboard");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  // ================= UI =================
  return (
    <div className="max-w-7xl mx-auto p-6 md:flex gap-6">

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} className="space-y-4 md:w-1/2">

        <input
          className="border p-2 w-full"
          placeholder="Business Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* CATEGORY */}
        <Select
          options={categories}
          value={form.categoryId}
          onChange={(v) =>
            setForm({ ...form, categoryId: v })
          }
        />

        {/* CITY */}
        <Select
          options={cities}
          value={form.cityId}
          onChange={(v) =>
            setForm({ ...form, cityId: v })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Address"
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="WhatsApp"
          value={form.whatsapp}
          onChange={(e) =>
            setForm({ ...form, whatsapp: e.target.value })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Website"
          value={form.website}
          onChange={(e) =>
            setForm({ ...form, website: e.target.value })
          }
        />

        {/* HOURS */}
        <BusinessHoursManager
          value={businessHours}
          onChange={setBusinessHours}
        />

        {/* MEDIA (REUSABLE COMPONENT) */}
        <BusinessMediaManager
          value={images}
          onChange={setImages}
        />

        {/* LOGO (simple version retained) */}
        <input
          type="file"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "servdial");

            const res = await fetch(
              "https://api.cloudinary.com/v1_1/dkz4ihfuv/image/upload",
              { method: "POST", body: data }
            );

            const json = await res.json();
            setLogo(json.secure_url);
          }}
        />

        {logo && (
          <img src={logo} className="h-20 mt-2 rounded" />
        )}

        {/* MAP */}
        <div className="h-64">
          <MapContainer center={location} zoom={13} style={{ height: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={location} icon={markerIcon} />
            <LocationPicker setLocation={setLocation} />
          </MapContainer>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Update Business
        </button>
      </form>

      {/* ================= PREVIEW ================= */}
      <div className="md:w-1/2 bg-white p-4 rounded shadow sticky top-4 h-fit">
        <h2 className="font-bold text-lg">{form.name}</h2>
        <p className="text-sm">{form.description}</p>
        <p className="text-sm mt-2">{form.address}</p>
        <p className="text-sm">{form.phone}</p>

        {logo && <img src={logo} className="w-20 h-20 mt-2 rounded" />}

        <div className="flex gap-2 mt-2 flex-wrap">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-16 h-16 rounded object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditBusiness;