// Path: frontend/src/pages/admin/BlogForm.jsx

import React, { useEffect, useState } from "react";
import {
  FaSave,
  FaImage,
  FaTags,
  FaEye,
} from "react-icons/fa";

import { getAllBlogCategories } from "../../api/blogCategoryAPI";
import { uploadImage } from "../../services/CloudinaryService";
import RichTextEditor from "../../components/admin/RichTextEditor";

const BlogForm = ({
  mode = "add",
  initialData = null,
  onSubmit,
  loading = false,
}) => {
  // =========================
  // FORM STATE
  // =========================

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    category: "",
    status: "draft",
    publishedAt: "",
    tags: "",
  });

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const [imageUploading, setImageUploading] =
  useState(false);

  // =========================
  // LOAD CATEGORIES
  // =========================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);

        const response = await getAllBlogCategories();

        const data = response?.data?.categories;

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
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // =========================
  // LOAD INITIAL DATA
  // =========================

  useEffect(() => {
    if (!initialData) {
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        featuredImage: "",
        category: "",
        status: "draft",
        publishedAt: "",
        tags: "",
      });

      return;
    }

    const categoryId =
      typeof initialData.category === "object"
        ? initialData.category?._id
        : initialData.category || "";

    const authorDate = initialData.publishedAt
      ? new Date(initialData.publishedAt)
      : null;

    let publishedAt = "";

    if (
      authorDate &&
      !Number.isNaN(authorDate.getTime())
    ) {
      const year = authorDate.getFullYear();
      const month = String(
        authorDate.getMonth() + 1
      ).padStart(2, "0");
      const day = String(
        authorDate.getDate()
      ).padStart(2, "0");
      const hours = String(
        authorDate.getHours()
      ).padStart(2, "0");
      const minutes = String(
        authorDate.getMinutes()
      ).padStart(2, "0");

      publishedAt = `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    const tags = Array.isArray(initialData.tags)
      ? initialData.tags.join(", ")
      : "";

    setFormData({
      title: initialData.title || "",
      slug: initialData.slug || "",
      excerpt: initialData.excerpt || "",
      content: initialData.content || "",
      featuredImage:
        initialData.featuredImage || "",
      category: categoryId,
      status: initialData.status || "draft",
      publishedAt,
      tags,
    });
  }, [initialData]);

  // =========================
  // INPUT HANDLERS
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
// FEATURED IMAGE UPLOAD
// =========================

const handleFeaturedImageChange = async (e) => {
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

    setFormData((prev) => ({
      ...prev,
      featuredImage: imageUrl,
    }));
  } catch (error) {
    console.error(
      "❌ Featured image upload failed:",
      error
    );

    alert(
      error?.message ||
        "Failed to upload featured image."
    );
  } finally {
    setImageUploading(false);
    e.target.value = "";
  }
};

  // =========================
  // SLUG
  // =========================

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;

    setFormData((prev) => ({
      ...prev,
      title,
      slug:
        !prev.slug ||
        prev.slug === generateSlug(prev.title)
          ? generateSlug(title)
          : prev.slug,
    }));
  };

  // =========================
  // TAGS
  // =========================

  const parseTags = (value) => {
    return value
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter blog title.");
      return;
    }

    if (!formData.slug.trim()) {
      alert("Please enter blog slug.");
      return;
    }

    const contentText = formData.content
  .replace(/<[^>]*>/g, " ")
  .replace(/&nbsp;/gi, " ")
  .replace(/\s+/g, " ")
  .trim();

if (!contentText) {
  alert("Please enter blog content.");
  return;
}

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      excerpt: formData.excerpt.trim(),
      content: formData.content,
      featuredImage:
        formData.featuredImage.trim(),
      category: formData.category || null,
      status: formData.status,

      publishedAt:
        formData.status === "published"
          ? formData.publishedAt ||
            new Date().toISOString()
          : null,

      tags: parseTags(formData.tags),
    };

    if (onSubmit) {
      await onSubmit(payload);
    }
  };

  // =========================
  // CLASSES
  // =========================

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";

  const textareaClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";

  // =========================
  // UI
  // =========================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* =========================
          BASIC INFORMATION
      ========================= */}

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add the main information for your blog post.
          </p>
        </div>

        <div className="space-y-5">
          {/* TITLE */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Title{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              maxLength={200}
              placeholder="Enter blog post title"
              className={inputClass}
            />

            <div className="mt-1 text-right text-xs text-gray-400">
              {formData.title.length}/200
            </div>
          </div>

          {/* SLUG */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Slug{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="blog-post-slug"
              className={inputClass}
            />

            <p className="mt-1 text-xs text-gray-400">
              Example: local-business-directory-guide
            </p>
          </div>

          {/* EXCERPT */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Excerpt
            </label>

            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={4}
              maxLength={500}
              placeholder="Short summary of the blog post..."
              className={textareaClass}
            />

            <div className="mt-1 text-right text-xs text-gray-400">
              {formData.excerpt.length}/500
            </div>
          </div>

         {/* CONTENT */}

<div>
  <label className="mb-1.5 block text-sm font-medium text-gray-700">
    Content{" "}
    <span className="text-red-500">*</span>
  </label>

  <RichTextEditor
    value={formData.content}
    onChange={(content) =>
      setFormData((prev) => ({
        ...prev,
        content,
      }))
    }
  />

  <p className="mt-1 text-xs text-gray-400">
    Write your article using the formatting toolbar. You
    do not need to write HTML or Markdown.
  </p>
</div>
        </div>
      </div>

      {/* =========================
          PUBLISHING
      ========================= */}

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <FaEye className="text-indigo-600" />

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Publishing
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Configure category and publication status.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* CATEGORY */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={categoriesLoading}
              className={inputClass}
            >
              <option value="">
                Select Category
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

            {categories.length === 0 &&
              !categoriesLoading && (
                <p className="mt-1 text-xs text-yellow-600">
                  No blog categories available. Create a
                  category first.
                </p>
              )}
          </div>

          {/* STATUS */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="draft">
                Draft
              </option>

              <option value="published">
                Published
              </option>
            </select>
          </div>

          {/* PUBLISHED DATE */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Publish Date
            </label>

            <input
              type="datetime-local"
              name="publishedAt"
              value={formData.publishedAt}
              onChange={handleChange}
              disabled={
                formData.status !== "published"
              }
              className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-100`}
            />

            <p className="mt-1 text-xs text-gray-400">
              Used when the post is published.
            </p>
          </div>

          {/* TAGS */}

          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaTags className="text-gray-400" />
              Tags
            </label>

            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="seo, local business, servdial"
              className={inputClass}
            />

            <p className="mt-1 text-xs text-gray-400">
              Separate tags with commas.
            </p>
          </div>
        </div>
      </div>

      {/* =========================
          FEATURED IMAGE
      ========================= */}

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <FaImage className="text-indigo-600" />

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Featured Image
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add the main image for this blog post.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
  <label
    htmlFor="featuredImageUpload"
    className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 ${
      imageUploading
        ? "cursor-not-allowed opacity-60"
        : ""
    }`}
  >
    <FaImage />

    {imageUploading
      ? "Uploading..."
      : formData.featuredImage
      ? "Change Image"
      : "Choose Image"}

    <input
      id="featuredImageUpload"
      type="file"
      accept="image/*"
      onChange={handleFeaturedImageChange}
      disabled={imageUploading}
      className="hidden"
    />
  </label>

  {formData.featuredImage && (
    <button
      type="button"
      onClick={() =>
        setFormData((prev) => ({
          ...prev,
          featuredImage: "",
        }))
      }
      disabled={imageUploading}
      className="text-sm font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Remove Image
    </button>
  )}
</div>

<p className="mt-1 text-xs text-gray-400">
  Upload the main image for this blog post.
</p>

        {formData.featuredImage && (
          <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
            <img
              src={formData.featuredImage}
              alt="Featured preview"
              className="max-h-72 w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display =
                  "none";
              }}
            />
          </div>
        )}
      </div>

      {/* =========================
          SUBMIT
      ========================= */}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || imageUploading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FaSave />

          {imageUploading
            ? "Uploading Image..."
            : loading
            ? "Saving..."
            : mode === "edit"
            ? "Update Blog Post"
            : "Create Blog Post"}
        </button>
      </div>
    </form>
  );
};

export default BlogForm;