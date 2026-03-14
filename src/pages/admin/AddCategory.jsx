import React, { useState, useEffect } from "react";
import {
  getAllCategories,
  addCategory,
  deleteCategory,
} from "../../api/adminAPI";
import Loader from "../../components/common/Loader";
import { FaTrash } from "react-icons/fa";

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  // ================= FETCH CATEGORIES =================
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategories();

      // Handle different API response formats
      const data =
        res?.data?.categories ||
        res?.data?.data ||
        res?.data ||
        [];

      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Category fetch error:", err);
      alert("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= ADD CATEGORY =================
  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      return alert("Category name is required.");
    }

    setLoading(true);

    try {
      await addCategory({ name: categoryName });

      setCategoryName("");
      fetchCategories();
    } catch (err) {
      console.error("Add category error:", err);
      alert("Failed to add category.");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE CATEGORY =================
  const handleDeleteCategory = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    setLoading(true);

    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (err) {
      console.error("Delete category error:", err);
      alert("Failed to delete category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h2 className="text-2xl font-bold mb-6">Add Category</h2>

      {loading && <Loader />}

      {/* ADD CATEGORY FORM */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Category Name *"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="border px-3 py-2 rounded flex-1"
        />

        <button
          onClick={handleAddCategory}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Category
        </button>
      </div>

      {/* CATEGORY TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full border border-gray-200">

          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="border px-3 py-2">Category Name</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>

            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat._id} className="text-center">
                  <td className="border px-3 py-2">{cat.name}</td>

                  <td className="border px-3 py-2 flex justify-center">
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="2"
                  className="text-center py-4 text-gray-500"
                >
                  No categories found
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>
    </div>
  );
};

export default AddCategory;