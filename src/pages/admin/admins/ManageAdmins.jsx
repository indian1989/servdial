// src/pages/admin/ManageAdmins.jsx
import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await API.get("/admins");
      setAdmins(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Delete admin
  const deleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await API.delete(`/admins/${id}`);
      setAdmins((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete admin");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Admins</h1>
      <button
        onClick={() => navigate("/admin/add-admin")}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add New Admin
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a._id} className="text-center border-t">
                <td className="p-2">{a.name}</td>
                <td className="p-2">{a.email}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => navigate(`/admin/edit-admin/${a._id}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAdmin(a._id)}
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

export default ManageAdmins;