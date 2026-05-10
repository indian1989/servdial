import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCity } from "../../context/CityContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Building2,
  Info,
  PlusCircle,
  LayoutDashboard,
  LogIn,
  UserPlus,
} from "lucide-react";

import CitySelector from "../common/CitySelector";
import logo from "../../assets/ServDial.png";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();
  const { city } = useCity();

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("servdial_user");
    navigate("/");
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Latest Businesses", path: "/latest-businesses", icon: Building2 },
    { name: "About Us", path: "/about", icon: Info },
    { name: "List Business", path: "/provider/add-business", icon: PlusCircle },
    { name: "Add Banner Ads", path: "/provider/add-banner", icon: PlusCircle },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">

      {/* TOP BAR */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="ServDial" className="h-10" />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1 transition ${
                    isActive(item.path)
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  <Icon size={16} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {/* CITY SELECTOR */}
            <div className="hidden md:flex">
              <CitySelector />
            </div>

            {/* AUTH */}
            {user ? (
              <div className="flex items-center gap-3">

                <Link
                  to={
                    user?.role === "provider"
                      ? "/provider/dashboard"
                      : user?.role === "admin" || user?.role === "superadmin"
                      ? "/admin/dashboard"
                      : "/"
                  }
                  className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>

              </div>
            ) : (
              <div className="hidden md:flex gap-3">

                <Link
                  className="flex items-center gap-1 text-sm hover:text-blue-600"
                  to="/login"
                >
                  <LogIn size={16} />
                  Login
                </Link>

                <Link
                  className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  to="/register"
                >
                  <UserPlus size={16} />
                  Register
                </Link>

              </div>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>

          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="flex flex-col p-4 gap-4 text-sm">

            {navLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className="flex items-center gap-2 py-1 text-gray-700"
                >
                  <Icon size={16} />
                  {item.name}
                </Link>
              );
            })}

            <div className="border-t pt-3">
              <CitySelector />
            </div>

            {user ? (
              <>
                <Link
                  to={
                    user?.role === "provider"
                      ? "/provider/dashboard"
                      : user?.role === "admin" || user?.role === "superadmin"
                      ? "/admin/dashboard"
                      : "/"
                  }
                  onClick={closeMenu}
                  className="flex items-center gap-2 text-blue-600 font-medium"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="bg-red-500 text-white px-3 py-2 rounded text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex items-center gap-2"
                >
                  <LogIn size={16} />
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded"
                >
                  <UserPlus size={16} />
                  Register
                </Link>
              </>
            )}

          </div>
        </div>
      )}
    </header>
  );
};

export default Header;