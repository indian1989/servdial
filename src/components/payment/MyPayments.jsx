import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyPayments,
} from "../../api/paymentAPI.js";


// =========================================================
// MY PAYMENTS
// =========================================================
//
// Shows payments created by the logged-in:
// - User
// - Provider
//
// Backend:
// GET /api/payments/my
//
// Features:
// - Payment list
// - Status filter
// - Service type filter
// - Pagination
// - Payment details navigation
// - Payment proof navigation
// - Empty state
// - Loading state
// - Error state
//
// =========================================================


// =========================================================
// CONSTANTS
// =========================================================

const SERVICE_TYPES = [
  {
    value: "",
    label: "All Services",
  },
  {
    value: "banner",
    label: "Banner",
  },
  {
    value: "lead",
    label: "Lead",
  },
  {
    value: "featured_business",
    label: "Featured Business",
  },
  {
    value: "premium_listing",
    label: "Premium Listing",
  },
  {
    value: "subscription",
    label: "Subscription",
  },
  {
    value: "promotion",
    label: "Promotion",
  },
  {
    value: "boost",
    label: "Boost",
  },
];


const STATUS_OPTIONS = [
  {
    value: "",
    label: "All Status",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "processing",
    label: "Processing",
  },
  {
    value: "verified",
    label: "Verified",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
  {
    value: "refunded",
    label: "Refunded",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];


const PAGE_LIMIT = 20;


// =========================================================
// HELPERS
// =========================================================

const formatServiceType = (
  serviceType
) => {

  if (!serviceType) {
    return "Payment";
  }

  const found =
    SERVICE_TYPES.find(
      (item) =>
        item.value === serviceType
    );

  if (found) {
    return found.label;
  }

  return serviceType
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};


const formatStatus = (
  status
) => {

  if (!status) {
    return "Unknown";
  }

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};


const formatPaymentMethod = (
  method
) => {

  if (
    method ===
    "bank_transfer"
  ) {
    return "Bank Transfer";
  }

  if (method === "upi") {
    return "UPI";
  }

  if (!method) {
    return "Not Available";
  }

  return method
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};


const formatAmount = (
  amount,
  currency = "INR"
) => {

  const numericAmount =
    Number(amount);

  if (
    !Number.isFinite(
      numericAmount
    )
  ) {
    return "—";
  }

  if (
    String(currency)
      .toUpperCase() === "INR"
  ) {
    return `₹${numericAmount.toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  }

  return `${String(currency).toUpperCase()} ${numericAmount.toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
};


const formatDate = (
  date
) => {

  if (!date) {
    return "—";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "—";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


// =========================================================
// STATUS STYLING
// =========================================================

const getStatusClasses = (
  status
) => {

  switch (status) {

    case "pending":
      return "bg-amber-100 text-amber-700";

    case "processing":
      return "bg-blue-100 text-blue-700";

    case "verified":
      return "bg-green-100 text-green-700";

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
// COMPONENT
// =========================================================

const MyPayments = () => {

  const navigate =
    useNavigate();


  // =======================================================
  // STATE
  // =======================================================

  const [payments, setPayments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [serviceType, setServiceType] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: PAGE_LIMIT,
      total: 0,
      pages: 0,
    });


  // =======================================================
  // FETCH PAYMENTS
  // =======================================================

  const fetchPayments =
    useCallback(
      async () => {

        try {

          setLoading(true);
          setError("");

          const response =
            await getMyPayments({
              serviceType,
              status,
              page,
              limit: PAGE_LIMIT,
            });

          if (
            !response?.success
          ) {
            throw new Error(
              response?.message ||
                "Unable to load payments."
            );
          }

          setPayments(
            Array.isArray(
              response.data
            )
              ? response.data
              : []
          );

          setPagination(
            response.pagination || {
              page,
              limit: PAGE_LIMIT,
              total: 0,
              pages: 0,
            }
          );

        } catch (err) {

          setError(
            err.response?.data
              ?.message ||
              err.message ||
              "Unable to load payments."
          );

          setPayments([]);

          setPagination({
            page,
            limit: PAGE_LIMIT,
            total: 0,
            pages: 0,
          });

        } finally {

          setLoading(false);

        }

      },
      [
        serviceType,
        status,
        page,
      ]
    );


  // =======================================================
  // LOAD
  // =======================================================

  useEffect(() => {

    fetchPayments();

  }, [
    fetchPayments,
  ]);


  // =======================================================
  // FILTER CHANGE
  // =======================================================

  const handleServiceChange = (
    event
  ) => {

    setServiceType(
      event.target.value
    );

    setPage(1);
  };


  const handleStatusChange = (
    event
  ) => {

    setStatus(
      event.target.value
    );

    setPage(1);
  };


  // =======================================================
  // DETAILS
  // =======================================================

  const handleViewDetails = (
    paymentId
  ) => {

    if (!paymentId) {
      return;
    }

    navigate(
      `/payments/${paymentId}`
    );
  };


  // =======================================================
  // PAGINATION
  // =======================================================

  const totalPages =
    Number(
      pagination?.pages
    ) || 0;


  const currentPage =
    Number(
      pagination?.page
    ) || page;


  const canGoPrevious =
    currentPage > 1;


  const canGoNext =
    totalPages > 0 &&
    currentPage < totalPages;


  const handlePrevious =
    () => {

      if (
        canGoPrevious
      ) {
        setPage(
          (current) =>
            Math.max(
              current - 1,
              1
            )
        );
      }
    };


  const handleNext =
    () => {

      if (canGoNext) {
        setPage(
          (current) =>
            current + 1
        );
      }
    };


  // =======================================================
  // RETRY
  // =======================================================

  const handleRetry = () => {

    fetchPayments();

  };


  // =======================================================
  // RENDER
  // =======================================================

  return (
    <section className="w-full">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6">

        <h1 className="text-2xl font-bold text-gray-900">
          My Payments
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View and track your ServDial payment history.
        </p>

      </div>


      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

        <div className="grid gap-4 sm:grid-cols-2">

          {/* SERVICE FILTER */}

          <div>

            <label
              htmlFor="paymentServiceType"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Service
            </label>

            <select
              id="paymentServiceType"
              value={serviceType}
              onChange={
                handleServiceChange
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            >

              {SERVICE_TYPES.map(
                (item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                )
              )}

            </select>

          </div>


          {/* STATUS FILTER */}

          <div>

            <label
              htmlFor="paymentStatus"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Status
            </label>

            <select
              id="paymentStatus"
              value={status}
              onChange={
                handleStatusChange
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            >

              {STATUS_OPTIONS.map(
                (item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                )
              )}

            </select>

          </div>

        </div>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={
                handleRetry
              }
              className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              Retry
            </button>

          </div>

        </div>
      )}


      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="animate-pulse space-y-4">

            {[
              1,
              2,
              3,
              4,
            ].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-lg border border-gray-100 p-4"
                >

                  <div className="mb-3 h-4 w-40 rounded bg-gray-200" />

                  <div className="grid gap-3 sm:grid-cols-4">

                    <div className="h-4 rounded bg-gray-100" />
                    <div className="h-4 rounded bg-gray-100" />
                    <div className="h-4 rounded bg-gray-100" />
                    <div className="h-4 rounded bg-gray-100" />

                  </div>

                </div>
              )
            )}

          </div>

        </div>

      ) : payments.length === 0 ? (

        /* =================================================
           EMPTY
        ================================================= */

        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">

            <span className="text-2xl">
              ₹
            </span>

          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No payments found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            You do not have any payment records matching the current selection.
          </p>

        </div>

      ) : (

        /* =================================================
           PAYMENT LIST
        ================================================= */

        <div className="space-y-4">

          {payments.map(
            (payment) => {

              const paymentId =
                payment._id ||
                payment.id;

              const paymentStatus =
                payment.status ||
                "unknown";

              const hasProof =
                Boolean(
                  payment.proofImage
                );

              const canSubmitProof =
                [
                  "pending",
                  "processing",
                ].includes(
                  paymentStatus
                );

              return (
                <article
                  key={
                    paymentId ||
                    payment.paymentNumber
                  }
                  className="rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >

                  {/* =====================================
                      PAYMENT HEADER
                  ===================================== */}

                  <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Payment Number
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                        {payment.paymentNumber ||
                          "Not available"}
                      </p>

                    </div>


                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                        paymentStatus
                      )}`}
                    >
                      {formatStatus(
                        paymentStatus
                      )}
                    </span>

                  </div>


                  {/* =====================================
                      PAYMENT INFORMATION
                  ===================================== */}

                  <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4">

                    {/* SERVICE */}

                    <div>

                      <p className="text-xs font-medium text-gray-500">
                        Service
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {formatServiceType(
                          payment.serviceType
                        )}
                      </p>

                    </div>


                    {/* AMOUNT */}

                    <div>

                      <p className="text-xs font-medium text-gray-500">
                        Amount
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {formatAmount(
                          payment.amount,
                          payment.currency
                        )}
                      </p>

                    </div>


                    {/* METHOD */}

                    <div>

                      <p className="text-xs font-medium text-gray-500">
                        Payment Method
                      </p>

                      <p className="mt-1 text-sm text-gray-900">
                        {formatPaymentMethod(
                          payment.paymentMethod
                        )}
                      </p>

                    </div>


                    {/* DATE */}

                    <div>

                      <p className="text-xs font-medium text-gray-500">
                        Payment Date
                      </p>

                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(
                          payment.paymentDate
                        )}
                      </p>

                    </div>

                  </div>


                  {/* =====================================
                      TRANSACTION
                  ===================================== */}

                  <div className="px-5 pb-5">

                    <div className="rounded-lg bg-gray-50 p-4">

                      <div className="grid gap-4 sm:grid-cols-2">

                        <div>

                          <p className="text-xs font-medium text-gray-500">
                            Transaction ID / UTR
                          </p>

                          <p className="mt-1 break-all text-sm text-gray-900">
                            {payment.transactionId ||
                              "Not submitted"}
                          </p>

                        </div>


                        <div>

                          <p className="text-xs font-medium text-gray-500">
                            Proof
                          </p>

                          <p className="mt-1 text-sm text-gray-900">

                            {hasProof ? (
                              <span className="font-medium text-green-700">
                                Submitted
                              </span>
                            ) : (
                              <span className="text-gray-500">
                                Not submitted
                              </span>
                            )}

                          </p>

                        </div>

                      </div>

                    </div>

                  </div>


                  {/* =====================================
                      REJECTION REASON
                  ===================================== */}

                  {paymentStatus ===
                    "rejected" &&
                    payment.rejectionReason && (
                      <div className="px-5 pb-5">

                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">

                          <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                            Rejection Reason
                          </p>

                          <p className="mt-1 text-sm leading-6 text-red-700">
                            {
                              payment.rejectionReason
                            }
                          </p>

                        </div>

                      </div>
                  )}


                  {/* =====================================
                      RECEIPT
                  ===================================== */}

                  {payment.receiptNumber && (
                    <div className="px-5 pb-5">

                      <div className="rounded-lg border border-green-200 bg-green-50 p-4">

                        <div className="grid gap-3 sm:grid-cols-2">

                          <div>

                            <p className="text-xs font-medium text-green-700">
                              Receipt Number
                            </p>

                            <p className="mt-1 break-all text-sm font-semibold text-green-800">
                              {
                                payment.receiptNumber
                              }
                            </p>

                          </div>

                          {payment.receiptGeneratedAt && (
                            <div>

                              <p className="text-xs font-medium text-green-700">
                                Receipt Date
                              </p>

                              <p className="mt-1 text-sm text-green-800">
                                {formatDate(
                                  payment.receiptGeneratedAt
                                )}
                              </p>

                            </div>
                          )}

                        </div>

                      </div>

                    </div>
                  )}


                  {/* =====================================
                      ACTIONS
                  ===================================== */}

                  <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-end">

                    {/* SUBMIT / UPDATE PROOF */}

                    {canSubmitProof && (
                      <button
                        type="button"
                        onClick={() =>
                          handleViewDetails(
                            paymentId
                          )
                        }
                        disabled={
                          !paymentId
                        }
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {hasProof
                          ? "Update Proof"
                          : "Submit Proof"}
                      </button>
                    )}


                    {/* VIEW DETAILS */}

                    <button
                      type="button"
                      onClick={() =>
                        handleViewDetails(
                          paymentId
                        )
                      }
                      disabled={
                        !paymentId
                      }
                      className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      View Details
                    </button>

                  </div>

                </article>
              );
            }
          )}


          {/* =================================================
              PAGINATION
          ================================================= */}

          {totalPages > 1 && (
            <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

              <p className="text-sm text-gray-500">

                Page{" "}
                <span className="font-medium text-gray-900">
                  {currentPage}
                </span>{" "}

                of{" "}
                <span className="font-medium text-gray-900">
                  {totalPages}
                </span>

              </p>


              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={
                    handlePrevious
                  }
                  disabled={
                    !canGoPrevious
                  }
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>


                <button
                  type="button"
                  onClick={
                    handleNext
                  }
                  disabled={
                    !canGoNext
                  }
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>

              </div>

            </div>
          )}

        </div>
      )}

    </section>
  );
};


export default MyPayments;