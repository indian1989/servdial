// src/pages/admin/AcquisitionAnalytics.jsx
import React, {
  useEffect,
  useState,
} from "react";

import {
  getAcquisitionAnalytics,
} from "../../api/adminAPI";

const RANGE_OPTIONS = [
  {
    value: "today",
    label: "Today",
  },
  {
    value: "yesterday",
    label: "Yesterday",
  },
  {
    value: "7d",
    label: "7 Days",
  },
  {
    value: "30d",
    label: "30 Days",
  },
  {
    value: "90d",
    label: "90 Days",
  },
  {
    value: "all",
    label: "All Time",
  },
  {
    value: "custom",
    label: "Custom",
  },
];

const formatNumber = (value) =>
  new Intl.NumberFormat().format(
    Number(value) || 0
  );

const AcquisitionAnalytics = () => {
  const [range, setRange] =
    useState("7d");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        range,
      };

      if (
        range === "custom" &&
        startDate &&
        endDate
      ) {
        params.startDate =
          startDate;

        params.endDate =
          endDate;
      }

      const response =
        await getAcquisitionAnalytics(
          params
        );

      setData(
        response?.data?.data || null
      );
    } catch (err) {
      console.error(
        "Acquisition analytics error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load acquisition analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      range === "custom" &&
      (!startDate || !endDate)
    ) {
      return;
    }

    loadAnalytics();
  }, [
    range,
    startDate,
    endDate,
  ]);

  const totals =
    data?.totals || {};

  const sources =
    data?.sources || [];

  const visitorTypes =
    data?.visitorTypes || [];

  const devices =
    data?.devices || [];

  const referrers =
    data?.referrers || [];

  const campaigns =
    data?.campaigns || [];

  const trend =
    data?.trend || [];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Traffic Source & Acquisition Analytics
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Understand where ServDial visitors
          come from and how they use the platform.
        </p>
      </div>

      {/* RANGE */}
      <div className="bg-white border rounded-xl p-4">
        <div className="flex flex-wrap gap-2">
          {RANGE_OPTIONS.map(
            (option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setRange(
                    option.value
                  )
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                  range ===
                  option.value
                    ? "bg-black text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {option.label}
              </button>
            )
          )}
        </div>

        {range === "custom" && (
          <div className="flex flex-wrap gap-4 mt-4">
            <div>
              <label className="block text-sm mb-1">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(
                    e.target.value
                  )
                }
                className="border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(
                    e.target.value
                  )
                }
                className="border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="bg-white border rounded-xl p-8 text-center">
          Loading acquisition analytics...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
          {error}
        </div>
      )}

      {!loading && data && (
        <>
          {/* KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border rounded-xl p-5">
              <p className="text-sm text-gray-500">
                Unique Visitors
              </p>

              <p className="text-3xl font-bold mt-2">
                {formatNumber(
                  totals.uniqueVisitors
                )}
              </p>
            </div>

            <div className="bg-white border rounded-xl p-5">
              <p className="text-sm text-gray-500">
                Sessions
              </p>

              <p className="text-3xl font-bold mt-2">
                {formatNumber(
                  totals.sessions
                )}
              </p>
            </div>

            <div className="bg-white border rounded-xl p-5">
              <p className="text-sm text-gray-500">
                Page Views
              </p>

              <p className="text-3xl font-bold mt-2">
                {formatNumber(
                  totals.pageViews
                )}
              </p>
            </div>

            <div className="bg-white border rounded-xl p-5">
              <p className="text-sm text-gray-500">
                Views / Visitor
              </p>

              <p className="text-3xl font-bold mt-2">
                {totals.averagePageViewsPerVisitor ||
                  0}
              </p>
            </div>
          </div>

          {/* SOURCES */}
          <section className="bg-white border rounded-xl overflow-hidden">
            <div className="p-5 border-b">
              <h2 className="text-lg font-semibold">
                Traffic Sources
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4">
                      Source
                    </th>
                    <th className="text-right p-4">
                      Visitors
                    </th>
                    <th className="text-right p-4">
                      Sessions
                    </th>
                    <th className="text-right p-4">
                      Page Views
                    </th>
                    <th className="text-right p-4">
                      View %
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sources.map(
                    (item) => (
                      <tr
                        key={
                          item.source
                        }
                        className="border-t"
                      >
                        <td className="p-4 font-medium capitalize">
                          {item.source}
                        </td>

                        <td className="p-4 text-right">
                          {formatNumber(
                            item.uniqueVisitors
                          )}
                        </td>

                        <td className="p-4 text-right">
                          {formatNumber(
                            item.sessions
                          )}
                        </td>

                        <td className="p-4 text-right">
                          {formatNumber(
                            item.pageViews
                          )}
                        </td>

                        <td className="p-4 text-right">
                          {item.pageViewPercentage ||
                            0}
                          %
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* VISITOR TYPES */}
          <section className="bg-white border rounded-xl overflow-hidden">
            <div className="p-5 border-b">
              <h2 className="text-lg font-semibold">
                Visitor Type
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
              {visitorTypes.map(
                (item) => (
                  <div
                    key={
                      item.visitorType
                    }
                    className="border rounded-xl p-4"
                  >
                    <p className="font-semibold capitalize">
                      {item.visitorType}
                    </p>

                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                      <p>
                        Visitors:{" "}
                        {formatNumber(
                          item.uniqueVisitors
                        )}
                      </p>

                      <p>
                        Sessions:{" "}
                        {formatNumber(
                          item.sessions
                        )}
                      </p>

                      <p>
                        Page Views:{" "}
                        {formatNumber(
                          item.pageViews
                        )}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          {/* DEVICES */}
          <section className="bg-white border rounded-xl overflow-hidden">
            <div className="p-5 border-b">
              <h2 className="text-lg font-semibold">
                Device Performance
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4">
                      Device
                    </th>
                    <th className="text-right p-4">
                      Visitors
                    </th>
                    <th className="text-right p-4">
                      Sessions
                    </th>
                    <th className="text-right p-4">
                      Page Views
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {devices.map(
                    (item) => (
                      <tr
                        key={
                          item.deviceType
                        }
                        className="border-t"
                      >
                        <td className="p-4 capitalize">
                          {item.deviceType}
                        </td>

                        <td className="p-4 text-right">
                          {formatNumber(
                            item.uniqueVisitors
                          )}
                        </td>

                        <td className="p-4 text-right">
                          {formatNumber(
                            item.sessions
                          )}
                        </td>

                        <td className="p-4 text-right">
                          {formatNumber(
                            item.pageViews
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* REFERRERS */}
          <section className="bg-white border rounded-xl overflow-hidden">
            <div className="p-5 border-b">
              <h2 className="text-lg font-semibold">
                Top Referrers
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4">
                      Referrer
                    </th>
                    <th className="text-right p-4">
                      Visitors
                    </th>
                    <th className="text-right p-4">
                      Sessions
                    </th>
                    <th className="text-right p-4">
                      Page Views
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {referrers.map(
                    (item) => (
                      <tr
                        key={
                          item.referrer
                        }
                        className="border-t"
                      >
                        <td className="p-4 max-w-xl truncate">
                          {item.referrer}
                        </td>

                        <td className="p-4 text-right">
                          {formatNumber(
                            item.uniqueVisitors
                          )}
                        </td>

                        <td className="p-4 text-right">
                          {formatNumber(
                            item.sessions
                          )}
                        </td>

                        <td className="p-4 text-right">
                          {formatNumber(
                            item.pageViews
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* CAMPAIGNS */}
          <section className="bg-white border rounded-xl overflow-hidden">
            <div className="p-5 border-b">
              <h2 className="text-lg font-semibold">
                Campaign Performance
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4">
                      Campaign
                    </th>
                    <th className="text-right p-4">
                      Visitors
                    </th>
                    <th className="text-right p-4">
                      Sessions
                    </th>
                    <th className="text-right p-4">
                      Page Views
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {campaigns.map(
                    (item) => (
                      <tr
                        key={
                          item.campaign
                        }
                        className="border-t"
                      >
                        <td className="p-4">
                          {item.campaign}
                        </td>

                        <td className="p-4 text-right">
                          {formatNumber(
                            item.uniqueVisitors
                          )}
                        </td>

                        <td className="p-4 text-right">
                          {formatNumber(
                            item.sessions
                          )}
                        </td>

                        <td className="p-4 text-right">
                          {formatNumber(
                            item.pageViews
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* DAILY TREND */}
          <section className="bg-white border rounded-xl overflow-hidden">
            <div className="p-5 border-b">
              <h2 className="text-lg font-semibold">
                Daily Acquisition Trend
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4">
                      Date
                    </th>
                    <th className="text-right p-4">
                      Visitors
                    </th>
                    <th className="text-right p-4">
                      Sessions
                    </th>
                    <th className="text-right p-4">
                      Page Views
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {trend.map(
                    (item) => (
                      <tr
                        key={item.date}
                        className="border-t"
                      >
                        <td className="p-4">
                          {item.date}
                        </td>

                        <td className="p-4 text-right">
                          {formatNumber(
                            item.uniqueVisitors
                          )}
                        </td>

                        <td className="p-4 text-right">
                          {formatNumber(
                            item.sessions
                          )}
                        </td>

                        <td className="p-4 text-right">
                          {formatNumber(
                            item.pageViews
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AcquisitionAnalytics;