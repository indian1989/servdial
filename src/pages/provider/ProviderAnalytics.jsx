// src/pages/provider/ProviderAnalytics.jsx

import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const ProviderAnalytics = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    views: 0,
    calls: 0,
    whatsapp: 0,
    leads: 0,
    businesses: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     FETCH ANALYTICS
  ========================= */
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/provider/analytics");

      const analytics = res.data?.stats || {};

      setStats({
        views: analytics.views || 0,
        calls: analytics.calls || 0,
        whatsapp: analytics.whatsapp || 0,
        leads: analytics.leads || 0,
        businesses: analytics.businesses || 0,
      });
    } catch (err) {
      console.error("Provider analytics error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  /* =========================
     TOTAL ENGAGEMENT
  ========================= */
  const totalEngagement = useMemo(() => {
    return (
      stats.views +
      stats.calls +
      stats.whatsapp +
      stats.leads
    );
  }, [stats]);

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">
          Loading analytics...
        </p>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="border border-red-200 bg-red-50 text-red-600 rounded-2xl p-6">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-8 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold">
              Provider Analytics
            </h1>

            <p className="text-indigo-100 mt-3 max-w-2xl">
              Track your business visibility, customer
              engagement, lead generation, and overall
              listing performance across ServDial.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 min-w-[260px]">
            <p className="text-indigo-100 text-sm mb-2">
              Total Engagement
            </p>

            <h2 className="text-5xl font-bold">
              {totalEngagement}
            </h2>

            <p className="text-sm text-indigo-100 mt-2">
              Combined interactions from all business
              listings
            </p>
          </div>
        </div>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        {/* VIEWS */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl">
              👁️
            </div>

            <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-medium">
              Visibility
            </span>
          </div>

          <h2 className="text-4xl font-bold mt-6">
            {stats.views}
          </h2>

          <p className="text-gray-500 mt-2">
            Listing Views
          </p>
        </div>

        {/* CALLS */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-2xl">
              📞
            </div>

            <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full font-medium">
              Contact
            </span>
          </div>

          <h2 className="text-4xl font-bold mt-6">
            {stats.calls}
          </h2>

          <p className="text-gray-500 mt-2">
            Call Clicks
          </p>
        </div>

        {/* WHATSAPP */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">
              💬
            </div>

            <span className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-medium">
              Messaging
            </span>
          </div>

          <h2 className="text-4xl font-bold mt-6">
            {stats.whatsapp}
          </h2>

          <p className="text-gray-500 mt-2">
            WhatsApp Clicks
          </p>
        </div>

        {/* LEADS */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl">
              🔥
            </div>

            <span className="text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-medium">
              Conversion
            </span>
          </div>

          <h2 className="text-4xl font-bold mt-6">
            {stats.leads}
          </h2>

          <p className="text-gray-500 mt-2">
            Leads Received
          </p>
        </div>

        {/* BUSINESSES */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center text-2xl">
              🏢
            </div>

            <span className="text-xs bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full font-medium">
              Listings
            </span>
          </div>

          <h2 className="text-4xl font-bold mt-6">
            {stats.businesses}
          </h2>

          <p className="text-gray-500 mt-2">
            Total Businesses
          </p>
        </div>
      </div>

      {/* ================= PERFORMANCE SUMMARY ================= */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* LEFT */}
        <div className="bg-white border rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">
            Engagement Summary
          </h2>

          <div className="space-y-6">
            {/* Views */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">
                  Listing Views
                </span>

                <span className="font-bold">
                  {stats.views}
                </span>
              </div>

              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{
                    width: `${Math.min(
                      stats.views,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Calls */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">
                  Call Clicks
                </span>

                <span className="font-bold">
                  {stats.calls}
                </span>
              </div>

              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 rounded-full"
                  style={{
                    width: `${Math.min(
                      stats.calls,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">
                  WhatsApp Clicks
                </span>

                <span className="font-bold">
                  {stats.whatsapp}
                </span>
              </div>

              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{
                    width: `${Math.min(
                      stats.whatsapp,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Leads */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">
                  Leads
                </span>

                <span className="font-bold">
                  {stats.leads}
                </span>
              </div>

              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      stats.leads,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white border rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">
            Performance Insights
          </h2>

          <div className="space-y-5">
            <div className="border rounded-xl p-5 bg-gray-50">
              <h3 className="font-semibold mb-2">
                Visibility Score
              </h3>

              <p className="text-gray-600 text-sm">
                Your listings generated{" "}
                <strong>{stats.views}</strong> total
                views across ServDial.
              </p>
            </div>

            <div className="border rounded-xl p-5 bg-gray-50">
              <h3 className="font-semibold mb-2">
                Customer Intent
              </h3>

              <p className="text-gray-600 text-sm">
                Customers interacted through{" "}
                <strong>
                  {stats.calls + stats.whatsapp}
                </strong>{" "}
                direct contact actions.
              </p>
            </div>

            <div className="border rounded-xl p-5 bg-gray-50">
              <h3 className="font-semibold mb-2">
                Lead Generation
              </h3>

              <p className="text-gray-600 text-sm">
                Your listings generated{" "}
                <strong>{stats.leads}</strong> enquiry
                leads from interested customers.
              </p>
            </div>

            <div className="border rounded-xl p-5 bg-gray-50">
              <h3 className="font-semibold mb-2">
                Listing Portfolio
              </h3>

              <p className="text-gray-600 text-sm">
                You currently manage{" "}
                <strong>{stats.businesses}</strong>{" "}
                active business listings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderAnalytics;