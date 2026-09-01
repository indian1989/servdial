// frontend/src/pages/admin/AdminNotifications.jsx

import React, { useEffect, useMemo, useState } from "react";

import {
  FaBell,
  FaBullhorn,
  FaCreditCard,
  FaStar,
  FaInfoCircle,
  FaExclamationCircle,
  FaTrash,
  FaPaperPlane,
  FaUsers,
  FaUser,
  FaSyncAlt,
} from "react-icons/fa";

import API from "../../api/axios";
import Loader from "../../components/common/Loader";


const AdminNotifications = () => {

  /* =====================================================
     STATE
  ===================================================== */

  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedIds, setSelectedIds] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filterType, setFilterType] = useState("");
  const [filterRead, setFilterRead] = useState("");

  /* =====================================================
     CREATE FORM
  ===================================================== */

  const [sendMode, setSendMode] = useState("role");

  const [form, setForm] = useState({
    user: "",
    userIds: "",
    roles: ["user", "provider"],
    title: "",
    message: "",
    type: "system",
  });


  /* =====================================================
     FETCH ALL NOTIFICATIONS
  ===================================================== */

  const fetchNotifications = async () => {

    try {

      setLoading(true);
      setError("");

      const params = {
        page,
        limit: 20,
        type: filterType || undefined,
        isRead:
          filterRead === ""
            ? undefined
            : filterRead,
      };

      const res = await API.get(
        "/notifications/admin/all",
        { params }
      );

      const data = res?.data?.data || [];
      const meta = res?.data?.meta || {};

      setNotifications(data);

      setTotalPages(
        Math.max(
          Number(meta.totalPages) || 1,
          1
        )
      );

    } catch (err) {

      console.error(
        "Failed to fetch admin notifications:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load notifications."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    fetchNotifications();
  }, [page, filterType, filterRead]);


  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  /* =====================================================
     ROLE TOGGLE
  ===================================================== */

  const toggleRole = (role) => {

    setForm((prev) => {

      const exists =
        prev.roles.includes(role);

      return {
        ...prev,

        roles: exists
          ? prev.roles.filter(
              (item) => item !== role
            )
          : [...prev.roles, role],
      };

    });

  };


  /* =====================================================
     CREATE NOTIFICATION
  ===================================================== */

  const handleSend = async () => {

    setError("");
    setSuccess("");

    if (!form.title.trim()) {

      setError(
        "Notification title is required."
      );

      return;

    }

    try {

      setSaving(true);

      let response;

      /* ================================================
         SINGLE USER
      ================================================ */

      if (sendMode === "single") {

        if (!form.user.trim()) {

          setError(
            "User ID is required."
          );

          return;

        }

        response = await API.post(
          "/notifications/admin",
          {
            user: form.user.trim(),
            title: form.title.trim(),
            message: form.message.trim(),
            type: form.type,
          }
        );

      }


      /* ================================================
         BULK USER IDS
      ================================================ */

      else if (sendMode === "users") {

        const userIds =
          form.userIds
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean);

        if (!userIds.length) {

          setError(
            "Enter at least one User ID."
          );

          return;

        }

        response = await API.post(
          "/notifications/admin/bulk",
          {
            userIds,
            title: form.title.trim(),
            message: form.message.trim(),
            type: form.type,
          }
        );

      }


      /* ================================================
         ROLE BASED
      ================================================ */

      else {

        if (!form.roles.length) {

          setError(
            "Select at least one role."
          );

          return;

        }

        response = await API.post(
          "/notifications/admin/bulk-role",
          {
            roles: form.roles,
            title: form.title.trim(),
            message: form.message.trim(),
            type: form.type,
          }
        );

      }


      setSuccess(
        response?.data?.message ||
          "Notification sent successfully."
      );


      setForm((prev) => ({
        ...prev,
        user: "",
        userIds: "",
        title: "",
        message: "",
      }));


      setSelectedIds([]);

      await fetchNotifications();

    } catch (err) {

      console.error(
        "Failed to send notification:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to send notification."
      );

    } finally {

      setSaving(false);

    }

  };


  /* =====================================================
     SELECT
  ===================================================== */

  const toggleSelect = (id) => {

    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter(
            (item) => item !== id
          )
        : [...prev, id]
    );

  };


  const allSelected =
    notifications.length > 0 &&
    notifications.every(
      (item) =>
        selectedIds.includes(item._id)
    );


  const toggleSelectAll = () => {

    if (allSelected) {

      setSelectedIds([]);

    } else {

      setSelectedIds(
        notifications.map(
          (item) => item._id
        )
      );

    }

  };


  /* =====================================================
     DELETE SELECTED
  ===================================================== */

  const handleDeleteSelected = async () => {

    if (!selectedIds.length) {

      setError(
        "Select at least one notification."
      );

      return;

    }

    if (
      !window.confirm(
        `Delete ${selectedIds.length} notification(s)?`
      )
    ) {
      return;
    }

    try {

      setSaving(true);
      setError("");
      setSuccess("");

      const res = await API.delete(
        "/notifications/admin/bulk",
        {
          data: {
            ids: selectedIds,
          },
        }
      );

      setSuccess(
        res?.data?.message ||
          "Notifications deleted successfully."
      );

      setSelectedIds([]);

      await fetchNotifications();

    } catch (err) {

      console.error(
        "Failed to delete notifications:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to delete notifications."
      );

    } finally {

      setSaving(false);

    }

  };


  /* =====================================================
     TYPE ICON
  ===================================================== */

  const getIcon = (type) => {

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

      default:
        return (
          <FaInfoCircle className="text-indigo-500" />
        );

    }

  };


  const getIconBg = (type) => {

    switch (type) {

      case "lead":
        return "bg-orange-100";

      case "payment":
        return "bg-blue-100";

      case "review":
        return "bg-yellow-100";

      default:
        return "bg-indigo-100";

    }

  };


  const formatDate = (date) => {

    if (!date) return "Date unavailable";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );

  };


  /* =====================================================
     STATS
  ===================================================== */

  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (item) => !item.isRead
      ).length,
    [notifications]
  );


  const readCount =
    notifications.length -
    unreadCount;


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (
      <div className="p-6">
        <Loader />
      </div>
    );

  }


  /* =====================================================
     PAGE
  ===================================================== */

  return (

    <div className="p-4 md:p-6 space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">

            <FaBell className="text-xl" />

          </div>

          <div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Notifications
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage and send notifications to ServDial users.
            </p>

          </div>

        </div>


        <button
          type="button"
          onClick={fetchNotifications}
          className="inline-flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-medium"
        >

          <FaSyncAlt />

          Refresh

        </button>

      </div>


      {/* =================================================
          ALERTS
      ================================================= */}

      {error && (

        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">

          <FaExclamationCircle />

          {error}

        </div>

      )}


      {success && (

        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 text-green-700 px-4 py-3 text-sm">

          <FaInfoCircle />

          {success}

        </div>

      )}


      {/* =================================================
          STATS
      ================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white border rounded-2xl p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Notifications
          </p>

          <h2 className="text-2xl font-bold mt-1">
            {notifications.length}
          </h2>

        </div>


        <div className="bg-white border rounded-2xl p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Unread
          </p>

          <h2 className="text-2xl font-bold text-orange-600 mt-1">
            {unreadCount}
          </h2>

        </div>


        <div className="bg-white border rounded-2xl p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Read
          </p>

          <h2 className="text-2xl font-bold text-green-600 mt-1">
            {readCount}
          </h2>

        </div>

      </div>


      {/* =================================================
          SEND NOTIFICATION
      ================================================= */}

      <div className="bg-white border rounded-2xl shadow-sm p-5">

        <div className="flex items-center gap-2 mb-5">

          <FaPaperPlane className="text-orange-500" />

          <h2 className="text-lg font-semibold">
            Send Notification
          </h2>

        </div>


        {/* SEND MODE */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">

          <button
            type="button"
            onClick={() =>
              setSendMode("single")
            }
            className={`border rounded-xl p-3 text-sm font-medium ${
              sendMode === "single"
                ? "border-orange-500 bg-orange-50 text-orange-700"
                : "border-gray-200"
            }`}
          >

            <FaUser className="inline mr-2" />

            Single User

          </button>


          <button
            type="button"
            onClick={() =>
              setSendMode("users")
            }
            className={`border rounded-xl p-3 text-sm font-medium ${
              sendMode === "users"
                ? "border-orange-500 bg-orange-50 text-orange-700"
                : "border-gray-200"
            }`}
          >

            <FaUsers className="inline mr-2" />

            Multiple Users

          </button>


          <button
            type="button"
            onClick={() =>
              setSendMode("role")
            }
            className={`border rounded-xl p-3 text-sm font-medium ${
              sendMode === "role"
                ? "border-orange-500 bg-orange-50 text-orange-700"
                : "border-gray-200"
            }`}
          >

            <FaUsers className="inline mr-2" />

            By Role

          </button>

        </div>


        {/* SINGLE USER */}

        {sendMode === "single" && (

          <div className="mb-4">

            <label className="block text-sm font-semibold text-gray-700 mb-1">
              User ID
            </label>

            <input
              type="text"
              name="user"
              value={form.user}
              onChange={handleChange}
              placeholder="Enter MongoDB User ID"
              className="w-full border rounded-xl px-3 py-2.5"
            />

          </div>

        )}


        {/* MULTIPLE USERS */}

        {sendMode === "users" && (

          <div className="mb-4">

            <label className="block text-sm font-semibold text-gray-700 mb-1">
              User IDs
            </label>

            <input
              type="text"
              name="userIds"
              value={form.userIds}
              onChange={handleChange}
              placeholder="userId1, userId2, userId3"
              className="w-full border rounded-xl px-3 py-2.5"
            />

            <p className="text-xs text-gray-400 mt-1">
              Enter multiple User IDs separated by commas.
            </p>

          </div>

        )}


        {/* ROLE */}

        {sendMode === "role" && (

          <div className="mb-4">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Recipient Roles
            </label>

            <div className="flex flex-wrap gap-2">

              {[
                "user",
                "provider",
                "admin",
                "superadmin",
              ].map((role) => (

                <button
                  key={role}
                  type="button"
                  onClick={() =>
                    toggleRole(role)
                  }
                  className={`px-4 py-2 rounded-lg border text-sm ${
                    form.roles.includes(role)
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  {role}
                </button>

              ))}

            </div>

          </div>

        )}


        {/* TYPE */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Notification Type
            </label>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded-xl px-3 py-2.5"
            >

              <option value="system">
                System
              </option>

              <option value="lead">
                Lead
              </option>

              <option value="payment">
                Payment
              </option>

              <option value="review">
                Review
              </option>

            </select>

          </div>


          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Notification title"
              className="w-full border rounded-xl px-3 py-2.5"
            />

          </div>

        </div>


        {/* MESSAGE */}

        <div className="mt-4">

          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Message
          </label>

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="Write notification message..."
            className="w-full border rounded-xl px-3 py-2.5"
          />

        </div>


        {/* SEND */}

        <div className="mt-4">

          <button
            type="button"
            onClick={handleSend}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60"
          >

            <FaPaperPlane />

            {saving
              ? "Sending..."
              : "Send Notification"}

          </button>

        </div>

      </div>


      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="bg-white border rounded-2xl p-5 shadow-sm">

        <div className="flex flex-col md:flex-row gap-3">

          <select
            value={filterType}
            onChange={(e) => {
              setPage(1);
              setFilterType(e.target.value);
            }}
            className="border rounded-xl px-3 py-2.5"
          >

            <option value="">
              All Types
            </option>

            <option value="system">
              System
            </option>

            <option value="lead">
              Lead
            </option>

            <option value="payment">
              Payment
            </option>

            <option value="review">
              Review
            </option>

          </select>


          <select
            value={filterRead}
            onChange={(e) => {
              setPage(1);
              setFilterRead(e.target.value);
            }}
            className="border rounded-xl px-3 py-2.5"
          >

            <option value="">
              All Status
            </option>

            <option value="false">
              Unread
            </option>

            <option value="true">
              Read
            </option>

          </select>


          {selectedIds.length > 0 && (

            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm"
            >

              <FaTrash />

              Delete Selected ({selectedIds.length})

            </button>

          )}

        </div>

      </div>


      {/* =================================================
          NOTIFICATION LIST
      ================================================= */}

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b flex items-center gap-3">

          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
          />

          <span className="text-sm font-semibold text-gray-700">
            Select All
          </span>

        </div>


        {notifications.length === 0 ? (

          <div className="p-10 text-center">

            <FaBell className="text-3xl text-gray-300 mx-auto mb-3" />

            <p className="text-gray-500">
              No notifications found.
            </p>

          </div>

        ) : (

          <div className="divide-y">

            {notifications.map(
              (notification) => (

                <div
                  key={notification._id}
                  className={`p-5 flex items-start gap-4 ${
                    !notification.isRead
                      ? "bg-orange-50/40"
                      : ""
                  }`}
                >

                  <input
                    type="checkbox"
                    checked={selectedIds.includes(
                      notification._id
                    )}
                    onChange={() =>
                      toggleSelect(
                        notification._id
                      )
                    }
                    className="mt-2"
                  />


                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconBg(
                      notification.type
                    )}`}
                  >

                    {getIcon(
                      notification.type
                    )}

                  </div>


                  <div className="flex-1 min-w-0">

                    <div className="flex flex-col md:flex-row md:justify-between gap-2">

                      <div>

                        <div className="flex items-center gap-2 flex-wrap">

                          <h3 className="font-semibold text-gray-900">
                            {notification.title}
                          </h3>

                          {!notification.isRead && (

                            <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                              Unread
                            </span>

                          )}

                        </div>


                        <p className="text-xs text-gray-400 mt-1">

                          {notification.user?.name ||
                            "Unknown User"}

                          {" • "}

                          {notification.user?.role ||
                            "unknown"}

                        </p>

                      </div>


                      <span className="text-xs text-gray-400">
                        {formatDate(
                          notification.createdAt
                        )}
                      </span>

                    </div>


                    {notification.message && (

                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {notification.message}
                      </p>

                    )}

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* =================================================
          PAGINATION
      ================================================= */}

      {totalPages > 1 && (

        <div className="flex items-center justify-center gap-3">

          <button
            type="button"
            disabled={page <= 1}
            onClick={() =>
              setPage(
                (prev) =>
                  Math.max(prev - 1, 1)
              )
            }
            className="border rounded-lg px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() =>
              setPage(
                (prev) =>
                  Math.min(
                    prev + 1,
                    totalPages
                  )
              )
            }
            className="border rounded-lg px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>

        </div>

      )}

    </div>

  );

};


export default AdminNotifications;