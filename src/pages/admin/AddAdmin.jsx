import React, { useState, useEffect } from "react";
// Path: src/pages/admin/users/AddAdmin.jsx
import {
  getAllAdmins,
  addAdmin,
  deleteAdmin
} from "../../api/adminAPI";
import Loader from "../../components/common/Loader";
import { FaTrash } from "react-icons/fa";

const AddAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  // ================= FETCH ADMINS =================
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await getAllAdmins();
      setAdmins(res.data.admins);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch admins.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // ================= ADD ADMIN =================
  const handleAddAdmin = async () => {
    const { name, email, password, role } = formData;
    if (!name || !email || !password || !role)
      return alert("All fields are required.");
    setLoading(true);
    try {
      await addAdmin({ name, email, password, role });
      setFormData({ name: "", email: "", password: "", role: "admin" });
      fetchAdmins();
      alert("Admin added successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to add admin.");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE ADMIN =================
  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    setLoading(true);
    try {
      await deleteAdmin(id);
      fetchAdmins();
    } catch (err) {
      console.error(err);
      alert("Failed to delete admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Admin</h2>

      {loading && <Loader />}

      {/* Add Admin Form */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <input
          type="text"
          placeholder="Name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="email"
          placeholder="Email *"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="password"
          placeholder="Password *"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
        <button
          onClick={handleAddAdmin}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Admin
        </button>
      </div>

      {/* Admins Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100 text-center">
            <tr>
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Email</th>
              <th className="border px-3 py-2">Role</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin._id} className="text-center">
                <td className="border px-3 py-2">{admin.name}</td>
                <td className="border px-3 py-2">{admin.email}</td>
                <td className="border px-3 py-2">{admin.role}</td>
                <td className="border px-3 py-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleDeleteAdmin(admin._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddAdmin;