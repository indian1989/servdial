import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function AdminSidebar() {

  const { user } = useContext(AuthContext);

  const role = user?.role;

  return (
    <div style={styles.sidebar}>

      <h2 style={styles.logo}>ServDial</h2>

      <nav style={styles.nav}>

        <Link style={styles.link} to="/admin/dashboard">
          Dashboard
        </Link>

        {/* BUSINESSES */}
        <p style={styles.section}>Businesses</p>

        <Link style={styles.link} to="/admin/businesses">
          Manage Businesses
        </Link>

        <Link style={styles.link} to="/admin/businesses/add">
          Add Business
        </Link>

        {/* CITIES */}
        <p style={styles.section}>Cities</p>

        <Link style={styles.link} to="/admin/cities">
          Manage Cities
        </Link>

        <Link style={styles.link} to="/admin/cities/add">
          Add City
        </Link>

        {/* CATEGORIES */}
        <p style={styles.section}>Categories</p>

        <Link style={styles.link} to="/admin/categories">
          Manage Categories
        </Link>

        <Link style={styles.link} to="/admin/categories/add">
          Add Category
        </Link>

        {/* BANNERS */}
        <p style={styles.section}>Banner Ads</p>

        <Link style={styles.link} to="/admin/banners">
          Manage Banner Ads
        </Link>

        <Link style={styles.link} to="/admin/banners/add">
          Add Banner
        </Link>

        {/* USERS */}
        <p style={styles.section}>Users</p>

        <Link style={styles.link} to="/admin/users">
          Manage Users
        </Link>

        {/* SUPERADMIN ONLY */}
        {role === "superadmin" && (
          <>
            <p style={styles.section}>Admins</p>

            <Link style={styles.link} to="/admin/admins">
              Manage Admins
            </Link>

            <Link style={styles.link} to="/admin/admins/add">
              Add Admin
            </Link>

            <p style={styles.section}>System</p>

            <Link style={styles.link} to="/admin/analytics">
              Analytics
            </Link>

            <Link style={styles.link} to="/admin/reports">
              Reports
            </Link>

            <Link style={styles.link} to="/admin/settings">
              System Settings
            </Link>

            <Link style={styles.link} to="/admin/logs">
              Activity Logs
            </Link>

          </>
        )}

      </nav>

    </div>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    background: "#111827",
    color: "white",
    padding: "20px",
    overflowY: "auto"
  },

  logo: {
    marginBottom: "20px"
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },

 link: {
  color: "white",
  textDecoration: "none",
  fontSize: "14px",
  
  },

  section: {
    marginTop: "15px",
    fontWeight: "bold",
    fontSize: "13px",
    color: "#9ca3af"
  }
};

export default AdminSidebar;