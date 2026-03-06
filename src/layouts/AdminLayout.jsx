import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <div style={{ width: "250px", background: "#111827", color: "white", padding: "20px" }}>
        <h2>ServDial Admin</h2>

        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><a href="/admin/dashboard">Dashboard</a></li>
          <li><a href="/admin/add-business">Add Business</a></li>
          <li><a href="/admin/add-city">Add City</a></li>
          <li><a href="/admin/add-category">Add Category</a></li>
          <li><a href="/admin/banners">Banners</a></li>
        </ul>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1 }}>
        
        {/* Header */}
        <div style={{ background: "#4f46e5", color: "white", padding: "15px" }}>
          Admin Dashboard
        </div>

        {/* Page Content */}
        <div style={{ padding: "20px" }}>
          <Outlet />
        </div>

      </div>

    </div>
  );
}

export default AdminLayout;