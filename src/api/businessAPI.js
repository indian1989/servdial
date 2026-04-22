// frontend/src/api/businessAPI.js

import API from "./axios";

// ================= PUBLIC BUSINESS =================

// Search / listing
export const getBusinesses = (params) =>
  API.get("/business", { params });

// Single business
export const getBusinessBySlug = (slug) =>
  API.get(`/business/${slug}`);

// Nearby businesses
export const getNearbyBusinesses = (lat, lng) =>
  API.get("/business/nearby", {
    params: { lat, lng },
  });

// Featured
export const getFeaturedBusinesses = () =>
  API.get("/business/featured");

// Recommendations
export const getRecommendedBusinesses = () =>
  API.get("/recommendations");