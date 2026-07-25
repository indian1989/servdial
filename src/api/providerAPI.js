import API from "./axios";


// ================= PROVIDER BUSINESSES =================

// Provider business list
export const getProviderBusinesses = () =>
  API.get("/provider/businesses");


// Single provider business
export const getProviderBusinessById = (id) =>
  API.get(`/provider/businesses/${id}`);


// Update provider business
export const updateProviderBusiness = (id, data) =>
  API.put(`/provider/businesses/${id}`, data);