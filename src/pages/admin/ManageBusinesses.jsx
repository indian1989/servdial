import React, { useState, useEffect } from "react";
import {
  getAllBusinesses,
  approveBusiness,
  rejectBusiness,
  toggleFeatured,
  deleteBusiness
} from "../../api/adminAPI";

import { FaTrash, FaCheck, FaTimes, FaStar } from "react-icons/fa";
import Loader from "../../components/common/Loader";
import ImageModal from "../../components/admin/modals/ImageModal";

const PAGE_SIZE = 10;

const ManageBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const res = await getAllBusinesses();
      setBusinesses(res?.data?.businesses || []);
    } catch (err) {
      console.error("Failed to fetch businesses:", err);
      alert("Failed to fetch businesses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  // ================= ACTIONS =================
  const handleApprove = async (id) => {
    await approveBusiness(id);
    fetchBusinesses();
  };

  const handleReject = async (id) => {
    await rejectBusiness(id);
    fetchBusinesses();
  };

  const handleFeature = async (id) => {
    await toggleFeatured(id);
    fetchBusinesses();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this business?")) {
      await deleteBusiness(id);
      fetchBusinesses();
    }
  };

  // ================= SAFE FILTER =================
  const safeBusinesses = Array.isArray(businesses) ? businesses : [];

  const filteredBusinesses = safeBusinesses
    .filter((b) =>
      statusFilter === "all" ? true : b.status === statusFilter
    )
    .filter((b) =>
      b.name?.toLowerCase().includes(search.toLowerCase())
    );

  const totalPages = Math.ceil(filteredBusinesses.length / PAGE_SIZE);

  const paginatedBusinesses = filteredBusinesses.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // ================= HELPERS =================
  const getCategoryName = (b) => {
    if (!b.category) return "N/A";
    if (typeof b.category === "object") return b.category.name;
    return b.category;
  };

  const getCityName = (b) => {
    if (!b.city) return "N/A";
    if (typeof b.city === "object") {
      return `${b.city.name || ""} ${b.city.state ? `(${b.city.state})` : ""}`;
    }
    return b.city;
  };

  const getOwnerName = (b) => {
    if (!b.owner) return "N/A";
    return b.owner.name || "Unknown";
  };

  const getOwnerEmail = (b) => {
    return b.owner?.email || "";
  };

  // ================= UI =================
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Businesses</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1 min-w-[200px]"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">

            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Image</th>
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">Category</th>
                <th className="border px-3 py-2">City</th>
                <th className="border px-3 py-2">Owner</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Featured</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedBusinesses.map((b) => (
                <tr key={b._id} className="text-center">

                  {/* IMAGE */}
                  <td className="border px-2 py-1">
                    {b.images?.[0] ? (
                      <img
                        src={b.images[0]}
                        className="h-12 w-12 object-cover cursor-pointer mx-auto rounded"
                        onClick={() => setSelectedImage(b.images[0])}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>

                  {/* NAME */}
                  <td className="border px-2 py-1 font-medium">
                    {b.name || "N/A"}
                  </td>

                  {/* CATEGORY FIXED */}
                  <td className="border px-2 py-1">
                    {getCategoryName(b)}
                  </td>

                  {/* CITY FIXED */}
                  <td className="border px-2 py-1">
                    {getCityName(b)}
                  </td>

                  {/* OWNER FIXED */}
                  <td className="border px-2 py-1">
                    {getOwnerName(b)} <br />
                    <span className="text-xs text-gray-500">
                      {getOwnerEmail(b)}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="border px-2 py-1">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-sm ${
                        b.status === "approved"
                          ? "bg-green-500"
                          : b.status === "rejected"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  {/* FEATURED FIXED */}
                  <td className="border px-2 py-1">
                    <button
                      onClick={() => handleFeature(b._id)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-white text-sm ${
                        b.isFeatured ? "bg-blue-600" : "bg-gray-400"
                      }`}
                    >
                      <FaStar />
                      {b.isFeatured ? "Featured" : "Not Featured"}
                    </button>
                  </td>

                  {/* ACTIONS */}
                  <td className="border px-2 py-1 flex flex-wrap justify-center gap-1">

                    <button
                      onClick={() => handleApprove(b._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded flex items-center gap-1"
                    >
                      <FaCheck /> Approve
                    </button>

                    <button
                      onClick={() => handleReject(b._id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded flex items-center gap-1"
                    >
                      <FaTimes /> Reject
                    </button>

                    <button
                      onClick={() => handleDelete(b._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
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