// src/pages/admin/SearchAnalytics.jsx

import { useEffect, useMemo, useState } from "react";

import {
  getSearchAnalytics,
} from "../../api/adminAPI";

const RANGE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
  { value: "custom", label: "Custom Range" },
  { value: "all", label: "All Time" },
];

const formatNumber = (value) => {
  const number = Number(value || 0);

  return new Intl.NumberFormat("en-IN").format(
    Number.isFinite(number) ? number : 0
  );
};

const formatPercent = (value) => {
  const number = Number(value || 0);

  if (!Number.isFinite(number)) {
    return "0%";
  }

  return `${number.toFixed(1)}%`;
};

const formatDate = (value) => {
  if (!value) return "—";

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

const formatSearchType = (value) => {
  if (!value) {
    return "—";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    return (
      value.type ||
      value.searchType ||
      value.intent ||
      "Unknown"
    );
  }

  return String(value);
};

const normalizeResponse = (response) => {
  const data = response?.data?.data || {};

  return {
    range: data.range || "7d",
    startDate: data.startDate || null,
    endDate: data.endDate || null,

    totals: {
      searches: Number(data.totals?.searches || 0),
      uniqueSearchers: Number(
        data.totals?.uniqueSearchers || 0
      ),
      searchesWithResults: Number(
        data.totals?.searchesWithResults || 0
      ),
      noResultSearches: Number(
        data.totals?.noResultSearches || 0
      ),
      noResultRate: Number(
        data.totals?.noResultRate || 0
      ),
      resultClicks: Number(
        data.totals?.resultClicks || 0
      ),
      businessViews: Number(
        data.totals?.businessViews || 0
      ),
    },

    funnel: {
      searches: Number(
        data.funnel?.searches || 0
      ),
      resultClicks: Number(
        data.funnel?.resultClicks || 0
      ),
      businessViews: Number(
        data.funnel?.businessViews || 0
      ),
      searchToClickRate: Number(
        data.funnel?.searchToClickRate || 0
      ),
      searchToBusinessViewRate: Number(
        data.funnel?.searchToBusinessViewRate || 0
      ),
    },

    topQueries: Array.isArray(data.topQueries)
      ? data.topQueries
      : [],

    noResultQueries: Array.isArray(
      data.noResultQueries
    )
      ? data.noResultQueries
      : [],

    searchTypes: Array.isArray(data.searchTypes)
      ? data.searchTypes
      : [],

    trend: Array.isArray(data.trend)
      ? data.trend
      : [],
  };
};

const SearchAnalytics = () => {
  const [range, setRange] = useState("7d");

  const [customStartDate, setCustomStartDate] =
    useState("");

  const [customEndDate, setCustomEndDate] =
    useState("");

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const fetchAnalytics = async () => {
    if (
      range === "custom" &&
      (!customStartDate || !customEndDate)
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
        params.startDate = customStartDate;
        params.endDate = customEndDate;
      }

      const response =
        await getSearchAnalytics(params);

      if (response?.data?.success === false) {
        throw new Error(
          response?.data?.message ||
            "Failed to load search analytics."
        );
      }

      setAnalytics(
        normalizeResponse(response)
      );
    } catch (err) {
      console.error(
        "Search analytics load failed:",
        err
      );

      setAnalytics(null);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load search analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (range !== "custom") {
      fetchAnalytics();
    }
  }, [range]);

  const trendMax = useMemo(() => {
    if (!analytics?.trend?.length) {
      return 1;
    }

    return Math.max(
      ...analytics.trend.map(
        (item) =>
          Number(item.searches || 0)
      ),
      1
    );
  }, [analytics]);

  const totals = analytics?.totals || {};
  const funnel = analytics?.funnel || {};

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Search Analytics
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Understand what visitors search, what
            gets results, and where users drop off.
          </p>

          {analytics?.startDate &&
            analytics?.endDate && (
              <p className="mt-2 text-xs text-gray-400">
                {formatDate(
                  analytics.startDate
                )}{" "}
                –{" "}
                {formatDate(
                  analytics.endDate
                )}
              </p>
            )}
        </div>

        {/* =====================================================
            RANGE FILTER
        ===================================================== */}
        <div className="flex flex-wrap gap-2">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                setRange(option.value)
              }
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                range === option.value
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================
          CUSTOM RANGE
      ===================================================== */}
      {range === "custom" && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Start Date
              </label>

              <input
                type="date"
                value={customStartDate}
                onChange={(event) =>
                  setCustomStartDate(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                End Date
              </label>

              <input
                type="date"
                value={customEndDate}
                onChange={(event) =>
                  setCustomEndDate(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={fetchAnalytics}
                disabled={
                  loading ||
                  !customStartDate ||
                  !customEndDate
                }
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}
      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          Loading search analytics...
        </div>
      )}

      {!loading && analytics && (
        <>
          {/* =================================================
              KPI CARDS
          ================================================= */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="Total Searches"
              value={formatNumber(
                totals.searches
              )}
            />

            <KpiCard
              title="Unique Searchers"
              value={formatNumber(
                totals.uniqueSearchers
              )}
            />

            <KpiCard
              title="Searches With Results"
              value={formatNumber(
                totals.searchesWithResults
              )}
            />

            <KpiCard
              title="No-Result Searches"
              value={formatNumber(
                totals.noResultSearches
              )}
              danger={
                totals.noResultSearches > 0
              }
            />

            <KpiCard
              title="No-Result Rate"
              value={formatPercent(
                totals.noResultRate
              )}
              danger={
                totals.noResultRate > 0
              }
            />

            <KpiCard
              title="Result Clicks"
              value={formatNumber(
                totals.resultClicks
              )}
            />

            <KpiCard
              title="Business Views"
              value={formatNumber(
                totals.businessViews
              )}
            />

            <KpiCard
              title="Search → Business View"
              value={formatPercent(
                funnel.searchToBusinessViewRate
              )}
            />
          </div>

          {/* =================================================
              SEARCH FUNNEL
          ================================================= */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Search Funnel
              </h2>

              <p className="text-sm text-gray-500">
                How searches turn into business
                engagement.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FunnelCard
                title="Searches"
                value={funnel.searches}
              />

              <FunnelCard
                title="Result Clicks"
                value={funnel.resultClicks}
                rate={
                  funnel.searchToClickRate
                }
              />

              <FunnelCard
                title="Business Views"
                value={funnel.businessViews}
                rate={
                  funnel.searchToBusinessViewRate
                }
              />
            </div>
          </section>

          {/* =================================================
              TOP SEARCH QUERIES
          ================================================= */}
          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Top Search Queries
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Most searched queries and their
                business engagement.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">
                      Query
                    </th>

                    <th className="px-4 py-3">
                      Searches
                    </th>

                    <th className="px-4 py-3">
                      Unique
                    </th>

                    <th className="px-4 py-3">
                      Results
                    </th>

                    <th className="px-4 py-3">
                      No Results
                    </th>

                    <th className="px-4 py-3">
                      Clicks
                    </th>

                    <th className="px-4 py-3">
                      Business Views
                    </th>

                    <th className="px-4 py-3">
                      Click Rate
                    </th>

                    <th className="px-4 py-3">
                      Result Rate
                    </th>

                    <th className="px-4 py-3">
                      Type
                    </th>

                    <th className="px-4 py-3">
                      City
                    </th>

                    <th className="px-4 py-3">
                      Category
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {analytics.topQueries.length ===
                  0 ? (
                    <EmptyRow
                      colSpan={12}
                      message="No search queries found."
                    />
                  ) : (
                    analytics.topQueries.map(
                      (item, index) => (
                        <tr
                          key={`${item.query}-${index}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {item.query || "—"}
                          </td>

                          <td className="px-4 py-3">
                            {formatNumber(
                              item.searches
                            )}
                          </td>

                          <td className="px-4 py-3">
                            {formatNumber(
                              item.uniqueSearchers
                            )}
                          </td>

                          <td className="px-4 py-3">
                            {formatNumber(
                              item.resultsFound
                            )}
                          </td>

                          <td className="px-4 py-3 text-red-600">
                            {formatNumber(
                              item.noResults
                            )}
                          </td>

                          <td className="px-4 py-3">
                            {formatNumber(
                              item.resultClicks
                            )}
                          </td>

                          <td className="px-4 py-3">
                            {formatNumber(
                              item.businessViews
                            )}
                          </td>

                          <td className="px-4 py-3">
                            {formatPercent(
                              item.clickRate
                            )}
                          </td>

                          <td className="px-4 py-3">
                            {formatPercent(
                              item.resultRate
                            )}
                          </td>

                          <td className="px-4 py-3 capitalize">
                            {formatSearchType(
                            item.searchType || item.intent
                            )}
                          </td>

                          <td className="px-4 py-3">
                            {item.citySlug ||
                              "Global"}
                          </td>

                          <td className="px-4 py-3">
                            {item.categorySlug ||
                              "—"}
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* =================================================
              NO RESULT SEARCHES
          ================================================= */}
          <section className="rounded-xl border border-red-100 bg-white shadow-sm">
            <div className="border-b border-red-100 p-5">
              <h2 className="text-lg font-semibold text-gray-900">
                No-Result Searches
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                These searches can reveal missing
                businesses or services on ServDial.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[650px] w-full text-left text-sm">
                <thead className="bg-red-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">
                      Query
                    </th>

                    <th className="px-4 py-3">
                      Searches
                    </th>

                    <th className="px-4 py-3">
                      Unique Searchers
                    </th>

                    <th className="px-4 py-3">
                      City
                    </th>

                    <th className="px-4 py-3">
                      Category
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {analytics.noResultQueries
                    .length === 0 ? (
                    <EmptyRow
                      colSpan={5}
                      message="No no-result searches found."
                    />
                  ) : (
                    analytics.noResultQueries.map(
                      (item, index) => (
                        <tr
                          key={`${item.query}-${index}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {item.query || "—"}
                          </td>

                          <td className="px-4 py-3 font-semibold text-red-600">
                            {formatNumber(
                              item.searches
                            )}
                          </td>

                          <td className="px-4 py-3">
                            {formatNumber(
                              item.uniqueSearchers
                            )}
                          </td>

                          <td className="px-4 py-3">
                            {item.citySlug ||
                              "Global"}
                          </td>

                          <td className="px-4 py-3">
                            {item.categorySlug ||
                              "—"}
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* =================================================
              SEARCH TYPE BREAKDOWN
          ================================================= */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Search Type Breakdown
              </h2>

              <p className="text-sm text-gray-500">
                Understand whether users search by
                business name, service, category, or
                mixed intent.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {analytics.searchTypes.length ===
              0 ? (
                <div className="col-span-full rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-500">
                  No search type data available.
                </div>
              ) : (
                analytics.searchTypes.map(
                  (item, index) => (
                    <div
                      key={`${item.type}-${index}`}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <p className="text-sm capitalize text-gray-500">
                        {formatSearchType(
                        item.type || item.searchType
                        )}
                      </p>

                      <p className="mt-2 text-2xl font-bold text-gray-900">
                        {formatNumber(
                          item.searches ||
                            item.count
                        )}
                      </p>

                      {item.percentage !==
                        undefined && (
                        <p className="mt-1 text-xs text-gray-500">
                          {formatPercent(
                            item.percentage
                          )}
                        </p>
                      )}
                    </div>
                  )
                )
              )}
            </div>
          </section>

          {/* =================================================
              DAILY TREND
          ================================================= */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Daily Search Trend
              </h2>

              <p className="text-sm text-gray-500">
                Search activity across the selected
                date range.
              </p>
            </div>

            {analytics.trend.length === 0 ? (
              <div className="rounded-lg bg-gray-50 p-8 text-center text-sm text-gray-500">
                No trend data available.
              </div>
            ) : (
              <div className="space-y-3">
                {analytics.trend.map(
                  (item, index) => {
                    const searches = Number(
                      item.searches || 0
                    );

                    const width =
                      trendMax > 0
                        ? Math.max(
                            (searches /
                              trendMax) *
                              100,
                            searches > 0
                              ? 3
                              : 0
                          )
                        : 0;

                    return (
                      <div
                        key={`${item.date}-${index}`}
                        className="grid grid-cols-[90px_1fr_70px] items-center gap-3"
                      >
                        <span className="text-xs text-gray-500">
                          {formatDate(
                            item.date
                          )}
                        </span>

                        <div className="h-7 overflow-hidden rounded bg-gray-100">
                          <div
                            className="h-full rounded bg-blue-500 transition-all"
                            style={{
                              width: `${width}%`,
                            }}
                          />
                        </div>

                        <span className="text-right text-sm font-semibold text-gray-700">
                          {formatNumber(
                            searches
                          )}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

/* =========================================================
   KPI CARD
========================================================= */

const KpiCard = ({
  title,
  value,
  danger = false,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${
          danger
            ? "text-red-600"
            : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

/* =========================================================
   FUNNEL CARD
========================================================= */

const FunnelCard = ({
  title,
  value,
  rate = null,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {formatNumber(value)}
      </p>

      {rate !== null && (
        <p className="mt-2 text-xs font-medium text-gray-500">
          Conversion: {formatPercent(rate)}
        </p>
      )}
    </div>
  );
};

/* =========================================================
   EMPTY ROW
========================================================= */

const EmptyRow = ({
  colSpan,
  message,
}) => {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-8 text-center text-sm text-gray-500"
      >
        {message}
      </td>
    </tr>
  );
};

export default SearchAnalytics;