import React, { useState, useEffect } from "react";
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../api/adminAPI";

import Loader from "../../components/common/Loader";
import { FaTrash, FaEdit } from "react-icons/fa";

/* ================= TREE BUILDER ================= */
const buildTree = (categories, parentId = null) => {
  return categories
    .filter((cat) =>
      parentId === null
        ? !cat.parentCategory
        : String(cat.parentCategory) === String(parentId)
    )
    .map((cat) => ({
      ...cat,
      children: buildTree(categories, cat._id),
    }));
};

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    order: 0,
    parentCategory: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({
    name: "",
    description: "",
    order: 0,
  });

  /* ================= FETCH ================= */
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategories();
      setCategories(res.data.flatCategories || []);
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

  /* ================= ADD ================= */
  const handleAdd = async () => {
    if (!form.name.trim()) return alert("Category name required");

    const exists = categories.some(
      (c) => c.name.toLowerCase() === form.name.toLowerCase()
    );

    if (exists) return alert("Category already exists");

    try {
      await addCategory({
        name: form.name.trim(),
        description: form.description,
        order: Number(form.order),
        parentCategory: form.parentCategory || null,
      });

      setForm({
        name: "",
        description: "",
        order: 0,
        parentCategory: "",
      });

      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to add category");
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async (id) => {
    try {
      await updateCategory(id, {
        name: editingData.name,
        description: editingData.description,
        order: Number(editingData.order),
      });

      setEditingId(null);
      fetchCategories();
    } catch {
      alert("Update failed");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      fetchCategories();
    } catch {
      alert("Delete failed");
    }
  };

  /* ================= RENDER ROW ================= */
  const renderRow = (cat, depth = 0) => {
    const isExpanded = expanded[cat._id];

    return (
      <React.Fragment key={cat._id}>
        <tr>
          {/* NAME */}
          <td className="border px-3 py-2">
            <div style={{ paddingLeft: `${depth * 16}px` }}>
              {cat.children?.length > 0 && (
                <button
                  onClick={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [cat._id]: !prev[cat._id],
                    }))
                  }
                  className="mr-2"
                >
                  {isExpanded ? "▼" : "▶"}
                </button>
              )}

              {editingId === cat._id ? (
                <input
                  value={editingData.name}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      name: e.target.value,
                    })
                  }
                  className="border px-2 py-1 w-full"
                />
              ) : (
                <span>{cat.name}</span>
              )}
            </div>
          </td>

          {/* DESCRIPTION */}
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

          {/* ORDER */}
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

          {/* ACTIONS */}
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

        {/* CHILDREN */}
        {isExpanded &&
          cat.children?.map((child) =>
            renderRow(child, depth + 1)
          )}
      </React.Fragment>
    );
  };

  const tree = buildTree(categories);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Category Manager
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
          <option value="">No Parent</option>

          {categories
            .filter((c) => !c.parentCategory)
            .map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
        </select>

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          Add
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

          <tbody>{tree.map((cat) => renderRow(cat))}</tbody>
        </table>
      </div>
    </div>
  );
};

export default AddCategory;