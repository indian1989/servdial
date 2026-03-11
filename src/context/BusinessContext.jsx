// frontend/src/context/BusinessContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH BUSINESSES =================
  useEffect(() => {
  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/business");

      if (Array.isArray(data)) {
        setBusinesses(data);
      } else {
        setBusinesses(data.businesses || []);
      }

    } catch (error) {
      console.error("Failed to fetch businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchBusinesses();
}, []);

  // ================= ADD BUSINESS =================
  const addBusiness = async (businessData) => {
    try {
      const { data } = await axios.post("/business", businessData);
      setBusinesses((prev) => [...prev, data.business]);
      return { success: true, business: data.business };
    } catch (error) {
      console.error("Failed to add business:", error);
      return { success: false, message: error.response?.data?.message || "Add failed" };
    }
  };

  // ================= UPDATE BUSINESS STATUS =================
  const updateBusinessStatus = async (id, status) => {
    try {
      const { data } = await axios.put(`/business/${id}`, { status });
      setBusinesses((prev) => prev.map((b) => (b._id === id ? data.business : b)));
      return { success: true };
    } catch (error) {
      console.error("Failed to update business status:", error);
      return { success: false, message: error.response?.data?.message || "Update failed" };
    }
  };

  // ================= DELETE BUSINESS =================
  const deleteBusiness = async (id) => {
    try {
      await axios.delete(`/business/${id}`);
      setBusinesses((prev) => prev.filter((b) => b._id !== id));
      return { success: true };
    } catch (error) {
      console.error("Failed to delete business:", error);
      return { success: false, message: error.response?.data?.message || "Delete failed" };
    }
  };

  // ================= TOGGLE PAID SERVICE =================
  const togglePaidService = async (id) => {
    try {
      const business = businesses.find((b) => b._id === id);
      if (!business) return { success: false, message: "Business not found" };

      const { data } = await axios.put(`/business/${id}/toggle-paid`, {
        isPaid: !business.isPaid,
      });

      setBusinesses((prev) =>
        prev.map((b) => (b._id === id ? data.business : b))
      );

      return { success: true, business: data.business };
    } catch (error) {
      console.error("Failed to toggle paid service:", error);
      return { success: false, message: error.response?.data?.message || "Toggle failed" };
    }
  };

  const value = {
    businesses,
    loading,
    addBusiness,
    updateBusinessStatus,
    deleteBusiness,
    togglePaidService,
  };

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
};