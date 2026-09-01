// frontend/src/pages/admin/AdminPaymentManagement.jsx

import { useCallback, useEffect, useState } from "react";

import {
  getAllPayments,
  verifyPayment,
  rejectPayment,
  refundPayment,
  cancelPayment,
} from "../../api/paymentAPI.js";


// =========================================================
// ADMIN PAYMENT MANAGEMENT
// =========================================================
//
// Admin / Superadmin payment management page.
//
// Supports:
// - View all payments
// - Server-side status filtering
// - Server-side service type filtering
// - Server-side payer role filtering
// - Server-side search
// - Server-side pagination
// - View payment information
// - Verify payment
// - Reject payment
// - Refund payment
// - Cancel payment
//
// API:
// getAllPayments(params)
//
// Query params:
// - status
// - serviceType
// - payerRole
// - search
// - page
// - limit
//
// =========================================================


// =========================================================
// CONSTANTS
// =========================================================

const SERVICE_TYPES = [
  "banner",
  "lead",
  "featured_business",
  "premium_listing",
  "subscription",
  "promotion",
  "boost",
];

const PAYMENT_STATUSES = [
  "pending",
  "processing",
  "verified",
  "rejected",
  "refunded",
  "cancelled",
];

const PAYER_ROLES = [
  "user",
  "provider",
];

const PAGE_SIZE = 10;


// =========================================================
// HELPERS
// =========================================================

const formatLabel = (value) => {
  if (!value) return "—";

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};


const formatAmount = (
  amount,
  currency = "INR"
) => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "—";
  }

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    return `${currency || "INR"} ${numericAmount}`;
  }
};


const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


