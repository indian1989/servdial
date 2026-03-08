import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, Menu, X } from "lucide-react";

import logo from "../../assets/ServDial.png";

const Header = () => {
  const navigate = useNavigate();

  const [city, setCity] = useState("Detecting...");
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("servdial_user"));

  // ===============================
  // Detect City using GPS
  // ===============================
  useEffect(() => {
    if (!navigator.geolocation) {
      setCity("India");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
              params: {
                lat: latitude,
                lon: longitude,
                format: "json",
              },
            }
          );

          const detectedCity =
            res.data.address.city ||
            res.data.address.town ||
            res.data.address.state ||
            "India";

          setCity(detectedCity);
        } catch {
          setCity("India");
        }
      },
      () => setCity("India")
    );
  }, []);

  // ===============================
  // Logout
  // ===============================
  const handleLogout = () => {
    localStorage.removeItem("servdial_user");
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center justify-between h-16">

          {/* ================= Logo ================= */}
          <Link to="/" className="flex items-center gap-2">

            <img
              src={logo}
              alt="ServDial"
              className="h-10 w-auto"
            />

          </Link>

          {/* ================= Desktop Nav ================= */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">

            <Link
              to="/"
              className="hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              to="/latest-businesses"
              className="hover:text-blue-600"
            >
              Latest Businesses
            </Link>

            <Link
              to="/categories"
              className="hover:text-blue-600"
            >
              Categories
            </Link>

            <Link
              to="/cities"
              className="hover:text-blue-600"
            >
              Cities
            </Link>

          </nav>

          {/* ================= Right Side ================= */}
          <div className="flex items-center gap-4">

            {/* City */}
            <div className="hidden md:flex items-center text-sm text-gray-600 gap-1">

              <MapPin size={16} />

              <span>{city}</span>

            </div>

            {/* Logged User */}
            {user ? (
              <div className="flex items-center gap-3">

                <Link
                  to="/dashboard"
                  className="text-sm font-medium hover:text-blue-600"
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

                <Link
                  to="/login"
                  className="text-sm font-medium hover:text-blue-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Register
                </Link>

              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>

          </div>
        </div>

      </div>

      {/* ================= Mobile Menu ================= */}
      {menuOpen && (

        <div className="md:hidden border-t bg-white">

          <div className="flex flex-col p-4 gap-4 text-sm">

            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>

            <Link
              to="/latest-businesses"
              onClick={() => setMenuOpen(false)}
            >
              Latest Businesses
            </Link>

            <Link
              to="/categories"
              onClick={() => setMenuOpen(false)}
            >
              Categories
            </Link>

            <Link
              to="/cities"
              onClick={() => setMenuOpen(false)}
            >
              Cities
            </Link>

            <div className="flex items-center gap-2 text-gray-600">

              <MapPin size={16} />

              <span>{city}</span>

            </div>

            {!user && (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                >
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