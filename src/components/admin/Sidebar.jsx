import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  MapPin,
  Tag,
  Image,
  Users,
  Shield,
  PlusCircle,
  Menu
} from "lucide-react";
import { useState } from "react";

const Sidebar = ({ role, user }) => {
  const [collapsed, setCollapsed] = useState(false);

  const linkClass =
    "flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition";

  const activeClass = "bg-gray-800";

  return (
    <div
      className={`bg-gray-900 text-white min-h-screen transition-all ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 flex justify-between items-center">
        {!collapsed && (
          <h2 className="text-xl font-bold">ServDial</h2>
        )}

        <button onClick={() => setCollapsed(!collapsed)}>
          <Menu size={20} />
        </button>
      </div>

      {/* USER PROFILE */}
      {!collapsed && (
        <div className="px-4 pb-6 border-b border-gray-700">
          <p className="font-semibold">{user?.name}</p>
          <p className="text-xs text-gray-400 capitalize">{role}</p>
        </div>
      )}

      <ul className="p-4 space-y-3 text-sm">

        {/* DASHBOARD */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <LayoutDashboard size={18} />
          {!collapsed && "Dashboard"}
        </NavLink>

        {/* MANAGEMENT */}
        {!collapsed && (
          <p className="text-gray-400 text-xs uppercase mt-6">Management</p>
        )}

        <NavLink
          to="/admin/businesses"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <Building2 size={18} />
          {!collapsed && "Manage Businesses"}
        </NavLink>

        <NavLink
          to="/admin/cities"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <MapPin size={18} />
          {!collapsed && "Manage Cities"}
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <Tag size={18} />
          {!collapsed && "Manage Categories"}
        </NavLink>

        <NavLink
          to="/admin/banners"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <Image size={18} />
          {!collapsed && "Manage Banner Ads"}
        </NavLink>

        {/* SUPERADMIN */}
        {role === "superadmin" && (
          <>
            <NavLink
              to="/admin/admins"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
            >
              <Shield size={18} />
              {!collapsed && "Manage Admins"}
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
            >
              <Users size={18} />
              {!collapsed && "Manage Users"}
            </NavLink>
          </>
        )}

        {/* CREATE */}
        {!collapsed && (
          <p className="text-gray-400 text-xs uppercase mt-6">Create</p>
        )}

        <NavLink
          to="/admin/add-business"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <PlusCircle size={18} />
          {!collapsed && "Add Business"}
        </NavLink>

        <NavLink
          to="/admin/add-city"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <PlusCircle size={18} />
          {!collapsed && "Add City"}
        </NavLink>

        <NavLink
          to="/admin/add-category"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <PlusCircle size={18} />
          {!collapsed && "Add Category"}
        </NavLink>

        <NavLink
          to="/admin/add-banner"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <PlusCircle size={18} />
          {!collapsed && "Add Banner Ad"}
        </NavLink>
      </ul>
    </div>
  );
};

export default Sidebar;