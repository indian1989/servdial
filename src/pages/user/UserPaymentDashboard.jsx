// frontend/src/pages/user/UserPaymentDashboard.jsx

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FaCreditCard,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaHistory,
  FaReceipt,
  FaSpinner,
  FaSyncAlt,
  FaExclamationCircle,
} from "react-icons/fa";

import { getMyPayments } from "../../api/paymentAPI.js";

/**
 * ==================================================
 * 👤 USER PAYMENT DASHBOARD
 * ==================================================
 *
 * USER PAYMENT OVERVIEW PAGE
 *
 * Route:
 * /user/payment-dashboard
 *
 * Data source:
 * GET /api/payments/my
 *
 * Features:
 * - Real payment summary
 * - Real status counts
 * - Recent payments
 * - Recent verified receipts
 * - Payment status guide
 * - Quick navigation to My Payments
 * - Loading state
 * - Error state
 * - Retry
 *
 * IMPORTANT:
 * - Uses existing getMyPayments API
 * - No dummy payment values
 * - No payment creation logic
 * - No payment verification logic
 * - No permission logic
 * ==================================================
 */

// ==================================================
// CONSTANTS
// ==================================================

const PAYMENT_PAGE_LIMIT = 20;

const STATUS_LIST = [
  "pending",
  "processing",
  "verified",
  "rejected",
  "refunded",
  "cancelled",
];


// ==================================================
// HELPERS
// ==================================================

const formatServiceType = (serviceType) => {
  if (!serviceType) {
    return "Payment";
  }

  return String(serviceType)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};


