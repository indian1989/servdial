import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Activity,
  BarChart3,
  CalendarDays,
  Eye,
  LogIn,
  RefreshCw,
  Search,
  Users,
  UserRound,
  UserRoundCheck,
  UserRoundCog,
  MousePointerClick,
  Phone,
  MessageCircle,
  MapPin,
  Globe,
  Share2,
  AlertCircle,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getVisitorAnalytics } from "../../api/adminAPI";

/* =========================================================
   CONSTANTS
========================================================= */

const RANGE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
  { value: "custom", label: "Custom" },
  { value: "all", label: "All Time" },
];

const EVENT_LABELS = {
  business_view: "Business Views",
  search: "Searches",
  call: "Calls",
  whatsapp: "WhatsApp",
  directions: "Directions",
  website_click: "Website Clicks",
  category_view: "Category Views",
  city_view: "City Views",
  share: "Shares",
  login: "Logins",
  register: "Registrations",
};

/* =========================================================
   HELPERS
========================================================= */

const numberFormatter = new Intl.NumberFormat("en-IN");

const formatNumber = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return numberFormatter.format(number);
};

const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

const formatDateLabel = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const formatRangeDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitialCustomDates = () => {
  const now = new Date();

  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  const start = new Date(now);
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
};

const getApiData = (response) => {
  if (!response) {
    return {};
  }

  if (response.data?.data) {
    return response.data.data;
  }

  if (response.data?.analytics) {
    return response.data.analytics;
  }

  if (response.data?.stats) {
    return response.data.stats;
  }

  if (response.data) {
    return response.data;
  }

  return {};
};

const normalizeSegment = (segment = {}) => ({
  uniqueVisitors: toNumber(
    segment.uniqueVisitors ??
      segment.unique ??
      segment.visitors
  ),
  sessions: toNumber(segment.sessions ?? segment.visits),
  pageViews: toNumber(
    segment.pageViews ??
      segment.views
  ),
  percentage: toNumber(
    segment.percentage ??
      segment.percent
  ),
});

const normalizeTrend = (trend = []) => {
  if (!Array.isArray(trend)) {
    return [];
  }

  return trend.map((item) => ({
    date:
      item.date ??
      item.day ??
      item.label ??
      item._id ??
      "",
    visitors: toNumber(
      item.visitors ??
        item.uniqueVisitors ??
        item.unique ??
        item.users
    ),
    sessions: toNumber(
      item.sessions ??
        item.visits
    ),
    pageViews: toNumber(
      item.pageViews ??
        item.views
    ),
  }));
};

const normalizeEvents = (events = []) => {
  if (Array.isArray(events)) {
    return events
      .map((item) => ({
        event:
          item.event ??
          item.name ??
          item.type ??
          "",
        count: toNumber(
          item.count ??
            item.total ??
            item.value
        ),
      }))
      .filter((item) => item.event);
  }

  if (
    events &&
    typeof events === "object"
  ) {
    return Object.entries(events).map(
      ([event, value]) => ({
        event,
        count: toNumber(
          value?.count ??
            value?.total ??
            value
        ),
      })
    );
  }

  return [];
};

const normalizeAnalytics = (response) => {
  const data = getApiData(response);

  const totalsSource =
    data.totals ??
    data.total ??
    data.summary ??
    {};

  const segmentsSource =
    data.segments ??
    data.breakdown ??
    {};

  const guest = normalizeSegment(
    segmentsSource.guest ??
      segmentsSource.guests ??
      data.guest ??
      {}
  );

  const user = normalizeSegment(
    segmentsSource.user ??
      segmentsSource.users ??
      data.user ??
      {}
  );

  const provider = normalizeSegment(
    segmentsSource.provider ??
      segmentsSource.providers ??
      data.provider ??
      {}
  );

  const totals = {
    uniqueVisitors: toNumber(
      totalsSource.uniqueVisitors ??
        totalsSource.unique ??
        data.uniqueVisitors ??
        data.totalUniqueVisitors
    ),
    sessions: toNumber(
      totalsSource.sessions ??
        totalsSource.visits ??
        data.sessions ??
        data.totalSessions
    ),
    pageViews: toNumber(
      totalsSource.pageViews ??
        totalsSource.views ??
        data.pageViews ??
        data.totalPageViews
    ),
  };

  const calculatedTotalVisitors =
    guest.uniqueVisitors +
    user.uniqueVisitors +
    provider.uniqueVisitors;

  const calculatedTotalSessions =
    guest.sessions +
    user.sessions +
    provider.sessions;

  const calculatedTotalPageViews =
    guest.pageViews +
    user.pageViews +
    provider.pageViews;

  if (
    totals.uniqueVisitors === 0 &&
    calculatedTotalVisitors > 0
  ) {
    totals.uniqueVisitors =
      calculatedTotalVisitors;
  }

  if (
    totals.sessions === 0 &&
    calculatedTotalSessions > 0
  ) {
    totals.sessions =
      calculatedTotalSessions;
  }

  if (
    totals.pageViews === 0 &&
    calculatedTotalPageViews > 0
  ) {
    totals.pageViews =
      calculatedTotalPageViews;
  }

  const segments = {
    guest,
    user,
    provider,
  };

  const segmentTotal =
    totals.uniqueVisitors;

  Object.keys(segments).forEach(
    (key) => {
      if (
        segments[key].percentage === 0 &&
        segmentTotal > 0
      ) {
        segments[key].percentage =
          (segments[key].uniqueVisitors /
            segmentTotal) *
          100;
      }
    }
  );

  return {
    range:
      data.range ??
      "7d",
    startDate:
      data.startDate ??
      null,
    endDate:
      data.endDate ??
      null,
    totals,
    segments,
    trend: normalizeTrend(
      data.trend ??
        data.timeseries ??
        data.timeSeries ??
        []
    ),
    events: normalizeEvents(
      data.events ??
        data.eventMetrics ??
        []
    ),
  };
};