const getStatusClasses = (status) => {
  switch (status) {
    case "verified":
      return "bg-green-100 text-green-700";

    case "processing":
      return "bg-blue-100 text-blue-700";

    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "rejected":
      return "bg-red-100 text-red-700";

    case "refunded":
      return "bg-purple-100 text-purple-700";

    case "cancelled":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};


// =========================================================
// RESPONSE NORMALIZER
// =========================================================
//
// Supports both:
// data: []
//
// and common paginated response forms:
// data: {
//   payments: [],
//   total: 100,
//   page: 1,
//   limit: 10,
//   totalPages: 10
// }
//
// This keeps the page compatible with the finalized API
// without changing the backend response contract here.
// =========================================================

const normalizePaymentResponse = (response) => {
  const responseData = response?.data;
  const pagination = response?.pagination;

  if (Array.isArray(responseData)) {
    const total = Number(
      pagination?.total ?? responseData.length
    );

    const page = Number(
      pagination?.page ?? 1
    );

    const limit = Number(
      pagination?.limit ?? PAGE_SIZE
    );

    const totalPages = Number(
      pagination?.pages ??
        Math.ceil(
          total /
            (Number.isFinite(limit) && limit > 0
              ? limit
              : PAGE_SIZE)
        )
    );

    return {
      payments: responseData,
      total:
        Number.isFinite(total)
          ? total
          : responseData.length,
      page:
        Number.isFinite(page) && page > 0
          ? page
          : 1,
      limit:
        Number.isFinite(limit) && limit > 0
          ? limit
          : PAGE_SIZE,
      totalPages:
        Number.isFinite(totalPages) &&
        totalPages > 0
          ? totalPages
          : 1,
    };
  }

  if (
    responseData &&
    typeof responseData === "object"
  ) {
    const payments =
      Array.isArray(responseData.payments)
        ? responseData.payments
        : Array.isArray(responseData.items)
        ? responseData.items
        : Array.isArray(responseData.results)
        ? responseData.results
        : [];

    const total = Number(
      responseData.total ??
        responseData.totalPayments ??
        responseData.count ??
        pagination?.total ??
        payments.length
    );

    const page = Number(
      responseData.page ??
        pagination?.page ??
        1
    );

    const limit = Number(
      responseData.limit ??
        pagination?.limit ??
        PAGE_SIZE
    );

    const totalPagesFromResponse =
      Number(
        responseData.totalPages ??
          responseData.pages ??
          pagination?.pages
      );

    const totalPages =
      Number.isFinite(
        totalPagesFromResponse
      ) &&
      totalPagesFromResponse > 0
        ? totalPagesFromResponse
        : Math.max(
            Math.ceil(
              (Number.isFinite(total)
                ? total
                : payments.length) /
                (Number.isFinite(limit) &&
                limit > 0
                  ? limit
                  : PAGE_SIZE)
            ),
            1
          );

    return {
      payments,
      total:
        Number.isFinite(total)
          ? total
          : payments.length,
      page:
        Number.isFinite(page) && page > 0
          ? page
          : 1,
      limit:
        Number.isFinite(limit) && limit > 0
          ? limit
          : PAGE_SIZE,
      totalPages,
    };
  }

  return {
    payments: [],
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
  };
};


// =========================================================
// COMPONENT
// =========================================================

const AdminPaymentManagement = () => {

  // =======================================================
  // STATE
  // =======================================================

  const [payments, setPayments] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");


  // =======================================================
  // FILTER STATE
  // =======================================================

  const [statusFilter, setStatusFilter] =
    useState("");

  const [serviceFilter, setServiceFilter] =
    useState("");

  const [payerRoleFilter, setPayerRoleFilter] =
    useState("");

  const [search, setSearch] =
    useState("");


  // =======================================================
  // PAGINATION STATE
  // =======================================================

  const [page, setPage] =
    useState(1);

  const [totalPayments, setTotalPayments] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);


  // =======================================================
  // ACTION MODAL STATE
  // =======================================================

  const [actionType, setActionType] =
    useState("");

  const [selectedPayment, setSelectedPayment] =
    useState(null);

  const [actionReason, setActionReason] =
    useState("");


  // =======================================================
  // FETCH PAYMENTS
  // =======================================================

  const fetchPayments = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          page,
          limit: PAGE_SIZE,
        };


        // ===============================================
        // STATUS
        // ===============================================

        if (statusFilter) {
          params.status = statusFilter;
        }


        // ===============================================
        // SERVICE TYPE
        // ===============================================

        if (serviceFilter) {
          params.serviceType =
            serviceFilter;
        }


        // ===============================================
        // PAYER ROLE
        // ===============================================

        if (payerRoleFilter) {
          params.payerRole =
            payerRoleFilter;
        }


        // ===============================================
        // SEARCH
        // ===============================================

        if (search.trim()) {
          params.search =
            search.trim();
        }


        const response =
          await getAllPayments(params);


        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Failed to load payments"
          );
        }


        const normalized =
          normalizePaymentResponse(
            response
          );


        setPayments(
          normalized.payments
        );

        setTotalPayments(
          normalized.total
        );

        setTotalPages(
          normalized.totalPages
        );


        // Keep local page synchronized
        // with server response.
        if (
          normalized.page !== page
        ) {
          setPage(
            normalized.page
          );
        }

      } catch (err) {

        console.error(
          "Admin payment fetch failed:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load payments"
        );

        setPayments([]);
        setTotalPayments(0);
        setTotalPages(1);

      } finally {
        setLoading(false);
      }
    },
    [
      page,
      statusFilter,
      serviceFilter,
      payerRoleFilter,
      search,
    ]
  );


  // =======================================================
  // FETCH WHEN QUERY CHANGES
  // =======================================================

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);


  // =======================================================
  // RESET PAGE WHEN FILTER CHANGES
  // =======================================================

  useEffect(() => {
    setPage(1);
  }, [
    statusFilter,
    serviceFilter,
    payerRoleFilter,
    search,
  ]);


  // =======================================================
  // OPEN ACTION
  // =======================================================

  const openAction = (
    type,
    payment
  ) => {
    setSelectedPayment(payment);
    setActionType(type);
    setActionReason("");
    setError("");
    setSuccessMessage("");
  };


  // =======================================================
  // CLOSE ACTION
  // =======================================================

  const closeAction = () => {
    if (actionLoading) return;

    setSelectedPayment(null);
    setActionType("");
    setActionReason("");
  };


  // =======================================================
  // EXECUTE ACTION
  // =======================================================

  const handleAction = async () => {

    if (!selectedPayment?._id) {
      return;
    }

    try {

      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      const paymentId =
        selectedPayment._id;


      // ===============================================
      // VERIFY
      // ===============================================

      if (
        actionType === "verify"
      ) {

        await verifyPayment(
          paymentId
        );

        setSuccessMessage(
          "Payment verified successfully."
        );
      }


      // ===============================================
      // REJECT
      // ===============================================

      else if (
        actionType === "reject"
      ) {

        if (
          !actionReason.trim()
        ) {
          setError(
            "Rejection reason is required."
          );

          return;
        }

        await rejectPayment(
          paymentId,
          {
            rejectionReason:
              actionReason.trim(),
          }
        );

        setSuccessMessage(
          "Payment rejected successfully."
        );
      }


      // ===============================================
      // REFUND
      // ===============================================

      else if (
        actionType === "refund"
      ) {

        if (
          !actionReason.trim()
        ) {
          setError(
            "Refund reference is required."
          );

          return;
        }

        await refundPayment(
          paymentId,
          {
            refundReference:
              actionReason.trim(),
          }
        );

        setSuccessMessage(
          "Payment refunded successfully."
        );
      }


      // ===============================================
      // CANCEL
      // ===============================================

      else if (
        actionType === "cancel"
      ) {

        await cancelPayment(
          paymentId
        );

        setSuccessMessage(
          "Payment cancelled successfully."
        );
      }


      // ===============================================
      // CLOSE MODAL
      // ===============================================

      setSelectedPayment(null);
      setActionType("");
      setActionReason("");


      // ===============================================
      // REFRESH CURRENT SERVER PAGE
      // ===============================================

      await fetchPayments();

    } catch (err) {

      console.error(
        "Payment action failed:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Payment action failed."
      );

    } finally {
      setActionLoading(false);
    }
  };


  // =======================================================
  // CLEAR FILTERS
  // =======================================================

  const clearFilters = () => {
    setStatusFilter("");
    setServiceFilter("");
    setPayerRoleFilter("");
    setSearch("");
    setPage(1);
  };


  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <div className="space-y-5">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payment Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and verify ServDial payments.
          </p>
        </div>


        <div className="rounded-xl border border-gray-200 bg-white p-5">

          <div className="animate-pulse space-y-4">

            <div className="h-10 rounded bg-gray-200" />

            <div className="h-10 rounded bg-gray-100" />

            <div className="h-64 rounded bg-gray-100" />

          </div>

        </div>

      </div>
    );
  }


  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div className="space-y-5">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payment Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review, verify and manage customer payments.
          </p>
        </div>


        <button
          type="button"
          onClick={fetchPayments}
          disabled={loading || actionLoading}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Refresh
        </button>

      </div>


      {/* =================================================
          GLOBAL ERROR
      ================================================= */}

      {error && !selectedPayment && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}


      {/* =================================================
          SUCCESS
      ================================================= */}

      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}


      {/* =================================================
          FILTERS
      ================================================= */}

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">

          {/* Search */}

          <div className="lg:col-span-2">

            <label className="mb-1 block text-xs font-medium text-gray-600">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Payment no., transaction ID, email..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-500"
            />

          </div>


          {/* Status */}

          <div>

            <label className="mb-1 block text-xs font-medium text-gray-600">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
            >

              <option value="">
                All Statuses
              </option>

              {PAYMENT_STATUSES.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {formatLabel(status)}
                  </option>
                )
              )}

            </select>

          </div>


          {/* Service */}

          <div>

            <label className="mb-1 block text-xs font-medium text-gray-600">
              Service
            </label>

            <select
              value={serviceFilter}
              onChange={(event) =>
                setServiceFilter(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
            >

              <option value="">
                All Services
              </option>

              {SERVICE_TYPES.map(
                (service) => (
                  <option
                    key={service}
                    value={service}
                  >
                    {formatLabel(service)}
                  </option>
                )
              )}

            </select>

          </div>


          {/* Payer Role */}

          <div>

            <label className="mb-1 block text-xs font-medium text-gray-600">
              Payer
            </label>

            <select
              value={payerRoleFilter}
              onChange={(event) =>
                setPayerRoleFilter(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
            >

              <option value="">
                All Payers
              </option>

              {PAYER_ROLES.map(
                (role) => (
                  <option
                    key={role}
                    value={role}
                  >
                    {formatLabel(role)}
                  </option>
                )
              )}

            </select>

          </div>

        </div>


        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">

          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {payments.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {totalPayments}
            </span>{" "}
            payment
            {totalPayments === 1
              ? ""
              : "s"}
          </p>


          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Clear Filters
          </button>

        </div>

      </section>


      {/* =================================================
          PAYMENT TABLE
      ================================================= */}

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {payments.length === 0 ? (

          <div className="p-10 text-center">

            <h3 className="text-base font-semibold text-gray-900">
              No payments found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              No payment records match the selected filters.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full divide-y divide-gray-200">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Payment
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Payer
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Service
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Amount
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Method
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-200">

                {payments.map(
                  (payment) => (

                    <tr
                      key={payment._id}
                      className="hover:bg-gray-50"
                    >

                      {/* Payment */}

                      <td className="px-4 py-4">

                        <p className="font-semibold text-gray-900">
                          {payment.paymentNumber ||
                            "—"}
                        </p>

                        <p className="mt-1 max-w-[180px] truncate text-xs text-gray-500">
                          TXN:{" "}
                          {payment.transactionId ||
                            "—"}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {formatDate(
                            payment.paymentDate ||
                              payment.createdAt
                          )}
                        </p>

                      </td>


                      {/* Payer */}

                      <td className="px-4 py-4">

                        <p className="text-sm font-medium text-gray-900">
                          {payment.userId?.name ||
                            "Unknown"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {payment.userId?.email ||
                            "—"}
                        </p>

                        <span className="mt-1 inline-block text-xs capitalize text-gray-400">
                          {formatLabel(
                            payment.payerRole
                          )}
                        </span>

                      </td>


                      {/* Service */}

                      <td className="px-4 py-4">

                        <p className="text-sm font-medium text-gray-900">
                          {formatLabel(
                            payment.serviceType
                          )}
                        </p>

                        <p className="mt-1 max-w-[150px] truncate text-xs text-gray-500">
                          ID:{" "}
                          {payment.serviceId ||
                            "—"}
                        </p>

                      </td>


                      {/* Amount */}

                      <td className="whitespace-nowrap px-4 py-4">

                        <p className="text-sm font-semibold text-gray-900">
                          {formatAmount(
                            payment.amount,
                            payment.currency
                          )}
                        </p>

                      </td>


                      {/* Method */}

                      <td className="px-4 py-4">

                        <span className="text-sm text-gray-700">
                          {formatLabel(
                            payment.paymentMethod
                          )}
                        </span>

                      </td>


                      {/* Status */}

                      <td className="px-4 py-4">

                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                            payment.status
                          )}`}
                        >
                          {formatLabel(
                            payment.status
                          )}
                        </span>

                      </td>


                      {/* Action */}

                      <td className="px-4 py-4 text-right">

                        <div className="flex flex-wrap justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openAction(
                                "view",
                                payment
                              )
                            }
                            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            View
                          </button>


                          {[
                            "pending",
                            "processing",
                          ].includes(
                            payment.status
                          ) && (

                            <button
                              type="button"
                              onClick={() =>
                                openAction(
                                  "verify",
                                  payment
                                )
                              }
                              className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                            >
                              Verify
                            </button>

                          )}


                          {[
                            "pending",
                            "processing",
                          ].includes(
                            payment.status
                          ) && (

                            <button
                              type="button"
                              onClick={() =>
                                openAction(
                                  "reject",
                                  payment
                                )
                              }
                              className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                            >
                              Reject
                            </button>

                          )}


                          {payment.status ===
                            "verified" && (

                            <button
                              type="button"
                              onClick={() =>
                                openAction(
                                  "refund",
                                  payment
                                )
                              }
                              className="rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700"
                            >
                              Refund
                            </button>

                          )}


                          {[
                            "pending",
                            "processing",
                          ].includes(
                            payment.status
                          ) && (

                            <button
                              type="button"
                              onClick={() =>
                                openAction(
                                  "cancel",
                                  payment
                                )
                              }
                              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                            >
                              Cancel
                            </button>

                          )}

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* =================================================
          PAGINATION
      ================================================= */}

      {totalPages > 1 && (

        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-gray-500">
            Page{" "}
            <span className="font-medium text-gray-900">
              {page}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900">
              {totalPages}
            </span>
          </p>


          <div className="flex gap-2">

            <button
              type="button"
              disabled={
                page <= 1 ||
                loading ||
                actionLoading
              }
              onClick={() =>
                setPage(
                  (current) =>
                    Math.max(
                      current - 1,
                      1
                    )
                )
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>


            <button
              type="button"
              disabled={
                page >= totalPages ||
                loading ||
                actionLoading
              }
              onClick={() =>
                setPage(
                  (current) =>
                    Math.min(
                      current + 1,
                      totalPages
                    )
                )
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>
      )}


      {/* =================================================
          ACTION MODAL
      ================================================= */}

      {selectedPayment && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">

            {/* Header */}

            <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4">

              <div>

                <h2 className="text-lg font-semibold text-gray-900">
                  {actionType === "view"
                    ? "Payment Details"
                    : `${formatLabel(
                        actionType
                      )} Payment`}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {selectedPayment.paymentNumber ||
                    "Payment"}
                </p>

              </div>


              <button
                type="button"
                onClick={closeAction}
                disabled={actionLoading}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                aria-label="Close"
              >
                ✕
              </button>

            </div>


            {/* Body */}

            <div className="space-y-4 px-5 py-5">

              {/* Summary */}

              <div className="grid gap-3 sm:grid-cols-2">

                <div className="rounded-lg bg-gray-50 p-3">

                  <p className="text-xs text-gray-500">
                    Amount
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {formatAmount(
                      selectedPayment.amount,
                      selectedPayment.currency
                    )}
                  </p>

                </div>


                <div className="rounded-lg bg-gray-50 p-3">

                  <p className="text-xs text-gray-500">
                    Status
                  </p>

                  <span
                    className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                      selectedPayment.status
                    )}`}
                  >
                    {formatLabel(
                      selectedPayment.status
                    )}
                  </span>

                </div>


                <div className="rounded-lg bg-gray-50 p-3">

                  <p className="text-xs text-gray-500">
                    Service
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatLabel(
                      selectedPayment.serviceType
                    )}
                  </p>

                </div>


                <div className="rounded-lg bg-gray-50 p-3">

                  <p className="text-xs text-gray-500">
                    Payment Method
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatLabel(
                      selectedPayment.paymentMethod
                    )}
                  </p>

                </div>

              </div>


              {/* Transaction */}

              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Transaction ID
                </p>

                <p className="mt-1 break-all text-sm text-gray-900">
                  {selectedPayment.transactionId ||
                    "—"}
                </p>

              </div>


              {/* Receipt */}

              {selectedPayment.receiptNumber && (

                <div>

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Receipt Number
                  </p>

                  <p className="mt-1 break-all text-sm text-gray-900">
                    {
                      selectedPayment.receiptNumber
                    }
                  </p>

                </div>

              )}


              {/* Payer */}

              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Payer
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {selectedPayment.userId?.name ||
                    "Unknown"}
                </p>

                <p className="text-xs text-gray-500">
                  {selectedPayment.userId?.email ||
                    "—"}
                </p>

              </div>


              {/* Dates */}

              <div className="grid gap-3 sm:grid-cols-2">

                <div>

                  <p className="text-xs text-gray-500">
                    Payment Date
                  </p>

                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(
                      selectedPayment.paymentDate
                    )}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-gray-500">
                    Submitted
                  </p>

                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(
                      selectedPayment.submittedAt ||
                        selectedPayment.createdAt
                    )}
                  </p>

                </div>

              </div>


              {/* Rejection */}

              {selectedPayment.rejectionReason && (

                <div className="rounded-lg border border-red-200 bg-red-50 p-3">

                  <p className="text-xs font-semibold text-red-700">
                    Rejection Reason
                  </p>

                  <p className="mt-1 whitespace-pre-line text-sm text-red-600">
                    {
                      selectedPayment.rejectionReason
                    }
                  </p>

                </div>

              )}


              {/* Refund */}

              {selectedPayment.refundReference && (

                <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">

                  <p className="text-xs font-semibold text-purple-700">
                    Refund Reference
                  </p>

                  <p className="mt-1 break-all text-sm text-purple-900">
                    {
                      selectedPayment.refundReference
                    }
                  </p>

                </div>

              )}


              {/* Action Error */}

              {error && (

                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>

              )}


              {/* Action Input */}

              {[
                "reject",
                "refund",
              ].includes(
                actionType
              ) && (

                <div>

                  <label className="mb-1 block text-sm font-medium text-gray-700">

                    {actionType === "reject"
                      ? "Rejection Reason"
                      : "Refund Reference"}

                    <span className="text-red-500">
                      {" "}*
                    </span>

                  </label>

                  <textarea
                    value={actionReason}
                    onChange={(event) =>
                      setActionReason(
                        event.target.value
                      )
                    }
                    rows={4}
                    placeholder={
                      actionType === "reject"
                        ? "Enter the reason for rejecting this payment..."
                        : "Enter the refund reference..."
                    }
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                  />

                </div>

              )}


              {/* Confirmation */}

              {actionType !== "view" && (

                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">

                  <p className="text-sm text-yellow-800">

                    {actionType === "verify" &&
                      "Confirm that this payment has been received and should be marked as verified."}

                    {actionType === "reject" &&
                      "This payment will be marked as rejected."}

                    {actionType === "refund" &&
                      "This payment will be marked as refunded."}

                    {actionType === "cancel" &&
                      "This payment will be marked as cancelled."}

                  </p>

                </div>

              )}

            </div>


            {/* Footer */}

            <div className="flex flex-wrap justify-end gap-2 border-t border-gray-200 px-5 py-4">

              <button
                type="button"
                onClick={closeAction}
                disabled={actionLoading}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionType === "view"
                  ? "Close"
                  : "Cancel"}
              </button>


              {actionType !== "view" && (

                <button
                  type="button"
                  onClick={handleAction}
                  disabled={actionLoading}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionLoading
                    ? "Processing..."
                    : `Confirm ${formatLabel(
                        actionType
                      )}`}
                </button>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
};


export default AdminPaymentManagement;