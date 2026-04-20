import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCity } from "../../context/CityContext";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Menu, X } from "lucide-react";
import CitySelector from "../common/CitySelector";

import logo from "../../assets/ServDial.png";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { city } = useCity();

  const [menuOpen, setMenuOpen] = useState(false);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("servdial_user");
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="ServDial" className="h-10 w-auto" />
          </Link>

          {/* NAV */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/latest-businesses" className="hover:text-blue-600">Latest Businesses</Link>
            <Link to="/about" className="hover:text-blue-600">About Us</Link>
            <Link to="/provider/add-business" className="hover:text-blue-600">List Your Business</Link>
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* ✅ CITY SELECTOR */}
            <div className="hidden md:flex items-center">
              <CitySelector />
            </div>

            {/* USER */}
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
                  className="text-sm hover:text-blue-600"
                >
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
                <Link to="/login" className="text-sm hover:text-blue-600">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Register</Link>
              </div>
            )}

            {/* MOBILE */}
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X /> : <Menu />}
            </button>

          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="flex flex-col p-4 gap-4 text-sm">

            <Link to="/">Home</Link>
            <Link to="/latest-businesses">Latest Businesses</Link>

            {/* MOBILE CITY */}
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{city?.name || "Select City"}</span>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default Header;