/* =========================================================
   COMPONENT
========================================================= */

const VisitorAnalytics = () => {
  const [range, setRange] = useState("7d");

  const [customDates, setCustomDates] =
    useState(getInitialCustomDates);

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =======================================================
     FETCH ANALYTICS
  ======================================================= */

  const fetchAnalytics = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const params = {
          range,
        };

        if (range === "custom") {
          params.startDate =
            customDates.startDate;

          params.endDate =
            customDates.endDate;
        }

        const response =
          await getVisitorAnalytics(params);

        const normalized =
          normalizeAnalytics(response);

        setAnalytics(normalized);
      } catch (err) {
        console.error(
          "Visitor analytics fetch failed:",
          err
        );

        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load visitor analytics.";

        setError(message);
        setAnalytics(null);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      range,
      customDates.startDate,
      customDates.endDate,
    ]
  );

  useEffect(() => {
    if (range !== "custom") {
      fetchAnalytics(false);
    }
  }, [range, fetchAnalytics]);

  /* =======================================================
     HANDLERS
  ======================================================= */

  const handleRangeChange = (value) => {
    setRange(value);
  };

  const handleCustomDateChange = (
    field,
    value
  ) => {
    setCustomDates((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleApplyCustomRange = () => {
    if (
      !customDates.startDate ||
      !customDates.endDate
    ) {
      setError(
        "Please select both start and end dates."
      );

      return;
    }

    if (
      customDates.startDate >
      customDates.endDate
    ) {
      setError(
        "Start date cannot be after end date."
      );

      return;
    }

    fetchAnalytics(false);
  };

  /* =======================================================
     MEMOS
  ======================================================= */

  const totals = analytics?.totals ?? {
    uniqueVisitors: 0,
    sessions: 0,
    pageViews: 0,
  };

  const segments = analytics?.segments ?? {
    guest: {
      uniqueVisitors: 0,
      sessions: 0,
      pageViews: 0,
      percentage: 0,
    },
    user: {
      uniqueVisitors: 0,
      sessions: 0,
      pageViews: 0,
      percentage: 0,
    },
    provider: {
      uniqueVisitors: 0,
      sessions: 0,
      pageViews: 0,
      percentage: 0,
    },
  };

  const trend = analytics?.trend ?? [];
  const events = analytics?.events ?? [];

  const trendData = useMemo(
    () =>
      trend.map((item) => ({
        ...item,
        label: formatDateLabel(
          item.date
        ),
      })),
    [trend]
  );

  const maxEventCount = useMemo(() => {
    if (!events.length) {
      return 0;
    }

    return Math.max(
      ...events.map(
        (event) => event.count
      )
    );
  }, [events]);

  const displayRange = useMemo(() => {
    if (range === "custom") {
      return `${formatRangeDate(
        customDates.startDate
      )} – ${formatRangeDate(
        customDates.endDate
      )}`;
    }

    if (
      analytics?.startDate ||
      analytics?.endDate
    ) {
      return `${formatRangeDate(
        analytics.startDate
      )} – ${formatRangeDate(
        analytics.endDate
      )}`;
    }

    const labels = {
      today: "Today",
      yesterday: "Yesterday",
      "7d": "Last 7 Days",
      "30d": "Last 30 Days",
      "90d": "Last 90 Days",
      all: "All Time",
      custom: "Custom Range",
    };

    return labels[range] || "Last 7 Days";
  }, [
    range,
    analytics?.startDate,
    analytics?.endDate,
    customDates.startDate,
    customDates.endDate,
  ]);

  /* =======================================================
     KPI CONFIG
  ======================================================= */

  const kpis = [
    {
      title: "Total Unique Visitors",
      value: totals.uniqueVisitors,
      subtitle:
        "Distinct visitors in selected period",
      icon: Users,
    },
    {
      title: "Total Sessions",
      value: totals.sessions,
      subtitle:
        "Visitor sessions / visits",
      icon: Activity,
    },
    {
      title: "Total Page Views",
      value: totals.pageViews,
      subtitle:
        "Tracked page views",
      icon: Eye,
    },
    {
      title: "Guest Visitors",
      value:
        segments.guest.uniqueVisitors,
      subtitle: `${segments.guest.percentage.toFixed(
        1
      )}% of unique visitors`,
      icon: UserRound,
    },
    {
      title: "Logged-in Users",
      value:
        segments.user.uniqueVisitors,
      subtitle: `${segments.user.percentage.toFixed(
        1
      )}% of unique visitors`,
      icon: UserRoundCheck,
    },
    {
      title: "Logged-in Providers",
      value:
        segments.provider.uniqueVisitors,
      subtitle: `${segments.provider.percentage.toFixed(
        1
      )}% of unique visitors`,
      icon: UserRoundCog,
    },
  ];

  /* =======================================================
     LOADING
  ======================================================= */

  if (
    loading &&
    !analytics
  ) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 animate-pulse">
            <div className="h-8 w-64 rounded bg-gray-200" />
            <div className="mt-3 h-4 w-96 max-w-full rounded bg-gray-200" />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-xl bg-white shadow-sm"
              />
            ))}
          </div>

          <div className="h-96 animate-pulse rounded-xl bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <BarChart3 size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Visitor Analytics
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Monitor ServDial visitors,
                  sessions, page views and
                  visitor segments.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              fetchAnalytics(true)
            }
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        {/* =================================================
            RANGE FILTER
        ================================================= */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <CalendarDays
                size={17}
                className="text-indigo-600"
              />
              Date Range
            </div>

            <div className="flex flex-wrap gap-2">
              {RANGE_OPTIONS.map(
                (option) => {
                  const active =
                    range ===
                    option.value;

                  return (
                    <button
                      key={
                        option.value
                      }
                      type="button"
                      onClick={() =>
                        handleRangeChange(
                          option.value
                        )
                      }
                      className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition ${
                        active
                          ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                          : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                }
              )}
            </div>

            {range === "custom" && (
              <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-end">
                <div className="w-full sm:max-w-xs">
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={
                      customDates.startDate
                    }
                    onChange={(event) =>
                      handleCustomDateChange(
                        "startDate",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div className="w-full sm:max-w-xs">
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    End Date
                  </label>

                  <input
                    type="date"
                    value={
                      customDates.endDate
                    }
                    onChange={(event) =>
                      handleCustomDateChange(
                        "endDate",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <button
                  type="button"
                  onClick={
                    handleApplyCustomRange
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Apply Range
                </button>
              </div>
            )}

            <div className="text-xs text-gray-500">
              Showing data for{" "}
              <span className="font-semibold text-gray-700">
                {displayRange}
              </span>
            </div>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                Unable to load visitor
                analytics
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                fetchAnalytics(true)
              }
              className="shrink-0 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
            >
              Retry
            </button>
          </div>
        )}

        {/* =================================================
            KPI CARDS
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;

            return (
              <div
                key={kpi.title}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {kpi.title}
                    </p>

                    <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                      {formatNumber(
                        kpi.value
                      )}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {kpi.subtitle}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Icon size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =================================================
            SEGMENT BREAKDOWN
        ================================================= */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <Users
                size={19}
                className="text-indigo-600"
              />

              <div>
                <h2 className="font-semibold text-gray-900">
                  Visitor Breakdown
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Compare guest and
                  authenticated visitor
                  activity.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Visitor Type
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Unique Visitors
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Sessions
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Page Views
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Share
                  </th>
                </tr>
              </thead>

              <tbody>
                {[
                  {
                    key: "guest",
                    label: "Guest Visitors",
                    icon: UserRound,
                  },
                  {
                    key: "user",
                    label: "Logged-in Users",
                    icon: UserRoundCheck,
                  },
                  {
                    key: "provider",
                    label: "Logged-in Providers",
                    icon: UserRoundCog,
                  },
                ].map((item) => {
                  const Icon =
                    item.icon;

                  const segment =
                    segments[
                      item.key
                    ];

                  return (
                    <tr
                      key={item.key}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                            <Icon
                              size={18}
                            />
                          </div>

                          <span className="font-medium text-gray-800">
                            {item.label}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right font-semibold text-gray-900">
                        {formatNumber(
                          segment.uniqueVisitors
                        )}
                      </td>

                      <td className="px-5 py-4 text-right text-gray-700">
                        {formatNumber(
                          segment.sessions
                        )}
                      </td>

                      <td className="px-5 py-4 text-right text-gray-700">
                        {formatNumber(
                          segment.pageViews
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex min-w-[58px] justify-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                          {segment.percentage.toFixed(
                            1
                          )}
                          %
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* =================================================
            TREND CHART
        ================================================= */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <BarChart3
                size={19}
                className="text-indigo-600"
              />

              <div>
                <h2 className="font-semibold text-gray-900">
                  Visitor Trend
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Visitors, sessions and
                  page views over time.
                </p>
              </div>
            </div>

            {trendData.length > 0 && (
              <div className="text-xs text-gray-400">
                {trendData.length} data
                points
              </div>
            )}
          </div>

          <div className="p-5">
            {trendData.length > 0 ? (
              <div className="h-[360px] w-full">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <LineChart
                    data={trendData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="label"
                      tick={{
                        fontSize: 11,
                      }}
                      tickLine={false}
                      axisLine={false}
                    />

                    <YAxis
                      tick={{
                        fontSize: 11,
                      }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />

                    <Tooltip
                      formatter={(
                        value,
                        name
                      ) => [
                        formatNumber(
                          value
                        ),
                        name ===
                        "visitors"
                          ? "Visitors"
                          : name ===
                            "sessions"
                          ? "Sessions"
                          : "Page Views",
                      ]}
                      labelFormatter={(
                        label
                      ) => label}
                    />

                    <Line
                      type="monotone"
                      dataKey="visitors"
                      name="visitors"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{
                        r: 5,
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="sessions"
                      name="sessions"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{
                        r: 5,
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="pageViews"
                      name="pageViews"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{
                        r: 5,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-72 flex-col items-center justify-center text-center">
                <BarChart3
                  size={38}
                  className="text-gray-300"
                />

                <p className="mt-3 text-sm font-medium text-gray-600">
                  No trend data available
                </p>

                <p className="mt-1 max-w-sm text-xs text-gray-400">
                  Visitor trend data will
                  appear here once the
                  tracking system starts
                  collecting page-view
                  sessions.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            EVENTS
        ================================================= */}

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <MousePointerClick
                size={19}
                className="text-indigo-600"
              />

              <div>
                <h2 className="font-semibold text-gray-900">
                  Visitor Events
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Engagement metrics from
                  the visitor tracking system.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            {events.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {events.map(
                  (
                    item,
                    index
                  ) => {
                    const percentage =
                      maxEventCount >
                      0
                        ? (item.count /
                            maxEventCount) *
                          100
                        : 0;

                    const eventIcon =
                      item.event ===
                      "business_view"
                        ? Eye
                        : item.event ===
                          "search"
                        ? Search
                        : item.event ===
                          "call"
                        ? Phone
                        : item.event ===
                          "whatsapp"
                        ? MessageCircle
                        : item.event ===
                          "directions"
                        ? MapPin
                        : item.event ===
                          "website_click"
                        ? Globe
                        : item.event ===
                          "share"
                        ? Share2
                        : item.event ===
                          "login"
                        ? LogIn
                        : Activity;

                    const EventIcon =
                      eventIcon;

                    const label =
                      EVENT_LABELS[
                        item.event
                      ] ||
                      item.event
                        .replace(
                          /[_-]/g,
                          " "
                        )
                        .replace(
                          /\b\w/g,
                          (char) =>
                            char.toUpperCase()
                        );

                    return (
                      <div
                        key={`${item.event}-${index}`}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
                              <EventIcon
                                size={18}
                              />
                            </div>

                            <span className="text-sm font-medium text-gray-700">
                              {label}
                            </span>
                          </div>

                          <span className="text-lg font-bold text-gray-900">
                            {formatNumber(
                              item.count
                            )}
                          </span>
                        </div>

                        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-indigo-600 transition-all"
                            style={{
                              width: `${Math.min(
                                percentage,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <div className="flex min-h-44 flex-col items-center justify-center text-center">
                <MousePointerClick
                  size={36}
                  className="text-gray-300"
                />

                <p className="mt-3 text-sm font-medium text-gray-600">
                  No event data available
                </p>

                <p className="mt-1 max-w-md text-xs text-gray-400">
                  Future visitor events such as
                  business views, searches,
                  calls, WhatsApp, directions,
                  website clicks and shares
                  will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            FOOTER NOTE
        ================================================= */}

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
          <Activity
            size={18}
            className="mt-0.5 shrink-0 text-indigo-600"
          />

          <div>
            <p className="text-sm font-semibold text-indigo-900">
              Analytics tracking architecture
            </p>

            <p className="mt-1 text-xs leading-5 text-indigo-700">
              Visitor → Session → Page Views →
              Events. Guest visitors are tracked
              anonymously, while authenticated
              users and providers are associated
              with their account identity whenever
              available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorAnalytics;