import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getMyPayments,
} from "../../api/paymentAPI.js";

import SubmitPaymentProof from "../../components/payment/SubmitPaymentProof.jsx";


// =========================================================
// PROVIDER PAYMENT DETAILS
// =========================================================
//
// Single provider payment area.
//
// Contains:
// - Payment Details
// - Pending Payments
// - Payment Proof Submission
// - Verified Payments
// - Rejected Payments
// - Refunded Payments
//
// IMPORTANT:
// Reuses central payment system.
// No separate payment system is created here.
// =========================================================


const SERVICE_LABELS = {
  banner: "Banner Advertisement",
  lead: "Lead Service",
  featured_business: "Featured Business",
  premium_listing: "Premium Listing",
  subscription: "Subscription",
  promotion: "Promotion",
  boost: "Business Boost",
};


const STATUS_STYLES = {
  pending:
    "bg-amber-100 text-amber-700",

  processing:
    "bg-blue-100 text-blue-700",

  verified:
    "bg-green-100 text-green-700",

  rejected:
    "bg-red-100 text-red-700",

  refunded:
    "bg-purple-100 text-purple-700",

  cancelled:
    "bg-gray-100 text-gray-700",
};


const formatAmount = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "₹0";
  }

  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
};


const formatDate = (value) => {
  if (!value) {
    return "—";
  }

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


const getServiceName = (payment) => {
  return (
    payment?.serviceName ||
    SERVICE_LABELS[payment?.serviceType] ||
    payment?.serviceType ||
    "Paid Service"
  );
};


const getStatusLabel = (status) => {
  return String(status || "pending")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};


const ProviderPaymentDetails = () => {

  // =======================================================
  // STATE
  // =======================================================

  const [payments, setPayments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedPayment, setSelectedPayment] =
    useState(null);

  const [showProof, setShowProof] =
    useState(false);


  // =======================================================
  // FETCH PAYMENTS
  // =======================================================

  const loadPayments = useCallback(
    async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await getMyPayments({
            page: 1,
            limit: 100,
          });

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Unable to load payments."
          );
        }

        setPayments(
          Array.isArray(response.data)
            ? response.data
            : []
        );

      } catch (err) {

        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load payment details."
        );

      } finally {

        setLoading(false);

      }

    },
    []
  );


  useEffect(() => {
    loadPayments();
  }, [loadPayments]);


  // =======================================================
  // GROUP PAYMENTS
  // =======================================================

  const groupedPayments = useMemo(() => {

    return {
      pending: payments.filter(
        (payment) =>
          payment.status === "pending"
      ),

      processing: payments.filter(
        (payment) =>
          payment.status === "processing"
      ),

      verified: payments.filter(
        (payment) =>
          payment.status === "verified"
      ),

      rejected: payments.filter(
        (payment) =>
          payment.status === "rejected"
      ),

      refunded: payments.filter(
        (payment) =>
          payment.status === "refunded"
      ),

      cancelled: payments.filter(
        (payment) =>
          payment.status === "cancelled"
      ),
    };

  }, [payments]);


  const proofPayment =
    selectedPayment &&
    [
      "pending",
      "processing",
    ].includes(
      selectedPayment.status
    )
      ? selectedPayment
      : null;


  // =======================================================
  // PROOF SUBMITTED
  // =======================================================

  const handleProofSubmitted = (
    updatedPayment
  ) => {

    setPayments((current) =>
      current.map((payment) =>
        payment._id ===
        updatedPayment._id
          ? updatedPayment
          : payment
      )
    );

    setSelectedPayment(
      updatedPayment
    );

    setShowProof(false);

  };


  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-6">

        <div className="animate-pulse space-y-5">

          <div className="h-32 rounded-2xl bg-gray-200" />

          <div className="h-24 rounded-xl bg-gray-100" />

          <div className="h-24 rounded-xl bg-gray-100" />

          <div className="h-24 rounded-xl bg-gray-100" />

        </div>

      </div>
    );
  }


  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white shadow-lg">

        <h1 className="text-2xl font-bold sm:text-3xl">
          Payment Details
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100">
          View your payment records, submit payment proof,
          and track verification status from one place.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-xs text-indigo-100">
              Total
            </p>
            <p className="mt-1 text-xl font-bold">
              {payments.length}
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-xs text-indigo-100">
              Pending
            </p>
            <p className="mt-1 text-xl font-bold">
              {groupedPayments.pending.length +
                groupedPayments.processing.length}
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-xs text-indigo-100">
              Verified
            </p>
            <p className="mt-1 text-xl font-bold">
              {groupedPayments.verified.length}
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-xs text-indigo-100">
              Rejected
            </p>
            <p className="mt-1 text-xl font-bold">
              {groupedPayments.rejected.length}
            </p>
          </div>

        </div>

      </section>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">

          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

        </div>
      )}


      {/* =================================================
          PAYMENT PROOF
      ================================================= */}

      {showProof && proofPayment && (
        <SubmitPaymentProof
          paymentId={proofPayment._id}
          payment={proofPayment}
          onProofSubmitted={
            handleProofSubmitted
          }
          onCancel={() => {
            setShowProof(false);
          }}
        />
      )}


      {/* =================================================
          PAYMENT LIST
      ================================================= */}

      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-5 py-4">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                All Payments
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Complete payment history and current status.
              </p>
            </div>

            <button
              type="button"
              onClick={loadPayments}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Refresh
            </button>

          </div>

        </div>


        {payments.length === 0 ? (

          <div className="p-8 text-center">

            <p className="font-medium text-gray-900">
              No payment records found.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Your payment records will appear here after
              creating a payment.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-gray-200">

            {payments.map((payment) => {

              const canSubmitProof =
                [
                  "pending",
                  "processing",
                ].includes(
                  payment.status
                );

              const isSelected =
                selectedPayment?._id ===
                payment._id;

              return (
                <div
                  key={payment._id}
                  className={`p-5 transition ${
                    isSelected
                      ? "bg-gray-50"
                      : "bg-white"
                  }`}
                >

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    {/* DETAILS */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-semibold text-gray-900">
                          {getServiceName(
                            payment
                          )}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                            STATUS_STYLES[
                              payment.status
                            ] ||
                            STATUS_STYLES.cancelled
                          }`}
                        >
                          {getStatusLabel(
                            payment.status
                          )}
                        </span>

                      </div>


                      <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">

                        <div>
                          <p className="text-xs text-gray-500">
                            Payment Number
                          </p>

                          <p className="mt-1 break-all font-medium text-gray-900">
                            {payment.paymentNumber ||
                              "—"}
                          </p>
                        </div>


                        <div>
                          <p className="text-xs text-gray-500">
                            Amount
                          </p>

                          <p className="mt-1 font-semibold text-gray-900">
                            {formatAmount(
                              payment.amount
                            )}
                          </p>
                        </div>


                        <div>
                          <p className="text-xs text-gray-500">
                            Payment Method
                          </p>

                          <p className="mt-1 capitalize text-gray-900">
                            {payment.paymentMethod ===
                            "bank_transfer"
                              ? "Bank Transfer"
                              : "UPI"}
                          </p>
                        </div>


                        <div>
                          <p className="text-xs text-gray-500">
                            Payment Date
                          </p>

                          <p className="mt-1 text-gray-900">
                            {formatDate(
                              payment.paymentDate ||
                                payment.createdAt
                            )}
                          </p>
                        </div>

                      </div>


                      {/* TRANSACTION */}

                      {payment.transactionId && (
                        <div className="mt-3">

                          <p className="text-xs text-gray-500">
                            Transaction ID / UTR
                          </p>

                          <p className="mt-1 break-all text-sm font-medium text-gray-900">
                            {payment.transactionId}
                          </p>

                        </div>
                      )}


                      {/* REJECTION */}

                      {payment.status ===
                        "rejected" &&
                        payment.rejectionReason && (
                          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">

                            <p className="text-xs font-medium text-red-700">
                              Rejection Reason
                            </p>

                            <p className="mt-1 text-sm text-red-700">
                              {payment.rejectionReason}
                            </p>

                          </div>
                        )}


                      {/* RECEIPT */}

                      {payment.receiptNumber && (
                        <div className="mt-3">

                          <p className="text-xs text-gray-500">
                            Receipt Number
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {payment.receiptNumber}
                          </p>

                        </div>
                      )}

                    </div>


                    {/* ACTIONS */}

                    <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPayment(
                            payment
                          );

                          setShowProof(false);
                        }}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        Payment Details
                      </button>


                      {canSubmitProof && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPayment(
                              payment
                            );

                            setShowProof(true);
                          }}
                          className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                          {payment.status ===
                          "processing"
                            ? "Update Proof"
                            : "Submit Proof"}
                        </button>
                      )}

                    </div>

                  </div>


                  {/* SELECTED DETAIL */}

                  {isSelected && !showProof && (
                    <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">

                      <h4 className="text-sm font-semibold text-gray-900">
                        Payment Details
                      </h4>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                        <div>
                          <p className="text-xs text-gray-500">
                            Service Type
                          </p>

                          <p className="mt-1 capitalize text-sm text-gray-900">
                            {String(
                              payment.serviceType ||
                                ""
                            ).replaceAll(
                              "_",
                              " "
                            ) || "—"}
                          </p>
                        </div>


                        <div>
                          <p className="text-xs text-gray-500">
                            Created
                          </p>

                          <p className="mt-1 text-sm text-gray-900">
                            {formatDate(
                              payment.createdAt
                            )}
                          </p>
                        </div>


                        <div>
                          <p className="text-xs text-gray-500">
                            Proof Submitted
                          </p>

                          <p className="mt-1 text-sm text-gray-900">
                            {formatDate(
                              payment.proofUploadedAt
                            )}
                          </p>
                        </div>


                        {payment.verifiedAt && (
                          <div>
                            <p className="text-xs text-gray-500">
                              Processed
                            </p>

                            <p className="mt-1 text-sm text-gray-900">
                              {formatDate(
                                payment.verifiedAt
                              )}
                            </p>
                          </div>
                        )}

                      </div>


                      {payment.proofImage && (
                        <div className="mt-4">

                          <p className="text-xs font-medium text-gray-500">
                            Payment Proof
                          </p>

                          <a
                            href={
                              payment.proofImage
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            View Payment Proof
                          </a>

                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })}

          </div>

        )}

      </section>

    </div>
  );
};


export default ProviderPaymentDetails;