import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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

  const [location, setLocation] = useState([20.5937, 78.9629]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    city: "",
    address: "",
    phone: "",
    whatsapp: "",
    website: "",
    openingHours: "",
  });

  const fetchData = async () => {
    try {
      const cat = await API.get("/categories");
      const cit = await API.get("/cities");
      const biz = await API.get(`/business/${id}`);

      setCategories(cat.data || []);
      setCities(cit.data || []);

      const b = biz.data.business;

      setForm({
        name: b.name || "",
        description: b.description || "",
        category: b.category?._id || "",
        city: b.city || "",
        address: b.address || "",
        phone: b.phone || "",
        whatsapp: b.whatsapp || "",
        website: b.website || "",
        openingHours: b.openingHours || "",
      });

      setLogo(b.logo || "");
      setImages(b.images || []);

      if (b.location) {
        setLocation([b.location.coordinates[1], b.location.coordinates[0]]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "servdial");

    const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
      method: "POST",
      body: data,
    });

    const json = await res.json();
    return json.secure_url;
  };

  const handleLogoUpload = async (e) => {
    const url = await uploadImage(e.target.files[0]);
    setLogo(url);
  };

  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    let uploaded = [];
    for (let file of files) {
      const url = await uploadImage(file);
      uploaded.push(url);
    }
    setImages(uploaded);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/business/${id}`, {
        ...form,
        logo,
        images,
        location: { type: "Point", coordinates: [location[1], location[0]] },
        status: "pending",
      });
      alert("Business updated and sent for approval");
      navigate("/provider/dashboard");
    } catch (err) {
      alert("Error updating business");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Business</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Business Name" className="w-full border p-2" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Business Description" className="w-full border p-2" />
        <select name="category" value={form.category} onChange={handleChange} className="w-full border p-2">
          <option>Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <select name="city" value={form.city} onChange={handleChange} className="w-full border p-2">
          <option>Select City</option>
          {cities.map((c) => (
            <option key={c._id} value={c.name}>{c.name}</option>
          ))}
        </select>
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="w-full border p-2" />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full border p-2" />
        <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="WhatsApp" className="w-full border p-2" />
        <input name="website" value={form.website} onChange={handleChange} placeholder="Website" className="w-full border p-2" />
        <input name="openingHours" value={form.openingHours} onChange={handleChange} placeholder="Opening Hours" className="w-full border p-2" />

        <div>
          <label className="font-semibold">Business Logo</label>
          <input type="file" onChange={handleLogoUpload} />
          {logo && <img src={logo} className="h-20 mt-2" />}
        </div>

        <div>
          <label className="font-semibold">Business Images</label>
          <input type="file" multiple onChange={handleImagesUpload} />
          <div className="grid grid-cols-4 gap-2 mt-2">
            {images.map((img, i) => (
              <img key={i} src={img} className="h-20 object-cover" />
            ))}
          </div>
        </div>

        <div>
          <label className="font-semibold">Update Location</label>
          <div className="h-80 mt-2">
            <MapContainer center={location} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={location} icon={markerIcon} />
              <LocationPicker setLocation={setLocation} />
            </MapContainer>
          </div>
        </div>

        <button className="bg-blue-600 text-white px-6 py-2 rounded">Update Business</button>
      </form>
    </div>
  );
};

export default EditBusiness;