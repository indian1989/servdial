
import React, { useState } from "react";

import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

import API from "../../api/axios";
import Loader from "../../components/common/Loader";

const UserChangePassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = formData;

    if (!currentPassword) {
      return "Please enter your current password.";
    }

    if (!newPassword) {
      return "Please enter your new password.";
    }

    if (newPassword.length < 6) {
      return "New password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      return "Please confirm your new password.";
    }

    if (newPassword !== confirmPassword) {
      return "New password and confirm password do not match.";
    }

    if (currentPassword === newPassword) {
      return "New password must be different from your current password.";
    }

    return "";
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const res = await API.put("/user/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (res?.data?.message) {
        setSuccess(res.data.message);
      } else {
        setSuccess("Password updated successfully.");
      }

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Give user a moment to see success message
      setTimeout(() => {
        navigate("/user/settings");
      }, 1200);

    } catch (err) {
      console.error("CHANGE PASSWORD ERROR:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to update password. Please try again.";

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PASSWORD FIELD
  // =====================================================

  const PasswordField = ({
    label,
    name,
    value,
    placeholder,
    visible,
    setVisible,
  }) => {
    return (
      <div>

        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>

        <div className="relative">

          <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
            <FaLock />
          </div>

          <input
            id={name}
            name={name}
            type={visible ? "text" : "password"}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            autoComplete={
              name === "currentPassword"
                ? "current-password"
                : "new-password"
            }
            className="w-full border border-gray-200 rounded-xl py-3 pl-11 pr-12 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
          />

          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
            aria-label={
              visible
                ? `Hide ${label}`
                : `Show ${label}`
            }
          >
            {visible ? <FaEyeSlash /> : <FaEye />}
          </button>

        </div>

      </div>
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6">

        <Link
          to="/user/settings"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition mb-4"
        >
          <FaArrowLeft />
          Back to Settings
        </Link>

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <FaLock className="text-xl" />
          </div>

          <div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Change Password
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Update your account password securely
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          FORM CARD
      ================================================= */}

      <div className="bg-white border rounded-2xl shadow-sm p-5 md:p-6">

        {/* SUCCESS */}

        {success && (
          <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-5">

            <FaCheckCircle className="mt-0.5 flex-shrink-0" />

            <p className="text-sm">
              {success}
            </p>

          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-5">

            <p className="text-sm">
              {error}
            </p>

          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <PasswordField
            label="Current Password"
            name="currentPassword"
            value={formData.currentPassword}
            placeholder="Enter your current password"
            visible={showCurrent}
            setVisible={setShowCurrent}
          />

          <PasswordField
            label="New Password"
            name="newPassword"
            value={formData.newPassword}
            placeholder="Enter your new password"
            visible={showNew}
            setVisible={setShowNew}
          />

          <PasswordField
            label="Confirm New Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Re-enter your new password"
            visible={showConfirm}
            setVisible={setShowConfirm}
          />

          {/* PASSWORD RULES */}

          <div className="bg-gray-50 border rounded-xl p-4">

            <p className="text-sm font-medium text-gray-700 mb-2">
              Password requirements
            </p>

            <ul className="space-y-1 text-xs text-gray-500">

              <li>
                • At least 6 characters
              </li>

              <li>
                • New password should be different from your current password
              </li>

              <li>
                • Confirm password must match the new password
              </li>

            </ul>

          </div>

          {/* ACTIONS */}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">

            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-5 py-3 rounded-xl font-medium transition"
            >
              {loading ? (
                "Updating..."
              ) : (
                <>
                  <FaLock />
                  Update Password
                </>
              )}
            </button>

            <Link
              to="/user/settings"
              className="sm:w-auto inline-flex items-center justify-center border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-xl font-medium transition"
            >
              Cancel
            </Link>

          </div>

        </form>

      </div>

      {/* =================================================
          SECURITY NOTE
      ================================================= */}

      <div className="mt-5 bg-blue-50 border border-blue-100 rounded-2xl p-4">

        <p className="text-sm text-blue-800 leading-6">
          For your security, never share your password with
          anyone. If you did not request a password change,
          review your account security immediately.
        </p>

      </div>

    </div>
  );
};

export default UserChangePassword;