// Path: frontend/src/api/blogCategoryAPI.js

import API from "./axios";

// ==================== PUBLIC BLOG CATEGORIES ====================

// Get active blog categories
export const getActiveBlogCategories = () =>
  API.get("/blog-categories");

// ==================== ADMIN BLOG CATEGORIES ====================

// Get all blog categories
export const getAllBlogCategories = (params = {}) =>
  API.get("/blog-categories/admin", {
    params,
  });

// Get single blog category
export const getBlogCategoryById = (id) =>
  API.get(`/blog-categories/admin/${id}`);

// Create blog category
export const createBlogCategory = (data) =>
  API.post("/blog-categories", data);

// Update blog category
export const updateBlogCategory = (id, data) =>
  API.put(`/blog-categories/${id}`, data);

// Delete blog category
export const deleteBlogCategory = (id) =>
  API.delete(`/blog-categories/${id}`);