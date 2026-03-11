
import { Outlet } from "react-router-dom";
import AdminSidebar from "../pages/admin/AdminSidebar";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function AdminLayout() {

  const { user } = useContext(AuthContext);

  return (
    <div style={styles.container}>

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN AREA */}
      <div style={styles.main}>

        {/* HEADER */}
        <div style={styles.header}>

          <div>
            <strong>ServDial Admin Panel</strong>
          </div>

          <div>
            Logged in as: <b>{user?.name}</b>
          </div>

        </div>

        {/* PAGE CONTENT */}
        <div style={styles.content}>
          <Outlet />
        </div>

      </div>

    </div>
  );
}

const styles = {

  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#f9fafb"
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },

  header: {
    background: "#4f46e5",
    color: "white",
    padding: "15px 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  content: {
    padding: "25px"
  }

};

export default AdminLayout;