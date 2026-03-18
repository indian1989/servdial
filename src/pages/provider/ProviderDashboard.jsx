import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../../api/axios";
import { providerRoutes } from "../../routes/routeConfig";

function ProviderSidebar({ sidebarOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-gray-900 text-white min-h-screen p-4">
        <SidebarContent location={location} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden">
          <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-4">
            <button
              onClick={onClose}
              className="mb-4 text-white text-xl font-bold"
            >
              ✕ Close
            </button>
            <SidebarContent location={location} />
          </div>
        </div>
      )}
    </>
  );
}

// Separate component for sidebar content
function SidebarContent({ location }) {
  return (
    <>
      <h2 className="text-xl font-bold mb-6">Provider Panel</h2>
      <ul className="space-y-3">
        {providerRoutes.map((route) => {
          const isActive = location.pathname.startsWith(route.path);
          return (
            <li key={route.path}>
              <Link
                to={route.path}
                className={`block p-2 rounded transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "hover:bg-gray-700"
                }`}
              >
                {route.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

const ProviderDashboard = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("servdial_user") || "null");

  const fetchBusinesses = async () => {
    try {
      const res = await API.get("/business/provider");
      setBusinesses(res.data.businesses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const deleteBusiness = async (id) => {
    if (!window.confirm("Delete this business?")) return;
    try {
      await API.delete(`/business/${id}`);
      fetchBusinesses();
    } catch {
      alert("Error deleting business");
    }
  };

  if (!user) return <p className="p-10">Login required</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-6">
        {/* Mobile hamburger */}
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h1 className="text-2xl font-bold">Provider Dashboard</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 bg-gray-200 px-3 py-1 rounded-md"
          >
            ☰ Menu
          </button>
        </div>

        {/* Desktop header */}
        <div className="hidden md:flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Provider Dashboard</h1>
          <Link
            to="/provider/add-business"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add New Business
          </Link>
        </div>

        {/* LOADING */}
        {loading && <p>Loading your businesses...</p>}

        {/* EMPTY */}
        {!loading && businesses.length === 0 && (
          <div className="border rounded p-10 text-center">
            <p className="mb-4">You have not added any business yet.</p>
            <Link
              to="/provider/add-business"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Your First Business
            </Link>
          </div>
        )}

        {/* BUSINESS LIST */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((biz) => {
            let statusColor = "bg-yellow-500";
            if (biz.status === "approved") statusColor = "bg-green-600";
            if (biz.status === "rejected") statusColor = "bg-red-600";

            return (
              <div
                key={biz._id}
                className="border rounded-lg overflow-hidden shadow-sm bg-white"
              >
                <img
                  src={biz.logo || "/placeholder.png"}
                  alt={biz.name}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{biz.name}</h3>
                  <p className="text-sm text-gray-500">{biz.city}</p>
                  <p className="text-sm text-gray-500">
                    Category: {biz.categoryName}
                  </p>

                  <div className="mt-2">
                    <span
                      className={`text-white text-xs px-2 py-1 rounded ${statusColor}`}
                    >
                      {biz.status}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4 flex-wrap">
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;