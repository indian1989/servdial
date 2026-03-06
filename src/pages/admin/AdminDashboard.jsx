import { useContext, useMemo } from "react";
import { BusinessContext } from "../../context/BusinessContext";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/admin/Sidebar";
import AdminHeader from "../../components/admin/AdminHeader";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

const AdminDashboard = () => {
  const { businesses } = useContext(BusinessContext);
  const { user } = useContext(AuthContext);

  // ================= KPI =================
  const total = businesses.length;
  const approved = businesses.filter((b) => b.status === "approved").length;
  const pending = businesses.filter((b) => b.status === "pending").length;
  const rejected = businesses.filter((b) => b.status === "rejected").length;

  // ================= CATEGORY CHART =================
  const categoryData = useMemo(() => {
    const map = {};

    businesses.forEach((b) => {
      map[b.category] = (map[b.category] || 0) + 1;
    });

    return Object.keys(map).map((key) => ({
      name: key,
      value: map[key],
    }));
  }, [businesses]);

  // ================= CITY CHART =================
  const cityData = useMemo(() => {
    const map = {};

    businesses.forEach((b) => {
      map[b.city] = (map[b.city] || 0) + 1;
    });

    return Object.keys(map).map((key) => ({
      name: key,
      value: map[key],
    }));
  }, [businesses]);

  return (
    <div className="flex">
      <Sidebar role={user.role} user={user} />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="p-6 bg-gray-50 min-h-screen">

          {/* PAGE TITLE */}
          <h2 className="text-2xl font-bold mb-6">
            {user.role === "superadmin"
              ? "Super Admin Dashboard"
              : "Admin Dashboard"}
          </h2>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500">Total Businesses</p>
              <h3 className="text-2xl font-bold">{total}</h3>
            </div>

            <div className="bg-green-50 p-6 rounded-xl shadow">
              <p className="text-green-700">Approved</p>
              <h3 className="text-2xl font-bold">{approved}</h3>
            </div>

            <div className="bg-yellow-50 p-6 rounded-xl shadow">
              <p className="text-yellow-700">Pending</p>
              <h3 className="text-2xl font-bold">{pending}</h3>
            </div>

            <div className="bg-red-50 p-6 rounded-xl shadow">
              <p className="text-red-700">Rejected</p>
              <h3 className="text-2xl font-bold">{rejected}</h3>
            </div>

          </div>

          {/* CHARTS */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">

            {/* CATEGORY PIE */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold mb-4">
                Businesses by Category
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* CITY BAR */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold mb-4">
                Businesses by City
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cityData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* RECENT BUSINESSES */}
          <div className="bg-white p-6 rounded-xl shadow">

            <h3 className="font-semibold mb-4">
              Recent Businesses
            </h3>

            {businesses.length === 0 ? (
              <p className="text-gray-500">
                No businesses found
              </p>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full text-left">

                  <thead className="border-b">
                    <tr>
                      <th className="py-2">Name</th>
                      <th>Category</th>
                      <th>City</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {businesses.slice(0, 5).map((b) => (
                      <tr key={b._id} className="border-b">

                        <td className="py-2">{b.name}</td>

                        <td>{b.category}</td>

                        <td>{b.city}</td>

                        <td>
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              b.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : b.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>
            )}

          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;