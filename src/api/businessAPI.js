// frontend/src/api/businessAPI.js

import API from "./axios";

// ================= PUBLIC BUSINESS =================

// Search / listing
export const getBusinesses = (params) =>
  API.get("/businesses", { params });

// Single business
export const getBusinessBySlug = (slug) =>
  API.get(`/businesses/${slug}`);

// Nearby businesses
export const getNearbyBusinesses = (lat, lng) =>
  API.get("/businesses/nearby", {
    params: { lat, lng },
  });

// Featured
export const getFeaturedBusinesses = () =>
  API.get("/businesses/featured");

// Recommendations
export const getRecommendedBusinesses = () =>
  API.get("/recommendations");