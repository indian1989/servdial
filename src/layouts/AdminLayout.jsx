import { Link, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* SIDEBAR */}
      <div
        style={{
          width: "240px",
          background: "#111827",
          color: "white",
          padding: "20px"
        }}
      >
        <h2>ServDial Admin</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/businesses">Businesses</Link>
          <Link to="/admin/cities">Cities</Link>
          <Link to="/admin/categories">Categories</Link>
          <Link to="/admin/banners">Banner Ads</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/admins">Admins</Link>
        </nav>
      </div>

      {/* MAIN AREA */}
      <div style={{ flex: 1 }}>

        {/* HEADER */}
        <div
          style={{
            background: "#4f46e5",
            color: "white",
            padding: "15px",
            fontWeight: "bold"
          }}
        >
          Admin Panel
        </div>

        {/* CONTENT */}
        <div style={{ padding: "20px" }}>
          <Outlet />
        </div>

      </div>

    </div>
  );
}

export default AdminLayout;