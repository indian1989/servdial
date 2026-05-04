// src/pages/admin/ManageCities.jsx

import React, { useState, useEffect } from "react";
import {
  getAllCities,
  addCity,
  updateCity,
  deleteCity,
  bulkUploadCities,
} from "../../api/adminAPI";

import Loader from "../../components/common/Loader";
import { FaTrash, FaEdit } from "react-icons/fa";
import CreatableSelect from "react-select/creatable";

const PAGE_SIZE = 15;

const ManageCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ================= ADD FORM =================
  const [form, setForm] = useState({
    name: "",
    district: "",
    state: "",
    latitude: "",
    longitude: "",
  });

  const [error, setError] = useState("");

  // ================= EDIT =================
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    district: "",
    state: "",
    latitude: "",
    longitude: "",
  });

  // ================= DROPDOWN OPTIONS =================
const getOptions = (key) => {
  const unique = [...new Set(cities.map((c) => c[key]).filter(Boolean))];

  return unique.map((v) => ({
    label: v,
    value: v,
  }));
};

// ================= FIND CITY DATA =================
const getCityDetails = (cityName) => {
  if (!cityName) return null;

  const normalized = cityName.toLowerCase().trim();

  return cities.find(
    (c) =>
      c.name?.toLowerCase().trim() === normalized ||
      c.name?.toLowerCase().includes(normalized)
  );
};

// ================= TOGGLE FEATURED =================
const toggleFeatured = async (city) => {
  try {
    await updateCity(city._id, {
      isFeatured: !city.isFeatured,
    });

    fetchCities(); // refresh UI
  } catch (err) {
    console.error(err);
    alert("Failed to update featured status");
  }
};

  // ================= FETCH =================
  const fetchCities = async () => {
  setLoading(true);
  try {
    const res = await getAllCities();

    console.log("🔥 FULL RESPONSE:", res);
    console.log("🔥 DATA:", res.data);

    setCities(res.data?.data || []);
  } catch (err) {
    console.error("❌ FETCH ERROR:", err);
    alert("Failed to fetch cities");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCities();
  }, []);

  // ================= COORDINATES =================
  const fetchCoordinates = async (name, district, state) => {
  try {
    const query = `${name}, ${district}, ${state}, India`;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    );

    const data = await res.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }

    return null;
  } catch (err) {
    console.error("Geo error:", err);
    return null;
  }
};

