import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkStyle = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "hover:text-blue-500";

  const roleBadgeColor = {
    user: "bg-gray-200 text-gray-700",
    provider: "bg-green-100 text-green-700",
    admin: "bg-blue-100 text-blue-700",
    superadmin: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="relative">

      {/* Desktop Menu */}
      <nav className="hidden md:flex items-center gap-6 font-medium">

        <NavLink to="/" className={linkStyle}>
          Home
        </NavLink>

        <NavLink to="/business" className={linkStyle}>
          All Business
        </NavLink>

        {user &&
          ["provider", "admin", "superadmin"].includes(user.role) && (
            <NavLink to="/add-business" className={linkStyle}>
              Add Business
            </NavLink>
          )}

        {(user?.role === "admin" || user?.role === "superadmin") && (
          <NavLink to="/admin" className={linkStyle}>
            Admin Panel
          </NavLink>
        )}

        {!user ? (
          <NavLink to="/login" className={linkStyle}>
            Login
          </NavLink>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 truncate max-w-[120px]">
              {user.email}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                roleBadgeColor[user.role]
              }`}
            >
              {user.role}
            </span>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-2xl"
      >
        ☰
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-4 space-y-3 md:hidden z-50">

          <NavLink to="/" className={linkStyle} onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>

          <NavLink to="/business" className={linkStyle} onClick={() => setMenuOpen(false)}>
            All Business
          </NavLink>

          {user &&
            ["provider", "admin", "superadmin"].includes(user.role) && (
              <NavLink
                to="/add-business"
                className={linkStyle}
                onClick={() => setMenuOpen(false)}
              >
                Add Business
              </NavLink>
            )}

          {(user?.role === "admin" || user?.role === "superadmin") && (
            <NavLink
              to="/admin"
              className={linkStyle}
              onClick={() => setMenuOpen(false)}
            >
              Admin Panel
            </NavLink>
          )}

          {!user ? (
            <NavLink
              to="/login"
              className={linkStyle}
              onClick={() => setMenuOpen(false)}
            >
              Login
            </NavLink>
          ) : (
            <>
              <div className="text-sm text-gray-600">
                {user.email}
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  roleBadgeColor[user.role]
                }`}
              >
                {user.role}
              </span>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

    </div>
  );
};

export default Navbar;