// src/pages/admin/AddBusiness.jsx
import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const AddBusiness = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    category: "",
    city: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple validation
    if (!formData.name || !formData.ownerName || !formData.category) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      await API.post("/businesses", formData);
      setLoading(false);
      navigate("/admin/manage-businesses"); // Redirect to manage page
    } catch (err) {
      console.error(err);
      setError("Failed to add business");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Business</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Business Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Owner Name*</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Category*</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Contact</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Business"}
        </button>
      </form>
    </div>
  );
};

export default AddBusiness;