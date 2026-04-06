// frontend/src/pages/admin/ManageCategories.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
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

import {
  toTitleCase,
  buildCategoryTree,
} from "../../utils/adminUtils";

const PAGE_SIZE = 10;

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [flatCategories, setFlatCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [dropdownSearch, setDropdownSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef();

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    order: 0,
    parentCategory: "",
  });

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryData, setEditingCategoryData] = useState({
    name: "",
    description: "",
    order: 0,
  });

  const [collapsed, setCollapsed] = useState({});

  // ================= OUTSIDE CLICK =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= DEBOUNCE =================
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(dropdownSearch), 300);
    return () => clearTimeout(t);
  }, [dropdownSearch]);

  // ================= FETCH =================
const fetchCategories = async () => {
  setLoading(true);
  try {
    const res = await getAllCategories();

    const flat = res?.data?.flatCategories || [];

    setFlatCategories(flat);
    setCategories(buildCategoryTree(flat));

    setCurrentPage(1);

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

  // ================= AUTO EXPAND ON SEARCH =================
useEffect(() => {
  if (search) {
    const expandAll = {};

    flatCategories.forEach((c) => {
      expandAll[c._id] = false;
    });

    setCollapsed(expandAll);
  }
}, [search, flatCategories]);

  // ================= FILTER =================
const filteredTree = useMemo(() => {
  if (!search) return categories;

  const filter = (nodes = []) =>
    nodes
      .map((n) => ({
        ...n,
        subcategories: filter(n.subcategories || []), // ✅ SAFE
      }))
      .filter(
        (n) =>
          n.name.toLowerCase().includes(search.toLowerCase()) ||
          (n.subcategories && n.subcategories.length > 0)
      );

  return filter(categories || []);
}, [search, categories]);

  // ================= ADD =================
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) return alert("Name required");

    const exists = flatCategories.some(
      (c) => c.name.toLowerCase() === newCategory.name.toLowerCase()
    );
    if (exists) return alert("Category already exists");

    setActionLoading(true);
    try {
      await addCategory({
        ...newCategory,
        name: toTitleCase(newCategory.name),
        order: Number(newCategory.order),
        parentCategory: newCategory.parentCategory || null,
      });

      setNewCategory({
        name: "",
        description: "",
        order: 0,
        parentCategory: "",
      });

      setDropdownSearch("");
      fetchCategories();
    } finally {
      setActionLoading(false);
    }
  };

  // ================= UPDATE =================
  const handleUpdateCategory = async (id) => {
    setActionLoading(true);
    try {
      await updateCategory(id, {
        ...editingCategoryData,
        name: toTitleCase(editingCategoryData.name),
        order: Number(editingCategoryData.order),
      });

      setEditingCategoryId(null);
      fetchCategories();
    } finally {
      setActionLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete?")) return;

    setActionLoading(true);
    try {
      await deleteCategory(id);
      fetchCategories();
    } finally {
      setActionLoading(false);
    }
  };

  // ================= TOGGLE STATUS =================
  const toggleStatus = async (cat) => {
  if (!cat?._id) return;

  const newStatus = cat.status === "active" ? "inactive" : "active";

  try {
    setActionLoading(true);

    await updateCategory(cat._id, {
      status: newStatus,
    });

    // 🔥 Optimistic UI update (instant feel)
    setFlatCategories((prev) =>
      prev.map((c) =>
        c._id === cat._id ? { ...c, status: newStatus } : c
      )
    );

    // 🔥 Rebuild tree instantly (no lag UI)
    setCategories((prev) => {
      const updated = flatCategories.map((c) =>
        c._id === cat._id ? { ...c, status: newStatus } : c
      );
      return buildCategoryTree(updated);
    });

  } catch (err) {
    console.error("Toggle status error:", err);
    alert("Failed to update status");
  } finally {
    setActionLoading(false);
  }
};

  // ================= FILTER =================
  const filteredDropdown = useMemo(() => {
    return flatCategories.filter((c) =>
      c.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [flatCategories, debouncedSearch]);

  // ================= RENDER =================
  const renderRow = (cat, level = 0) => {
    const isCollapsed = collapsed[cat._id];

    return (
      <React.Fragment key={cat._id}>
        <tr className="text-center hover:bg-gray-50">
          <td
            className="border px-3 py-2 text-left"
            style={{ paddingLeft: level * 20 }}
          >
            {cat.subcategories.length > 0 && (
              <button
                onClick={() =>
                  setCollapsed((p) => ({ ...p, [cat._id]: !isCollapsed }))
                }
                className="mr-2"
              >
                {isCollapsed ? <FaChevronRight /> : <FaChevronDown />}
              </button>
            )}

            {editingCategoryId === cat._id ? (
              <input
                className="border px-2 py-1 rounded w-full"
                value={editingCategoryData.name}
                onChange={(e) =>
                  setEditingCategoryData({
                    ...editingCategoryData,
                    name: e.target.value,
                  })
                }
              />
            ) : (
              cat.name
            )}
          </td>

          <td className="border px-3 py-2">
            {editingCategoryId === cat._id ? (
              <input
                className="border px-2 py-1 rounded w-full"
                value={editingCategoryData.description}
                onChange={(e) =>
                  setEditingCategoryData({
                    ...editingCategoryData,
                    description: e.target.value,
                  })
                }
              />
            ) : (
              cat.description || "-"
            )}
          </td>

          <td className="border px-3 py-2">
            {editingCategoryId === cat._id ? (
              <input
                type="number"
                className="border px-2 py-1 rounded w-full"
                value={editingCategoryData.order}
                onChange={(e) =>
                  setEditingCategoryData({
                    ...editingCategoryData,
                    order: e.target.value,
                  })
                }
              />
            ) : (
              cat.order
            )}
          </td>

          <td className="border px-3 py-2">
            <button
              onClick={() => toggleStatus(cat)}
              className={`px-2 py-1 rounded text-xs ${
                cat.status === "active"
                  ? "bg-green-500 text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              {cat.status}
            </button>
          </td>

          <td className="border px-3 py-2 flex justify-center gap-2">
            {editingCategoryId === cat._id ? (
              <button
                onClick={() => handleUpdateCategory(cat._id)}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingCategoryId(cat._id);
                  setEditingCategoryData({
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
              onClick={() => handleDeleteCategory(cat._id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              <FaTrash />
            </button>
          </td>
        </tr>

        {!isCollapsed &&
          cat.subcategories.map((sub) => renderRow(sub, level + 1))}
      </React.Fragment>
    );
  };

  // ================= UI =================
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>

      {(loading || actionLoading) && <Loader />}

      {/* ADD */}
      <div className="grid md:grid-cols-5 gap-3 mb-6">
        <input
          className="border px-3 py-2 rounded"
          placeholder="Name"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
        />

        <input
          className="border px-3 py-2 rounded"
          placeholder="Description"
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory({ ...newCategory, description: e.target.value })
          }
        />

        <input
          className="border px-3 py-2 rounded"
          type="number"
          placeholder="Order"
          value={newCategory.order}
          onChange={(e) =>
            setNewCategory({ ...newCategory, order: e.target.value })
          }
        />

        {/* DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <input
            className="border px-3 py-2 rounded w-full"
            placeholder="Search parent..."
            value={dropdownSearch}
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => setDropdownSearch(e.target.value)}
          />

          {showDropdown && (
            <div className="absolute bg-white border w-full max-h-40 overflow-y-auto z-10">
              <div
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setNewCategory({ ...newCategory, parentCategory: "" });
                  setDropdownSearch("");
                  setShowDropdown(false);
                }}
              >
                No Parent
              </div>

              {/* FilteredDropdown */}
  {filteredDropdown
  .filter(c => c._id !== newCategory._id)
  .map((c) => (
    <div
      key={c._id}
      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => {
        // 🚫 prevent selecting same parent again
        if (c._id === newCategory.parentCategory) return;

        setNewCategory((prev) => ({
          ...prev,
          parentCategory: c._id,
        }));

        setDropdownSearch(c.name);
        setShowDropdown(false);
      }}
    >
      {c.name}
    </div>
))}
            </div>
          )}
        </div>

        <button
          onClick={handleAddCategory}
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          Add
        </button>
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-2 mb-4">
        <FaSearch />
        <input
          className="border px-3 py-2 rounded w-full"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2">Description</th>
              <th className="border px-3 py-2">Order</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>{filteredTree.map((c) => renderRow(c))}</tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCategories;