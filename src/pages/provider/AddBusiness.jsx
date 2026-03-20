import { useEffect, useState } from "react";
import API from "../../api/axios";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from "react-leaflet";

import L from "leaflet";
import { useDropzone } from "react-dropzone";
import { FaStar } from "react-icons/fa";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import "leaflet/dist/leaflet.css";

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

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dkz4ihfuv/image/upload",
        { method: "POST", body: data }
      );
      const json = await res.json();
      return json.secure_url;
    } catch {
      return null;
    }
  };

  const onDrop = async (acceptedFiles) => {
    let uploaded = [];

    for (let file of acceptedFiles) {
      const url = await uploadFile(file);
      if (url) uploaded.push(url);
    }

    if (!uploaded.length) return;

    setImages(multiple ? [...images, ...uploaded] : uploaded);
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
// PREVIEW
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
          <div className="w-16 h-16 bg-gray-200 flex items-center justify-center">
            Logo
          </div>
        )}

        <div>
          <h2 className="font-bold text-lg">{data.name || "Business Name"}</h2>
          <p>{data.city || "City"}</p>

          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-yellow-400" />
            ))}
          </div>
        </div>
      </div>

      <p className="mt-2 text-gray-600">
        {data.description || "Description preview"}
      </p>

      <div className="flex gap-2 mt-3 flex-wrap">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-20 h-20 cursor-pointer object-cover rounded"
            onClick={() => {
              setIndex(i);
              setIsOpen(true);
            }}
          />
        ))}
      </div>

      {isOpen && images.length > 0 && (
        <Lightbox
          mainSrc={images[index]}
          nextSrc={images[(index + 1) % images.length]}
          prevSrc={images[(index + images.length - 1) % images.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setIndex((index + images.length - 1) % images.length)
          }
          onMoveNextRequest={() =>
            setIndex((index + 1) % images.length)
          }
        />
      )}

      <div className="h-40 mt-3">
        <MapContainer center={location} zoom={13} style={{ height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={location} icon={markerIcon}>
            <Popup>{data.name || "Business"}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

// ============================
// MAIN
// ============================
const AddBusiness = () => {

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [location, setLocation] = useState([20.5937, 78.9629]);

  const [logo, setLogo] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("servdial_user"));

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    city: "",
    address: "",
    phone: "",
    whatsapp: "",
    website: "",
    openingTime: "",
    closingTime: ""
  });

  // ✅ FINAL FIXED FETCH
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await API.get("/categories", {
          headers: { Authorization: "" } // 🔥 REMOVE TOKEN
        });

        const cityRes = await API.get("/cities");

        console.log("CATEGORIES:", catRes.data);

        setCategories(catRes.data?.categories || []);
        setCities(cityRes.data?.cities || []);

      } catch (err) {
        console.error("FETCH ERROR:", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await API.post(
        "/provider/business",
        {
          ...form,
          openingHours: `${form.openingTime} - ${form.closingTime}`,
          logo,
          images,
          location: {
            type: "Point",
            coordinates: [location[1], location[0]]
          }
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        }
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

        <input name="name" value={form.name} onChange={handleChange} placeholder="Business Name *" className="w-full border p-2" />

        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border p-2" />

        <select name="category" value={form.category} onChange={handleChange} className="w-full border p-2">
          <option value="">Select Category *</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <select name="city" value={form.city} onChange={handleChange} className="w-full border p-2">
          <option value="">Select City *</option>
          {cities.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <input name="address" value={form.address} onChange={handleChange} placeholder="Address *" className="w-full border p-2" />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone *" className="w-full border p-2" />

        <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="WhatsApp" className="w-full border p-2" />
        <input name="website" value={form.website} onChange={handleChange} placeholder="Website" className="w-full border p-2" />

        <div className="grid grid-cols-2 gap-2">
          <input type="time" name="openingTime" value={form.openingTime} onChange={handleChange} className="border p-2" />
          <input type="time" name="closingTime" value={form.closingTime} onChange={handleChange} className="border p-2" />
        </div>

        <div>
          <label className="font-semibold">Logo</label>
          <ImageUploader images={logo ? [logo] : []} setImages={(img) => setLogo(img[0])} />
        </div>

        <div>
          <label className="font-semibold">Images</label>
          <ImageUploader images={images} setImages={setImages} multiple />
        </div>

        <div className="h-64">
          <MapContainer center={location} zoom={13} style={{ height: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={location} icon={markerIcon} />
            <LocationPicker setLocation={setLocation} />
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