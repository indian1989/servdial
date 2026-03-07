import React, { useEffect, useState } from "react";
import API from "../../../api/axios";

const ManageBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ================= FETCH BUSINESSES =================
  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/api/admin/businesses");
      setBusinesses(data);
    } catch (error) {
      console.error("Failed to fetch businesses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  // ================= ACTIONS =================
  const approveBusiness = async (id) => {
    await API.put(`/api/admin/business/approve/${id}`);
    fetchBusinesses();
  };

  const rejectBusiness = async (id) => {
    await API.put(`/api/admin/business/reject/${id}`);
    fetchBusinesses();
  };

  const deleteBusiness = async (id) => {
    if (!window.confirm("Delete this business?")) return;

    await API.delete(`/api/admin/business/${id}`);
    fetchBusinesses();
  };

  const featureBusiness = async (id) => {
    await API.put(`/api/admin/business/feature/${id}`);
    fetchBusinesses();
  };

  // ================= FILTER =================
  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ================= UI =================
  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Businesses</h1>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 mb-6">

        <input
          type="text"
          placeholder="Search business..."
          className="border rounded-lg px-4 py-2 w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg px-4 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>

      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading businesses...
        </div>
      ) : (

        <div className="overflow-x-auto bg-white shadow rounded-lg">

          <table className="min-w-full">

            <thead className="bg-gray-100 text-left text-sm">

              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">City</th>
                <th className="p-3">Owner</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Status</th>
                <th className="p-3">Featured</th>
                <th className="p-3">Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredBusinesses.map((b) => (

                <tr key={b._id} className="border-t">

                  {/* IMAGE */}
                  <td className="p-3">
                    {b.images?.length > 0 ? (
                      <img
                        src={b.images[0]}
                        alt={b.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>

                  {/* NAME */}
                  <td className="p-3 font-medium">{b.name}</td>

                  <td className="p-3">{b.category}</td>

                  <td className="p-3">{b.city}</td>

                  {/* OWNER */}
                  <td className="p-3">
                    {b.owner?.name || "N/A"}
                    <div className="text-xs text-gray-500">
                      {b.owner?.email}
                    </div>
                  </td>

                  <td className="p-3">{b.phone}</td>

                  {/* STATUS */}
                  <td className="p-3">

                    {b.status === "approved" && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        Approved
                      </span>
                    )}

                    {b.status === "pending" && (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                        Pending
                      </span>
                    )}

                    {b.status === "rejected" && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                        Rejected
                      </span>
                    )}

                  </td>

                  {/* FEATURED */}
                  <td className="p-3">

                    {b.isFeatured ? (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        Featured
                      </span>
                    ) : (
                      "No"
                    )}

                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 space-x-2">

                    <button
                      onClick={() => approveBusiness(b._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectBusiness(b._id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => featureBusiness(b._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Feature
                    </button>

                    <button
                      onClick={() => deleteBusiness(b._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
};

export default ManageBusinesses;