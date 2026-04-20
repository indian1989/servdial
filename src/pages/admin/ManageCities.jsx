import React, { useState, useEffect } from "react";
import {
  getAllCities,
  addCity,
  updateCity,
  deleteCity,
  bulkUploadCities
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

  const [newCity, setNewCity] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [newState, setNewState] = useState("");

  const [formError, setFormError] = useState(false);

  const [editingCityId, setEditingCityId] = useState(null);
  const [editingData, setEditingData] = useState({
    name: "",
    district: "",
    state: ""
  });

  // ================= FETCH =================
  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await getAllCities();
      setCities(res.data?.cities || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch cities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // ================= ADD =================
  const handleAddCity = async () => {
    const city = newCity.trim().replace(/\b\w/g, l => l.toUpperCase());
const district = newDistrict.trim().replace(/\b\w/g, l => l.toUpperCase());
const state = newState.trim().replace(/\b\w/g, l => l.toUpperCase());

    if (!city || !district || !state) {
      setFormError(true);
      return alert("City, District and State are mandatory.");
    }

    setFormError(false);
    setLoading(true);

    try {
      await addCity({ name: city, district, state });

      setNewCity("");
      setNewDistrict("");
      setNewState("");

      fetchCities();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to add city.");
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE =================
  const handleUpdateCity = async (id) => {
    const city = editingData.name.trim();
    const district = editingData.district.trim();
    const state = editingData.state.trim();

    if (!city || !district || !state) {
      return alert("City, District and State are mandatory.");
    }

    setLoading(true);

    try {
      await updateCity(id, { name: city, district, state });

      setEditingCityId(null);
      setEditingData({ name: "", district: "", state: "" });

      fetchCities();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to update city.");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDeleteCity = async (id) => {
    if (!window.confirm("Are you sure you want to delete this city?")) return;

    setLoading(true);

    try {
      await deleteCity(id);
      fetchCities();
    } catch (err) {
      console.error(err);
      alert("Failed to delete city.");
    } finally {
      setLoading(false);
    }
  };

  // ================= BULK UPLOAD =================
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const text = await file.text();

      const rows = text
        .split("\n")
        .map((r) => r.trim())
        .filter((r) => r !== "");

      if (rows.length <= 1) {
        alert("CSV file is empty or invalid.");
        return;
      }

      const cities = rows.slice(1).map((row, index) => {
        const cols = row.split(",");

        return {
          name: cols[0]?.trim().replace(/\b\w/g, l => l.toUpperCase()),
district: cols[1]?.trim().replace(/\b\w/g, l => l.toUpperCase()),
state: cols[2]?.trim().replace(/\b\w/g, l => l.toUpperCase()),
        };
      });

      const validCities = cities.filter(
        (c) => c.name && c.district && c.state
      );

      if (validCities.length === 0) {
        alert("No valid rows found.");
        return;
      }

      const res = await bulkUploadCities({ cities: validCities });

      alert(`
✅ Inserted: ${res.data.inserted}
⏭ Skipped: ${res.data.skipped}
❌ Failed: ${res.data.failedCount}
      `);

      fetchCities();

    } catch (err) {
      console.error(err);
      alert("Bulk upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // ================= FILTER =================
  const filteredCities = cities.filter((c) =>
    `${c.name} ${c.district} ${c.state}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCities.length / PAGE_SIZE);

  const paginatedCities = filteredCities.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ================= UI =================
  return (
    <div className="p-6 max-w-6xl mx-auto">

      <h2 className="text-2xl font-bold mb-4">Manage Cities</h2>

      {loading && <Loader />}

      {/* ADD SECTION */}
      <div className="flex gap-2 mb-4 flex-wrap">

        <input
          type="text"
          placeholder="City *"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          className={`border px-3 py-2 rounded flex-1 min-w-[150px] ${
            formError && !newCity.trim() ? "border-red-500" : ""
          }`}
        />

        <input
          type="text"
          placeholder="District *"
          value={newDistrict}
          onChange={(e) => setNewDistrict(e.target.value)}
          className={`border px-3 py-2 rounded flex-1 min-w-[150px] ${
            formError && !newDistrict.trim() ? "border-red-500" : ""
          }`}
        />

        <input
          type="text"
          placeholder="State *"
          value={newState}
          onChange={(e) => setNewState(e.target.value)}
          className={`border px-3 py-2 rounded flex-1 min-w-[150px] ${
            formError && !newState.trim() ? "border-red-500" : ""
          }`}
        />

        <button
          onClick={handleAddCity}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add City
        </button>

      </div>

      {/* BULK UPLOAD */}
      <div className="mb-4 flex items-center gap-3">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="border px-3 py-2 rounded"
        />
        {uploading && (
          <span className="text-blue-500 font-medium">
            Uploading...
          </span>
        )}
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search city / district / state..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-4"
      />

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">

          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="border px-3 py-2">City</th>
              <th className="border px-3 py-2">District</th>
              <th className="border px-3 py-2">State</th>
              <th className="border px-3 py-2">Slug</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCities.map((city) => (
              <tr key={city._id} className="text-center">

                <td className="border px-3 py-2">
                  {editingCityId === city._id ? (
                    <input
                      value={editingData.name}
                      onChange={(e) =>
                        setEditingData({ ...editingData, name: e.target.value })
                      }
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : city.name}
                </td>

                <td className="border px-3 py-2">
                  {editingCityId === city._id ? (
                    <input
                      value={editingData.district}
                      onChange={(e) =>
                        setEditingData({ ...editingData, district: e.target.value })
                      }
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : city.district}
                </td>

                <td className="border px-3 py-2">
                  {editingCityId === city._id ? (
                    <input
                      value={editingData.state}
                      onChange={(e) =>
                        setEditingData({ ...editingData, state: e.target.value })
                      }
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : city.state}
                </td>

                <td className="border px-3 py-2">{city.slug}</td>

                <td className="border px-3 py-2 flex justify-center gap-2 flex-wrap">

                  <button
                    onClick={() => {
                      setEditingCityId(city._id);
                      setEditingData({
                        name: city.name,
                        district: city.district,
                        state: city.state
                      });
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>

                  {editingCityId === city._id && (
                    <>
                      <button
                        onClick={() => handleUpdateCity(city._id)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingCityId(null)}
                        className="bg-gray-400 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleDeleteCity(city._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                  >
                    <FaTrash /> Delete
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageCities;