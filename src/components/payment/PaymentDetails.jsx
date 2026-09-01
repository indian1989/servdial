// frontend/src/components/payment/PaymentDetails.jsx

import React from "react";


// =========================================================
// PAYMENT DETAILS
// =========================================================
//
// Reusable payment details component.
//
// Can be used by:
// - My Payments
// - Payment Details page
// - Admin Payment Management
// - Admin Payment Verification UI
//
// Props:
// - payment: payment object
// - showActions: optional action area
// - actions: optional custom action content
//
// =========================================================


const PaymentDetails = ({
  payment,
  showActions = false,
  actions = null,
}) => {
  // =======================================================
  // EMPTY STATE
  // =======================================================

  if (!payment) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="text-sm text-gray-500">
          Payment details are not available.
        </p>
      </div>
    );
  }


  // =======================================================
  // HELPERS
  // =======================================================

  const formatDate = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Not available";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  const formatAmount = (
    amount,
    currency = "INR"
  ) => {
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount)) {
      return "Not available";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 2,
    }).format(numericAmount);
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


  const formatLabel = (value) => {
    if (!value) return "Not available";

    return String(value)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };


  // =======================================================
  // RENDER
  // =======================================================

  return (
    <section className="w-full rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="border-b border-gray-200 px-5 py-4">

        <div className="flex flex-wrap items-start justify-between gap-3">

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Payment Details
            </h2>

            {payment.paymentNumber && (
              <p className="mt-1 text-sm text-gray-500">
                Payment No:{" "}
                <span className="font-medium text-gray-700">
                  {payment.paymentNumber}
                </span>
              </p>
            )}
          </div>


          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
              payment.status
            )}`}
          >
            {formatLabel(payment.status)}
          </span>

        </div>

      </div>


      {/* =================================================
          PAYMENT SUMMARY
      ================================================= */}

      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">

        {/* Amount */}

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">

          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Amount
          </p>

          <p className="mt-1 text-lg font-bold text-gray-900">
            {formatAmount(
              payment.amount,
              payment.currency
            )}
          </p>

        </div>


        {/* Service */}

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">

          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Service
          </p>

          <p className="mt-1 font-semibold text-gray-900">
            {formatLabel(
              payment.serviceType
            )}
          </p>

        </div>


        {/* Payment Method */}

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">

          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Payment Method
          </p>

          <p className="mt-1 font-semibold text-gray-900">
            {formatLabel(
              payment.paymentMethod
            )}
          </p>

        </div>

      </div>


      {/* =================================================
          TRANSACTION INFORMATION
      ================================================= */}

      <div className="border-t border-gray-200 px-5 py-4">

        <h3 className="text-base font-semibold text-gray-900">
          Transaction Information
        </h3>


        <div className="mt-4 grid gap-4 sm:grid-cols-2">

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Transaction ID
            </p>

            <p className="mt-1 break-all text-sm font-medium text-gray-900">
              {payment.transactionId ||
                "Not available"}
            </p>
          </div>


          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Payment Date
            </p>

            <p className="mt-1 text-sm text-gray-900">
              {formatDate(
                payment.paymentDate
              )}
            </p>
          </div>


          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Submitted At
            </p>

            <p className="mt-1 text-sm text-gray-900">
              {formatDate(
                payment.submittedAt ||
                  payment.createdAt
              )}
            </p>
          </div>


          {payment.processedAt && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Processed At
              </p>

              <p className="mt-1 text-sm text-gray-900">
                {formatDate(
                  payment.processedAt
                )}
              </p>
            </div>
          )}

        </div>

      </div>


      {/* =================================================
          PAYMENT ACCOUNT
      ================================================= */}

      {(payment.paymentAccountName ||
        payment.paymentUpiId ||
        payment.paymentBankName ||
        payment.paymentBankIfsc ||
        payment.paymentBankAccountLast4) && (

        <div className="border-t border-gray-200 px-5 py-4">

          <h3 className="text-base font-semibold text-gray-900">
            Payment Account
          </h3>


          <div className="mt-4 grid gap-4 sm:grid-cols-2">

            {payment.paymentAccountName && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Account Name
                </p>

                <p className="mt-1 text-sm text-gray-900">
                  {payment.paymentAccountName}
                </p>
              </div>
            )}


            {payment.paymentUpiId && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  UPI ID
                </p>

                <p className="mt-1 break-all text-sm font-medium text-gray-900">
                  {payment.paymentUpiId}
                </p>
              </div>
            )}


            {payment.paymentBankName && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Bank Name
                </p>

                <p className="mt-1 text-sm text-gray-900">
                  {payment.paymentBankName}
                </p>
              </div>
            )}


            {payment.paymentBankIfsc && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  IFSC
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {payment.paymentBankIfsc}
                </p>
              </div>
            )}


            {payment.paymentBankAccountLast4 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Bank Account
                </p>

                <p className="mt-1 text-sm text-gray-900">
                  ****
                  {payment.paymentBankAccountLast4}
                </p>
              </div>
            )}

          </div>

        </div>
      )}


      {/* =================================================
          RECEIPT
      ================================================= */}

      {(payment.receiptNumber ||
        payment.receiptGeneratedAt) && (

        <div className="border-t border-gray-200 px-5 py-4">

          <h3 className="text-base font-semibold text-gray-900">
            Receipt
          </h3>


          <div className="mt-4 grid gap-4 sm:grid-cols-2">

            {payment.receiptNumber && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Receipt Number
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {payment.receiptNumber}
                </p>
              </div>
            )}


            {payment.receiptGeneratedAt && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Generated At
                </p>

                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(
                    payment.receiptGeneratedAt
                  )}
                </p>
              </div>
            )}

          </div>

        </div>
      )}


      {/* =================================================
          REJECTION
      ================================================= */}

      {payment.rejectionReason && (
        <div className="border-t border-gray-200 px-5 py-4">

          <div className="rounded-lg border border-red-200 bg-red-50 p-4">

            <h3 className="text-sm font-semibold text-red-700">
              Rejection Reason
            </h3>

            <p className="mt-1 whitespace-pre-line text-sm text-red-600">
              {payment.rejectionReason}
            </p>

          </div>

        </div>
      )}


      {/* =================================================
          REFUND
      ================================================= */}

      {(payment.refundedAt ||
        payment.refundReference) && (

        <div className="border-t border-gray-200 px-5 py-4">

          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">

            <h3 className="text-sm font-semibold text-purple-700">
              Refund Information
            </h3>


            <div className="mt-3 grid gap-3 sm:grid-cols-2">

              {payment.refundReference && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-purple-600">
                    Refund Reference
                  </p>

                  <p className="mt-1 break-all text-sm text-purple-900">
                    {payment.refundReference}
                  </p>
                </div>
              )}


              {payment.refundedAt && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-purple-600">
                    Refunded At
                  </p>

                  <p className="mt-1 text-sm text-purple-900">
                    {formatDate(
                      payment.refundedAt
                    )}
                  </p>
                </div>
              )}

            </div>

          </div>

        </div>
      )}


      {/* =================================================
          NOTES
      ================================================= */}

      {payment.notes && (
        <div className="border-t border-gray-200 px-5 py-4">

          <h3 className="text-sm font-semibold text-gray-900">
            Notes
          </h3>

          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
            {payment.notes}
          </p>

        </div>
      )}


      {/* =================================================
          ACTIONS
      ================================================= */}

      {showActions && actions && (
        <div className="border-t border-gray-200 px-5 py-4">
          {actions}
        </div>
      )}

    </section>
  );
};


export default PaymentDetails;