// src/pages/admin/ManageBannerAds.jsx
import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const ManageBannerAds = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await API.get("/banners");
      setBanners(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Delete banner
  const deleteBanner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      await API.delete(`/banners/${id}`);
      setBanners((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete banner");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Banner Ads</h1>
      <button
        onClick={() => navigate("/admin/add-banner")}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add New Banner
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b._id} className="text-center border-t">
                <td className="p-2">
                  <img src={b.imageUrl} alt={b.title} className="w-32 mx-auto" />
                </td>
                <td className="p-2">{b.title}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => navigate(`/admin/edit-banner/${b._id}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBanner(b._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageBannerAds;