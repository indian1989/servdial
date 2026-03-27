import React, { useState, useEffect } from "react";
import {
  getAllCities,
  addCity,
  updateCity,
  deleteCity
} from "../../api/adminAPI";
import Loader from "../../components/common/Loader";
import { FaTrash, FaEdit } from "react-icons/fa";

const PAGE_SIZE = 10;

const ManageCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [newCity, setNewCity] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [newState, setNewState] = useState("");

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
    if (!newCity || !newDistrict || !newState) {
      return alert("All fields are required.");
    }

    setLoading(true);

    try {
      await addCity({
        name: newCity,
        district: newDistrict,
        state: newState
      });

      setNewCity("");
      setNewDistrict("");
      setNewState("");

      fetchCities();
    } catch (err) {
      console.error(err);
      alert("Failed to add city.");
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE =================
  const handleUpdateCity = async (id) => {
    if (!editingData.name || !editingData.district || !editingData.state) {
      return alert("All fields required.");
    }

    setLoading(true);

    try {
      await updateCity(id, editingData);

      setEditingCityId(null);
      setEditingData({ name: "", district: "", state: "" });

      fetchCities();
    } catch (err) {
      console.error(err);
      alert("Failed to update city.");
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

  // ================= FILTER =================
  const filteredCities = Array.isArray(cities)
    ? cities.filter((c) =>
        `${c.name} ${c.district} ${c.state}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredCities.length / PAGE_SIZE);

  const paginatedCities = filteredCities.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // reset page on search
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
          placeholder="City"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          className="border px-3 py-2 rounded flex-1 min-w-[150px]"
        />

        <input
          type="text"
          placeholder="District"
          value={newDistrict}
          onChange={(e) => setNewDistrict(e.target.value)}
          className="border px-3 py-2 rounded flex-1 min-w-[150px]"
        />

        <input
          type="text"
          placeholder="State"
          value={newState}
          onChange={(e) => setNewState(e.target.value)}
          className="border px-3 py-2 rounded flex-1 min-w-[150px]"
        />

        <button
          onClick={handleAddCity}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add City
        </button>

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
        <table className="w-full border-collapse border border-gray-200">

          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="border px-3 py-2">City</th>
              <th className="border px-3 py-2">District</th>
              <th className="border px-3 py-2">State</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCities.map((city) => (
              <tr key={city._id} className="text-center">

                {/* NAME */}
                <td className="border px-3 py-2">
                  {editingCityId === city._id ? (
                    <input
                      value={editingData.name}
                      onChange={(e) =>
                        setEditingData({ ...editingData, name: e.target.value })
                      }
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    city.name
                  )}
                </td>

                {/* DISTRICT */}
                <td className="border px-3 py-2">
                  {editingCityId === city._id ? (
                    <input
                      value={editingData.district}
                      onChange={(e) =>
                        setEditingData({ ...editingData, district: e.target.value })
                      }
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    city.district
                  )}
                </td>

                {/* STATE */}
                <td className="border px-3 py-2">
                  {editingCityId === city._id ? (
                    <input
                      value={editingData.state}
                      onChange={(e) =>
                        setEditingData({ ...editingData, state: e.target.value })
                      }
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    city.state
                  )}
                </td>

                {/* ACTIONS */}
                <td className="border px-3 py-2 flex justify-center gap-2 flex-wrap">

                  {editingCityId === city._id ? (
                    <button
                      onClick={() => handleUpdateCity(city._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                  ) : (
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