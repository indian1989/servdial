import React, { useEffect, useState } from "react";
import {
  getAllBusinesses,
  approveBusiness,
  rejectBusiness,
  toggleFeatured,
  deleteBusiness
} from "../../api/adminAPI";

import {
  FaTrash,
  FaStar,
  FaEdit,
  FaCheck,
  FaTimes
} from "react-icons/fa";

import ImageModal from "../../components/admin/modals/ImageModal";

const PAGE_SIZE = 10;

const ManageBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", category: "", city: "" });

  const fetchBusinesses = async () => {
  setLoading(true);
  try {
    const res = await getAllBusinesses();

    const data =
      res?.data?.businesses ||
      res?.data?.data ||
      [];

    setBusinesses(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Failed to fetch businesses", err);
    setBusinesses([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // ================= EDIT =================
  const startEdit = (b) => {
    setEditId(b._id);
    setEditForm({
      name: b.name || "",
      category: b.categoryId?.name || "",
      city: b.cityId?.name || ""
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ name: "", category: "", city: "" });
  };

  const saveEdit = async (id) => {
    setBusinesses((prev) =>
      prev.map((b) => (b._id === id ? { ...b, ...editForm } : b))
    );
    cancelEdit();
  };

  // ================= ACTIONS =================
  const updateLocal = (id, updater) => {
    setBusinesses((prev) =>
      prev.map((b) => (b._id === id ? updater(b) : b))
    );
  };

    const handleApprove = async (id) => {
    updateLocal(id, (b) => ({ ...b, status: "approved" }));
    await approveBusiness(id);
  };

  const handleReject = async (id) => {
    updateLocal(id, (b) => ({ ...b, status: "rejected" }));
    await rejectBusiness(id);
  };

  const handleFeature = async (id) => {
  const original = businesses.find(b => b._id === id);

  updateLocal(id, (b) => ({ ...b, isFeatured: !b.isFeatured }));

  try {
    await toggleFeatured(id);
  } catch (err) {
    console.error("Feature toggle failed", err);

    // rollback on failure
    updateLocal(id, () => original);
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this business?")) return;
    setBusinesses((prev) => prev.filter((b) => b._id !== id));
    await deleteBusiness(id);
  };

 // ================= FILTER =================

const searchTerm = search.toLowerCase();

const filtered = businesses
  .filter((b) =>
    statusFilter === "all" ? true : b.status === statusFilter
  )
  .filter((b) =>
    (b.name || "").toLowerCase().includes(searchTerm)
  );

const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

const paginated = filtered.slice(
  (currentPage - 1) * PAGE_SIZE,
  currentPage * PAGE_SIZE
);

  // ================= STATUS =================
  const StatusChip = ({ status }) => {
    const map = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700"
};

const safeStatus = status || "pending";

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${map[safeStatus]}`}>
  {safeStatus}
</span>
    );
  };

  // ================= UI =================
  return (
    <div className="p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <h2 className="text-2xl font-bold">Manage Businesses</h2>

        <div className="flex gap-2">
          <input
            className="border px-3 py-2 rounded w-full md:w-64"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border px-3 py-2 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* TABLE WRAPPER (MOBILE SCROLL FIX) */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">

        <table className="min-w-[900px] w-full text-sm">

          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Business</th>
              <th className="p-3">Category</th>
              <th className="p-3">City</th>
              <th className="p-3">Status</th>
              <th className="p-3">Featured</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="p-3" colSpan="6">
                    <div className="h-6 bg-gray-200 animate-pulse rounded" />
                  </td>
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No businesses found
                </td>
              </tr>
            ) : (

              paginated.map((b) => (
                <tr key={b._id} className="border-t hover:bg-gray-50">

                  {/* BUSINESS */}
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={b.images?.[0] || "/placeholder.png"}
                      className="w-10 h-10 rounded cursor-pointer object-cover"
                      onClick={() => setSelectedImage(b.images?.[0])}
                    />

                    {editId === b._id ? (
                      <input
                        className="border px-2 py-1 rounded w-full"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                    ) : (
                      <span className="font-medium">{b.name}</span>
                    )}
                  </td>

                  {/* CATEGORY */}
                  <td className="p-3">
                    {editId === b._id ? (
                      <input
                        className="border px-2 py-1 rounded w-full"
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm({ ...editForm, category: e.target.value })
                        }
                      />
                    ) : (
                      b.categoryId?.name || "N/A"
                    )}
                  </td>

                  {/* CITY */}
                  <td className="p-3">
                    {editId === b._id ? (
                      <input
                        className="border px-2 py-1 rounded w-full"
                        value={editForm.city}
                        onChange={(e) =>
                          setEditForm({ ...editForm, city: e.target.value })
                        }
                      />
                    ) : (
                      b.cityId?.name || "N/A"
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <StatusChip status={b.status} />
                  </td>

                  {/* FEATURE */}
                  <td className="p-3">
                    <button
                      onClick={() => handleFeature(b._id)}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-gray-100"
                    >
                      <FaStar />
                      {b.isFeatured ? "Yes" : "No"}
                    </button>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 text-right">

                    {editId === b._id ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => saveEdit(b._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>

                        <button
                          onClick={cancelEdit}
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() => startEdit(b)}
                          className="p-2 bg-blue-500 text-white rounded"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => handleApprove(b._id)}
                          className="p-2 bg-green-500 text-white rounded"
                        >
                          <FaCheck />
                        </button>

                        <button
                          onClick={() => handleReject(b._id)}
                          className="p-2 bg-yellow-500 text-white rounded"
                        >
                          <FaTimes />
                        </button>

                        <button
                          onClick={() => handleDelete(b._id)}
                          className="p-2 bg-red-500 text-white rounded"
                        >
                          <FaTrash />
                        </button>

                      </div>
                    )}

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-indigo-500 text-white"
                  : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* IMAGE MODAL */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

    </div>
  );
};

export default ManageBusinesses;