// ================= FETCH CITY DETAILS =================
const fetchCityMeta = async (name) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(name)}`
    );

    const data = await res.json();

    if (data && data.length > 0) {
      const addr = data[0].address;

      return {
        district:
          addr.state_district ||
          addr.county ||
          addr.city_district ||
          "",
        state: addr.state || "",
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }

    return null;
  } catch (err) {
    console.error("City meta error:", err);
    return null;
  }
};

// ================= ADD CITY =================
const handleAddCity = async () => {
  if (!form.name || !form.district || !form.state) {
    return setError("City, district, state required");
  }

  setLoading(true);
  setError("");

  try {
    let lat = Number(form.latitude);
    let lng = Number(form.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      const coords = await fetchCoordinates(
        form.name,
        form.district,
        form.state
      );

      if (!coords) {
        setError("Coordinates not found");
        setLoading(false);
        return;
      }

      lat = coords.lat;
      lng = coords.lng;
    }

    await addCity({
      name: form.name,
      district: form.district,
      state: form.state,
      country: "India",
      latitude: lat,
      longitude: lng,
    });

    setForm({
      name: "",
      district: "",
      state: "",
      latitude: "",
      longitude: "",
    });

    fetchCities();
  } catch (err) {
    console.error(err);
    alert("Add failed");
  } finally {
    setLoading(false);
  }
};

  // ================= UPDATE CITY =================
  const handleUpdateCity = async (id) => {
  if (!editForm.name || !editForm.district || !editForm.state) {
    return alert("All fields required");
  }

  setLoading(true);

  try {
    let lat = Number(editForm.latitude);
    let lng = Number(editForm.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      const coords = await fetchCoordinates(
        editForm.name,
        editForm.district,
        editForm.state
      );

      if (!coords) {
        alert("Coordinates not found");
        setLoading(false);
        return;
      }

      lat = coords.lat;
      lng = coords.lng;
    }

    await updateCity(id, {
      name: editForm.name,
      district: editForm.district,
      state: editForm.state,
      latitude: lat,
      longitude: lng,
    });

    setEditId(null);
    fetchCities();
  } catch (err) {
    console.error(err);
    alert("Update failed");
  } finally {
    setLoading(false);
  }
};

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this city?")) return;

    setLoading(true);
    try {
      await deleteCity(id);
      fetchCities();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= BULK UPLOAD =================
  const handleBulk = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploading(true);

  try {
    const text = await file.text();

    const rows = text.split("\n").slice(1);

    const processed = [];

    for (let row of rows) {
      const [name, district, state, lat, lng] = row.split(",");

      if (!name || !district || !state) continue;

      let latitude = Number(lat);
      let longitude = Number(lng);

      if (isNaN(latitude) || isNaN(longitude)) {
        const coords = await fetchCoordinates(name, district, state);
        if (!coords) continue;

        latitude = coords.lat;
        longitude = coords.lng;
      }

      processed.push({
        name: name.trim(),
        district: district.trim(),
        state: state.trim(),
        latitude,
        longitude,
      });
    }

    await bulkUploadCities({ cities: processed });

    fetchCities();
  } catch (err) {
    console.error(err);
    alert("Bulk upload failed");
  } finally {
    setUploading(false);
  }
};

  // ================= FILTER =================
  const filtered = cities.filter((c) =>
    `${c.name} ${c.district} ${c.state}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // ================= UI =================
 return (
  <div className="p-6 max-w-6xl mx-auto relative">

    <h2 className="text-2xl font-bold mb-4">Manage Cities</h2>

    {/* NON-BLOCKING LOADER */}
    {loading && (
      <div className="absolute top-2 right-2 text-sm text-gray-500">
        Loading...
      </div>
    )}

      {/* ================= ADD ================= */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">

        <CreatableSelect
  placeholder="Select or type city"
  options={getOptions("name")}
  value={form.name ? { label: form.name, value: form.name } : null}
  onChange={async (selected) => {
  const cityName = selected?.value || "";

  // 🔥 1. Try DB first
  const cityData = getCityDetails(cityName);

  let updatedForm = {
    ...form,
    name: cityName,
    district: cityData?.district || "",
    state: cityData?.state || "",
  };

  setForm(updatedForm);

  // 🔥 2. If not found in DB → use geo autofill
  if (!cityData && cityName) {
    const meta = await fetchCityMeta(cityName);

    if (meta) {
      updatedForm = {
        ...updatedForm,
        district: meta.district || "",
        state: meta.state || "",
        latitude: meta.lat,
        longitude: meta.lng,
      };

      setForm(updatedForm);
      return;
    }
  }

  // 🔥 3. fallback → fetch coords
  if (updatedForm.name && updatedForm.district && updatedForm.state) {
    const coords = await fetchCoordinates(
      updatedForm.name,
      updatedForm.district,
      updatedForm.state
    );

    if (coords) {
      setForm((prev) => ({
        ...prev,
        latitude: coords.lat,
        longitude: coords.lng,
      }));
    }
  }
}}
/>

        <CreatableSelect
  placeholder="Select or type district"
  options={getOptions("district")}
  value={
    form.district ? { label: form.district, value: form.district } : null
  }
  onChange={async (selected) => {
  const district = selected?.value || "";

  const updated = { ...form, district };
  setForm(updated);

  if (updated.name && district && updated.state) {
    const coords = await fetchCoordinates(
      updated.name,
      district,
      updated.state
    );

    if (coords) {
      setForm((prev) => ({
        ...prev,
        latitude: coords.lat,
        longitude: coords.lng,
      }));
    }
  }
}}
/>

        <CreatableSelect
  placeholder="Select or type state"
  options={getOptions("state")}
  value={form.state ? { label: form.state, value: form.state } : null}
  onChange={async (selected) => {
    const newState = selected?.value || "";

    const updatedForm = { ...form, state: newState };
    setForm(updatedForm);

    // 🔥 AUTO COORDINATES
    if (updatedForm.name && updatedForm.district && newState) {
      const coords = await fetchCoordinates(
        updatedForm.name,
        updatedForm.district,
        newState
      );

      if (coords) {
        setForm((prev) => ({
          ...prev,
          latitude: coords.lat,
          longitude: coords.lng,
        }));
      }
    }
  }}
/>

        <input
  placeholder="Lat (auto)"
  value={form.latitude}
  disabled
  className="border p-2 rounded bg-gray-100 cursor-not-allowed"
/>

<input
  placeholder="Lng (auto)"
  value={form.longitude}
  disabled
  className="border p-2 rounded bg-gray-100 cursor-not-allowed"
/>

      </div>

      <button
        onClick={handleAddCity}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Add City
      </button>

      {/* ================= BULK ================= */}
      <div className="mb-4">
        <input type="file" accept=".csv" onChange={handleBulk} />
        {uploading && <p>Uploading...</p>}
      </div>

      {/* ================= SEARCH ================= */}
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

  <div className="overflow-x-auto">
    <table className="w-full text-sm">

      {/* HEADER */}
      <thead className="bg-gray-100 sticky top-0 z-10">
        <tr className="text-left text-gray-600 uppercase text-xs tracking-wider">
          <th className="p-3">City</th>
          <th className="p-3">District</th>
          <th className="p-3">State</th>
          <th className="p-3">Latitude</th>
          <th className="p-3">Longitude</th>
          <th className="p-3 text-center">Featured</th>
          <th className="p-3 text-center">Actions</th>
        </tr>
      </thead>

      {/* BODY */}
      <tbody>
        {paginated.map((c, index) => (
          <tr
            key={c._id}
            className={`border-t hover:bg-gray-50 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
            }`}
          >

            {/* CITY */}
            <td className="p-3 font-medium">
              {editId === c._id ? (
                <input
                  className="border px-2 py-1 rounded w-full"
                  value={editForm.name}
                  onBlur={async () => {
                    if (!editForm.name) return;

                    const meta = await fetchCityMeta(editForm.name);

                    if (meta) {
                      setEditForm((prev) => ({
                        ...prev,
                        district: meta.district || prev.district,
                        state: meta.state || prev.state,
                        latitude: meta.lat,
                        longitude: meta.lng,
                      }));
                    }
                  }}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              ) : (
                c.name
              )}
            </td>

            {/* DISTRICT */}
            <td className="p-3">
            {editId === c._id ? (
              <CreatableSelect
                options={getOptions("district")}
                value={
                  editForm.district
                    ? { label: editForm.district, value: editForm.district }
                    : null
                }
                onChange={(selected) =>
                  setEditForm({ ...editForm, district: selected?.value || "" })
                }
              />
            ) : (
              c.district
            )}
          </td>

            {/* STATE */}
            <td className="p-3">
            {editId === c._id ? (
              <CreatableSelect
                options={getOptions("state")}
                value={
                  editForm.state
                    ? { label: editForm.state, value: editForm.state }
                    : null
                }
                onChange={(selected) =>
                  setEditForm({ ...editForm, state: selected?.value || "" })
                }
              />
            ) : (
              c.state
            )}
          </td>

            {/* LAT */}
            <td className="p-3">
            {editId === c._id ? (
              <input
                type="number"
                className="border px-2 py-1 rounded w-full"
                value={editForm.latitude}
                onChange={(e) =>
                  setEditForm({ ...editForm, latitude: e.target.value })
                }
              />
            ) : (
              c.latitude
            )}
          </td>

            {/* LNG */}
            <td className="p-3">
            {editId === c._id ? (
              <input
                type="number"
                className="border px-2 py-1 rounded w-full"
                value={editForm.longitude}
                onChange={(e) =>
                  setEditForm({ ...editForm, longitude: e.target.value })
                }
              />
            ) : (
              c.longitude
            )}
          </td>

          {/* FEATURE TOGGLE */}
                <td className="p-3 text-center">
                  <button
                    onClick={() => toggleFeatured(c)}
                    className={`px-3 py-1 rounded text-xs ${
                      c.isFeatured
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    {c.isFeatured ? "Featured" : "Mark Featured"}
                  </button>
                </td>

            {/* ACTIONS */}
            <td className="p-3">
              <div className="flex justify-center gap-2">

                {editId === c._id ? (
                  <>
                    <button
                      onClick={() => handleUpdateCity(c._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditId(null)}
                      className="px-3 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditId(c._id);
                        setEditForm({
                        ...c,
                        latitude: c.latitude ?? "",
                        longitude: c.longitude ?? "",
                      });
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      <FaEdit /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(c._id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                    >
                      <FaTrash /> Delete
                    </button>
                  </>
                )}

              </div>
            </td>

          </tr>
        ))}
      </tbody>

    </table>
  </div>

</div>

</div>
  );
};

export default ManageCities;