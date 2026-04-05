// frontend/src/pages/admin/AddCategory.jsx
import React, { useState, useEffect } from "react";
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../api/adminAPI";
import { buildCategoryTree } from "../../utils/adminUtils";

import Loader from "../../components/common/Loader";
import { FaTrash, FaEdit } from "react-icons/fa";


const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [flatCategories, setFlatCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    parentCategory: "",
    order: 0,
  });

  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({
    name: "",
    description: "",
    order: 0,
  });

  // ================= FETCH =================
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategories();

      const flat = res.data.flatCategories || res.data.categories || [];

setFlatCategories(flat);
setCategories(buildCategoryTree(flat));
    } catch (err) {
      console.error(err);
      alert("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= HELPERS =================
  const generateSlug = (name) =>
    name.toLowerCase().trim().replace(/\s+/g, "-");

  const generateKeywords = (name) =>
    name.toLowerCase().split(" ");

  // ================= ADD =================
  const handleAdd = async () => {
  if (!form.name.trim()) return alert("Category name required");

  const exists = flatCategories.some(
    (c) => c.name.toLowerCase() === form.name.toLowerCase()
  );

  if (exists) return alert("Category already exists");

  try {
    await addCategory({
      name: form.name.trim(),
      description: form.description,
      order: Number(form.order),

      // ✅ SAFE FIELDS
      slug: generateSlug(form.name),
      keywords: generateKeywords(form.name),
      status: "active",

      // ✅ FIXED parent handling
      parentCategory:
  form.parentCategory && form.parentCategory !== ""
    ? form.parentCategory
    : null,
    });

    setForm({
      name: "",
      description: "",
      parentCategory: "",
      order: 0,
    });

    fetchCategories();
  } catch (err) {
    console.error(err);
    alert("Failed to add category");
  }
};

  // ================= UPDATE =================
  const handleUpdate = async (id) => {
    try {
      await updateCategory(id, {
        name: editingData.name,
        description: editingData.description,
        order: Number(editingData.order),

        slug: generateSlug(editingData.name),
        keywords: generateKeywords(editingData.name),
      });

      setEditingId(null);
      fetchCategories();
    } catch {
      alert("Update failed");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      fetchCategories();
    } catch {
      alert("Delete failed");
    }
  };

  // ================= DROPDOWN =================
  const renderOptions = (nodes, level = 0) =>
    nodes.flatMap((cat) => [
      <option key={cat._id} value={cat._id}>
        {"—".repeat(level)} {cat.name}
      </option>,
      ...(cat.subcategories ? renderOptions(cat.subcategories, level + 1) : []),
    ]);

  // ================= RENDER =================
  const renderTree = (nodes, level = 0) =>
    nodes.map((cat) => (
      <React.Fragment key={cat._id}>
        <tr>
          <td
            className="border px-3 py-2"
            style={{ paddingLeft: level * 20 }}
          >
            {editingId === cat._id ? (
              <input
                value={editingData.name}
                onChange={(e) =>
                  setEditingData({ ...editingData, name: e.target.value })
                }
                className="border px-2 py-1 w-full"
              />
            ) : (
              cat.name
            )}
          </td>

          <td className="border px-3 py-2">
            {editingId === cat._id ? (
              <input
                value={editingData.description}
                onChange={(e) =>
                  setEditingData({
                    ...editingData,
                    description: e.target.value,
                  })
                }
                className="border px-2 py-1 w-full"
              />
            ) : (
              cat.description || "-"
            )}
          </td>

          <td className="border px-3 py-2">
            {editingId === cat._id ? (
              <input
                type="number"
                value={editingData.order}
                onChange={(e) =>
                  setEditingData({
                    ...editingData,
                    order: e.target.value,
                  })
                }
                className="border px-2 py-1 w-full"
              />
            ) : (
              cat.order
            )}
          </td>

          <td className="border px-3 py-2 flex gap-2 justify-center">
            {editingId === cat._id ? (
              <button
                onClick={() => handleUpdate(cat._id)}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingId(cat._id);
                  setEditingData({
                    name: cat.name,
                    description: cat.description || "",
                    order: cat.order,
                  });
                }}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                <FaEdit />
              </button>
            )}

            <button
              onClick={() => handleDelete(cat._id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              <FaTrash />
            </button>
          </td>
        </tr>

        {cat.subcategories &&
          renderTree(cat.subcategories, level + 1)}
      </React.Fragment>
    ));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Category Manager (Hierarchical)
      </h2>

      {loading && <Loader />}

      {/* ================= FORM ================= */}
      <div className="grid md:grid-cols-5 gap-3 mb-6">
        <input
          placeholder="Category Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="border px-3 py-2 rounded"
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="border px-3 py-2 rounded"
        />

        <input
          type="number"
          placeholder="Order"
          value={form.order}
          onChange={(e) =>
            setForm({ ...form, order: e.target.value })
          }
          className="border px-3 py-2 rounded"
        />

        <select
          value={form.parentCategory}
          onChange={(e) =>
            setForm({ ...form, parentCategory: e.target.value })
          }
          className="border px-3 py-2 rounded"
        >
          <option value="">No Parent (Root)</option>
          {renderOptions(categories)}
        </select>

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          Add Category
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2">Description</th>
              <th className="border px-3 py-2">Order</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>{renderTree(categories)}</tbody>
        </table>
      </div>
    </div>
  );
};

export default AddCategory;