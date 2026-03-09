// src/pages/admin/AddCategory.jsx
import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Category name is required");
      return;
    }

    try {
      setLoading(true);
      await API.post("/categories", { name });
      setLoading(false);
      navigate("/admin/manage-categories");
    } catch (err) {
      console.error(err);
      setError("Failed to add category");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Category</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Category Name*</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
};

export default AddCategory;