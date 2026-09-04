// src/pages/admin/BusinessFunnelAnalytics.jsx

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getBusinessFunnelAnalytics,
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
    value: "custom",
    label: "Custom Range",
  },
  {
    value: "all",
    label: "All Time",
  },
];

const numberFormat = (value) =>
  new Intl.NumberFormat("en-IN").format(
    Number(value) || 0
  );

const percentageFormat = (value) =>
  `${Number(value || 0).toFixed(2)}%`;

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Failed to load business funnel analytics.";

const StatCard = ({
  title,
  value,
  subtitle,
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="text-sm font-medium text-gray-500">
      {title}
    </div>

    <div className="mt-2 text-2xl font-bold text-gray-900">
      {value}
    </div>

    {subtitle ? (
      <div className="mt-1 text-xs text-gray-500">
        {subtitle}
      </div>
    ) : null}
  </div>
);

const FunnelRow = ({
  title,
  value,
  rate,
}) => (
  <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-4 last:border-b-0">
    <div>
      <div className="font-medium text-gray-800">
        {title}
      </div>

      <div className="text-xs text-gray-500">
        {numberFormat(value)} actions
      </div>
    </div>

    <div className="text-right">
      <div className="font-semibold text-gray-900">
        {percentageFormat(rate)}
      </div>

      <div className="text-xs text-gray-500">
        from business views
      </div>
    </div>
  </div>
);

export default function BusinessFunnelAnalytics() {
  const [range, setRange] = useState("7d");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

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
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const response =
        await getBusinessFunnelAnalytics(
          params
        );

      const payload =
        response?.data?.data ||
        response?.data ||
        null;

      setAnalytics(payload);
    } catch (err) {
      console.error(
        "Business funnel analytics error:",
        err
      );

      setError(
        getErrorMessage(err)
      );

      setAnalytics(null);
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

  const totals = analytics?.totals || {};

  const funnel = analytics?.funnel || {};

  const trend = Array.isArray(
    analytics?.trend
  )
    ? analytics.trend
    : [];

  const businessPerformance =
    Array.isArray(
      analytics?.businessPerformance
    )
      ? analytics.businessPerformance
      : [];

  const totalViews =
    Number(
      totals.businessViews
    ) || 0;

  const maxTrendValue = useMemo(() => {
    if (!trend.length) return 1;

    return Math.max(
      ...trend.map((item) =>
        Number(item.businessViews) || 0
      ),
      1
    );
  }, [trend]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Business Funnel Analytics
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Track business views and visitor actions
              across ServDial.
            </p>
          </div>

          <div className="text-sm text-gray-500">
            {analytics?.startDate ? (
              <>
                {formatDate(
                  analytics.startDate
                )}{" "}
                —{" "}
                {formatDate(
                  analytics.endDate
                )}
              </>
            ) : (
              "All available data"
            )}
          </div>
        </div>

        {/* =====================================================
            FILTERS
        ===================================================== */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">

            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Date Range
              </label>

              <select
                value={range}
                onChange={(event) =>
                  setRange(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              >
                {RANGE_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>
            </div>

            {range === "custom" ? (
              <>
                <div className="flex-1">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={startDate}
                    onChange={(event) =>
                      setStartDate(
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                  />
                </div>

                <div className="flex-1">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    End Date
                  </label>

                  <input
                    type="date"
                    value={endDate}
                    onChange={(event) =>
                      setEndDate(
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                  />
                </div>
              </>
            ) : null}

            <button
              type="button"
              onClick={loadAnalytics}
              disabled={
                loading ||
                (
                  range === "custom" &&
                  (!startDate ||
                    !endDate)
                )
              }
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Loading..."
                : "Refresh"}
            </button>
          </div>
        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && !analytics ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
            Loading business funnel analytics...
          </div>
        ) : null}

        {/* =====================================================
            KPI CARDS
        ===================================================== */}

        {analytics ? (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <StatCard
                title="Business Views"
                value={numberFormat(
                  totals.businessViews
                )}
                subtitle="Total business detail views"
              />

              <StatCard
                title="Unique View Visitors"
                value={numberFormat(
                  totals.uniqueBusinessViewVisitors
                )}
                subtitle="Unique public visitors"
              />

              <StatCard
                title="Total Actions"
                value={numberFormat(
                  totals.totalActions
                )}
                subtitle="All tracked business actions"
              />

              <StatCard
                title="Conversion Rate"
                value={percentageFormat(
                  totals.conversionRate
                )}
                subtitle="Actions / business views"
              />

            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <StatCard
                title="Calls"
                value={numberFormat(
                  totals.calls
                )}
                subtitle={percentageFormat(
                  funnel.viewToCallRate
                )}
              />

              <StatCard
                title="WhatsApp"
                value={numberFormat(
                  totals.whatsapp
                )}
                subtitle={percentageFormat(
                  funnel.viewToWhatsappRate
                )}
              />

              <StatCard
                title="Directions"
                value={numberFormat(
                  totals.directions
                )}
                subtitle={percentageFormat(
                  funnel.viewToDirectionsRate
                )}
              />

              <StatCard
                title="Website Clicks"
                value={numberFormat(
                  totals.websiteClicks
                )}
                subtitle={percentageFormat(
                  funnel.viewToWebsiteRate
                )}
              />

              <StatCard
                title="Shares"
                value={numberFormat(
                  totals.shares
                )}
                subtitle={percentageFormat(
                  funnel.viewToShareRate
                )}
              />

              <StatCard
                title="Favorites"
                value={numberFormat(
                  totals.favorites
                )}
                subtitle={percentageFormat(
                  funnel.viewToFavoriteRate
                )}
              />

            </div>

            {/* =================================================
                FUNNEL
            ================================================= */}

            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Business Funnel
                  </h2>

                  <p className="text-sm text-gray-500">
                    Visitor actions after viewing a
                    business.
                  </p>
                </div>

                <div>
                  <FunnelRow
                    title="Calls"
                    value={
                      totals.calls
                    }
                    rate={
                      funnel.viewToCallRate
                    }
                  />

                  <FunnelRow
                    title="WhatsApp"
                    value={
                      totals.whatsapp
                    }
                    rate={
                      funnel.viewToWhatsappRate
                    }
                  />

                  <FunnelRow
                    title="Directions"
                    value={
                      totals.directions
                    }
                    rate={
                      funnel.viewToDirectionsRate
                    }
                  />

                  <FunnelRow
                    title="Website Clicks"
                    value={
                      totals.websiteClicks
                    }
                    rate={
                      funnel.viewToWebsiteRate
                    }
                  />

                  <FunnelRow
                    title="Shares"
                    value={
                      totals.shares
                    }
                    rate={
                      funnel.viewToShareRate
                    }
                  />

                  <FunnelRow
                    title="Favorites"
                    value={
                      totals.favorites
                    }
                    rate={
                      funnel.viewToFavoriteRate
                    }
                  />
                </div>
              </div>

              {/* =============================================
                  FUNNEL SUMMARY
              ============================================= */}

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Funnel Summary
                </h2>

                <div className="space-y-5">

                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-gray-600">
                        Business Views
                      </span>

                      <span className="font-semibold">
                        {numberFormat(
                          totalViews
                        )}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gray-700"
                        style={{
                          width: "100%",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-gray-600">
                        Total Actions
                      </span>

                      <span className="font-semibold">
                        {numberFormat(
                          totals.totalActions
                        )}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gray-700"
                        style={{
                          width: `${Math.min(
                            100,
                            Number(
                              totals.conversionRate
                            ) || 0
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="text-sm text-gray-500">
                      Overall Conversion
                    </div>

                    <div className="mt-1 text-3xl font-bold text-gray-900">
                      {percentageFormat(
                        totals.conversionRate
                      )}
                    </div>

                    <div className="mt-1 text-xs text-gray-500">
                      Business views that generated
                      tracked actions.
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* =================================================
                DAILY TREND
            ================================================= */}

            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Daily Business Funnel Trend
                </h2>

                <p className="text-sm text-gray-500">
                  Business views and actions by day.
                </p>
              </div>

              {!trend.length ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  No trend data available.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div
                    className="flex min-w-max items-end gap-3"
                    style={{
                      minHeight: "260px",
                    }}
                  >
                    {trend.map(
                      (item) => {
                        const views =
                          Number(
                            item.businessViews
                          ) || 0;

                        const height =
                          Math.max(
                            8,
                            (
                              views /
                              maxTrendValue
                            ) * 180
                          );

                        const actions =
                          (Number(
                            item.calls
                          ) || 0) +
                          (Number(
                            item.whatsapp
                          ) || 0) +
                          (Number(
                            item.directions
                          ) || 0) +
                          (Number(
                            item.websiteClicks
                          ) || 0) +
                          (Number(
                            item.shares
                          ) || 0) +
                          (Number(
                            item.favorites
                          ) || 0);

                        return (
                          <div
                            key={
                              item.date
                            }
                            className="flex w-16 flex-col items-center"
                          >
                            <div className="mb-2 text-xs font-medium text-gray-700">
                              {numberFormat(
                                views
                              )}
                            </div>

                            <div className="flex h-48 items-end">
                              <div
                                className="w-10 rounded-t-md bg-gray-800"
                                style={{
                                  height: `${height}px`,
                                }}
                                title={`${item.date}: ${views} views`}
                              />
                            </div>

                            <div className="mt-2 text-center text-[10px] text-gray-500">
                              {item.date}
                            </div>

                            <div className="mt-1 text-[10px] text-gray-400">
                              {numberFormat(
                                actions
                              )} actions
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* =================================================
                BUSINESS PERFORMANCE
            ================================================= */}

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

              <div className="border-b border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Business-wise Performance
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Top businesses based on business views.
                </p>
              </div>

              {!businessPerformance.length ? (
                <div className="p-8 text-center text-sm text-gray-500">
                  No business performance data available.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">

                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Business
                        </th>

                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Views
                        </th>

                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Calls
                        </th>

                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                          WhatsApp
                        </th>

                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Directions
                        </th>

                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Website
                        </th>

                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Shares
                        </th>

                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Favorites
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 bg-white">
                      {businessPerformance.map(
                        (business, index) => (
                          <tr
                            key={
                              business.businessId ||
                              index
                            }
                            className="hover:bg-gray-50"
                          >
                            <td className="whitespace-nowrap px-4 py-3">
                              <div className="font-medium text-gray-900">
                                {business.businessName ||
                                  "Unknown Business"}
                              </div>

                              {business.businessSlug ? (
                                <div className="text-xs text-gray-500">
                                  {business.businessSlug}
                                </div>
                              ) : null}
                            </td>

                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-gray-900">
                              {numberFormat(
                                business.businessViews
                              )}
                            </td>

                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-700">
                              {numberFormat(
                                business.calls
                              )}
                            </td>

                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-700">
                              {numberFormat(
                                business.whatsapp
                              )}
                            </td>

                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-700">
                              {numberFormat(
                                business.directions
                              )}
                            </td>

                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-700">
                              {numberFormat(
                                business.websiteClicks
                              )}
                            </td>

                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-700">
                              {numberFormat(
                                business.shares
                              )}
                            </td>

                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-700">
                              {numberFormat(
                                business.favorites
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