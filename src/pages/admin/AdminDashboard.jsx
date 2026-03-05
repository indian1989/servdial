// frontend/src/pages/admin/AdminDashboard.jsx
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BusinessContext } from "../../context/BusinessContext";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/admin/Sidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const { businesses, updateBusinessStatus } = useContext(BusinessContext);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("business");
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [passMessage, setPassMessage] = useState("");
  const [passError, setPassError] = useState("");

  const [adminData, setAdminData] = useState({ name: "", email: "", password: "" });
  const [adminMessage, setAdminMessage] = useState("");
  const [adminError, setAdminError] = useState("");

  // ================= Filter businesses by search =================
  useEffect(() => {
    if (!searchQuery) return setFilteredBusinesses(businesses);
    const filtered = businesses.filter(
      (b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBusinesses(filtered);
  }, [searchQuery, businesses]);

  // ================= CHANGE PASSWORD =================
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassMessage("");
    setPassError("");
    try {
      const { data } = await axios.put(
        "/api/admin/change-password",
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPassMessage(data.message);
      setPasswordData({ currentPassword: "", newPassword: "" });
      toast.success(data.message);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to change password";
      setPassError(message);
      toast.error(message);
    }
  };

  // ================= CREATE ADMIN =================
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAdminMessage("");
    setAdminError("");
    try {
      const { data } = await axios.post(
        "/api/admin/create-admin",
        adminData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdminMessage("Admin created: " + data.admin.email);
      setAdminData({ name: "", email: "", password: "" });
      toast.success("Admin created: " + data.admin.email);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create admin";
      setAdminError(message);
      toast.error(message);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ================= Export CSV =================
  const exportCSV = () => {
    const csvRows = [
      ["Name", "Category", "City", "Status", "Owner Email"],
      ...businesses.map((b) => [b.name, b.category, b.city, b.status, b.owner?.email || "N/A"]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "businesses.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ================= KPI stats =================
  const totalBusinesses = businesses.length;
  const approvedCount = businesses.filter((b) => b.status === "approved").length;
  const pendingCount = businesses.filter((b) => b.status === "pending").length;
  const rejectedCount = businesses.filter((b) => b.status === "rejected").length;

  return (
    <div className="flex">
      <Sidebar role={user.role} />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="p-6 bg-gray-50 min-h-screen">
          {/* ===== TOP HEADER ===== */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {user.role === "superadmin" ? "Super Admin Dashboard" : "Admin Dashboard"}
            </h2>
            <div className="flex gap-4">
              {(user.role === "admin" || user.role === "superadmin") && (
                <button
                  onClick={() => navigate("/add-business")}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  + Add Business
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* ===== KPI Cards ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <h3 className="text-gray-500">Total Businesses</h3>
              <p className="text-2xl font-bold">{totalBusinesses}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow text-center">
              <h3 className="text-green-600">Approved</h3>
              <p className="text-2xl font-bold">{approvedCount}</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg shadow text-center">
              <h3 className="text-yellow-600">Pending</h3>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg shadow text-center">
              <h3 className="text-red-600">Rejected</h3>
              <p className="text-2xl font-bold">{rejectedCount}</p>
            </div>
          </div>

          {/* ===== Tabs ===== */}
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab("business")}
              className={`px-4 py-2 font-semibold ${activeTab === "business" ? "border-b-2 border-blue-600" : ""}`}
            >
              Businesses
            </button>
            <button
              onClick={() => setActiveTab("changePassword")}
              className={`px-4 py-2 font-semibold ${activeTab === "changePassword" ? "border-b-2 border-blue-600" : ""}`}
            >
              Change Password
            </button>
            {user.role === "superadmin" && (
              <button
                onClick={() => setActiveTab("createAdmin")}
                className={`px-4 py-2 font-semibold ${activeTab === "createAdmin" ? "border-b-2 border-blue-600" : ""}`}
              >
                Create Admin
              </button>
            )}
          </div>

          {/* ===== BUSINESS TAB ===== */}
          {activeTab === "business" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border p-2 rounded w-1/3"
                />
                <button
                  onClick={exportCSV}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Export CSV
                </button>
              </div>

              {filteredBusinesses.length === 0 ? (
                <p>No businesses found</p>
              ) : (
                <div className="grid gap-6">
                  {filteredBusinesses.map((b) => (
                    <div
                      key={b._id}
                      className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center"
                    >
                      <div>
                        <h3 className="text-xl font-semibold">{b.name}</h3>
                        <p className="text-gray-600">{b.category} - {b.city}</p>
                        <p className="mt-2">
                          Status:{" "}
                          <span
                            className={`font-bold ${
                              b.status === "approved"
                                ? "text-green-600"
                                : b.status === "rejected"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {b.status}
                          </span>
                        </p>
                      </div>
                      {b.status === "pending" && (
                        <div className="flex flex-col gap-3">
                          <button
                            onClick={() => updateBusinessStatus(b._id, "approved")}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateBusinessStatus(b._id, "rejected")}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== CHANGE PASSWORD TAB ===== */}
          {activeTab === "changePassword" && (
            <div className="max-w-md bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Change Password</h2>
              {passMessage && <p className="text-green-600">{passMessage}</p>}
              {passError && <p className="text-red-600">{passError}</p>}
              <form onSubmit={handlePasswordChange} className="space-y-3">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  Update Password
                </button>
              </form>
            </div>
          )}

          {/* ===== CREATE ADMIN TAB ===== */}
          {activeTab === "createAdmin" && user.role === "superadmin" && (
            <div className="max-w-md bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Create Admin</h2>
              {adminMessage && <p className="text-green-600">{adminMessage}</p>}
              {adminError && <p className="text-red-600">{adminError}</p>}
              <form onSubmit={handleCreateAdmin} className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={adminData.name}
                  onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={adminData.email}
                  onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={adminData.password}
                  onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  Create Admin
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;