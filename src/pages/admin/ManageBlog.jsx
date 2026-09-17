// Path: frontend/src/pages/admin/ManageBlog.jsx

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaThumbtack,
  FaEye,
  FaCalendarAlt,
} from "react-icons/fa";

import {
  getAllBlogs,
  deleteBlog,
  toggleBlogPin,
} from "../../api/blogAPI";

import { getAllBlogCategories } from "../../api/blogCategoryAPI";

const ManageBlog = () => {
  const navigate = useNavigate();

  // =========================
  // STATE
  // =========================

  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // =========================
  // FETCH BLOGS
  // =========================

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const response = await getAllBlogs();

      const data = response?.data?.data;

      if (Array.isArray(data)) {
        setBlogs(data);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error("❌ Failed to fetch blogs:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to load blog posts."
      );

      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH CATEGORIES
  // =========================

  const fetchCategories = async () => {
    try {
      const response = await getAllBlogCategories();

      const data = response?.data?.data;

      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error(
        "❌ Failed to fetch blog categories:",
        error
      );

      setCategories([]);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  // =========================
  // FILTER BLOGS
  // =========================

  const filteredBlogs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return blogs.filter((blog) => {
      const title = blog?.title?.toLowerCase() || "";
      const slug = blog?.slug?.toLowerCase() || "";
      const excerpt = blog?.excerpt?.toLowerCase() || "";

      const matchesSearch =
        !normalizedSearch ||
        title.includes(normalizedSearch) ||
        slug.includes(normalizedSearch) ||
        excerpt.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        blog?.status === statusFilter;

      const blogCategoryId =
        typeof blog?.category === "object"
          ? blog?.category?._id
          : blog?.category;

      const matchesCategory =
        categoryFilter === "all" ||
        blogCategoryId === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    blogs,
    search,
    statusFilter,
    categoryFilter,
  ]);

  // =========================
  // DELETE BLOG
  // =========================

  const handleDelete = async (blog) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${blog?.title}"?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(blog._id);

      await deleteBlog(blog._id);

      setBlogs((prev) =>
        prev.filter((item) => item._id !== blog._id)
      );
    } catch (error) {
      console.error("❌ Failed to delete blog:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to delete blog post."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================
  // PIN / UNPIN BLOG
  // =========================

  const handleTogglePin = async (blog) => {
    try {
      setActionLoading(blog._id);

      const response = await toggleBlogPin(blog._id);

      const updatedBlog = response?.data?.data;

      setBlogs((prev) =>
        prev.map((item) =>
          item._id === blog._id
            ? {
                ...item,
                isPinned:
                  updatedBlog?.isPinned ??
                  !item.isPinned,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "❌ Failed to update pin status:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to update pin status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================
  // HELPERS
  // =========================

  const getCategoryName = (blog) => {
    if (!blog?.category) {
      return "—";
    }

    if (typeof blog.category === "object") {
      return blog.category?.name || "—";
    }

    const category = categories.find(
      (item) => item._id === blog.category
    );

    return category?.name || "—";
  };

  const getAuthorName = (blog) => {
    if (!blog?.author) {
      return "Admin";
    }

    if (typeof blog.author === "object") {
      return (
        blog.author?.name ||
        blog.author?.fullName ||
        blog.author?.email ||
        "Admin"
      );
    }

    return "Admin";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-gray-500">
          Loading blog posts...
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="space-y-6">
      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Blog
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create, manage and publish ServDial blog posts.
          </p>
        </div>

        <Link
          to="/admin/blog/add"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <FaPlus />
          Add Post
        </Link>
      </div>

      {/* =========================
          FILTERS
      ========================= */}

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* Search */}

          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search blog posts..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">
              All Status
            </option>

            <option value="published">
              Published
            </option>

            <option value="draft">
              Draft
            </option>
          </select>

          {/* Category */}

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">
              All Categories
            </option>

            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* =========================
          SUMMARY
      ========================= */}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">
            {filteredBlogs.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700">
            {blogs.length}
          </span>{" "}
          posts
        </p>
      </div>

      {/* =========================
          TABLE
      ========================= */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Title
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Category
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Author
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Published
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Views
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Pin
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredBlogs.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center"
                  >
                    <div className="text-sm font-medium text-gray-500">
                      No blog posts found.
                    </div>

                    <div className="mt-1 text-xs text-gray-400">
                      Try changing your search or filters.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="hover:bg-gray-50"
                  >
                    {/* TITLE */}

                    <td className="max-w-[300px] px-4 py-4">
                      <div className="flex items-start gap-2">
                        {blog.isPinned && (
                          <FaThumbtack
                            className="mt-1 shrink-0 text-indigo-600"
                            title="Pinned post"
                          />
                        )}

                        <div>
                          <div className="font-medium text-gray-900">
                            {blog.title}
                          </div>

                          {blog.slug && (
                            <div className="mt-1 truncate text-xs text-gray-400">
                              /blog/{blog.slug}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY */}

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      {getCategoryName(blog)}
                    </td>

                    {/* AUTHOR */}

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      {getAuthorName(blog)}
                    </td>

                    {/* STATUS */}

                    <td className="whitespace-nowrap px-4 py-4">
                      {blog.status === "published" ? (
                        <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700">
                          Draft
                        </span>
                      )}
                    </td>

                    {/* PUBLISHED */}

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        {formatDate(blog.publishedAt)}
                      </div>
                    </td>

                    {/* VIEWS */}

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaEye className="text-gray-400" />
                        {Number(blog.views || 0).toLocaleString(
                          "en-IN"
                        )}
                      </div>
                    </td>

                    {/* PIN */}

                    <td className="whitespace-nowrap px-4 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          handleTogglePin(blog)
                        }
                        disabled={
                          actionLoading === blog._id
                        }
                        title={
                          blog.isPinned
                            ? "Unpin post"
                            : "Pin post"
                        }
                        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                          blog.isPinned
                            ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        <FaThumbtack />

                        {actionLoading === blog._id
                          ? "Saving..."
                          : blog.isPinned
                          ? "Pinned"
                          : "Pin"}
                      </button>
                    </td>

                    {/* ACTIONS */}

                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin/blog/edit/${blog._id}`
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                          <FaEdit />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(blog)
                          }
                          disabled={
                            actionLoading === blog._id
                          }
                          className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBlog;