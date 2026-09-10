// frontend/src/api/temporaryListingAPI.js

import API from "./axios";

// Public temporary listings
export const getPublicTemporaryListings = async (params = {}) => {
  const response = await API.get("/temporary-listings", {
    params,
  });

  return response.data;
};

// Get single temporary listing
export const getTemporaryListing = async (id) => {
  const response = await API.get(`/temporary-listings/${id}`);

  return response.data;
};

// Create temporary listing
export const createTemporaryListing = async (data) => {
  const response = await API.post("/temporary-listings", data);

  return response.data;
};

// Provider's own temporary listings
export const getProviderTemporaryListings = async () => {
  const response = await API.get(
    "/temporary-listings/provider/my-listings"
  );

  return response.data;
};

// Update temporary listing
export const updateTemporaryListing = async (id, data) => {
  const response = await API.put(
    `/temporary-listings/${id}`,
    data
  );

  return response.data;
};

// Delete temporary listing
export const deleteTemporaryListing = async (id) => {
  const response = await API.delete(
    `/temporary-listings/${id}`
  );

  return response.data;
};

// Admin: all temporary listings
export const getAllTemporaryListings = async (params = {}) => {
  const response = await API.get(
    "/temporary-listings/admin/all",
    {
      params,
    }
  );

  return response.data;
};

// Admin: approve
export const approveTemporaryListing = async (id) => {
  const response = await API.put(
    `/temporary-listings/admin/${id}/approve`
  );

  return response.data;
};

// Admin: reject
export const rejectTemporaryListing = async (id) => {
  const response = await API.put(
    `/temporary-listings/admin/${id}/reject`
  );

  return response.data;
};