import React, { useState, useEffect } from "react";
import { getAllCategories, addCategory, updateCategory, deleteCategory } from "../../api/adminAPI";
import Loader from "../../components/common/Loader";
import { FaTrash, FaChevronDown, FaChevronRight } from "react-icons/fa";
import slugify from "slugify";

const PAGE_SIZE = 10;

const AddCategory = () => {
  const [categories, setCategories] = useState([]); // tree
  const [loading, setLoading] = useState(false);

  const [categoryName, setCategoryName] = useState("");
  const [selectedParent, setSelectedParent] = useState("");
  const [order, setOrder] = useState(0);

  const [collapsed, setCollapsed] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // ================= HELPERS =================
  const toTitleCase = (str) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  const normalizeCategories = (cats) =>
    cats.map((cat) => ({
      ...cat,
      name: cat.name ? toTitleCase(cat.name) : "",
      slug: cat.slug || slugify(cat.name || "", { lower: true }),
      order: Number(cat.order) || 0,
      status: cat.status || "active",
      subcategories: (cat.subcategories || []).map((sub) => ({
        ...sub,
        name: sub.name ? toTitleCase(sub.name) : "",
        slug: sub.slug || slugify(sub.name || "", { lower: true }),
        order: Number(sub.order) || 0,
      })),
    }));

  const buildCategoryTree = (cats) => {
    const map = {};
    const roots = [];

    cats.forEach((cat) => {
      map[cat._id] = { ...cat, subcategories: [] };
    });

    cats.forEach((cat) => {
      if (cat.parentCategory?._id) {
        const parent = map[cat.parentCategory._id];
        if (parent) {
          const exists = parent.subcategories.some((sc) => sc.slug === cat.slug);
          if (!exists) parent.subcategories.push(map[cat._id]);
        }
      } else {
        const exists = roots.some((r) => r.slug === cat.slug);
        if (!exists) roots.push(map[cat._id]);
      }
    });

    const sortTree = (nodes) => {
      nodes.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
      nodes.forEach((n) => sortTree(n.subcategories));
    };
    sortTree(roots);
    return roots;
  };

  // ================= FETCH =================
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategories();
      const cats = normalizeCategories(res?.data?.categories || []);
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

  // ================= ADD CATEGORY =================
  const handleAddCategory = async () => {
    if (!categoryName.trim()) return alert("Category name required");

    const tempId = Date.now().toString();
    const newCat = {
      _id: tempId,
      name: toTitleCase(categoryName.trim()),
      slug: slugify(categoryName.trim(), { lower: true }),
      order: Number(order),
      parentCategory: selectedParent || null,
      status: "active",
      subcategories: [],
    };

    // Optimistic update with deduplication
    setCategories((prev) => {
      const copy = [...prev];

      if (selectedParent) {
        const addToSub = (nodes) => {
          nodes.forEach((n) => {
            if (n._id === selectedParent) {
              if (!n.subcategories.some((sc) => sc.slug === newCat.slug)) {
                n.subcategories.push(newCat);
              }
            }
            addToSub(n.subcategories);
          });
        };
        addToSub(copy);
        return copy;
      } else {
        if (!copy.some((c) => c.slug === newCat.slug)) copy.push(newCat);
        return copy;
      }
    });

    setCategoryName("");
    setSelectedParent("");
    setOrder(0);

    try {
      const res = await addCategory(newCat);
      // replace tempId with real _id
      const replaceTempId = (cats) =>
        cats.map((c) => ({
          ...c,
          _id: c._id === tempId ? res.data._id : c._id,
          subcategories: replaceTempId(c.subcategories),
        }));
      setCategories((prev) => replaceTempId(prev));
    } catch (err) {
      alert("Failed to add category");
      fetchCategories();
    }
  };

  // ================= DELETE =================
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    const removeCategory = (cats) =>
      cats
        .filter((c) => c._id !== id)
        .map((c) => ({ ...c, subcategories: removeCategory(c.subcategories) }));
    setCategories((prev) => removeCategory(prev));

    try {
      await deleteCategory(id);
    } catch (err) {
      alert("Delete failed");
      fetchCategories();
    }
  };

  // ================= TOGGLE ACTIVE =================
  const toggleActive = async (cat) => {
    const newStatus = cat.status === "active" ? "inactive" : "active";
    const updateStatus = (cats) =>
      cats.map((c) => ({
        ...c,
        status: c._id === cat._id ? newStatus : c.status,
        subcategories: updateStatus(c.subcategories),
      }));
    setCategories((prev) => updateStatus(prev));

    try {
      await updateCategory(cat._id, { status: newStatus });
    } catch (err) {
      alert("Update failed");
      fetchCategories();
    }
  };

  // ================= PAGINATION =================
  const topLevelCategories = categories;
  const indexOfLast = currentPage * PAGE_SIZE;
  const indexOfFirst = indexOfLast - PAGE_SIZE;
  const currentCategories = topLevelCategories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(topLevelCategories.length / PAGE_SIZE);

  // ================= DROPDOWN =================
  const renderDropdownOptions = (cats, level = 0, parentIds = []) =>
    cats.flatMap((cat) => {
      if (parentIds.includes(cat._id)) return [];
      return [
        <option key={cat._id} value={cat._id}>
          {"—".repeat(level) + " " + cat.name}
        </option>,
        ...renderDropdownOptions(cat.subcategories, level + 1, [...parentIds, cat._id]),
      ];
    });

  // ================= RENDER ROW =================
  const renderCategoryRow = (cat, level = 0) => {
    const isCollapsed = collapsed[cat._id];
    return (
      <React.Fragment key={cat._id}>
        <tr className="text-center">
          <td className="border px-2 py-2 text-left" style={{ paddingLeft: `${level * 20}px` }}>
            {cat.subcategories.length > 0 && (
              <button
                onClick={() => setCollapsed((prev) => ({ ...prev, [cat._id]: !isCollapsed }))}
                className="mr-1"
              >
                {isCollapsed ? <FaChevronRight /> : <FaChevronDown />}
              </button>
            )}
            {cat.name}
          </td>
          <td className="border px-2 py-2">{cat.order}</td>
          <td className="border px-2 py-2">
            <button
              onClick={() => toggleActive(cat)}
              className={`px-2 py-1 rounded text-xs ${
                cat.status === "active" ? "bg-green-500 text-white" : "bg-gray-400 text-white"
              }`}
            >
              {cat.status}
            </button>
          </td>
          <td className="border px-2 py-2">
            <button
              onClick={() => handleDeleteCategory(cat._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </td>
        </tr>
        {!isCollapsed && cat.subcategories.map((sub) => renderCategoryRow(sub, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Category Manager</h2>

      {loading && <Loader />}

      {/* FORM */}
      <div className="grid md:grid-cols-5 gap-3 mb-6">
        <input
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Order"
          value={order}
          onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
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
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="border px-2 py-2 text-left">Name</th>
              <th className="border px-2 py-2">Order</th>
              <th className="border px-2 py-2">Status</th>
              <th className="border px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>{currentCategories.map((cat) => renderCategoryRow(cat))}</tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AddCategory;