import React, { useContext } from "react";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaCalendarAlt,
  FaEdit,
  FaCheckCircle,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  // =====================================================
  // USER DATA
  // =====================================================

  const name = user?.name || "User";
  const email = user?.email || "Not available";
  const phone = user?.phone || "Not publicly available";
  const role = user?.role || "user";
  const avatar = user?.avatar || "";

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "Not available";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Not available";
    }
  };

  // =====================================================
  // ROLE LABEL
  // =====================================================

  const roleLabel =
    role.charAt(0).toUpperCase() + role.slice(1);

  // =====================================================
  // INITIAL
  // =====================================================

  const initial = name
    .trim()
    .charAt(0)
    .toUpperCase();

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="p-4 md:p-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <FaUser className="text-xl" />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              My Profile
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              View and manage your account information
            </p>
          </div>

        </div>

        <Link
          to="/user/settings"
          className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
        >
          <FaEdit />
          Edit Profile
        </Link>

      </div>

      {/* =================================================
          PROFILE CARD
      ================================================= */}

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden mb-6">

        {/* PROFILE TOP */}

        <div className="p-6 md:p-8 border-b">

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">

            {/* AVATAR */}

            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-24 h-24 rounded-2xl object-cover border"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-4xl font-bold">
                {initial}
              </div>
            )}

            {/* NAME */}

            <div>

              <div className="flex items-center gap-2 flex-wrap">

                <h2 className="text-2xl font-bold text-gray-900">
                  {name}
                </h2>

                <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                  <FaCheckCircle />
                  Active
                </span>

              </div>

              <p className="text-sm text-gray-500 mt-1">
                {email}
              </p>

              <span className="inline-flex items-center gap-1 mt-3 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                <FaShieldAlt />
                {roleLabel}
              </span>

            </div>

          </div>

        </div>

        {/* =================================================
            ACCOUNT INFORMATION
        ================================================= */}

        <div className="p-6 md:p-8">

          <h3 className="text-lg font-semibold text-gray-900 mb-5">
            Account Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* NAME */}

            <div className="border rounded-xl p-4">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                  <FaUser />
                </div>

                <div className="min-w-0">

                  <p className="text-xs text-gray-500">
                    Full Name
                  </p>

                  <p className="text-sm font-medium text-gray-900 mt-1 break-words">
                    {name}
                  </p>

                </div>

              </div>

            </div>

            {/* EMAIL */}

            <div className="border rounded-xl p-4">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <FaEnvelope />
                </div>

                <div className="min-w-0">

                  <p className="text-xs text-gray-500">
                    Email Address
                  </p>

                  <p className="text-sm font-medium text-gray-900 mt-1 break-words">
                    {email}
                  </p>

                </div>

              </div>

            </div>

            {/* PHONE */}

            <div className="border rounded-xl p-4">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                  <FaPhone />
                </div>

                <div>

                  <p className="text-xs text-gray-500">
                    Phone Number
                  </p>

                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {phone}
                  </p>

                </div>

              </div>

            </div>

            {/* ROLE */}

            <div className="border rounded-xl p-4">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                  <FaShieldAlt />
                </div>

                <div>

                  <p className="text-xs text-gray-500">
                    Account Type
                  </p>

                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {roleLabel}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          ACCOUNT STATUS
      ================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* STATUS */}

        <div className="bg-white border rounded-2xl shadow-sm p-5">

          <div className="flex items-start gap-4">

            <div className="w-11 h-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
              <FaCheckCircle />
            </div>

            <div>

              <h3 className="font-semibold text-gray-900">
                Account Status
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Your account is currently active.
              </p>

            </div>

          </div>

        </div>

        {/* SECURITY */}

        <div className="bg-white border rounded-2xl shadow-sm p-5">

          <div className="flex items-start gap-4">

            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <FaShieldAlt />
            </div>

            <div className="flex-1">

              <h3 className="font-semibold text-gray-900">
                Account Security
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Keep your account secure by updating your
                password regularly.
              </p>

              <Link
                to="/user/change-password"
                className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium mt-3"
              >
                Change Password
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default UserProfile;