const formatStatus = (status) => {
  if (!status) {
    return "Unknown";
  }

  return String(status)
    .replaceAll("_", " ")
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

  const normalizedCurrency =
    String(currency || "INR").toUpperCase();

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: normalizedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    return `${normalizedCurrency} ${numericAmount.toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  }
};


const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


const getStatusClasses = (status) => {
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


const getStatusIcon = (status) => {
  switch (status) {
    case "pending":
      return FaClock;

    case "processing":
      return FaCreditCard;

    case "verified":
      return FaCheckCircle;

    case "rejected":
      return FaTimesCircle;

    default:
      return FaCreditCard;
  }
};


// ==================================================
// COMPONENT
// ==================================================

const UserPaymentDashboard = () => {
  const navigate = useNavigate();


  // ==================================================
  // STATE
  // ==================================================

  const [summary, setSummary] = useState({
    totalPayments: 0,
    pendingPayments: 0,
    processingPayments: 0,
    verifiedPayments: 0,
    rejectedPayments: 0,
    refundedPayments: 0,
    cancelledPayments: 0,
  });

  const [recentPayments, setRecentPayments] =
    useState([]);

  const [recentReceipts, setRecentReceipts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [refreshing, setRefreshing] =
    useState(false);


  // ==================================================
  // LOAD DASHBOARD
  // ==================================================

  const loadDashboard = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");


        // ==================================================
        // 1. LOAD RECENT PAYMENTS
        // ==================================================

        const recentResponse =
          await getMyPayments({
            page: 1,
            limit: PAYMENT_PAGE_LIMIT,
          });


        if (
          !recentResponse?.success
        ) {
          throw new Error(
            recentResponse?.message ||
              "Unable to load payment information."
          );
        }


        const payments = Array.isArray(
          recentResponse.data
        )
          ? recentResponse.data
          : [];


        // ==================================================
        // 2. TOTAL PAYMENT COUNT
        // ==================================================

        const totalPayments =
          Number(
            recentResponse?.pagination?.total
          ) || payments.length;


        // ==================================================
        // 3. LOAD STATUS COUNTS
        // ==================================================
        //
        // We request only one record for each status.
        // Backend pagination.total gives the real count.
        //

        const statusResponses =
          await Promise.all(
            STATUS_LIST.map(
              async (status) => {
                try {
                  const response =
                    await getMyPayments({
                      status,
                      page: 1,
                      limit: 1,
                    });

                  if (
                    !response?.success
                  ) {
                    return {
                      status,
                      count: 0,
                    };
                  }

                  return {
                    status,
                    count:
                      Number(
                        response?.pagination
                          ?.total
                      ) || 0,
                  };
                } catch {
                  return {
                    status,
                    count: 0,
                  };
                }
              }
            )
          );


        const statusCounts =
          statusResponses.reduce(
            (result, item) => {
              result[item.status] =
                item.count;

              return result;
            },
            {}
          );


        // ==================================================
        // 4. RECENT PAYMENTS
        // ==================================================

        setRecentPayments(
          payments.slice(0, 5)
        );


        // ==================================================
        // 5. RECENT RECEIPTS
        // ==================================================

        const receipts =
          payments
            .filter(
              (payment) =>
                payment?.receiptNumber &&
                payment?.status === "verified"
            )
            .slice(0, 5);

        setRecentReceipts(receipts);


        // ==================================================
        // 6. UPDATE SUMMARY
        // ==================================================

        setSummary({
          totalPayments,

          pendingPayments:
            statusCounts.pending || 0,

          processingPayments:
            statusCounts.processing || 0,

          verifiedPayments:
            statusCounts.verified || 0,

          rejectedPayments:
            statusCounts.rejected || 0,

          refundedPayments:
            statusCounts.refunded || 0,

          cancelledPayments:
            statusCounts.cancelled || 0,
        });


      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load payment dashboard."
        );

        setRecentPayments([]);
        setRecentReceipts([]);

        setSummary({
          totalPayments: 0,
          pendingPayments: 0,
          processingPayments: 0,
          verifiedPayments: 0,
          rejectedPayments: 0,
          refundedPayments: 0,
          cancelledPayments: 0,
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );


  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);


  // ==================================================
  // NAVIGATION
  // ==================================================

  const openPayments = () => {
    navigate("/user/payment");
  };


  const openPaymentDetails = (
    paymentId
  ) => {
    if (!paymentId) {
      return;
    }

    navigate(
      `/payment/${paymentId}`
    );
  };


  // ==================================================
  // STAT CARDS
  // ==================================================

  const statCards = [
    {
      label: "Total Payments",
      value: summary.totalPayments,
      icon: FaCreditCard,
      iconClass:
        "bg-blue-100 text-blue-600",
    },

    {
      label: "Pending Payments",
      value: summary.pendingPayments,
      icon: FaClock,
      iconClass:
        "bg-amber-100 text-amber-600",
    },

    {
      label: "Processing Payments",
      value: summary.processingPayments,
      icon: FaCreditCard,
      iconClass:
        "bg-indigo-100 text-indigo-600",
    },

    {
      label: "Verified Payments",
      value: summary.verifiedPayments,
      icon: FaCheckCircle,
      iconClass:
        "bg-green-100 text-green-600",
    },

    {
      label: "Rejected Payments",
      value: summary.rejectedPayments,
      icon: FaTimesCircle,
      iconClass:
        "bg-red-100 text-red-600",
    },

    {
      label: "Refunded Payments",
      value: summary.refundedPayments,
      icon: FaReceipt,
      iconClass:
        "bg-purple-100 text-purple-600",
    },

    {
      label: "Cancelled Payments",
      value: summary.cancelledPayments,
      icon: FaTimesCircle,
      iconClass:
        "bg-gray-100 text-gray-600",
    },
  ];


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <section className="w-full">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Payment Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Loading your payment activity...
          </p>
        </div>


        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {[
            1,
            2,
            3,
            4,
          ].map((item) => (
            <div
              key={item}
              className="
                animate-pulse
                rounded-xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
              "
            >
              <div className="flex items-center justify-between">

                <div className="space-y-2">
                  <div className="h-4 w-28 rounded bg-gray-200" />
                  <div className="h-7 w-16 rounded bg-gray-200" />
                </div>

                <div className="h-11 w-11 rounded-xl bg-gray-200" />

              </div>
            </div>
          ))}

        </div>


        <div
          className="
            mt-6
            rounded-xl
            border
            border-gray-200
            bg-white
            p-6
            shadow-sm
          "
        >
          <div className="animate-pulse space-y-4">

            <div className="h-5 w-40 rounded bg-gray-200" />

            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-4 w-5/6 rounded bg-gray-100" />
            <div className="h-4 w-4/6 rounded bg-gray-100" />

          </div>
        </div>

      </section>
    );
  }


  // ==================================================
  // RENDER
  // ==================================================

  return (
    <section className="w-full">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="mb-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              Payment Dashboard
            </h1>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              View your payment activity, payment status
              and verified receipts from your ServDial account.
            </p>

          </div>


          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                loadDashboard(true)
              }
              disabled={refreshing}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-gray-300
                bg-white
                px-4
                py-2.5
                text-sm
                font-medium
                text-gray-700
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <FaSyncAlt
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>


            <button
              type="button"
              onClick={openPayments}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-gray-900
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-gray-800
              "
            >
              <FaHistory />

              My Payments

              <FaArrowRight className="text-xs" />
            </button>

          </div>

        </div>

      </div>


      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div
          className="
            mb-6
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-4
          "
        >

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-3">

              <FaExclamationCircle className="mt-0.5 shrink-0 text-red-600" />

              <div>

                <p className="text-sm font-semibold text-red-800">
                  Unable to load payment dashboard
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>

              </div>

            </div>


            <button
              type="button"
              onClick={() =>
                loadDashboard(true)
              }
              disabled={refreshing}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-red-300
                bg-white
                px-4
                py-2
                text-sm
                font-medium
                text-red-700
                transition
                hover:bg-red-100
                disabled:opacity-60
              "
            >
              <FaSyncAlt
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Retry
            </button>

          </div>

        </div>
      )}


      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {statCards.map((card) => {

          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="
                rounded-xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
                transition
                hover:shadow-md
              "
            >

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-sm font-medium text-gray-500">
                    {card.label}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>

                </div>


                <div
                  className={`
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    ${card.iconClass}
                  `}
                >
                  <Icon className="text-lg" />
                </div>

              </div>

            </div>
          );
        })}

      </div>


      {/* ==================================================
          RECENT PAYMENTS + RECEIPTS
      ================================================== */}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        {/* ==================================================
            RECENT PAYMENTS
        ================================================== */}

        <div
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >

          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  bg-blue-100
                  text-blue-600
                "
              >
                <FaCreditCard />
              </div>

              <div>

                <h2 className="text-base font-semibold text-gray-900">
                  Recent Payments
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Your latest payment activity
                </p>

              </div>

            </div>


            <button
              type="button"
              onClick={openPayments}
              className="
                text-xs
                font-semibold
                text-gray-600
                transition
                hover:text-gray-900
              "
            >
              View All
            </button>

          </div>


          <div className="p-5">

            {recentPayments.length === 0 ? (

              <div className="rounded-lg bg-gray-50 p-6 text-center">

                <div
                  className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-gray-400
                    shadow-sm
                  "
                >
                  <FaCreditCard />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-gray-900">
                  No payment activity yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                  Your payment activity will appear here
                  after a payment record is created.
                </p>

              </div>

            ) : (

              <div className="space-y-3">

                {recentPayments.map(
                  (payment) => {

                    const paymentId =
                      payment?._id ||
                      payment?.id;

                    const paymentStatus =
                      payment?.status ||
                      "unknown";

                    return (
                      <button
                        key={
                          paymentId ||
                          payment?.paymentNumber
                        }
                        type="button"
                        onClick={() =>
                          openPaymentDetails(
                            paymentId
                          )
                        }
                        disabled={!paymentId}
                        className="
                          w-full
                          rounded-lg
                          border
                          border-gray-200
                          bg-white
                          p-4
                          text-left
                          transition
                          hover:border-gray-300
                          hover:bg-gray-50
                          disabled:cursor-default
                        "
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div className="min-w-0">

                            <p className="break-all text-sm font-semibold text-gray-900">
                              {payment?.paymentNumber ||
                                "Payment"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {formatServiceType(
                                payment?.serviceType
                              )}
                            </p>

                          </div>


                          <span
                            className={`
                              inline-flex
                              shrink-0
                              rounded-full
                              px-2.5
                              py-1
                              text-[11px]
                              font-semibold
                              ${getStatusClasses(
                                paymentStatus
                              )}
                            `}
                          >
                            {formatStatus(
                              paymentStatus
                            )}
                          </span>

                        </div>


                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">

                          <p className="text-sm font-semibold text-gray-900">
                            {formatAmount(
                              payment?.amount,
                              payment?.currency
                            )}
                          </p>

                          <p className="text-xs text-gray-500">
                            {formatDate(
                              payment?.paymentDate ||
                                payment?.createdAt
                            )}
                          </p>

                        </div>

                      </button>
                    );
                  }
                )}


                {recentPayments.length > 0 && (
                  <button
                    type="button"
                    onClick={openPayments}
                    className="
                      mt-2
                      inline-flex
                      items-center
                      gap-2
                      text-sm
                      font-semibold
                      text-gray-700
                      transition
                      hover:text-gray-900
                    "
                  >
                    Open complete payment history

                    <FaArrowRight className="text-xs" />
                  </button>
                )}

              </div>
            )}

          </div>

        </div>


        {/* ==================================================
            RECENT RECEIPTS
        ================================================== */}

        <div
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >

          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  bg-green-100
                  text-green-600
                "
              >
                <FaReceipt />
              </div>

              <div>

                <h2 className="text-base font-semibold text-gray-900">
                  Recent Receipts
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Your verified payment receipts
                </p>

              </div>

            </div>

          </div>


          <div className="p-5">

            {recentReceipts.length === 0 ? (

              <div className="rounded-lg bg-gray-50 p-6 text-center">

                <div
                  className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-gray-400
                    shadow-sm
                  "
                >
                  <FaReceipt />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-gray-900">
                  No receipts available
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                  Verified payment receipts will appear
                  here after successful payment verification.
                </p>

              </div>

            ) : (

              <div className="space-y-3">

                {recentReceipts.map(
                  (payment) => {

                    const paymentId =
                      payment?._id ||
                      payment?.id;

                    return (
                      <button
                        key={
                          paymentId ||
                          payment?.receiptNumber
                        }
                        type="button"
                        onClick={() =>
                          openPaymentDetails(
                            paymentId
                          )
                        }
                        disabled={!paymentId}
                        className="
                          w-full
                          rounded-lg
                          border
                          border-green-100
                          bg-green-50/50
                          p-4
                          text-left
                          transition
                          hover:bg-green-50
                          disabled:cursor-default
                        "
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div className="min-w-0">

                            <p className="text-xs font-medium text-green-700">
                              Receipt Number
                            </p>

                            <p className="mt-1 break-all text-sm font-semibold text-green-900">
                              {payment?.receiptNumber}
                            </p>

                          </div>


                          <FaCheckCircle className="mt-1 shrink-0 text-green-600" />

                        </div>


                        <div className="mt-3 grid gap-2 sm:grid-cols-2">

                          <div>

                            <p className="text-[11px] font-medium text-gray-500">
                              Payment
                            </p>

                            <p className="mt-0.5 break-all text-xs font-medium text-gray-800">
                              {payment?.paymentNumber ||
                                "Not available"}
                            </p>

                          </div>


                          <div>

                            <p className="text-[11px] font-medium text-gray-500">
                              Generated
                            </p>

                            <p className="mt-0.5 text-xs text-gray-800">
                              {formatDate(
                                payment?.receiptGeneratedAt
                              )}
                            </p>

                          </div>

                        </div>

                      </button>
                    );
                  }
                )}

              </div>
            )}

          </div>

        </div>

      </div>


      {/* ==================================================
          STATUS GUIDE
      ================================================== */}

      <div
        className="
          mt-6
          rounded-xl
          border
          border-gray-200
          bg-white
          shadow-sm
        "
      >

        <div className="border-b border-gray-200 px-5 py-4">

          <h2 className="text-base font-semibold text-gray-900">
            Payment Status Guide
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Understand the status shown for your payments.
          </p>

        </div>


        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">

          {[
            {
              status: "pending",
              description:
                "Payment has been created and required payment information or proof may still be pending.",
            },

            {
              status: "processing",
              description:
                "Payment information has been submitted and is currently being processed.",
            },

            {
              status: "verified",
              description:
                "The payment has been successfully verified by ServDial.",
            },

            {
              status: "rejected",
              description:
                "The submitted payment information or proof was not accepted.",
            },
          ].map((item) => {

            const Icon =
              getStatusIcon(
                item.status
              );

            return (
              <div
                key={item.status}
                className={`
                  rounded-lg
                  p-4
                  ${
                    item.status ===
                    "pending"
                      ? "bg-amber-50"
                      : item.status ===
                        "processing"
                      ? "bg-blue-50"
                      : item.status ===
                        "verified"
                      ? "bg-green-50"
                      : "bg-red-50"
                  }
                `}
              >

                <div className="flex items-center gap-2">

                  <Icon
                    className={
                      item.status ===
                      "pending"
                        ? "text-amber-600"
                        : item.status ===
                          "processing"
                        ? "text-blue-600"
                        : item.status ===
                          "verified"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  />

                  <p
                    className={`
                      text-sm
                      font-semibold
                      ${
                        item.status ===
                        "pending"
                          ? "text-amber-800"
                          : item.status ===
                            "processing"
                          ? "text-blue-800"
                          : item.status ===
                            "verified"
                          ? "text-green-800"
                          : "text-red-800"
                      }
                    `}
                  >
                    {formatStatus(
                      item.status
                    )}
                  </p>

                </div>


                <p
                  className={`
                    mt-2
                    text-sm
                    leading-6
                    ${
                      item.status ===
                      "pending"
                        ? "text-amber-700"
                        : item.status ===
                          "processing"
                        ? "text-blue-700"
                        : item.status ===
                          "verified"
                        ? "text-green-700"
                        : "text-red-700"
                    }
                  `}
                >
                  {item.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>


      {/* ==================================================
          QUICK ACTION
      ================================================== */}

      <div
        className="
          mt-6
          rounded-xl
          border
          border-gray-200
          bg-gray-950
          p-5
          text-white
          shadow-sm
        "
      >

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-base font-semibold">
              Need to check a payment?
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-400">
              Open your complete payment history to view
              payment details, payment status, transaction
              information and payment proof.
            </p>

          </div>


          <button
            type="button"
            onClick={openPayments}
            className="
              inline-flex
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-white
              px-4
              py-2.5
              text-sm
              font-semibold
              text-gray-900
              transition
              hover:bg-gray-100
            "
          >
            Open My Payments

            <FaArrowRight className="text-xs" />
          </button>

        </div>

      </div>

    </section>
  );
};


export default UserPaymentDashboard;