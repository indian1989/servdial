import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

const ProviderDashboard = () => {
  const [businesses, setBusinesses] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    leads: 0,
    reviews: 0,
  });

  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("servdial_user") || "null");

  const fetchDashboardData = async () => {
    try {
      // 🔥 parallel calls (faster dashboard)
      const [bizRes, leadsRes, reviewsRes] = await Promise.all([
        API.get("/provider/businesses"),
        API.get("/provider/leads"),
        API.get("/provider/reviews"),
      ]);

      const bizList = Array.isArray(bizRes.data?.businesses)
        ? bizRes.data.businesses
        : [];

      const leads = Array.isArray(leadsRes.data?.leads)
        ? leadsRes.data.leads
        : [];

      const reviews = Array.isArray(reviewsRes.data?.reviews)
        ? reviewsRes.data.reviews
        : [];

      setBusinesses(bizList);

      setStats({
        total: bizList.length,
        approved: bizList.filter((b) => b.status === "approved").length,
        pending: bizList.filter((b) => b.status === "pending").length,
        rejected: bizList.filter((b) => b.status === "rejected").length,

        // 🔥 NEW KPIs
        leads: leads.length,
        reviews: reviews.length,
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const deleteBusiness = async (id) => {
    if (!window.confirm("Delete this business?")) return;

    try {
      await API.delete(`/business/${id}`);
      fetchDashboardData();
    } catch (err) {
      alert("Error deleting business");
    }
  };

  if (!user) return <p className="p-10">Login required</p>;

  const StatCard = ({ label, value, color }) => (
    <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
      <p className="text-gray-500 text-sm">{label}</p>
      <h2 className={`text-xl font-bold ${color}`}>{value}</h2>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">

      <div className="flex-1 p-4 md:p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Provider Dashboard</h1>

          <Link
            to="/provider/add-business"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Business
          </Link>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">

          <StatCard label="Total" value={stats.total} color="" />
          <StatCard label="Approved" value={stats.approved} color="text-green-600" />
          <StatCard label="Pending" value={stats.pending} color="text-yellow-600" />
          <StatCard label="Rejected" value={stats.rejected} color="text-red-600" />

          {/* 🔥 NEW */}
          <StatCard label="Leads" value={stats.leads} color="text-blue-600" />
          <StatCard label="Reviews" value={stats.reviews} color="text-purple-600" />

        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid gap-4">
            <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
          </div>
        )}

        {/* EMPTY */}
        {!loading && businesses.length === 0 && (
          <div className="p-10 text-center border rounded bg-white">
            <p className="mb-4">No businesses found yet</p>
            <Link
              to="/provider/add-business"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Create Your First Business
            </Link>
          </div>
        )}

        {/* BUSINESS LIST */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {businesses.map((biz) => (
            <div
              key={biz._id}
              className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition"
            >

              <img
                src={biz.logo || "/placeholder.png"}
                className="h-40 w-full object-cover"
                alt={biz.name}
              />

              <div className="p-4 space-y-2">

                <h3 className="font-semibold text-lg">{biz.name}</h3>

                <p className="text-sm text-gray-500">
                  {biz.cityId?.name || "City"}
                </p>

                <p className="text-sm text-gray-500">
                  {biz.categoryId?.name || "Category"}
                </p>

                <span className="text-xs px-2 py-1 rounded bg-gray-100 inline-block">
                  {biz.status}
                </span>

                <div className="flex gap-2 pt-3">

                  <Link
                    to={`/provider/edit-business/${biz._id}`}
                    className="bg-gray-800 text-white px-3 py-1 text-sm rounded"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteBusiness(biz._id)}
                    className="bg-red-500 text-white px-3 py-1 text-sm rounded"
                  >
                    Delete
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default ProviderDashboard;