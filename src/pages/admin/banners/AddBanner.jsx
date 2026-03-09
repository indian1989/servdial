// src/pages/admin/AddBanner.jsx
import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const AddBanner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      setError("Title and image are required");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("image", formData.image);

    try {
      setLoading(true);
      await API.post("/banners", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLoading(false);
      navigate("/admin/manage-banners");
    } catch (err) {
      console.error(err);
      setError("Failed to add banner");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Banner</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Title*</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Banner Image*</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Adding..." : "Add Banner"}
        </button>
      </form>
    </div>
  );
};

export default AddBanner;