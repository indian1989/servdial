import React, { useState, useEffect } from "react";
import {
  getAllAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin,
} from "../../api/adminAPI";
import Loader from "../../components/common/Loader";
import { FaTrash, FaEdit } from "react-icons/fa";

const PAGE_SIZE = 10;

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  const [editingAdminId, setEditingAdminId] = useState(null);
  const [editingAdminData, setEditingAdminData] = useState({
    name: "",
    email: "",
    role: "admin",
  });

  // ================= FETCH ADMINS =================
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await getAllAdmins();
      setAdmins(res.data.admins);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
      alert("Failed to fetch admins.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // ================= CRUD HANDLERS =================
  const handleAddAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) return alert("All fields are required.");
    setLoading(true);
    try {
      await addAdmin(newAdmin);
      setNewAdmin({ name: "", email: "", password: "", role: "admin" });
      fetchAdmins();
    } catch (err) {
      console.error(err);
      alert("Failed to add admin.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAdmin = async (id) => {
    if (!editingAdminData.name || !editingAdminData.email) return alert("Name and Email are required.");
    setLoading(true);
    try {
      await updateAdmin(id, editingAdminData);
      setEditingAdminId(null);
      setEditingAdminData({ name: "", email: "", role: "admin" });
      fetchAdmins();
    } catch (err) {
      console.error(err);
      alert("Failed to update admin.");
    } finally {
      setLoading(false);
    }
  };

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

  // ================= FILTER & PAGINATION =================
  const filteredAdmins = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAdmins.length / PAGE_SIZE);
  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // ================= RENDER =================
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Admins</h2>

      {/* Add Admin */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
        <input
          type="text"
          placeholder="Name"
          value={newAdmin.name}
          onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={newAdmin.email}
          onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={newAdmin.password}
          onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <select
          value={newAdmin.role}
          onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
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

      {/* Search */}
      <input
        type="text"
        placeholder="Search admins..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-4"
      />

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr className="text-center">
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">Email</th>
                <th className="border px-3 py-2">Role</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAdmins.map((admin) => (
                <tr key={admin._id} className="text-center">
                  <td className="border px-3 py-2">
                    {editingAdminId === admin._id ? (
                      <input
                        type="text"
                        value={editingAdminData.name}
                        onChange={(e) => setEditingAdminData({ ...editingAdminData, name: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      admin.name
                    )}
                  </td>
                  <td className="border px-3 py-2">
                    {editingAdminId === admin._id ? (
                      <input
                        type="email"
                        value={editingAdminData.email}
                        onChange={(e) => setEditingAdminData({ ...editingAdminData, email: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      admin.email
                    )}
                  </td>
                  <td className="border px-3 py-2">
                    {editingAdminId === admin._id ? (
                      <select
                        value={editingAdminData.role}
                        onChange={(e) => setEditingAdminData({ ...editingAdminData, role: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                      >
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded ${
                          admin.role === "superadmin" ? "bg-purple-500 text-white" : "bg-green-500 text-white"
                        }`}
                      >
                        {admin.role}
                      </span>
                    )}
                  </td>
                  <td className="border px-3 py-2 flex justify-center gap-2 flex-wrap">
                    {editingAdminId === admin._id ? (
                      <button
                        onClick={() => handleUpdateAdmin(admin._id)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingAdminId(admin._id);
                          setEditingAdminData({ name: admin.name, email: admin.email, role: admin.role });
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </button>
                    )}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageAdmins;