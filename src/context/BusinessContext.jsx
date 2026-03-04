import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch businesses from backend on app start
  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/business");
        setBusinesses(data.businesses || []);
      } catch (error) {
        console.error("Failed to fetch businesses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  // Add Business via backend
  const addBusiness = async (businessData) => {
    try {
      const { data } = await axios.post("/api/business", businessData);
      setBusinesses((prev) => [...prev, data.business]);
      return { success: true };
    } catch (error) {
      console.error("Failed to add business:", error);
      return { success: false, message: error.response?.data?.message || "Add failed" };
    }
  };

  // Update Status via backend (Admin)
  const updateBusinessStatus = async (id, status) => {
    try {
      const { data } = await axios.put(`/api/business/${id}`, { status });
      setBusinesses((prev) =>
        prev.map((b) => (b._id === id ? data.business : b))
      );
      return { success: true };
    } catch (error) {
      console.error("Failed to update status:", error);
      return { success: false };
    }
  };

  // Delete Business via backend
  const deleteBusiness = async (id) => {
    try {
      await axios.delete(`/api/business/${id}`);
      setBusinesses((prev) => prev.filter((b) => b._id !== id));
      return { success: true };
    } catch (error) {
      console.error("Failed to delete business:", error);
      return { success: false };
    }
  };

  const value = {
    businesses,
    loading,
    addBusiness,
    updateBusinessStatus,
    deleteBusiness,
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
};