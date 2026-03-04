import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-5">
      <h2 className="text-2xl font-bold mb-8">ServDial Admin</h2>

      <ul className="space-y-4 text-sm">
        <li>
          <Link to="/admin" className="hover:text-blue-400">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/businesses" className="hover:text-blue-400">Manage Businesses</Link>
        </li>
        <li>
          <Link to="/admin/banners" className="hover:text-blue-400">Manage Banner Ads</Link>
        </li>

        {role === "superadmin" && (
          <>
            <li>
              <Link to="/admin/admins" className="hover:text-blue-400">Manage Admins</Link>
            </li>
            <li>
              <Link to="/admin/users" className="hover:text-blue-400">Manage Users</Link>
            </li>
          </>
        )}

        {/* Add City / Category / Business for admin & superadmin */}
        {(role === "admin" || role === "superadmin") && (
          <>
            <li>
              <Link to="/admin/add-city" className="hover:text-blue-400">Add City</Link>
            </li>
            <li>
              <Link to="/admin/add-category" className="hover:text-blue-400">Add Category</Link>
            </li>
            <li>
              <Link to="/add-business" className="hover:text-blue-400">Add Business</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;