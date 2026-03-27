import API from "./axios";

// ==================== Businesses ====================
export const getAllBusinesses = () => API.get("/admin/businesses");

export const addBusiness = (data) =>
  API.post("/admin/business", data);

export const approveBusiness = (id) =>
  API.put(`/admin/business/approve/${id}`);

export const rejectBusiness = (id) =>
  API.put(`/admin/business/reject/${id}`);

export const toggleFeatured = (id) =>
  API.put(`/admin/business/feature/${id}`);

export const deleteBusiness = (id) =>
  API.delete(`/admin/business/${id}`);


// ==================== Users ====================
export const getAllUsers = () =>
  API.get("/admin/users");

export const toggleUserStatus = (id) =>
  API.put(`/admin/user/status/${id}`);

export const deleteUser = (id) =>
  API.delete(`/admin/user/${id}`);


// ==================== Cities ====================
export const getAllCities = () =>
  API.get("/admin/cities");

export const getCities = () =>
  API.get("/admin/cities"); // alias for components expecting getCities

export const addCity = (data) =>
  API.post("/admin/cities", data);

export const getStates = () =>
  API.get("/admin/cities/states");

export const getDistricts = (stateSlug) =>
  API.get(`/admin/cities/districts/${stateSlug}`);

// BULK UPLOAD
export const bulkUploadCities = (data) =>
  API.post("/admin/cities/bulk", data);

export const updateCity = (id, data) =>
  API.put(`/admin/cities/${id}`, data);

export const deleteCity = (id) =>
  API.delete(`/admin/cities/${id}`);

// ==================== Categories ====================

// ✅ ADMIN (used in admin panel)
export const getAllCategories = () =>
  API.get("/admin/categories");

export const getCategories = getAllCategories; // alias

export const addCategory = (data) =>
  API.post("/admin/categories", data);

export const updateCategory = (id, data) =>
  API.put(`/admin/categories/${id}`, data);

export const deleteCategory = (id) =>
  API.delete(`/admin/categories/${id}`);


// ✅ PUBLIC (used in user/provider/homepage)
export const fetchCategories = () =>
  API.get("/categories");

// ==================== Banner Ads ====================
export const getAllBanners = () =>
  API.get("/admin/banners");

export const addBanner = (data) =>
  API.post("/admin/banner", data);

export const updateBanner = (id, data) =>
  API.put(`/admin/banner/${id}`, data);

export const deleteBanner = (id) =>
  API.delete(`/admin/banner/${id}`);


// ==================== Admins ====================
export const getAllAdmins = () =>
  API.get("/admin/admins");

export const addAdmin = (data) =>
  API.post("/admin/admin", data);

export const updateAdmin = (id, data) =>
  API.put(`/admin/admin/${id}`, data);

export const deleteAdmin = (id) =>
  API.delete(`/admin/admin/${id}`);