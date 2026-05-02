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

  // ================= FETCH =================
  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await getAllCities();
      setCities(res.data?.cities || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch cities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // ================= ADD CITY =================
  const handleAddCity = async () => {
    const name = form.name.trim();
    const district = form.district.trim();
    const state = form.state.trim();
    const lat = Number(form.latitude);
    const lng = Number(form.longitude);

    if (!name || !district || !state || isNaN(lat) || isNaN(lng)) {
      setError("All fields including coordinates are required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await addCity({
        name,
        district,
        state,
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
      alert("Failed to add city");
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE CITY =================
  const handleUpdateCity = async (id) => {
    const name = editForm.name.trim();
    const district = editForm.district.trim();
    const state = editForm.state.trim();
    const lat = Number(editForm.latitude);
    const lng = Number(editForm.longitude);

    if (!name || !district || !state || isNaN(lat) || isNaN(lng)) {
      alert("All fields required");
      return;
    }

    setLoading(true);

    try {
      await updateCity(id, {
        name,
        district,
        state,
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

      const rows = text.split("\n").slice(1).map((r) => r.split(","));

      const payload = rows
        .map((r) => ({
          name: r[0]?.trim(),
          district: r[1]?.trim(),
          state: r[2]?.trim(),
          latitude: Number(r[3]),
          longitude: Number(r[4]),
        }))
        .filter((c) => c.name && !isNaN(c.latitude) && !isNaN(c.longitude));

      await bulkUploadCities({ cities: payload });

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
    <div className="p-6 max-w-6xl mx-auto">

      <h2 className="text-2xl font-bold mb-4">Manage Cities</h2>

      {loading && <Loader />}

      {/* ================= ADD ================= */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">

        <input
          placeholder="City"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          placeholder="District"
          value={form.district}
          onChange={(e) => setForm({ ...form, district: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          placeholder="State"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          placeholder="Lat"
          value={form.latitude}
          onChange={(e) => setForm({ ...form, latitude: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          placeholder="Lng"
          value={form.longitude}
          onChange={(e) => setForm({ ...form, longitude: e.target.value })}
          className="border p-2 rounded"
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
      <table className="w-full border">
        <thead>
          <tr>
            <th>City</th>
            <th>District</th>
            <th>State</th>
            <th>Lat</th>
            <th>Lng</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {paginated.map((c) => (
            <tr key={c._id} className="text-center">

              <td>
                {editId === c._id ? (
                  <input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                ) : (
                  c.name
                )}
              </td>

              <td>{c.district}</td>
              <td>{c.state}</td>
              <td>{c.latitude}</td>
              <td>{c.longitude}</td>

              <td>
                <button
                  onClick={() => {
                    setEditId(c._id);
                    setEditForm(c);
                  }}
                >
                  <FaEdit />
                </button>

                {editId === c._id && (
                  <button onClick={() => handleUpdateCity(c._id)}>
                    Save
                  </button>
                )}

                <button onClick={() => handleDelete(c._id)}>
                  <FaTrash />
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default ManageCities;