// src/pages/admin/AddCity.jsx
import React, { useState } from "react";
import API from "../../../api/axios";
import { useNavigate } from "react-router-dom";

const AddCity = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    state: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.state) {
      setError("City and State are required");
      return;
    }

    try {
      setLoading(true);
      await API.post("/cities", formData);
      setLoading(false);
      navigate("/admin/manage-cities");
    } catch (err) {
      console.error(err);
      setError("Failed to add city");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New City</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">City Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">State*</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Adding..." : "Add City"}
        </button>
      </form>
    </div>
  );
};

export default AddCity;