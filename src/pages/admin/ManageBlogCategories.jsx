// Path: frontend/src/pages/admin/ManageBlogCategories.jsx

import React, { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import {
  getAllBlogCategories,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from "../../api/blogCategoryAPI";
import { uploadImage } from "../../api/uploadAPI";

const ManageBlogCategories = () => {
  // =========================
  // STATE
  // =========================

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [imageUploading, setImageUploading] =
  useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    isActive: true,
    sortOrder: 0,
  });

  const [editingId, setEditingId] = useState(null);

  // =========================
  // FETCH CATEGORIES
  // =========================

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await getAllBlogCategories();

      const data = response?.data?.data;

      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "❌ Failed to fetch blog categories:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to load blog categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // =========================
  // FILTER
  // =========================

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return categories;
    }

    return categories.filter((category) => {
      return (
        category?.name?.toLowerCase().includes(query) ||
        category?.slug?.toLowerCase().includes(query) ||
        category?.description
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [categories, search]);

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
// CATEGORY IMAGE UPLOAD
// =========================

const handleCategoryImageChange = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image file.");
    e.target.value = "";
    return;
  }

  try {
    setImageUploading(true);

    const data = await uploadImage(file);

    const imageUrl = data?.secure_url;

    if (!imageUrl) {
      throw new Error(
        "Image uploaded but no image URL was returned."
      );
    }

    setForm((prev) => ({
      ...prev,
      image: imageUrl,
    }));
  } catch (error) {
    console.error(
      "❌ Category image upload failed:",
      error
    );

    alert(
      error?.message ||
        "Failed to upload category image."
    );
  } finally {
    setImageUploading(false);
    e.target.value = "";
  }
};

  // =========================
  // AUTO SLUG
  // =========================

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleNameChange = (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      name: value,
      ...(editingId
        ? {}
        : {
            slug: generateSlug(value),
          }),
    }));
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      description: "",
      image: "",
      isActive: true,
      sortOrder: 0,
    });

    setEditingId(null);
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Category name is required.");
      return;
    }

    if (!form.slug.trim()) {
      alert("Category slug is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase(),
        description: form.description.trim(),
        image: form.image.trim(),
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder) || 0,
      };

      if (editingId) {
        const response = await updateBlogCategory(
          editingId,
          payload
        );

        const updatedCategory =
          response?.data?.data;

        setCategories((prev) =>
          prev.map((category) =>
            category._id === editingId
              ? updatedCategory || {
                  ...category,
                  ...payload,
                }
              : category
          )
        );

        alert("Blog category updated successfully.");
      } else {
        const response = await createBlogCategory(
          payload
        );

        const newCategory = response?.data?.data;

        if (newCategory) {
          setCategories((prev) => [
            newCategory,
            ...prev,
          ]);
        } else {
          await fetchCategories();
        }

        alert("Blog category created successfully.");
      }

      resetForm();
    } catch (error) {
      console.error(
        "❌ Failed to save blog category:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to save blog category."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (category) => {
    setEditingId(category._id);

    setForm({
      name: category?.name || "",
      slug: category?.slug || "",
      description: category?.description || "",
      image: category?.image || "",
      isActive: category?.isActive !== false,
      sortOrder: category?.sortOrder ?? 0,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(id);

      await deleteBlogCategory(id);

      setCategories((prev) =>
        prev.filter((category) => category._id !== id)
      );

      if (editingId === id) {
        resetForm();
      }

      alert("Blog category deleted successfully.");
    } catch (error) {
      console.error(
        "❌ Failed to delete blog category:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to delete blog category."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="space-y-6">
      {/* =========================
          HEADER
      ========================= */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Blog Categories
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create and manage categories used for ServDial blog posts.
        </p>
      </div>

      {/* =========================
          CATEGORY FORM
      ========================= */}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId
                ? "Edit Blog Category"
                : "Add Blog Category"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {editingId
                ? "Update the selected blog category."
                : "Create a new category for blog posts."}
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* NAME */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category Name *
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleNameChange}
                placeholder="e.g. Local Business Tips"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* SLUG */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Slug *
              </label>

              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="local-business-tips"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Short description of this blog category..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            
            {/* IMAGE */}

<div>
  <label className="mb-2 block text-sm font-medium text-gray-700">
    Category Image
  </label>

  <div className="flex flex-col gap-3">
    <div className="flex flex-wrap items-center gap-3">
      <label
        htmlFor="categoryImageUpload"
        className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 ${
          imageUploading
            ? "cursor-not-allowed opacity-60"
            : ""
        }`}
      >
        <FaImage />

        {imageUploading
          ? "Uploading..."
          : form.image
          ? "Change Image"
          : "Choose Image"}

        <input
          id="categoryImageUpload"
          type="file"
          accept="image/*"
          onChange={handleCategoryImageChange}
          disabled={imageUploading}
          className="hidden"
        />
      </label>

      {form.image && (
        <button
          type="button"
          onClick={() =>
            setForm((prev) => ({
              ...prev,
              image: "",
            }))
          }
          disabled={imageUploading}
          className="text-sm font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Remove Image
        </button>
      )}
    </div>

    <p className="text-xs text-gray-400">
      Upload an image for this blog category.
    </p>

    {form.image && (
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <img
          src={form.image}
          alt="Category preview"
          className="h-40 w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    )}
  </div>
</div>

            {/* SORT ORDER */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sort Order
              </label>

              <input
                type="number"
                name="sortOrder"
                value={form.sortOrder}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* ACTIVE */}

          <label className="inline-flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />

            <span className="text-sm font-medium text-gray-700">
              Active Category
            </span>
          </label>

          {/* BUTTONS */}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving || imageUploading}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaPlus />

              {imageUploading
                ? "Uploading Image..."
                : saving
                ? "Saving..."
                : editingId
                ? "Update Category"
                : "Add Category"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* =========================
          SEARCH + SUMMARY
      ========================= */}

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              All Blog Categories
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredCategories.length} categor
              {filteredCategories.length === 1
                ? "y"
                : "ies"}{" "}
              found
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search categories..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      </div>

      {/* =========================
          TABLE
      ========================= */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading blog categories...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-medium text-gray-600">
              No blog categories found.
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Create your first blog category above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Category
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Slug
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Sort Order
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredCategories.map(
                  (category) => (
                    <tr
                      key={category._id}
                      className="transition hover:bg-gray-50"
                    >
                      {/* CATEGORY */}

                      <td className="px-5 py-4">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {category.name}
                          </div>

                          {category.description && (
                            <div className="mt-1 max-w-md truncate text-xs text-gray-500">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* SLUG */}

                      <td className="px-5 py-4">
                        <code className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                          {category.slug}
                        </code>
                      </td>

                      {/* SORT ORDER */}

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {category.sortOrder ?? 0}
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">
                        {category.isActive ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                            <FaCheckCircle />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                            <FaTimesCircle />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(category)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
                          >
                            <FaEdit />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                category._id
                              )
                            }
                            disabled={
                              actionLoading ===
                              category._id
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <FaTrash />

                            {actionLoading ===
                            category._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBlogCategories;