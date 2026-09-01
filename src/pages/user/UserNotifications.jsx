import React, { useEffect, useMemo, useState } from "react";

import {
  FaBell,
  FaCheckCircle,
  FaCreditCard,
  FaStar,
  FaBullhorn,
  FaInfoCircle,
  FaExclamationCircle,
  FaClock,
} from "react-icons/fa";

import API from "../../api/axios";
import Loader from "../../components/common/Loader";

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     FETCH NOTIFICATIONS
  ===================================================== */

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/user/notifications");

      setNotifications(
        res?.data?.notifications || []
      );
    } catch (err) {
      console.error(
        "Failed to fetch user notifications:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load notifications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  /* =====================================================
     STATS
  ===================================================== */

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (notification) => !notification.isRead
    ).length;
  }, [notifications]);

  const readCount = notifications.length - unreadCount;

  /* =====================================================
     NOTIFICATION ICON
  ===================================================== */

  const getNotificationIcon = (type) => {
    switch (type) {
      case "lead":
        return (
          <FaBullhorn className="text-orange-500" />
        );

      case "payment":
        return (
          <FaCreditCard className="text-blue-500" />
        );

      case "review":
        return (
          <FaStar className="text-yellow-500" />
        );

      case "system":
      default:
        return (
          <FaInfoCircle className="text-indigo-500" />
        );
    }
  };

  /* =====================================================
     NOTIFICATION ICON BACKGROUND
  ===================================================== */

  const getNotificationIconBg = (type) => {
    switch (type) {
      case "lead":
        return "bg-orange-100";

      case "payment":
        return "bg-blue-100";

      case "review":
        return "bg-yellow-100";

      case "system":
      default:
        return "bg-indigo-100";
    }
  };

  /* =====================================================
     TYPE LABEL
  ===================================================== */

  const getTypeLabel = (type) => {
    switch (type) {
      case "lead":
        return "Lead";

      case "payment":
        return "Payment";

      case "review":
        return "Review";

      case "system":
      default:
        return "System";
    }
  };

  /* =====================================================
     DATE FORMAT
  ===================================================== */

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "Date unavailable";
    }
  };

  /* =====================================================
     TIME FORMAT
  ===================================================== */

  const formatTime = (date) => {
    if (!date) return "";

    try {
      return new Date(date).toLocaleTimeString(
        "en-IN",
        {
          hour: "numeric",
          minute: "2-digit",
        }
      );
    } catch {
      return "";
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <Loader />
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div className="p-4 md:p-6">

        <div className="bg-white border rounded-2xl shadow-sm p-8 text-center">

          <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
            <FaExclamationCircle className="text-2xl" />
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Unable to Load Notifications
          </h2>

          <p className="text-sm text-gray-500 mb-5">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchNotifications}
            className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="p-4 md:p-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <FaBell className="text-xl" />
          </div>

          <div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Notifications
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Stay updated with your account and activity
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={fetchNotifications}
          className="inline-flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium transition"
        >
          <FaClock />
          Refresh
        </button>

      </div>

      {/* =================================================
          STATS
      ================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        {/* TOTAL */}

        <div className="bg-white border rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Total Notifications
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {notifications.length}
              </h3>

            </div>

            <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <FaBell />
            </div>

          </div>

        </div>

        {/* UNREAD */}

        <div className="bg-white border rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Unread
              </p>

              <h3 className="text-2xl font-bold text-orange-600 mt-1">
                {unreadCount}
              </h3>

            </div>

            <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <FaExclamationCircle />
            </div>

          </div>

        </div>

        {/* READ */}

        <div className="bg-white border rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Read
              </p>

              <h3 className="text-2xl font-bold text-green-600 mt-1">
                {readCount}
              </h3>

            </div>

            <div className="w-11 h-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
              <FaCheckCircle />
            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {notifications.length === 0 && (
        <div className="bg-white border rounded-2xl shadow-sm p-10 text-center">

          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center mx-auto mb-4">
            <FaBell className="text-2xl" />
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            No Notifications Yet
          </h2>

          <p className="text-sm text-gray-500 max-w-md mx-auto">
            You don't have any notifications right now.
            Important account, review, payment and system
            updates will appear here.
          </p>

        </div>
      )}

      {/* =================================================
          NOTIFICATION LIST
      ================================================= */}

      {notifications.length > 0 && (
        <div className="grid gap-4">

          {notifications.map((notification) => (

            <div
              key={notification._id}
              className={`bg-white border rounded-2xl shadow-sm p-4 md:p-5 transition hover:shadow-md ${
                !notification.isRead
                  ? "border-orange-200"
                  : ""
              }`}
            >

              <div className="flex items-start gap-4">

                {/* ICON */}

                <div
                  className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${getNotificationIconBg(
                    notification.type
                  )}`}
                >
                  {getNotificationIcon(
                    notification.type
                  )}
                </div>

                {/* CONTENT */}

                <div className="flex-1 min-w-0">

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">

                    <div className="flex items-center gap-2 flex-wrap">

                      <h2 className="text-base md:text-lg font-semibold text-gray-900">
                        {notification.title}
                      </h2>

                      {!notification.isRead && (
                        <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          New
                        </span>
                      )}

                    </div>

                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(
                        notification.createdAt
                      )}
                    </span>

                  </div>

                  {/* MESSAGE */}

                  {notification.message && (
                    <p className="text-sm text-gray-600 leading-relaxed mt-2">
                      {notification.message}
                    </p>
                  )}

                  {/* META */}

                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">

                    <span>
                      {getTypeLabel(
                        notification.type
                      )}
                    </span>

                    <span>•</span>

                    <span>
                      {formatTime(
                        notification.createdAt
                      )}
                    </span>

                    {notification.isRead && (
                      <>
                        <span>•</span>

                        <span className="inline-flex items-center gap-1 text-green-600">
                          <FaCheckCircle />
                          Read
                        </span>
                      </>
                    )}

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default UserNotifications;