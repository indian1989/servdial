import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BusinessContext } from "../../context/BusinessContext";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/admin/Sidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import axios from "../../api/axios";

const AdminDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const { businesses, updateBusinessStatus, togglePaidService } =
    useContext(BusinessContext);

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("business");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [passMessage, setPassMessage] = useState("");
  const [passError, setPassError] = useState("");

  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [adminMessage, setAdminMessage] = useState("");
  const [adminError, setAdminError] = useState("");

  // ================= CHANGE PASSWORD =================
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassMessage("");
    setPassError("");

    try {
      const { data } = await axios.put(
        "/api/users/change-password",
        passwordData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPassMessage(data.message);
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPassError(
        err.response?.data?.message || "Failed to change password"
      );
    }
  };

  // ================= CREATE ADMIN =================
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAdminMessage("");
    setAdminError("");

    try {
      const { data } = await axios.post(
        "/api/users/create-admin",
        adminData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAdminMessage(
        "Admin created successfully: " + data.admin.email
      );
      setAdminData({ name: "", email: "", password: "" });
    } catch (err) {
      setAdminError(
        err.response?.data?.message || "Failed to create admin"
      );
    }
  };

  return (
    <div className="flex">
      <Sidebar role={user.role} />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="p-6 bg-gray-50 min-h-screen">

          {/* ======= TOP HEADER WITH ADD BUSINESS BUTTON ======= */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {user.role === "superadmin"
                ? "Super Admin Dashboard"
                : "Admin Dashboard"}
            </h2>

            {(user.role === "admin" ||
              user.role === "superadmin") && (
              <button
                onClick={() => navigate("/add-business")}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                + Add Business
              </button>
            )}
          </div>

          {/* ================= TABS ================= */}
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab("business")}
              className={`px-4 py-2 font-semibold ${
                activeTab === "business"
                  ? "border-b-2 border-blue-600"
                  : ""
              }`}
            >
              Businesses
            </button>

            <button
              onClick={() => setActiveTab("changePassword")}
              className={`px-4 py-2 font-semibold ${
                activeTab === "changePassword"
                  ? "border-b-2 border-blue-600"
                  : ""
              }`}
            >
              Change Password
            </button>

            {user.role === "superadmin" && (
              <button
                onClick={() => setActiveTab("createAdmin")}
                className={`px-4 py-2 font-semibold ${
                  activeTab === "createAdmin"
                    ? "border-b-2 border-blue-600"
                    : ""
                }`}
              >
                Create Admin
              </button>
            )}
          </div>

          {/* ================= BUSINESS TAB ================= */}
          {activeTab === "business" && (
            <div>
              {businesses.length === 0 && (
                <p>No Businesses Submitted Yet</p>
              )}

              <div className="grid gap-6">
                {businesses.map((business) => (
                  <div
                    key={business._id}
                    className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-xl font-semibold">
                        {business.name}
                      </h3>
                      <p className="text-gray-600">
                        {business.category} - {business.city}
                      </p>
                      <p className="mt-2">
                        Status:{" "}
                        <span
                          className={`font-bold ${
                            business.status === "approved"
                              ? "text-green-600"
                              : business.status === "rejected"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {business.status}
                        </span>
                      </p>
                    </div>

                    {business.status === "pending" && (
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() =>
                            updateBusinessStatus(
                              business._id,
                              "approved"
                            )
                          }
                          className="bg-green-600 text-white px-4 py-2 rounded-lg"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            updateBusinessStatus(
                              business._id,
                              "rejected"
                            )
                          }
                          className="bg-red-600 text-white px-4 py-2 rounded-lg"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= CHANGE PASSWORD TAB ================= */}
          {activeTab === "changePassword" && (
            <div className="max-w-md bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-4">
                Change Password
              </h2>

              {passMessage && (
                <p className="text-green-600">{passMessage}</p>
              )}
              {passError && (
                <p className="text-red-600">{passError}</p>
              )}

              <form
                onSubmit={handlePasswordChange}
                className="space-y-3"
              >
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                  className="w-full border px-3 py-2 rounded"
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                  className="w-full border px-3 py-2 rounded"
                />

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}

          {/* ================= CREATE ADMIN TAB ================= */}
          {activeTab === "createAdmin" &&
            user.role === "superadmin" && (
              <div className="max-w-md bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">
                  Create Admin
                </h2>

                {adminMessage && (
                  <p className="text-green-600">
                    {adminMessage}
                  </p>
                )}
                {adminError && (
                  <p className="text-red-600">
                    {adminError}
                  </p>
                )}

                <form
                  onSubmit={handleCreateAdmin}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={adminData.name}
                    onChange={(e) =>
                      setAdminData({
                        ...adminData,
                        name: e.target.value,
                      })
                    }
                    required
                    className="w-full border px-3 py-2 rounded"
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    value={adminData.email}
                    onChange={(e) =>
                      setAdminData({
                        ...adminData,
                        email: e.target.value,
                      })
                    }
                    required
                    className="w-full border px-3 py-2 rounded"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={adminData.password}
                    onChange={(e) =>
                      setAdminData({
                        ...adminData,
                        password: e.target.value,
                      })
                    }
                    required
                    className="w-full border px-3 py-2 rounded"
                  />

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
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