import React, { useEffect, useState, useContext } from "react";
import axios from "../../api/axios";
import BusinessCard from "./BusinessCard";
import { AuthContext } from "../../context/AuthContext";

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);
  const userRole = user?.role || "user";

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get("/api/business");
        setBusinesses(res.data.businesses);
      } catch (err) {
        console.error("Failed to fetch businesses:", err);
        setError("Unable to load businesses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading businesses...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        {error}
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No businesses found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {businesses.map((b) => (
        <BusinessCard key={b._id} business={b} userRole={userRole} />
      ))}
    </div>
  );
};

export default BusinessList;