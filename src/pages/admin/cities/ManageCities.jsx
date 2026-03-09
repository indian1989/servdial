// src/pages/admin/ManageCities.jsx
import React, { useState, useEffect } from "react";
import API from "../../../api/axios";
import { useNavigate } from "react-router-dom";

const ManageCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch all cities
  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await API.get("/cities");
      setCities(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch cities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // Delete city
  const deleteCity = async (id) => {
    if (!window.confirm("Are you sure you want to delete this city?")) return;
    try {
      await API.delete(`/cities/${id}`);
      setCities((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete city");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Cities</h1>
      <button
        onClick={() => navigate("/admin/add-city")}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add New City
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">City</th>
              <th className="p-2 border">State</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((c) => (
              <tr key={c._id} className="text-center border-t">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.state}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => navigate(`/admin/edit-city/${c._id}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCity(c._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageCities;