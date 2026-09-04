// src/pages/admin/VisitorJourneyAnalytics.jsx

import React, {
  useEffect,
  useState,
} from "react";

import {
  getVisitorJourneyAnalytics,
} from "../../api/adminAPI";

const RANGE_OPTIONS = [
  ["today", "Today"],
  ["yesterday", "Yesterday"],
  ["7d", "7 Days"],
  ["30d", "30 Days"],
  ["90d", "90 Days"],
  ["custom", "Custom Range"],
  ["all", "All Time"],
];

const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN").format(
    Number(value) || 0
  );

const formatPercent = (value) =>
  `${Number(value || 0).toFixed(2)}%`;

const StatCard = ({
  title,
  value,
  subtitle,
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">
      {title}
    </p>

    <p className="mt-2 text-2xl font-bold text-gray-900">
      {value}
    </p>

    {subtitle ? (
      <p className="mt-1 text-xs text-gray-500">
        {subtitle}
      </p>
    ) : null}
  </div>
);

const JourneyStep = ({
  title,
  value,
  rate,
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <p className="text-sm font-medium text-gray-600">
      {title}
    </p>

    <p className="mt-2 text-2xl font-bold text-gray-900">
      {formatNumber(value)}
    </p>

    {rate !== undefined ? (
      <p className="mt-1 text-xs text-gray-500">
        {formatPercent(rate)}
      </p>
    ) : null}
  </div>
);

export default function VisitorJourneyAnalytics() {
  const [range, setRange] =
    useState("7d");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadData = async () => {
    if (
      range === "custom" &&
      (!startDate || !endDate)
    ) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const params = {
        range,
      };

      if (range === "custom") {
        params.startDate =
          startDate;

        params.endDate =
          endDate;
      }

      const response =
        await getVisitorJourneyAnalytics(
          params
        );

      setData(
        response?.data?.data || null
      );
    } catch (err) {
      console.error(
        "Visitor journey analytics error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load visitor journey analytics."
      );

      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [
    range,
    startDate,
    endDate,
  ]);

  const journey =
    data?.journey || {};

  const conversion =
    data?.conversion || {};

  const visitorTypes =
    Array.isArray(data?.visitorTypes)
      ? data.visitorTypes
      : [];

  const trend =
    Array.isArray(data?.trend)
      ? data.trend
      : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Visitor Journey Analytics
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Understand how visitors move through
            ServDial from visit to business action.
          </p>
        </div>

        {/* FILTER */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Date Range
              </label>

              <select
                value={range}
                onChange={(e) =>
                  setRange(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              >
                {RANGE_OPTIONS.map(
                  ([value, label]) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  )
                )}
              </select>
            </div>

            {range === "custom" && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
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
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
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
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                  />
                </div>
              </>
            )}

            <div className="flex items-end">
              <button
                type="button"
                onClick={loadData}
                disabled={loading}
                className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
              >
                {loading
                  ? "Loading..."
                  : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {!data && loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
            Loading visitor journey analytics...
          </div>
        ) : null}

        {data ? (
          <>
            {/* TOP KPIs */}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <StatCard
                title="Unique Visitors"
                value={formatNumber(
                  journey.visitors
                )}
              />

              <StatCard
                title="Sessions"
                value={formatNumber(
                  journey.sessions
                )}
              />

              <StatCard
                title="Page Views"
                value={formatNumber(
                  journey.pageViews
                )}
              />

              <StatCard
                title="Searches"
                value={formatNumber(
                  journey.searches
                )}
              />

            </div>

            {/* JOURNEY */}

            <div className="mb-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Visitor Journey
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

                <JourneyStep
                  title="Visitors"
                  value={
                    journey.visitors
                  }
                />

                <JourneyStep
                  title="Sessions"
                  value={
                    journey.sessions
                  }
                  rate={
                    conversion.visitorToSessionRate
                  }
                />

                <JourneyStep
                  title="Page Views"
                  value={
                    journey.pageViews
                  }
                  rate={
                    conversion.sessionToPageViewRate
                  }
                />

                <JourneyStep
                  title="Searches"
                  value={
                    journey.searches
                  }
                  rate={
                    conversion.pageViewToSearchRate
                  }
                />

                <JourneyStep
                  title="Business Views"
                  value={
                    journey.businessViews
                  }
                  rate={
                    conversion.searchToBusinessViewRate
                  }
                />

              </div>
            </div>

            {/* BUSINESS ACTIONS */}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <StatCard
                title="Calls"
                value={formatNumber(
                  journey.calls
                )}
                subtitle={formatPercent(
                  conversion.businessViewToCallRate
                )}
              />

              <StatCard
                title="WhatsApp"
                value={formatNumber(
                  journey.whatsapp
                )}
                subtitle={formatPercent(
                  conversion.businessViewToWhatsappRate
                )}
              />

              <StatCard
                title="Directions"
                value={formatNumber(
                  journey.directions
                )}
                subtitle={formatPercent(
                  conversion.businessViewToDirectionsRate
                )}
              />

              <StatCard
                title="Website Clicks"
                value={formatNumber(
                  journey.websiteClicks
                )}
              />

            </div>

            {/* VISITOR TYPES */}

            <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Visitor Type Breakdown
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Admin and Superadmin activity is excluded.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">

                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                        Visitor Type
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                        Visitors
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                        Percentage
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {visitorTypes.map(
                      (item) => (
                        <tr
                          key={
                            item.type
                          }
                        >
                          <td className="px-5 py-4 text-sm font-medium capitalize text-gray-900">
                            {item.type}
                          </td>

                          <td className="px-5 py-4 text-right text-sm text-gray-700">
                            {formatNumber(
                              item.visitors
                            )}
                          </td>

                          <td className="px-5 py-4 text-right text-sm font-medium text-gray-700">
                            {formatPercent(
                              item.percentage
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>

                </table>
              </div>
            </div>

            {/* DAILY TREND */}

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

              <div className="border-b border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Journey Trend
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Daily visitor journey activity.
                </p>
              </div>

              {!trend.length ? (
                <div className="p-8 text-center text-sm text-gray-500">
                  No trend data available.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">

                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                          Date
                        </th>

                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                          Searches
                        </th>

                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                          Business Views
                        </th>

                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                          Calls
                        </th>

                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                          WhatsApp
                        </th>

                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                          Directions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {trend.map(
                        (item) => (
                          <tr
                            key={
                              item.date
                            }
                          >
                            <td className="px-5 py-4 text-sm font-medium text-gray-900">
                              {item.date}
                            </td>

                            <td className="px-5 py-4 text-right text-sm">
                              {formatNumber(
                                item.searches
                              )}
                            </td>

                            <td className="px-5 py-4 text-right text-sm">
                              {formatNumber(
                                item.businessViews
                              )}
                            </td>

                            <td className="px-5 py-4 text-right text-sm">
                              {formatNumber(
                                item.calls
                              )}
                            </td>

                            <td className="px-5 py-4 text-right text-sm">
                              {formatNumber(
                                item.whatsapp
                              )}
                            </td>

                            <td className="px-5 py-4 text-right text-sm">
                              {formatNumber(
                                item.directions
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>

                  </table>
                </div>
              )}

            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}