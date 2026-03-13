import React, { useState, useEffect } from "react";
import { getAllBusinesses, approveBusiness, rejectBusiness, toggleFeatured, deleteBusiness } from "../../api/adminAPI";
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

  // ============ Handlers ============
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

  // ============ Filters ============

const safeBusinesses = Array.isArray(businesses) ? businesses : [];

const filteredBusinesses = safeBusinesses
  .filter((b) =>
    statusFilter === "all" ? true : b.status === statusFilter
  )
  .filter((b) =>
    b.name?.toLowerCase().includes(search?.toLowerCase())
  );

const totalPages = Math.ceil(filteredBusinesses.length / PAGE_SIZE);

const paginatedBusinesses = filteredBusinesses.slice(
  (currentPage - 1) * PAGE_SIZE,
  currentPage * PAGE_SIZE
);

  // ============ Render ============
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Businesses</h2>

      {/* Search & Filter */}
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
          <option value="all">All Statuses</option>
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
                  <td className="border px-2 py-1">
                    {b.images?.[0] ? (
                      <img
                        src={b.images[0]}
                        alt={b.name}
                        className="h-12 w-12 object-cover cursor-pointer mx-auto rounded"
                        onClick={() => setSelectedImage(b.images[0])}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="border px-2 py-1">{b.name}</td>
                  <td className="border px-2 py-1">{b.category}</td>
                  <td className="border px-2 py-1">{b.city}</td>
                  <td className="border px-2 py-1">
                    {b.owner?.name} <br />
                    <span className="text-xs text-gray-500">{b.owner?.email}</span>
                  </td>
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
                  <td className="border px-2 py-1">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-white text-sm bg-blue-500 cursor-pointer" onClick={() => handleFeature(b._id)}>
                      {b.isFeatured ? <FaStar /> : "No"} Featured
                    </span>
                  </td>
                  <td className="border px-2 py-1 flex flex-wrap justify-center gap-1">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center gap-1"
                      onClick={() => handleApprove(b._id)}
                    >
                      <FaCheck /> Approve
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 flex items-center gap-1"
                      onClick={() => handleReject(b._id)}
                    >
                      <FaTimes /> Reject
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                      onClick={() => handleDelete(b._id)}
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

      {/* Image Preview Modal */}
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