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

const PAGE_SIZE = 10;

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [flatCategories, setFlatCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownSearch, setDropdownSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);

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

  const toTitleCase = (str) =>
    str.replace(/\w\S*/g, (t) =>
      t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
    );

  const normalize = (cats) =>
    cats.map((c) => ({
      ...c,
      name: toTitleCase(c.name || ""),
      order: Number(c.order) || 0,
      status: c.status || "active",
    }));

  const buildTree = (cats) => {
    const map = {};
    const roots = [];

    cats.forEach((c) => {
      map[c._id] = { ...c, subcategories: [] };
    });

    cats.forEach((c) => {
      const parentId =
        c.parentCategory && typeof c.parentCategory === "object"
          ? c.parentCategory._id
          : c.parentCategory || null;

      if (parentId && map[parentId]) {
        map[parentId].subcategories.push(map[c._id]);
      } else {
        roots.push(map[c._id]);
      }
    });

    const sortTree = (nodes) => {
      nodes.sort(
        (a, b) =>
          Number(a.order || 0) - Number(b.order || 0) ||
          a.name.localeCompare(b.name)
      );
      nodes.forEach((n) => sortTree(n.subcategories));
    };

    sortTree(roots);
    return roots;
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategories();
      const raw = res?.data?.categories || [];
      const normalized = normalize(raw);

      setFlatCategories(normalized);
      setCategories(buildTree(normalized));
      setCurrentPage(1);
    } catch {
      alert("Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) return alert("Name required");

    await addCategory({
      ...newCategory,
      name: toTitleCase(newCategory.name),
      order: Number(newCategory.order),
      parentCategory: newCategory.parentCategory || null,
    });

    setNewCategory({ name: "", description: "", order: 0, parentCategory: "" });
    setDropdownSearch("");
    fetchCategories();
  };

  const handleUpdateCategory = async (id) => {
    await updateCategory(id, {
      ...editingCategoryData,
      name: toTitleCase(editingCategoryData.name),
      order: Number(editingCategoryData.order),
    });
    setEditingCategoryId(null);
    fetchCategories();
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete?")) return;
    await deleteCategory(id);
    fetchCategories();
  };

  const toggleStatus = async (cat) => {
    await updateCategory(cat._id, {
      status: cat.status === "active" ? "inactive" : "active",
    });
    fetchCategories();
  };

  const filteredTree = useMemo(() => {
    if (!search) return categories;

    const filter = (nodes) =>
      nodes
        .map((n) => ({ ...n, subcategories: filter(n.subcategories) }))
        .filter(
          (n) =>
            n.name.toLowerCase().includes(search.toLowerCase()) ||
            n.subcategories.length
        );

    return filter(categories);
  }, [search, categories]);

  const topLevel = filteredTree;
  const current = topLevel.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const totalPages = Math.ceil(topLevel.length / PAGE_SIZE);

  const filteredDropdown = flatCategories.filter((c) =>
    c.name.toLowerCase().includes(dropdownSearch.toLowerCase())
  );

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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>

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

        {/* SEARCHABLE DROPDOWN */}
        <div className="relative">
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

              {filteredDropdown.map((c) => (
                <div
                  key={c._id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setNewCategory({
                      ...newCategory,
                      parentCategory: c._id,
                    });
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

      {loading ? (
        <Loader />
      ) : (
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
            <tbody>{current.map((c) => renderRow(c))}</tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManageCategories;