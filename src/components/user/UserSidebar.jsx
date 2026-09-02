// frontend/src/components/user/UserSidebar.jsx

import React from "react";
import { NavLink } from "react-router-dom";

import {
  FaTachometerAlt,
  FaImage,
  FaImages,
  FaCreditCard,
  FaBookmark,
  FaStar,
  FaLightbulb,
  FaBell,
  FaEnvelope,
  FaUser,
  FaCog,
  FaKey,
} from "react-icons/fa";

/**
 * ==================================================
 * 👤 USER SIDEBAR
 * ==================================================
 *
 * USER NAVIGATION ONLY
 *
 * - No API logic
 * - No permission logic
 * - No business logic
 * - Navigation UI only
 * ==================================================
 */

const userRoutes = [
  // ================= DASHBOARD =================
  {
    path: "/user/dashboard",
    label: "Dashboard",
    icon: FaTachometerAlt,
  },

  // ================= BANNERS =================
  {
    path: "/user/add-banner",
    label: "Add Banner Ad",
    icon: FaImage,
  },

  {
    path: "/user/manage-banners",
    label: "Manage Banner Ads",
    icon: FaImages,
  },

    // ================= PAYMENT DASHBOARD =================
{
  path: "/user/payment-dashboard",
  label: "Payment Dashboard",
  icon: FaCreditCard,
},

  // ================= SAVED BUSINESSES =================
  {
    path: "/user/saved-businesses",
    label: "Saved Businesses",
    icon: FaBookmark,
  },

  // ================= REVIEWS =================
  {
    path: "/user/reviews",
    label: "My Reviews",
    icon: FaStar,
  },

  // ================= RECOMMENDATIONS =================
  {
    path: "/user/recommendations",
    label: "Recommendations",
    icon: FaLightbulb,
  },

  // ================= NOTIFICATIONS =================
  {
    path: "/user/notifications",
    label: "Notifications",
    icon: FaBell,
  },

  // ================= MESSAGES =================
  {
    path: "/user/messages",
    label: "Messages",
    icon: FaEnvelope,
  },

  // ================= PROFILE =================
  {
    path: "/user/profile",
    label: "Profile",
    icon: FaUser,
  },

  // ================= SETTINGS =================
  {
    path: "/user/settings",
    label: "Settings",
    icon: FaCog,
  },

  // ================= CHANGE PASSWORD =================
  {
    path: "/user/change-password",
    label: "Change Password",
    icon: FaKey,
  },
];

const UserSidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200">

      {/* ================= HEADER ================= */}
      <div className="px-5 py-5 border-b border-gray-200">

        <h2 className="text-lg font-bold text-gray-900">
          User Panel
        </h2>

        <p className="text-xs text-gray-500 mt-1">
          Manage your ServDial account
        </p>

      </div>

      {/* ================= NAVIGATION ================= */}
      <nav className="p-3">

        <div className="space-y-1">

          {userRoutes.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-4 py-3 rounded-xl",
                    "text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-orange-100 text-orange-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  ].join(" ")
                }
              >

                <Icon className="text-base flex-shrink-0" />

                <span>
                  {item.label}
                </span>

              </NavLink>
            );

          })}

        </div>

      </nav>

    </aside>
  );
};

export default UserSidebar;