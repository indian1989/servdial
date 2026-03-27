import React, { useState, useEffect } from "react";
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../api/adminAPI";
import Loader from "../../components/common/Loader";
import {
  FaTrash,
  FaChevronDown,
  FaChevronRight,
  FaEdit,
} from "react-icons/fa";

import {
  toTitleCase,
  buildCategoryTree,
} from "../../utils/adminUtils";

const PAGE_SIZE = 10;

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [flatCategories, setFlatCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedParent, setSelectedParent] = useState("");
  const [order, setOrder] = useState(0);

  const [collapsed, setCollapsed] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

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
      const cats = res?.data?.categories || [];
      setFlatCategories(cats);
      setCategories(buildCategoryTree(cats));
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

  // ================= ADD =================
  const handleAddCategory = async () => {
    if (!categoryName.trim()) return alert("Category name required");

    const exists = flatCategories.some(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase()
    );
    if (exists) return alert("Category already exists");

    try {
      await addCategory({
        name: toTitleCase(categoryName.trim()),
        description,
        order: Number(order),
        parentCategory: selectedParent || null,
      });

      setCategoryName("");
      setDescription("");
      setSelectedParent("");
      setOrder(0);

      fetchCategories();
    } catch {
      alert("Failed to add category");
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async (id) => {
    try {
      await updateCategory(id, {
        name: toTitleCase(editingData.name),
        description: editingData.description,
        order: Number(editingData.order),
      });

      setEditingId(null);
      fetchCategories();
    } catch {
      alert("Update failed");
    }
  };

  // ================= DELETE =================
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch {
      alert("Delete failed");
    }
  };

  // ================= STATUS =================
  const toggleActive = async (cat) => {
    try {
      await updateCategory(cat._id, {
        status: cat.status === "active" ? "inactive" : "active",
      });
      fetchCategories();
    } catch {
      alert("Status update failed");
    }
  };

  // ================= FIX PAGINATION (NO UI CHANGE) =================
  const flattenTree = (nodes, level = 0) => {
    let arr = [];
    nodes.forEach((n) => {
      arr.push({ ...n, level });
      arr = arr.concat(flattenTree(n.subcategories, level + 1));
    });
    return arr;
  };

  const flatTree = flattenTree(categories);

  const indexOfLast = currentPage * PAGE_SIZE;
  const indexOfFirst = indexOfLast - PAGE_SIZE;
  const paginated = flatTree.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(flatTree.length / PAGE_SIZE);

  // ================= DROPDOWN =================
  const renderDropdownOptions = (cats, level = 0) =>
    cats.flatMap((cat) => [
      <option key={cat._id} value={cat._id}>
        {"—".repeat(level) + " " + cat.name}
      </option>,
      ...renderDropdownOptions(cat.subcategories, level + 1),
    ]);

  // ================= RENDER =================
  const renderRow = (cat) => {
    const isCollapsed = collapsed[cat._id];

    return (
      <React.Fragment key={cat._id}>
        <tr className="text-center">
          <td
            className="border px-2 py-2 text-left"
            style={{ paddingLeft: `${cat.level * 20}px` }}
          >
            {cat.subcategories.length > 0 && (
              <button
                onClick={() =>
                  setCollapsed((prev) => ({
                    ...prev,
                    [cat._id]: !isCollapsed,
                  }))
                }
                className="mr-1"
              >
                {isCollapsed ? <FaChevronRight /> : <FaChevronDown />}
              </button>
            )}

            {editingId === cat._id ? (
              <input
                value={editingData.name}
                onChange={(e) =>
                  setEditingData({ ...editingData, name: e.target.value })
                }
                className="border px-2 py-1 rounded w-full"
              />
            ) : (
              cat.name
            )}
          </td>

          <td className="border px-2 py-2">
            {editingId === cat._id ? (
              <input
                value={editingData.description}
                onChange={(e) =>
                  setEditingData({
                    ...editingData,
                    description: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded w-full"
              />
            ) : (
              cat.description || "-"
            )}
          </td>

          <td className="border px-2 py-2">
            {editingId === cat._id ? (
              <input
                type="number"
                value={editingData.order}
                onChange={(e) =>
                  setEditingData({ ...editingData, order: e.target.value })
                }
                className="border px-2 py-1 rounded w-full"
              />
            ) : (
              cat.order
            )}
          </td>

          <td className="border px-2 py-2">
            <button
              onClick={() => toggleActive(cat)}
              className={`px-2 py-1 rounded text-xs ${
                cat.status === "active"
                  ? "bg-green-500 text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              {cat.status}
            </button>
          </td>

          <td className="border px-2 py-2 flex gap-2 justify-center">
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
                    description: cat.description,
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
      </React.Fragment>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Category Manager</h2>

      {loading && <Loader />}

      {/* FORM */}
      <div className="grid md:grid-cols-5 gap-3 mb-6">
        <input
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <input
          type="number"
          placeholder="Order"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <select
          value={selectedParent}
          onChange={(e) => setSelectedParent(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">No Parent</option>
          {renderDropdownOptions(categories)}
        </select>

        <button
          onClick={handleAddCategory}
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          Add
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <tbody>{paginated.map((c) => renderRow(c))}</tbody>
        </table>
      </div>

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

export default AddCategory;