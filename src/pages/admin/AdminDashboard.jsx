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

    // 🔁 Auto refresh every 30 sec
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setError("");

      const [adminStats, businessStats] = await Promise.all([
        API.get("/admin/dashboard"),
        API.get("/admin/business-stats")
      ]);

      setStats({
        users: adminStats.data?.stats?.users || 0,
        admins: adminStats.data?.stats?.admins || 0,
        cities: adminStats.data?.stats?.cities || 0,
        categories: adminStats.data?.stats?.categories || 0,
        businesses: businessStats.data?.stats?.total || 0,
        pending: businessStats.data?.stats?.pending || 0,
        featured: businessStats.data?.stats?.featured || 0
      });

      setLoading(false);
    } catch (err) {
      console.error("Dashboard error", err);
      setError("Failed to load dashboard data");
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "25px" }}>
        🚀 ServDial Admin Dashboard
      </h1>

      <div className="dashboard-grid">
        <Card title="Total Users" value={stats.users} icon={<FaUsers />} color="#3b82f6" />
        <Card title="Admins" value={stats.admins} icon={<FaUserShield />} color="#9333ea" />
        <Card title="Cities" value={stats.cities} icon={<FaCity />} color="#0ea5e9" />
        <Card title="Categories" value={stats.categories} icon={<FaLayerGroup />} color="#f59e0b" />
        <Card title="Businesses" value={stats.businesses} icon={<FaStore />} color="#10b981" />
        <Card title="Pending" value={stats.pending} icon={<FaClock />} color="#ef4444" />
        <Card title="Featured" value={stats.featured} icon={<FaStar />} color="#f97316" />
      </div>

      {/* Inline CSS (kept simple, you can move later) */}
      <style>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }

        .card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: 0.2s;
        }

        .card:hover {
          transform: translateY(-5px);
        }

        .card-left h3 {
          margin: 0;
          font-size: 14px;
          color: #666;
        }

        .card-left h1 {
          margin: 5px 0 0;
          font-size: 26px;
        }

        .icon-box {
          font-size: 24px;
          padding: 12px;
          border-radius: 10px;
          color: white;
        }

        .skeleton {
          height: 100px;
          border-radius: 10px;
          background: linear-gradient(90deg, #eee, #ddd, #eee);
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
      `}</style>
    </div>
  );
}

/* ================= CARD ================= */
function Card({ title, value, icon, color }) {
  return (
    <div className="card">
      <div className="card-left">
        <h3>{title}</h3>
        <h1>{value}</h1>
      </div>

      <div
        className="icon-box"
        style={{ background: color }}
      >
        {icon}
      </div>
    </div>
  );
}

/* ================= LOADING ================= */
function DashboardSkeleton() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Loading dashboard...</h2>
      <div className="dashboard-grid">
        {Array(7).fill().map((_, i) => (
          <div key={i} className="skeleton"></div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;