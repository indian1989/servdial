// frontend/src/pages/user/UserDashboard.jsx

import React, { useContext, useEffect, useState } from "react";

import {
  FaBookmark,
  FaBullhorn,
  FaBell,
  FaEnvelope,
  FaStar,
  FaUser,
  FaCog,
  FaArrowRight,
  FaHeart,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import API from "../../api/axios";

import Loader from "../../components/common/Loader";

import { AuthContext } from "../../context/AuthContext";

/**
 * ==================================================
 * 👤 USER DASHBOARD
 * ==================================================
 *
 * User-side dashboard.
 *
 * Shows:
 * - Welcome section
 * - Saved businesses
 * - Banner ads
 * - Notifications
 * - Messages
 * - Reviews
 * - Recommendations
 * - Profile / Settings shortcuts
 *
 * No provider business-management functionality.
 * ==================================================
 */

const UserDashboard = () => {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    savedBusinesses: 0,
    banners: 0,
    notifications: 0,
    messages: 0,
    reviews: 0,
    recommendations: 0,
  });

  /* ================= FETCH DASHBOARD DATA ================= */

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      try {
        const requests = await Promise.allSettled([
          API.get("/user/saved-businesses"),
          API.get("/user/banners"),
          API.get("/user/notifications"),
          API.get("/user/messages"),
          API.get("/user/reviews"),
          API.get("/user/recommendations"),
        ]);

        const [
          savedBusinessesRes,
          bannersRes,
          notificationsRes,
          messagesRes,
          reviewsRes,
          recommendationsRes,
        ] = requests;

        setStats({
          savedBusinesses:
            savedBusinessesRes.status === "fulfilled"
              ? savedBusinessesRes.value?.data?.data?.length ||
                savedBusinessesRes.value?.data?.count ||
                0
              : 0,

          banners:
            bannersRes.status === "fulfilled"
              ? bannersRes.value?.data?.data?.length ||
                bannersRes.value?.data?.count ||
                0
              : 0,

          notifications:
            notificationsRes.status === "fulfilled"
              ? notificationsRes.value?.data?.data?.length ||
                notificationsRes.value?.data?.count ||
                0
              : 0,

          messages:
            messagesRes.status === "fulfilled"
              ? messagesRes.value?.data?.data?.length ||
                messagesRes.value?.data?.count ||
                0
              : 0,

          reviews:
            reviewsRes.status === "fulfilled"
              ? reviewsRes.value?.data?.data?.length ||
                reviewsRes.value?.data?.count ||
                0
              : 0,

          recommendations:
            recommendationsRes.status === "fulfilled"
              ? recommendationsRes.value?.data?.data?.length ||
                recommendationsRes.value?.data?.count ||
                0
              : 0,
        });
      } catch (error) {
        console.error(
          "Failed to load user dashboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  /* ================= LOADING ================= */

  if (loading) {
    return <Loader />;
  }

  /* ================= USER NAME ================= */

  const userName =
    user?.name ||
    user?.firstName ||
    "User";

  /* ================= STAT CARDS ================= */

  const statCards = [
    {
      label: "Saved Businesses",
      value: stats.savedBusinesses,
      icon: FaBookmark,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      path: "/user/saved-businesses",
    },

    {
      label: "Banner Ads",
      value: stats.banners,
      icon: FaBullhorn,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      path: "/user/manage-banners",
    },

    {
      label: "Notifications",
      value: stats.notifications,
      icon: FaBell,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      path: "/user/notifications",
    },

    {
      label: "Messages",
      value: stats.messages,
      icon: FaEnvelope,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      path: "/user/messages",
    },

    {
      label: "My Reviews",
      value: stats.reviews,
      icon: FaStar,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      path: "/user/reviews",
    },

    {
      label: "Recommendations",
      value: stats.recommendations,
      icon: FaHeart,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      path: "/user/recommendations",
    },
  ];

  /* ================= UI ================= */

  return (
    <div className="p-4 md:p-6">

      {/* ================= WELCOME ================= */}

      <div className="bg-white border rounded-2xl shadow-sm p-5 md:p-6 mb-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>

            <div className="flex items-center gap-3 mb-2">

              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                <FaUser className="text-xl" />
              </div>

              <div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Welcome, {userName}!
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Manage your ServDial account and activity.
                </p>

              </div>

            </div>

          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl text-sm font-medium transition"
          >
            Explore Businesses
            <FaArrowRight />
          </Link>

        </div>

      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">

        {statCards.map((card) => {

          const Icon = card.icon;

          return (
            <Link
              key={card.label}
              to={card.path}
              className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    {card.label}
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mt-1">
                    {card.value}
                  </h2>

                </div>

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconBg} ${card.iconColor}`}
                >
                  <Icon className="text-xl" />
                </div>

              </div>

            </Link>
          );

        })}

      </div>

      {/* ================= QUICK ACTIONS ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">

        {/* SAVED BUSINESSES */}

        <div className="bg-white border rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between mb-4">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <FaBookmark />
              </div>

              <div>

                <h2 className="font-semibold text-gray-900">
                  Saved Businesses
                </h2>

                <p className="text-xs text-gray-500">
                  Businesses you saved for later
                </p>

              </div>

            </div>

            <Link
              to="/user/saved-businesses"
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </Link>

          </div>

          <p className="text-sm text-gray-600">
            You currently have{" "}
            <strong>
              {stats.savedBusinesses}
            </strong>{" "}
            saved business
            {stats.savedBusinesses !== 1 ? "es" : ""}.
          </p>

        </div>

        {/* REVIEWS */}

        <div className="bg-white border rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between mb-4">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <FaStar />
              </div>

              <div>

                <h2 className="font-semibold text-gray-900">
                  My Reviews
                </h2>

                <p className="text-xs text-gray-500">
                  Manage your business reviews
                </p>

              </div>

            </div>

            <Link
              to="/user/reviews"
              className="text-sm text-purple-600 hover:underline"
            >
              View All
            </Link>

          </div>

          <p className="text-sm text-gray-600">
            You have submitted{" "}
            <strong>
              {stats.reviews}
            </strong>{" "}
            review
            {stats.reviews !== 1 ? "s" : ""}.
          </p>

        </div>

      </div>

      {/* ================= BANNER PROMOTION ================= */}

      <div className="bg-white border rounded-2xl p-5 shadow-sm mb-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div className="flex items-start gap-3">

            <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
              <FaBullhorn />
            </div>

            <div>

              <h2 className="font-semibold text-gray-900">
                Promote Your Business
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Create banner advertisements to reach
                more customers on ServDial.
              </p>

            </div>

          </div>

          <div className="flex gap-3">

            <Link
              to="/user/add-banner"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition"
            >
              <FaBullhorn />
              Add Banner
            </Link>

            <Link
              to="/user/manage-banners"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium transition"
            >
              Manage
            </Link>

          </div>

        </div>

      </div>

      {/* ================= ACCOUNT ================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* PROFILE */}

        <Link
          to="/user/profile"
          className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
        >

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
              <FaUser />
            </div>

            <div className="flex-1">

              <h2 className="font-semibold text-gray-900">
                My Profile
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                View and manage your account profile.
              </p>

            </div>

            <FaArrowRight className="text-gray-400" />

          </div>

        </Link>

        {/* SETTINGS */}

        <Link
          to="/user/settings"
          className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
        >

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
              <FaCog />
            </div>

            <div className="flex-1">

              <h2 className="font-semibold text-gray-900">
                Account Settings
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Manage your account and preferences.
              </p>

            </div>

            <FaArrowRight className="text-gray-400" />

          </div>

        </Link>

      </div>

    </div>
  );
};

export default UserDashboard;