// src/pages/admin/ManageCategories.jsx
import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await API.get("/categories");
      setCategories(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Delete category
  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await API.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete category");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
      <button
        onClick={() => navigate("/admin/add-category")}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add New Category
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id} className="text-center border-t">
                <td className="p-2">{c.name}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => navigate(`/admin/edit-category/${c._id}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(c._id)}
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

export default ManageCategories;