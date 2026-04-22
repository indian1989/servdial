// frontend/src/api/adminAPI.js
import API from "./axios";

// ==================== Businesses ====================

// ✅ FIXED
export const getAllBusinesses = () => 
  API.get("/admin-businesses");

export const addBusiness = (data) =>
  API.post("/admin-businesses", data);

// ✅ FIXED PARAM ORDER
export const approveBusiness = (id) =>
  API.put(`/admin-businesses/${id}/approve`);

export const rejectBusiness = (id) =>
  API.put(`/admin-businesses/${id}/reject`);

export const toggleFeatured = (id) =>
  API.put(`/admin-businesses/${id}/feature`);

export const deleteBusiness = (id) =>
  API.delete(`/admin-businesses/${id}`);

// ==================== BUSINESS STATS ====================
// export const getBusinessStats = () =>
 //  API.get("/admin/businesses/business-stats");
// ==================== Users ====================
export const getAllUsers = () =>
  API.get("/admin/users");

export const toggleUserStatus = (id) =>
  API.put(`/admin/users/${id}/status`);

export const deleteUser = (id) =>
  API.delete(`/admin/users/${id}`);


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
  API.post("/admin/banners", {
    ...data,
    status: undefined,
    paymentStatus: undefined,
    approvedBy: undefined,
    approvedAt: undefined,
  });

export const updateBanner = (id, data) =>
  API.put(`/admin/banners/${id}`, {
    title: data.title,
    link: data.link,
    image: data.image,
    placement: data.placement,
    cityId: data.cityId,
    categoryId: data.categoryId,
    isActive: data.isActive,
  });

export const deleteBanner = (id) =>
  API.delete(`/admin/banners/${id}`);

export const approveBanner = (id) =>
  API.put(`/admin/banners/${id}/approve`);

export const rejectBanner = (id) =>
  API.put(`/admin/banners/${id}/reject`);

export const markBannerPaid = (id, paymentId) =>
  API.put(`/admin/banners/${id}/payment`, {
    paymentStatus: "paid",
    paymentId,
  });
// ==================== Admins ====================
export const getAllAdmins = () =>
  API.get("/admin/admins");

export const addAdmin = (data) =>
  API.post("/admin/admins", data);

export const updateAdmin = (id, data) =>
  API.put(`/admin/admins/${id}`, data);

export const deleteAdmin = (id) =>
  API.delete(`/admin/admins/${id}`);