// frontend/src/pages/admin/AdminPaymentVerification.jsx

import { useCallback, useEffect, useState } from "react";

import {
  getAllPayments,
  verifyPayment,
  rejectPayment,
} from "../../api/paymentAPI.js";


// =========================================================
// ADMIN PAYMENT VERIFICATION
// =========================================================
//
// Admin / Superadmin payment verification page.
//
// Supports:
// - View pending / processing payments
// - Search payment
// - Filter by service type
// - Verify payment
// - Reject payment
// - Pagination
//
// API:
// - getAllPayments(params)
// - verifyPayment(paymentId)
// - rejectPayment(paymentId)
//
// Server remains authoritative for all payment actions.
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

const VERIFICATION_STATUSES = [
  "pending",
  "processing",
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
    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "processing":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};


// =========================================================
// COMPONENT
// =========================================================

const AdminPaymentVerification = () => {

  // =======================================================
  // STATE
  // =======================================================

  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [serviceFilter, setServiceFilter] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
  useState(1);

const [totalPayments, setTotalPayments] =
  useState(0);

  // =======================================================
  // ACTION MODAL
  // =======================================================

  const [actionType, setActionType] =
    useState("");

  const [selectedPayment, setSelectedPayment] =
    useState(null);

  const [rejectionReason, setRejectionReason] =
    useState("");


  // =======================================================
  // FETCH PAYMENTS
  // =======================================================

  const fetchPayments = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
  await getAllPayments({
    status: "pending",
    page,
    limit: PAGE_SIZE,
    serviceType: serviceFilter || undefined,
    search: search.trim() || undefined,
  });

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Failed to load payments"
          );
        }

        const data = Array.isArray(
        response.data
        )
        ? response.data
        : [];

    setTotalPages(
  Math.max(
    Number(
      response.pagination?.pages
    ) || 1,
    1
  )
);

setTotalPayments(
  Number(
    response.pagination?.total
  ) || data.length
);

setPayments(data);

const serverPage =
  Number(
    response.pagination?.page
  ) || 1;

if (serverPage !== page) {
  setPage(serverPage);
}

      } catch (err) {

        console.error(
          "Admin payment verification fetch failed:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load payments"
        );

      } finally {
        setLoading(false);
      }
       },
    [
      page,
      serviceFilter,
      search,
    ]
  );


  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);


  // =======================================================
  // FILTER
  // =======================================================

 const filteredPayments = payments;


  // =======================================================
  // PAGINATION
  // =======================================================

const safePage = Math.min(
  page,
  totalPages
);

const paginatedPayments =
  filteredPayments;


  // =======================================================
  // RESET PAGE
  // =======================================================

  useEffect(() => {
    setPage(1);
  }, [
    search,
    serviceFilter,
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

    setRejectionReason("");

    setError("");

    setSuccessMessage("");
  };


  // =======================================================
  // CLOSE ACTION
  // =======================================================

  const closeAction = () => {

    if (actionLoading) {
      return;
    }

    setSelectedPayment(null);

    setActionType("");

    setRejectionReason("");
  };


  // =======================================================
  // EXECUTE VERIFICATION ACTION
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


      // ===================================================
      // VERIFY
      // ===================================================

      if (actionType === "verify") {

        await verifyPayment(
          paymentId
        );

        setSuccessMessage(
          "Payment verified successfully."
        );
      }


      // ===================================================
      // REJECT
      // ===================================================

      else if (
        actionType === "reject"
      ) {

        if (
          !rejectionReason.trim()
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
              rejectionReason.trim(),
          }
        );

        setSuccessMessage(
          "Payment rejected successfully."
        );
      }


      // ===================================================
      // CLOSE MODAL
      // ===================================================

      setSelectedPayment(null);

      setActionType("");

      setRejectionReason("");


      // ===================================================
      // REFRESH
      // ===================================================

      await fetchPayments();

    } catch (err) {

      console.error(
        "Payment verification action failed:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Payment verification action failed."
      );

    } finally {

      setActionLoading(false);
    }
  };


  // =======================================================
  // CLEAR FILTERS
  // =======================================================

  const clearFilters = () => {

    setSearch("");

    setServiceFilter("");

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
            Payment Verification
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review and verify submitted payments.
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
            Payment Verification
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review submitted payment proofs and verify payments.
          </p>

        </div>


        <button
          type="button"
          onClick={fetchPayments}
          disabled={
            loading ||
            actionLoading
          }
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Refresh
        </button>

      </div>


      {/* =================================================
          SUCCESS
      ================================================= */}

      {successMessage && (

        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>

      )}


      {/* =================================================
          GLOBAL ERROR
      ================================================= */}

      {error && !selectedPayment && (

        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>

      )}


      {/* =================================================
          FILTERS
      ================================================= */}

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">

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

        </div>


        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">

          <p className="text-xs text-gray-500">

            {totalPayments} payment
            {totalPayments === 1
            ? ""
            : "s"} awaiting verification

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

        {paginatedPayments.length === 0 ? (

          <div className="p-10 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
              ✓
            </div>

            <h3 className="mt-3 text-base font-semibold text-gray-900">
              No payments awaiting verification
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              There are currently no pending or processing payments to review.
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

                {paginatedPayments.map(
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

                        <span className="mt-1 inline-block text-xs text-gray-400">
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


                      {/* Actions */}

                      <td className="px-4 py-4 text-right">

                        <div className="flex flex-wrap justify-end gap-2">

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

      {filteredPayments.length > PAGE_SIZE && (

        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">

          <p className="text-sm text-gray-500">

            Page{" "}

            <span className="font-medium text-gray-900">
              {safePage}
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
                safePage <= 1
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
                safePage >= totalPages
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
                  {actionType === "verify"
                    ? "Verify Payment"
                    : "Reject Payment"}
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

              {/* Payment summary */}

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
                    {selectedPayment.receiptNumber}
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


              {/* Rejection reason */}

              {actionType === "reject" && (

                <div>

                  <label className="mb-1 block text-sm font-medium text-gray-700">

                    Rejection Reason

                    <span className="text-red-500">
                      {" "}*
                    </span>

                  </label>

                  <textarea
                    value={
                      rejectionReason
                    }
                    onChange={(event) =>
                      setRejectionReason(
                        event.target.value
                      )
                    }
                    rows={4}
                    placeholder="Enter the reason for rejecting this payment..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                  />

                </div>

              )}


              {/* Error */}

              {error && (

                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>

              )}


              {/* Confirmation */}

              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">

                <p className="text-sm text-yellow-800">

                  {actionType === "verify"
                    ? "Confirm that the payment proof has been reviewed and the payment should be marked as verified."
                    : "This payment will be marked as rejected. Make sure the rejection reason is correct before continuing."}

                </p>

              </div>

            </div>


            {/* Footer */}

            <div className="flex flex-wrap justify-end gap-2 border-t border-gray-200 px-5 py-4">

              <button
                type="button"
                onClick={closeAction}
                disabled={actionLoading}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={handleAction}
                disabled={
                  actionLoading
                }
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                  actionType === "verify"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {actionLoading
                  ? "Processing..."
                  : actionType === "verify"
                    ? "Confirm Verification"
                    : "Confirm Rejection"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};


export default AdminPaymentVerification;