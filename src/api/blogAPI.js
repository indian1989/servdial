// Path: frontend/src/api/blogAPI.js

import API from "./axios";

// ==================== PUBLIC BLOG ====================

// Get published blogs
export const getPublishedBlogs = (params = {}) =>
  API.get("/blog", {
    params,
  });

// Get single published blog by slug
export const getBlogBySlug = (slug) =>
  API.get(`/blog/${slug}`);

// Increment blog views
export const incrementBlogViews = (id) =>
  API.patch(`/blog/${id}/views`);

// ==================== ADMIN BLOG ====================

// Get all blogs including drafts
export const getAllBlogs = (params = {}) =>
  API.get("/blog/admin", {
    params,
  });

// Get single blog by ID
export const getBlogById = (id) =>
  API.get(`/blog/admin/${id}`);

// Create blog
export const createBlog = (data) =>
  API.post("/blog", data);

// Update blog
export const updateBlog = (id, data) =>
  API.put(`/blog/${id}`, data);

// Delete blog
export const deleteBlog = (id) =>
  API.delete(`/blog/${id}`);

// ==================== PIN / UNPIN ====================

export const toggleBlogPin = (id) =>
  API.patch(`/blog/${id}/pin`);