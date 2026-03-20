import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function AdminLayout() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) return <div className="flex justify-center items-center h-screen">Unauthorized</div>;

  return (
    <div style={styles.container}>
      <AdminSidebar />
      <div style={styles.main}>
        <div style={styles.header}>
          <div><strong>ServDial Admin Panel</strong></div>
          <div>Logged in as: <b>{user?.name}</b></div>
        </div>
        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", minHeight: "100vh", background: "#f9fafb" },
  main: { flex: 1, display: "flex", flexDirection: "column" },
  header: { background: "#4f46e5", color: "white", padding: "15px 25px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  content: { padding: "25px" }
};

export default AdminLayout;