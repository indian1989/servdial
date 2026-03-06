import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

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