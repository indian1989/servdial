// frontend/src/components/user/UserHeader.jsx

import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaBell,
  FaUser,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

import { AuthContext } from "../../context/AuthContext";

/**
 * ==================================================
 * 👤 USER HEADER
 * ==================================================
 *
 * USER PANEL HEADER
 *
 * - ServDial branding
 * - Home navigation
 * - Dashboard navigation
 * - Notifications
 * - Profile
 * - Mobile navigation
 * - Logout
 *
 * No API/business logic.
 * ==================================================
 */

const UserHeader = () => {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  // ================= LOGOUT =================

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
      }
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      navigate("/login");
    }
  };

  // ================= CLOSE MOBILE MENU =================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // ================= USER NAME =================

  const userName =
    user?.name ||
    user?.fullName ||
    "User";

  // ================= AVATAR =================

  const avatar =
    user?.avatar ||
    user?.profileImage ||
    null;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">

      <div className="max-w-full mx-auto px-4 md:px-6">

        <div className="h-16 flex items-center justify-between">

          {/* ================= BRAND ================= */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2"
          >

            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold">
              S
            </div>

            <div className="hidden sm:block">

              <div className="text-lg font-bold text-gray-900 leading-none">
                ServDial
              </div>

              <div className="text-[10px] text-gray-500 mt-1">
                Local Business Discovery
              </div>

            </div>

          </Link>

          {/* ================= DESKTOP NAV ================= */}

          <nav className="hidden md:flex items-center gap-2">

            {/* HOME */}

            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition"
            >
              <FaHome />
              Home
            </Link>

            {/* DASHBOARD */}

            <Link
              to="/user/dashboard"
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition"
            >
              Dashboard
            </Link>

            {/* NOTIFICATIONS */}

            <Link
              to="/user/notifications"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition"
              title="Notifications"
            >
              <FaBell />
            </Link>

            {/* PROFILE */}

            <Link
              to="/user/profile"
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition"
            >

              {avatar ? (
                <img
                  src={avatar}
                  alt={userName}
                  className="w-8 h-8 rounded-full object-cover border"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <FaUser className="text-sm" />
                </div>
              )}

              <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                {userName}
              </span>

            </Link>

            {/* LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
            >
              <FaSignOutAlt />
              Logout
            </button>

          </nav>

          {/* ================= MOBILE MENU BUTTON ================= */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen((prev) => !prev)
            }
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-100 transition"
            aria-label="Toggle navigation"
          >

            {mobileMenuOpen ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}

          </button>

        </div>

        {/* ================= MOBILE NAV ================= */}

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3">

            <nav className="flex flex-col gap-1">

              {/* HOME */}

              <Link
                to="/"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              >
                <FaHome />
                Home
              </Link>

              {/* DASHBOARD */}

              <Link
                to="/user/dashboard"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              >
                Dashboard
              </Link>

              {/* NOTIFICATIONS */}

              <Link
                to="/user/notifications"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              >
                <FaBell />
                Notifications
              </Link>

              {/* PROFILE */}

              <Link
                to="/user/profile"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              >
                <FaUser />
                Profile
              </Link>

              {/* LOGOUT */}

              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  handleLogout();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 text-left"
              >
                <FaSignOutAlt />
                Logout
              </button>

            </nav>

          </div>
        )}

      </div>

    </header>
  );
};

export default UserHeader;