// frontend/src/pages/admin/ManageCategories.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../api/adminAPI";

import Loader from "../../components/common/Loader";
import {
  FaTrash,
  FaEdit,
  FaChevronDown,
  FaChevronRight,
  FaSearch,
} from "react-icons/fa";

import { toTitleCase } from "../../utils/adminUtils";

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

const ManageCategories = () => {
  const [flatCategories, setFlatCategories] = useState([]);
  const [tree, setTree] = useState([]);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [expanded, setExpanded] = useState({});

  const [newCategory, setNewCategory] = useState({
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
    isTrending: false,
  });

  /* ================= FETCH ================= */
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategories();

      const flat = res?.data?.data || res?.data?.flatCategories || [];

      setFlatCategories(flat);
      setTree(buildTree(flat));
      setExpanded({});
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

  /* ================= FILTER TREE ================= */
  const filteredTree = useMemo(() => {
    if (!search) return tree;

    const q = search.toLowerCase();

    const filterNodes = (nodes = []) =>
      nodes
        .map((node) => {
          const children = filterNodes(node.children || []);
          const match =
            node.name.toLowerCase().includes(q) || children.length > 0;

          return match ? { ...node, children } : null;
        })
        .filter(Boolean);

    return filterNodes(tree);
  }, [search, tree]);

  /* ================= ADD CATEGORY ================= */
  const handleAdd = async () => {
    if (!newCategory.name.trim()) return alert("Name required");

    const orderValue =
    newCategory.order === "" || newCategory.order === null
      ? 0
      : Number(newCategory.order);

    setActionLoading(true);

    try {
      await addCategory({
        name: toTitleCase(newCategory.name),
        description: newCategory.description,
        order:
  newCategory.order === "" || newCategory.order === null
    ? 0
    : Number(newCategory.order),
        parentCategory: newCategory.parentCategory || null,
      });

      setNewCategory({
        name: "",
        description: "",
        order: 0,
        parentCategory: "",
      });

      fetchCategories();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async (id) => {
    setActionLoading(true);

    try {
      await updateCategory(id, {
        name: toTitleCase(editingData.name),
        description: editingData.description,
        order: Number(editingData.order),
        isTrending: editingData.isTrending,
      });

      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    setActionLoading(true);

    try {
      await deleteCategory(id);

      const updated = flatCategories.filter((c) => c._id !== id);
      setFlatCategories(updated);
      setTree(buildTree(updated));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  /* ================= TOGGLE STATUS + TRENDING ================= */
  const toggleField = async (cat, field) => {
  try {
    let newValue;

    // ✅ FIX STATUS ENUM (CRITICAL)
    if (field === "status") {
      newValue = cat.status === "active" ? "inactive" : "active";
    } else {
      newValue = !cat[field];
    }

    await updateCategory(cat._id, {
      [field]: newValue,
    });

    const updated = flatCategories.map((c) =>
      c._id === cat._id ? { ...c, [field]: newValue } : c
    );

    setFlatCategories(updated);
    setTree(buildTree(updated));
  } catch (err) {
    console.error("Toggle failed:", err);
  }
};

  /* ================= RENDER ROW ================= */
  const renderRow = (cat, level = 0) => {
    const isOpen = expanded[cat._id];

    return (
      <React.Fragment key={cat._id}>
        <tr className="text-center hover:bg-gray-50">
          {/* NAME */}
          <td
            className="border px-3 py-2 text-left"
            style={{ paddingLeft: level * 20 }}
          >
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
                {isOpen ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )}
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
              cat.name
            )}
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
                    order: Number(e.target.value),
                  })
                }
                className="border px-2 py-1 w-full"
              />
            ) : (
              cat.order
            )}
          </td>

          {/* STATUS */}
          <td className="border px-3 py-2">
            <button
              onClick={() => toggleField(cat, "status")}
              className={`px-2 py-1 rounded text-xs ${
                cat.status === "active"
                  ? "bg-green-500 text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              {cat.status}
            </button>

            <button
              onClick={() => toggleField(cat, "isTrending")}
              className={`ml-2 px-2 py-1 rounded text-xs ${
                cat.isTrending
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-300"
              }`}
            >
              Trending
            </button>
          </td>

          {/* ACTIONS */}
          <td className="border px-3 py-2 flex justify-center gap-2">
            {editingId === cat._id ? (
              <>
                <button
                  onClick={() => handleUpdate(cat._id)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-400 text-white px-2 py-1 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setEditingId(cat._id);
                  setEditingData({
                    name: cat.name,
                    description: cat.description || "",
                    order: cat.order,
                    isTrending: cat.isTrending || false,
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

        {isOpen &&
          cat.children?.map((child) =>
            renderRow(child, level + 1)
          )}
      </React.Fragment>
    );
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Manage Categories
      </h2>

      {(loading || actionLoading) && <Loader />}

      {/* ADD */}
      <div className="grid md:grid-cols-5 gap-3 mb-6">
        <input
          className="border px-3 py-2 rounded"
          placeholder="Name"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory((p) => ({
              ...p,
              name: e.target.value,
            }))
          }
        />

        <input
          className="border px-3 py-2 rounded"
          placeholder="Description"
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory((p) => ({
              ...p,
              description: e.target.value,
            }))
          }
        />

        <input
          type="number"
          className="border px-3 py-2 rounded"
          placeholder="Order"
          value={newCategory.order}
          onChange={(e) =>
  setNewCategory((p) => ({
    ...p,
    order: e.target.value === "" ? "" : Number(e.target.value),
  }))
}
        />

        <select
  className="border px-3 py-2 rounded"
  value={newCategory.parentCategory}
  onChange={(e) =>
    setNewCategory((p) => ({
      ...p,
      parentCategory: e.target.value,
    }))
  }
>
  <option value="">No Parent</option>

  {flatCategories
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

      <div className="flex items-center gap-2 mb-4">
  <FaSearch />
  <input
    className="border px-3 py-2 rounded w-full"
    placeholder="Search categories..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>


      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">
                Name
              </th>
              <th className="border px-3 py-2">
                Description
              </th>
              <th className="border px-3 py-2">Order</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTree.map((c) => renderRow(c))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCategories;