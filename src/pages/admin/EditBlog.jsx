// Path: frontend/src/pages/admin/EditBlog.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import {
  getBlogById,
  updateBlog,
} from "../../api/blogAPI";

import BlogForm from "./BlogForm";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================
  // FETCH BLOG
  // =========================

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);

        const response = await getBlogById(id);

        const blogData = response?.data?.data;

        if (!blogData) {
          throw new Error("Blog post not found.");
        }

        setBlog(blogData);
      } catch (error) {
        console.error(
          "❌ Failed to fetch blog:",
          error
        );

        alert(
          error?.response?.data?.message ||
            "Failed to load blog post."
        );

        navigate("/admin/blog");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id, navigate]);

  // =========================
  // UPDATE BLOG
  // =========================

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);

      await updateBlog(id, payload);

      alert("Blog post updated successfully.");

      navigate("/admin/blog");
    } catch (error) {
      console.error(
        "❌ Failed to update blog:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to update blog post."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-sm font-medium text-gray-500">
          Loading blog post...
        </div>
      </div>
    );
  }

  // =========================
  // BLOG NOT FOUND
  // =========================

  if (!blog) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-indigo-600"
        >
          <FaArrowLeft />
          Back to Blog
        </Link>

        <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
          Blog post not found.
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="space-y-6">
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
          Edit Blog Post
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update the ServDial blog post details, content and SEO settings.
        </p>
      </div>

      <BlogForm
        mode="edit"
        initialData={blog}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
};

export default EditBlog;