// src/pages/provider/ProviderProfile.jsx

import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";

const ProviderProfile = () => {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [stats, setStats] = useState({
    businesses: 0,
    leads: 0,
    reviews: 0,
  });

  /* =========================
     FETCH PROFILE
  ========================= */
  const fetchProfile = async () => {
    try {
      const res = await API.get("/provider/profile");

      const user = res.data?.user || null;

      setProfile(user);

      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        avatar: user?.avatar || "",
      });
    } catch (err) {
      console.error("Profile fetch failed:", err);
    }
  };

  /* =========================
     FETCH DASHBOARD STATS
  ========================= */
  const fetchStats = async () => {
    try {
      const res = await API.get("/provider/dashboard");

      const dashboard = res.data?.stats || {};

      setStats({
        businesses: dashboard.totalBusinesses || 0,
        leads: dashboard.totalLeads || 0,
        reviews: dashboard.totalReviews || 0,
      });
    } catch (err) {
      console.error("Stats fetch failed:", err);
    }
  };

  /* =========================
     INITIAL LOAD
  ========================= */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetchProfile(),
        fetchStats(),
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  /* =========================
     PROFILE COMPLETION
  ========================= */
  const profileCompletion = useMemo(() => {
    const fields = [
      formData.name,
      formData.email,
      formData.phone,
      formData.avatar,
    ];

    const completed = fields.filter(
      (field) => field && String(field).trim() !== ""
    ).length;

    return Math.round((completed / fields.length) * 100);
  }, [formData]);

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* =========================
     SAVE PROFILE
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      // IMPORTANT:
      // Replace endpoint when profile update API exists
      await API.put("/provider/profile", formData);

      alert("Profile updated successfully");

      fetchProfile();
    } catch (err) {
      console.error("Profile update failed:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-8 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* AVATAR */}
          <div className="flex-shrink-0">
            <img
              src={
                formData.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  formData.name || "Provider"
                )}&background=4f46e5&color=fff`
              }
              alt={formData.name || "Provider"}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
            />
          </div>

          {/* USER INFO */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-3xl lg:text-4xl font-bold">
              {formData.name || "Provider"}
            </h1>

            <p className="text-indigo-100 mt-2">
              Manage your ServDial account, business identity,
              and provider information.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-6">
              <span className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                {profile?.role || "provider"}
              </span>

              {profile?.createdAt && (
                <span className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                  Joined{" "}
                  {new Date(
                    profile.createdAt
                  ).toLocaleDateString()}
                </span>
              )}

              <span className="bg-green-500/90 px-4 py-2 rounded-full text-sm font-medium">
                Active Account
              </span>
            </div>
          </div>

          {/* PROFILE COMPLETION */}
          <div className="w-full lg:w-72 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">
                Profile Completion
              </h3>

              <span className="font-bold">
                {profileCompletion}%
              </span>
            </div>

            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{
                  width: `${profileCompletion}%`,
                }}
              />
            </div>

            <p className="text-sm text-indigo-100 mt-3">
              Complete your profile to improve provider trust.
            </p>
          </div>
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* ================= SIDEBAR ================= */}
        <div className="space-y-6">
          {/* ACCOUNT STATUS */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-lg font-bold mb-5">
              Account Status
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  Email
                </span>

                <span className="font-medium text-gray-900">
                  {formData.email || "Not added"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  Phone
                </span>

                <span className="font-medium text-gray-900">
                  {formData.phone || "Not added"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  Role
                </span>

                <span className="capitalize font-medium text-indigo-600">
                  {profile?.role || "provider"}
                </span>
              </div>
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-lg font-bold mb-5">
              Quick Stats
            </h2>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">
                    Businesses
                  </span>

                  <span className="font-bold">
                    {stats.businesses}
                  </span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{
                      width: `${
                        Math.min(
                          stats.businesses * 10,
                          100
                        )
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">
                    Leads
                  </span>

                  <span className="font-bold">
                    {stats.leads}
                  </span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 rounded-full"
                    style={{
                      width: `${
                        Math.min(
                          stats.leads,
                          100
                        )
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">
                    Reviews
                  </span>

                  <span className="font-bold">
                    {stats.reviews}
                  </span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{
                      width: `${
                        Math.min(
                          stats.reviews * 5,
                          100
                        )
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PROFILE FORM ================= */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border shadow-sm p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">
                Profile Information
              </h2>

              <p className="text-gray-500 mt-2">
                Update and maintain your provider account
                details.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* NAME */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter full name"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter email address"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter phone number"
                />
              </div>

              {/* AVATAR */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Profile Image URL
                </label>

                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Paste image URL"
                />
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white px-8 py-3 rounded-xl font-medium transition"
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={fetchProfile}
                  className="border hover:bg-gray-50 px-8 py-3 rounded-xl font-medium transition"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;