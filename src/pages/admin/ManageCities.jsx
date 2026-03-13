import React, { useState, useEffect } from "react";
import { getAllCities, addCity, updateCity, deleteCity } from "../../api/adminAPI";
import Loader from "../../components/common/Loader";
import { FaTrash, FaEdit } from "react-icons/fa";

const PAGE_SIZE = 10;

const ManageCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newCity, setNewCity] = useState("");
  const [editingCityId, setEditingCityId] = useState(null);
  const [editingCityName, setEditingCityName] = useState("");

  // ================= FETCH CITIES =================
  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await getAllCities();
      setCities(res.data?.cities || []);
    } catch (err) {
      console.error("Failed to fetch cities:", err);
      alert("Failed to fetch cities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // ================= CRUD HANDLERS =================
  const handleAddCity = async () => {
    if (!newCity.trim()) return alert("City name cannot be empty.");
    setLoading(true);
    try {
      await addCity({ name: newCity });
      setNewCity("");
      fetchCities();
    } catch (err) {
      console.error(err);
      alert("Failed to add city.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCity = async (id) => {
    if (!editingCityName.trim()) return alert("City name cannot be empty.");
    setLoading(true);
    try {
      await updateCity(id, { name: editingCityName });
      setEditingCityId(null);
      setEditingCityName("");
      fetchCities();
    } catch (err) {
      console.error(err);
      alert("Failed to update city.");
    } finally {
      setLoading(false);
    }
  };

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

  // ================= FILTER & PAGINATION =================

const filteredCities = Array.isArray(cities)
  ? cities.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    )
  : [];

const totalPages = Math.ceil(filteredCities.length / PAGE_SIZE);

const paginatedCities = filteredCities.slice(
  (currentPage - 1) * PAGE_SIZE,
  currentPage * PAGE_SIZE
);

  // ================= RENDER =================
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Cities</h2>

      {/* Add City */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="New City"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          className="border px-3 py-2 rounded flex-1 min-w-[200px]"
        />
        <button
          onClick={handleAddCity}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add City
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search cities..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-4"
      />

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr className="text-center">
                <th className="border px-3 py-2">City Name</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCities.map((city) => (
                <tr key={city._id} className="text-center">
                  <td className="border px-3 py-2">
                    {editingCityId === city._id ? (
                      <input
                        type="text"
                        value={editingCityName}
                        onChange={(e) => setEditingCityName(e.target.value)}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      city.name
                    )}
                  </td>
                  <td className="border px-3 py-2 flex justify-center gap-2 flex-wrap">
                    {editingCityId === city._id ? (
                      <button
                        onClick={() => handleUpdateCity(city._id)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center gap-1"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingCityId(city._id);
                          setEditingCityName(city.name);
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </button>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageCities;