import React, { useContext } from "react";

import {
  FaCog,
  FaUser,
  FaShieldAlt,
  FaBell,
  FaEnvelope,
  FaLock,
  FaChevronRight,
  FaInfoCircle,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

const UserSettings = () => {
  const { user } = useContext(AuthContext);

  // =====================================================
  // USER DATA
  // =====================================================

  const name = user?.name || "User";
  const email = user?.email || "Not available";

  // =====================================================
  // SETTINGS ITEMS
  // =====================================================

  const settingsItems = [
    {
      title: "Profile",
      description: "View your personal account information",
      icon: FaUser,
      path: "/user/profile",
      iconClass: "bg-orange-100 text-orange-600",
    },

    {
      title: "Change Password",
      description: "Update your account password",
      icon: FaLock,
      path: "/user/change-password",
      iconClass: "bg-red-100 text-red-600",
    },

    {
      title: "Notifications",
      description: "View your account notifications",
      icon: FaBell,
      path: "/user/notifications",
      iconClass: "bg-green-100 text-green-600",
    },

    {
      title: "Messages",
      description: "View your conversations and messages",
      icon: FaEnvelope,
      path: "/user/messages",
      iconClass: "bg-blue-100 text-blue-600",
    },
  ];

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="p-4 md:p-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center gap-3 mb-6">

        <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
          <FaCog className="text-xl" />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Settings
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage your account and preferences
          </p>
        </div>

      </div>

      {/* =================================================
          ACCOUNT SUMMARY
      ================================================= */}

      <div className="bg-white border rounded-2xl shadow-sm p-5 md:p-6 mb-6">

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">

          {/* AVATAR */}

          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={name}
              className="w-16 h-16 rounded-2xl object-cover border"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
          )}

          {/* USER */}

          <div className="flex-1 min-w-0">

            <h2 className="text-lg font-semibold text-gray-900">
              {name}
            </h2>

            <p className="text-sm text-gray-500 mt-1 break-words">
              {email}
            </p>

          </div>

          <Link
            to="/user/profile"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 hover:border-orange-300 hover:text-orange-600 px-4 py-2.5 rounded-xl text-sm font-medium transition"
          >
            View Profile
            <FaChevronRight className="text-xs" />
          </Link>

        </div>

      </div>

      {/* =================================================
          ACCOUNT SETTINGS
      ================================================= */}

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden mb-6">

        <div className="p-5 border-b">

          <h2 className="text-lg font-semibold text-gray-900">
            Account Settings
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Manage your profile, security and communication
            preferences.
          </p>

        </div>

        <div className="divide-y">

          {settingsItems.map((item) => {

            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-4 p-5 hover:bg-gray-50 transition group"
              >

                {/* ICON */}

                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.iconClass}`}
                >
                  <Icon />
                </div>

                {/* CONTENT */}

                <div className="flex-1 min-w-0">

                  <h3 className="font-medium text-gray-900 group-hover:text-orange-600 transition">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {item.description}
                  </p>

                </div>

                {/* ARROW */}

                <FaChevronRight className="text-gray-300 group-hover:text-orange-500 transition" />

              </Link>
            );

          })}

        </div>

      </div>

      {/* =================================================
          SECURITY
      ================================================= */}

      <div className="bg-white border rounded-2xl shadow-sm p-5 md:p-6 mb-6">

        <div className="flex items-start gap-4">

          <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
            <FaShieldAlt />
          </div>

          <div className="flex-1">

            <h2 className="text-lg font-semibold text-gray-900">
              Account Security
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Keep your account secure by using a strong,
              unique password.
            </p>

            <Link
              to="/user/change-password"
              className="inline-flex items-center gap-2 mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition"
            >
              <FaLock />
              Change Password
            </Link>

          </div>

        </div>

      </div>

      {/* =================================================
          INFORMATION
      ================================================= */}

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">

        <div className="flex items-start gap-3">

          <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />

          <div>

            <h3 className="text-sm font-semibold text-blue-900">
              About your account
            </h3>

            <p className="text-sm text-blue-800 mt-1 leading-6">
              Your account settings help you manage your
              profile, security, notifications and messages.
              Some account information can only be changed
              through supported account features.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default UserSettings;