import { useEffect, useState } from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import API from "../../api/axios";

import Select from "react-select";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

import {
  FaSave,
  FaMapMarkerAlt,
} from "react-icons/fa";

import BusinessMediaManager from "../../components/BusinessMediaManager";
import BusinessHoursManager from "../../components/BusinessHoursManager";

import Loader from "../../components/common/Loader";

/* ================= MARKER FIX ================= */

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* ================= MAP PICKER ================= */

const LocationPicker = ({
  setLocation,
}) => {
  useMapEvents({
    click(e) {
      setLocation([
        e.latlng.lat,
        e.latlng.lng,
      ]);
    },
  });

  return null;
};

/* ================= SELECT STYLE ================= */

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "48px",
    borderRadius: "12px",
    borderColor: state.isFocused
      ? "#6366f1"
      : "#d1d5db",

    boxShadow: "none",

    "&:hover": {
      borderColor: "#6366f1",
    },
  }),
};

const EditBusiness = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [categories, setCategories] =
    useState([]);

  const [cities, setCities] =
    useState([]);

  const [location, setLocation] =
    useState([26.1209, 85.3647]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: null,
    cityId: null,
    address: "",
    pincode: "",
    phone: "",
    whatsapp: "",
    website: "",
    logo: "",
    images: [],
    businessHours: {},
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          catRes,
          cityRes,
          bizRes,
        ] = await Promise.all([
          API.get("/categories"),
          API.get("/cities"),
          API.get(`/business/${id}`),
        ]);

        /* ================= CATEGORIES ================= */

        const rawCategories =
          catRes?.data?.data || [];

        setCategories(
          rawCategories.map((c) => ({
            value: c._id,
            label: c.name,
          }))
        );

        /* ================= CITIES ================= */

        const rawCities =
          cityRes?.data?.data?.cities ||
          [];

        setCities(
          rawCities.map((c) => ({
            value: c._id,

            label: `${c.name} (${c.state})`,

            district: c.district,
            state: c.state,
          }))
        );

        /* ================= BUSINESS ================= */

        const business =
          bizRes?.data?.data;

        if (!business) return;

        setForm({
          name: business.name || "",

          description:
            business.description || "",

          categoryId:
            business.categoryId
              ? {
                  value:
                    business.categoryId
                      ._id,

                  label:
                    business.categoryId
                      .name,
                }
              : null,

          cityId: business.cityId
            ? {
                value:
                  business.cityId._id,

                label:
                  business.cityId.name,
              }
            : null,

          address:
            business.address || "",

          pincode:
            business.pincode || "",

          phone:
            business.phone || "",

          whatsapp:
            business.whatsapp || "",

          website:
            business.website || "",

          logo: business.logo || "",

          images:
            business.images || [],

          businessHours:
            business.businessHours ||
            {},
        });

        if (
          business.location
            ?.coordinates?.length === 2
        ) {
          setLocation([
            business.location
              .coordinates[1],

            business.location
              .coordinates[0],
          ]);
        }
      } catch (err) {
        console.error(err);
        alert(
          "Failed to load business"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* ================= INPUT ================= */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    let nextValue = value;

    if (
      name === "phone" ||
      name === "whatsapp"
    ) {
      nextValue = value
        .replace(/\D/g, "")
        .slice(0, 10);
    }

    if (name === "pincode") {
      nextValue = value
        .replace(/\D/g, "")
        .slice(0, 6);
    }

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await API.put(
        `/provider/businesses/${id}`,
        {
          name: form.name,

          description:
            form.description,

          categoryId:
            form.categoryId?.value,

          cityId:
            form.cityId?.value,

          address: form.address,

          pincode: form.pincode,

          phone: form.phone,

          whatsapp:
            form.whatsapp,

          website: form.website,

          logo: form.logo,

          images: form.images,

          businessHours:
            form.businessHours,

          location: {
            type: "Point",

            coordinates: [
              location[1],
              location[0],
            ],
          },
        }
      );

      alert(
        "Business updated successfully"
      );

      navigate(
        "/provider/businesses"
      );
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Update failed"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================= LOADER ================= */

  if (loading) {
    return <Loader />;
  }

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">

      <div className="grid lg:grid-cols-3 gap-6">

        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white border rounded-2xl shadow-sm p-5 md:p-6 space-y-5"
        >

          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              Edit Business
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Update your business
              details and information
            </p>

          </div>

          {/* NAME */}

          <div>
            <label className="text-sm font-medium mb-2 block">
              Business Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={
                handleChange
              }
              className="w-full border rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="text-sm font-medium mb-2 block">
              Description
            </label>

            <textarea
              rows={5}
              name="description"
              value={
                form.description
              }
              onChange={
                handleChange
              }
              className="w-full border rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          {/* CATEGORY */}

          <div>
            <label className="text-sm font-medium mb-2 block">
              Category
            </label>

            <Select
              options={categories}
              value={
                form.categoryId
              }
              onChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  categoryId: v,
                }))
              }
              styles={selectStyles}
            />
          </div>

          {/* CITY */}

          <div>
            <label className="text-sm font-medium mb-2 block">
              City
            </label>

            <Select
              options={cities}
              value={form.cityId}
              onChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  cityId: v,
                }))
              }
              styles={selectStyles}
            />
          </div>

          {/* ADDRESS */}

          <div>
            <label className="text-sm font-medium mb-2 block">
              Address
            </label>

            <input
              type="text"
              name="address"
              value={
                form.address
              }
              onChange={
                handleChange
              }
              className="w-full border rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          {/* GRID */}

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-medium mb-2 block">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={
                  form.phone
                }
                onChange={
                  handleChange
                }
                className="w-full border rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                WhatsApp
              </label>

              <input
                type="text"
                name="whatsapp"
                value={
                  form.whatsapp
                }
                onChange={
                  handleChange
                }
                className="w-full border rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

          </div>

          {/* WEBSITE */}

          <div>
            <label className="text-sm font-medium mb-2 block">
              Website
            </label>

            <input
              type="text"
              name="website"
              value={
                form.website
              }
              onChange={
                handleChange
              }
              className="w-full border rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          {/* HOURS */}

          <BusinessHoursManager
            value={
              form.businessHours
            }
            onChange={(hrs) =>
              setForm((prev) => ({
                ...prev,
                businessHours:
                  hrs,
              }))
            }
          />

          {/* MEDIA */}

          <BusinessMediaManager
            value={form.images}
            onChange={(imgs) =>
              setForm((prev) => ({
                ...prev,
                images: imgs,
              }))
            }
          />

          {/* MAP */}

          <div>

            <div className="flex items-center gap-2 mb-3">
              <FaMapMarkerAlt className="text-red-500" />

              <h2 className="font-semibold">
                Business Location
              </h2>
            </div>

            <div className="h-72 rounded-2xl overflow-hidden border">

              <MapContainer
                center={location}
                zoom={13}
                style={{
                  height: "100%",
                }}
              >

                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Marker
                  position={
                    location
                  }
                  icon={
                    markerIcon
                  }
                />

                <LocationPicker
                  setLocation={
                    setLocation
                  }
                />

              </MapContainer>

            </div>

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition"
          >

            <FaSave />

            {saving
              ? "Saving..."
              : "Update Business"}

          </button>

        </form>

        {/* ================= PREVIEW ================= */}

        <div className="bg-white border rounded-2xl shadow-sm p-5 sticky top-4 h-fit">

          <h2 className="text-xl font-bold text-gray-900">
            Live Preview
          </h2>

          <div className="mt-4">

            {form.logo && (
              <img
                src={form.logo}
                alt={form.name}
                className="w-24 h-24 rounded-2xl object-cover border mb-4"
              />
            )}

            <h3 className="text-lg font-semibold">
              {form.name ||
                "Business Name"}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              {
                form.description
              }
            </p>

            <div className="mt-4 text-sm text-gray-600 space-y-1">

              <p>
                📍{" "}
                {form.address}
              </p>

              <p>
                📞 {form.phone}
              </p>

              <p>
                🌐{" "}
                {form.website}
              </p>

            </div>

            {/* GALLERY */}

            {form.images
              ?.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-5">

                {form.images.map(
                  (img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt=""
                      className="w-full h-20 rounded-xl object-cover border"
                    />
                  )
                )}

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default EditBusiness;