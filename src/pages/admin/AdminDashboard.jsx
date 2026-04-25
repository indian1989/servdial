import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  FaUsers,
  FaUserShield,
  FaCity,
  FaLayerGroup,
  FaStore,
  FaClock,
  FaStar
} from "react-icons/fa";

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
  Legend
} from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    admins: 0,
    cities: 0,
    categories: 0,
    businesses: 0,
    pending: 0,
    featured: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const safeNumber = (val) => (typeof val === "number" ? val : 0);

  const fetchStats = async () => {
    try {
      setError("");

      const [adminRes, businessRes, usersRes] = await Promise.all([
        API.get("/admin/dashboard"),
        API.get("/admin-businesses"),
        API.get("/admin/users")
      ]);

      // 🔥 NORMALIZE ADMIN
      const adminData =
        adminRes.data?.stats ||
        adminRes.data ||
        {};

      // 🔥 NORMALIZE USERS
      const usersList =
        usersRes.data?.users ||
        usersRes.data?.data ||
        usersRes.data ||
        [];

      // 🔥 NORMALIZE BUSINESS
      const businessData =
        businessRes.data?.stats ||
        businessRes.data ||
        {};

      const businessList =
        businessRes.data?.businesses ||
        businessRes.data?.data ||
        [];

      setStats({
        // ✅ USERS FIXED
        users:
          safeNumber(adminData.users) ||
          safeNumber(adminData.totalUsers) ||
          usersList.length,

        // ✅ ADMINS FIXED
        admins:
          safeNumber(adminData.admins) ||
          safeNumber(adminData.totalAdmins) ||
          usersList.filter(u => u.role === "admin" || u.role === "superadmin").length,

        cities: safeNumber(adminData.cities),
        categories: safeNumber(adminData.categories),

        // ✅ BUSINESSES FIXED
        businesses:
          safeNumber(businessData.total) ||
          safeNumber(businessData.count) ||
          businessList.length,

        // ✅ PENDING FIXED
        pending:
          safeNumber(businessData.pending) ||
          safeNumber(businessData.pendingCount) ||
          businessList.filter(b => b.status !== "approved").length,

        // ✅ FEATURED FIXED (IMPORTANT)
        featured:
          safeNumber(businessData.featured) ||
          safeNumber(businessData.featuredCount) ||
          businessList.filter(b => b.isFeatured).length
      });

      setLoading(false);
    } catch (err) {
      console.error("Dashboard error", err);
      setError("Failed to load dashboard data");
      setLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;
  if (error) return <div className="text-red-500">{error}</div>;

  // 📊 Derived
  const totalEntities =
    stats.users +
    stats.admins +
    stats.cities +
    stats.categories +
    stats.businesses;

  const barData = [
    { name: "Users", value: stats.users },
    { name: "Admins", value: stats.admins },
    { name: "Cities", value: stats.cities },
    { name: "Categories", value: stats.categories },
    { name: "Businesses", value: stats.businesses }
  ];

  const pieData = [
    { name: "Pending", value: stats.pending },
    { name: "Featured", value: stats.featured },
    {
      name: "Others",
      value: Math.max(stats.businesses - stats.pending - stats.featured, 0)
    }
  ];

  const COLORS = ["#ef4444", "#22c55e", "#3b82f6"];

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        🚀 ServDial Admin Dashboard
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <Card title="Users" value={stats.users} icon={<FaUsers />} color="from-blue-500 to-indigo-600" />
        <Card title="Admins" value={stats.admins} icon={<FaUserShield />} color="from-purple-500 to-pink-600" />
        <Card title="Cities" value={stats.cities} icon={<FaCity />} color="from-cyan-500 to-blue-500" />
        <Card title="Categories" value={stats.categories} icon={<FaLayerGroup />} color="from-yellow-400 to-orange-500" />
        <Card title="Businesses" value={stats.businesses} icon={<FaStore />} color="from-green-500 to-emerald-600" />
        <Card title="Pending" value={stats.pending} icon={<FaClock />} color="from-red-500 to-rose-600" />
        <Card title="Featured" value={stats.featured} icon={<FaStar />} color="from-orange-500 to-amber-500" />
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI title="Total Entities" value={totalEntities} />
        <KPI title="Active Businesses" value={stats.businesses - stats.pending} />
        <KPI
          title="Approval Rate"
          value={
            stats.businesses
              ? Math.round(((stats.businesses - stats.pending) / stats.businesses) * 100) + "%"
              : "0%"
          }
        />
        <KPI
          title="Featured Ratio"
          value={
            stats.businesses
              ? Math.round((stats.featured / stats.businesses) * 100) + "%"
              : "0%"
          }
        />
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">
        <ChartCard title="System Overview">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Business Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

    </div>
  );
}

/* COMPONENTS */
const Card = ({ title, value, icon, color }) => (
  <div className={`bg-gradient-to-r ${color} text-white p-5 rounded-xl shadow flex justify-between`}>
    <div>
      <h4 className="text-sm opacity-80">{title}</h4>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
    <div className="text-2xl opacity-80">{icon}</div>
  </div>
);

const KPI = ({ title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-xl font-bold">{value}</h2>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-5 rounded-xl shadow">
    <h3 className="font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

const DashboardSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
    {Array(7).fill().map((_, i) => (
      <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
    ))}
  </div>
);

export default AdminDashboard;