import { useEffect, useState } from "react";
import API from "../../api/axios";

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

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {

      const adminStats = await API.get("/admin/dashboard");
      const businessStats = await API.get("/admin/business-stats");

      setStats({
        users: adminStats.data.stats.users,
        admins: adminStats.data.stats.admins,
        cities: adminStats.data.stats.cities,
        categories: adminStats.data.stats.categories,
        businesses: businessStats.data.stats.total,
        pending: businessStats.data.stats.pending,
        featured: businessStats.data.stats.featured
      });

      setLoading(false);

    } catch (error) {
      console.error("Dashboard error", error);
    }
  };

  if (loading) {
    return <h2>Loading dashboard...</h2>;
  }

  return (
    <div>

      <h1 style={{ marginBottom: "20px" }}>
        ServDial Admin Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: "20px"
        }}
      >

        <Card title="Total Users" value={stats.users} />
        <Card title="Total Admins" value={stats.admins} />
        <Card title="Total Cities" value={stats.cities} />
        <Card title="Total Categories" value={stats.categories} />
        <Card title="Total Businesses" value={stats.businesses} />
        <Card title="Pending Businesses" value={stats.pending} />
        <Card title="Featured Businesses" value={stats.featured} />

      </div>

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
      }}
    >

      <h3 style={{ marginBottom: "10px", color: "#666" }}>
        {title}
      </h3>

      <h1 style={{ color: "#4f46e5" }}>
        {value}
      </h1>

    </div>
  );
}

export default AdminDashboard;