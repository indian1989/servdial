import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  FaHome,
  FaStore,
  FaCity,
  FaLayerGroup,
  FaBullhorn,
  FaUsers,
  FaUserShield,
  FaChartBar,
  FaCog,
  FaBars,
  FaTimes
} from "react-icons/fa";

function AdminSidebar({ onClose }) {
  const { user } = useContext(AuthContext);
  const role = user?.role;

  const [collapsed, setCollapsed] = useState(false);

  const isMobile = !!onClose;

  const widthClass = collapsed ? "w-20" : "w-64";

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
     ${isActive ? "bg-white text-gray-900 font-medium" : "text-gray-300 hover:bg-gray-800"}`;

  const section = "mt-4 mb-1 text-[11px] text-gray-400 uppercase tracking-wide px-3";

  return (
    <div
      className={`
        bg-gray-900 text-white h-full flex flex-col transition-all duration-300
        ${widthClass}
        ${isMobile ? "shadow-xl" : ""}
      `}
    >

      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">

        {/* LOGO */}
        {!collapsed && (
          <h1 className="text-lg font-bold">🚀 ServDial</h1>
        )}

        <div className="flex items-center gap-2">

          {/* COLLAPSE BUTTON */}
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="text-gray-300 hover:text-white"
            title="Collapse"
          >
            <FaBars />
          </button>

          {/* MOBILE CLOSE */}
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white md:hidden"
              title="Close"
            >
              <FaTimes />
            </button>
          )}

        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-1">

        <NavLink to="/admin/dashboard" className={linkClass}>
          <FaHome /> {!collapsed && "Dashboard"}
        </NavLink>

        <p className={section}>{!collapsed && "Business Engine"}</p>

        <NavLink to="/admin/businesses" className={linkClass}>
          <FaStore /> {!collapsed && "Businesses"}
        </NavLink>

        <NavLink to="/admin/businesses/add" className={linkClass}>
          <FaStore /> {!collapsed && "Add Business"}
        </NavLink>

        <p className={section}>{!collapsed && "Location Engine"}</p>

        <NavLink to="/admin/cities" className={linkClass}>
          <FaCity /> {!collapsed && "Cities"}
        </NavLink>

        <p className={section}>{!collapsed && "Category Engine"}</p>

        <NavLink to="/admin/categories" className={linkClass}>
          <FaLayerGroup /> {!collapsed && "Categories"}
        </NavLink>

        <p className={section}>{!collapsed && "Monetization"}</p>

        <NavLink to="/admin/banners" className={linkClass}>
          <FaBullhorn /> {!collapsed && "Banner Ads"}
        </NavLink>

        <NavLink to="/admin/banners/add" className={linkClass}>
          <FaBullhorn /> {!collapsed && "Add Banner"}
        </NavLink>

        <p className={section}>{!collapsed && "Users"}</p>

        <NavLink to="/admin/users" className={linkClass}>
          <FaUsers /> {!collapsed && "Users"}
        </NavLink>

        {/* SUPERADMIN ONLY */}
        {role === "superadmin" && (
          <>
            <p className={section}>{!collapsed && "System Control"}</p>

            <NavLink to="/admin/admins" className={linkClass}>
              <FaUserShield /> {!collapsed && "Admins"}
            </NavLink>

            <NavLink to="/admin/analytics" className={linkClass}>
              <FaChartBar /> {!collapsed && "Analytics"}
            </NavLink>

            <NavLink to="/admin/settings" className={linkClass}>
              <FaCog /> {!collapsed && "Settings"}
            </NavLink>
          </>
        )}

      </nav>

      {/* FOOTER */}
      {!collapsed && (
        <div className="p-3 text-xs text-gray-500 border-t border-gray-800">
          ServDial Admin Panel
        </div>
      )}

    </div>
  );
}

export default AdminSidebar;