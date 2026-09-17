// Path: frontend/src/pages/admin/AddBlog.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import { createBlog } from "../../api/blogAPI";
import BlogForm from "./BlogForm";

const AddBlog = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // =========================
  // CREATE BLOG
  // =========================

  const handleSubmit = async (payload) => {
    try {
      setLoading(true);

      await createBlog(payload);

      alert("Blog post created successfully.");

      navigate("/admin/blog");
    } catch (error) {
      console.error(
        "❌ Failed to create blog:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to create blog post."
      );
    } finally {
      setLoading(false);
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
        <div className="mb-2">
          <Link
            to="/admin/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-indigo-600"
          >
            <FaArrowLeft />
            Back to Blog
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Add Blog Post
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a new ServDial blog post.
        </p>
      </div>

      {/* =========================
          COMMON BLOG FORM
      ========================= */}

      <BlogForm
        mode="add"
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default AddBlog;