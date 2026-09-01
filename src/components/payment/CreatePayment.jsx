// frontend/src/components/payment/CreatePayment.jsx

import { useEffect, useMemo, useState } from "react";

import {
  createPayment,
  getPaymentSettings,
} from "../../api/paymentAPI.js";

import PaymentInstructions from "./PaymentInstructions.jsx";


// =========================================================
// CREATE PAYMENT / CHECKOUT
// =========================================================
//
// Used by:
// - User
// - Provider
//
// Backend:
// POST /api/payments
//
// Required:
// - serviceType
// - serviceId
// - amount
// - currency
// - paymentMethod
// - paymentDate
// - notes
//
// IMPORTANT:
// For banner payments, backend validates the amount against
// Banner.price. Frontend amount is never trusted by backend.
//
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


const PAYMENT_METHODS = [
  {
    value: "upi",
    label: "UPI",
  },
  {
    value: "bank_transfer",
    label: "Bank Transfer",
  },
];


// =========================================================
// HELPERS
// =========================================================

const formatAmount = (amount) => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "₹0";
  }

  return numericAmount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
};


const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


// =========================================================
// COMPONENT
// =========================================================

const CreatePayment = ({
  serviceType,
  serviceId,
  amount,
  currency = "INR",
  serviceName = "",
  onPaymentCreated,
  onCancel,
}) => {
  // =======================================================
  // STATE
  // =======================================================

  const [paymentMethod, setPaymentMethod] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [paymentDate, setPaymentDate] =
  useState(getTodayDate());

  const [settings, setSettings] =
    useState(null);

  const [loadingSettings, setLoadingSettings] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [createdPayment, setCreatedPayment] =
    useState(null);


  // =======================================================
  // NORMALIZED VALUES
  // =======================================================

  const numericAmount = useMemo(
    () => Number(amount),
    [amount]
  );


  const displayServiceName =
    serviceName ||
    SERVICE_LABELS[serviceType] ||
    serviceType ||
    "Paid Service";


  const upiEnabled = Boolean(
    settings?.upi?.enabled
  );


  const bankEnabled = Boolean(
    settings?.bank?.enabled
  );


  const availablePaymentMethods =
    useMemo(() => {
      return PAYMENT_METHODS.filter(
        (method) => {
          if (method.value === "upi") {
            return upiEnabled;
          }

          if (
            method.value ===
            "bank_transfer"
          ) {
            return bankEnabled;
          }

          return false;
        }
      );
    }, [
      upiEnabled,
      bankEnabled,
    ]);


  // =======================================================
  // LOAD PAYMENT SETTINGS
  // =======================================================

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        setLoadingSettings(true);
        setError("");

        const response =
          await getPaymentSettings();

        if (!mounted) return;

        if (
          response?.success &&
          response?.data
        ) {
          setSettings(
            response.data
          );
        } else {
          setError(
            response?.message ||
              "Payment settings are currently unavailable."
          );
        }
      } catch (err) {
        if (!mounted) return;

        setError(
          err.response?.data?.message ||
            "Unable to load payment settings."
        );
      } finally {
        if (mounted) {
          setLoadingSettings(false);
        }
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);


  // =======================================================
  // AUTO SELECT PAYMENT METHOD
  // =======================================================

  useEffect(() => {
    if (
      availablePaymentMethods.length === 1
    ) {
      setPaymentMethod(
        availablePaymentMethods[0].value
      );

      return;
    }

    if (
      paymentMethod &&
      !availablePaymentMethods.some(
        (method) =>
          method.value === paymentMethod
      )
    ) {
      setPaymentMethod("");
    }
  }, [
    availablePaymentMethods,
    paymentMethod,
  ]);


  // =======================================================
  // VALIDATION
  // =======================================================

  const validateForm = () => {
    if (!serviceType) {
      return "Service type is required.";
    }

    if (!serviceId) {
      return "Service ID is required.";
    }

    if (
      !Number.isFinite(
        numericAmount
      ) ||
      numericAmount <= 0
    ) {
      return "Invalid payment amount.";
    }

    if (!paymentMethod) {
      return "Please select a payment method.";
    }

    if (
      !availablePaymentMethods.some(
        (method) =>
          method.value === paymentMethod
      )
    ) {
      return "Selected payment method is currently unavailable.";
    }

    if (!paymentDate) {
      return "Payment date is required.";
    }

    const parsedDate =
      new Date(paymentDate);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Invalid payment date.";
    }

    return "";
  };


  // =======================================================
  // SUBMIT
  // =======================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(
        validationError
      );

      return;
    }

    try {
      setSubmitting(true);

      const paymentData = {
        serviceType,

        serviceId,

        amount:
          numericAmount,

        currency:
          String(currency)
            .trim()
            .toUpperCase(),

        paymentMethod,

        paymentDate,

        notes:
          notes.trim() || undefined,
      };


      const response =
        await createPayment(
          paymentData
        );


      if (
        !response?.success ||
        !response?.data
      ) {
        throw new Error(
          response?.message ||
            "Payment could not be created."
        );
      }


      setCreatedPayment(
        response.data
      );

      setSuccess(
        response.message ||
          "Payment record created successfully."
      );


      if (
        typeof onPaymentCreated ===
        "function"
      ) {
        onPaymentCreated(
          response.data
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to create payment."
      );
    } finally {
      setSubmitting(false);
    }
  };


  // =======================================================
  // SUCCESS VIEW
  // =======================================================

  if (createdPayment) {
    return (
      <section className="w-full rounded-xl border border-green-200 bg-white shadow-sm">

        {/* HEADER */}

        <div className="border-b border-green-200 bg-green-50 px-5 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">

              <span className="text-lg font-bold">
                ✓
              </span>

            </div>

            <div>
              <h2 className="text-lg font-semibold text-green-800">
                Payment Record Created
              </h2>

              <p className="mt-1 text-sm text-green-700">
                Your payment details have been recorded successfully.
              </p>
            </div>

          </div>

        </div>


        {/* PAYMENT SUMMARY */}

        <div className="space-y-4 p-5">

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">

            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Payment Details
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">

              <div>
                <p className="text-xs font-medium text-gray-500">
                  Payment Number
                </p>

                <p className="mt-1 break-all font-semibold text-gray-900">
                  {createdPayment.paymentNumber ||
                    "Not available"}
                </p>
              </div>


              <div>
                <p className="text-xs font-medium text-gray-500">
                  Amount
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {formatAmount(
                    createdPayment.amount
                  )}
                </p>
              </div>


              <div>
                <p className="text-xs font-medium text-gray-500">
                  Payment Method
                </p>

                <p className="mt-1 capitalize text-gray-900">
                  {createdPayment.paymentMethod ===
                  "bank_transfer"
                    ? "Bank Transfer"
                    : "UPI"}
                </p>
              </div>


              <div>
                <p className="text-xs font-medium text-gray-500">
                  Status
                </p>

                <span className="mt-1 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                  {createdPayment.status ||
                    "pending"}
                </span>
              </div>

            </div>

          </div>


          {/* NEXT STEP */}

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">

            <h3 className="font-semibold text-blue-900">
              Next Step
            </h3>

            <p className="mt-1 text-sm leading-6 text-blue-800">
              Please submit your payment proof for this payment so that the ServDial admin team can verify the transaction.
            </p>

          </div>


          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Close
            </button>
          )}

        </div>

      </section>
    );
  }


  // =======================================================
  // LOADING
  // =======================================================

  if (loadingSettings) {
    return (
      <section className="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

        <div className="animate-pulse space-y-4">

          <div className="h-6 w-56 rounded bg-gray-200" />

          <div className="h-20 rounded-lg bg-gray-100" />

          <div className="h-20 rounded-lg bg-gray-100" />

          <div className="h-10 rounded-lg bg-gray-200" />

        </div>

      </section>
    );
  }


  // =======================================================
  // RENDER
  // =======================================================

  return (
    <section className="w-full rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="border-b border-gray-200 px-5 py-5">

        <h2 className="text-xl font-semibold text-gray-900">
          Create Payment
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Complete the payment details below.
        </p>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mx-5 mt-5 rounded-lg border border-red-200 bg-red-50 p-4">

          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

        </div>
      )}


      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {success && (
        <div className="mx-5 mt-5 rounded-lg border border-green-200 bg-green-50 p-4">

          <p className="text-sm font-medium text-green-700">
            {success}
          </p>

        </div>
      )}


      {/* =================================================
          FORM
      ================================================= */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-5"
      >

        {/* ===============================================
            SERVICE SUMMARY
        =============================================== */}

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">

          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            Service
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <p className="text-xs font-medium text-gray-500">
                Service
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {displayServiceName}
              </p>
            </div>


            <div>
              <p className="text-xs font-medium text-gray-500">
                Service Type
              </p>

              <p className="mt-1 capitalize text-gray-900">
                {serviceType
                  ?.replaceAll(
                    "_",
                    " "
                  ) ||
                  "—"}
              </p>
            </div>


            <div>
              <p className="text-xs font-medium text-gray-500">
                Amount
              </p>

              <p className="mt-1 text-lg font-bold text-gray-900">
                {formatAmount(
                  numericAmount
                )}
              </p>
            </div>


            <div>
              <p className="text-xs font-medium text-gray-500">
                Currency
              </p>

              <p className="mt-1 text-gray-900">
                {String(currency)
                  .trim()
                  .toUpperCase()}
              </p>
            </div>

          </div>

        </div>


        {/* ===============================================
            PAYMENT INSTRUCTIONS
        =============================================== */}

        <PaymentInstructions />


        {/* ===============================================
            PAYMENT METHOD
        =============================================== */}

        <div>

          <label className="mb-2 block text-sm font-medium text-gray-900">
            Payment Method
            <span className="ml-1 text-red-500">
              *
            </span>
          </label>


          {availablePaymentMethods.length === 0 ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">

              <p className="text-sm text-red-700">
                No payment method is currently available.
              </p>

            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">

              {availablePaymentMethods.map(
                (method) => (
                  <label
                    key={method.value}
                    className={`cursor-pointer rounded-lg border p-4 transition ${
                      paymentMethod ===
                      method.value
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >

                    <div className="flex items-start gap-3">

                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={
                          paymentMethod ===
                          method.value
                        }
                        onChange={(event) =>
                          setPaymentMethod(
                            event.target.value
                          )
                        }
                        className="mt-1"
                      />

                      <div>

                        <p className="font-medium text-gray-900">
                          {method.label}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {method.value ===
                          "upi"
                            ? "Pay using the configured UPI account."
                            : "Pay using the configured bank account."}
                        </p>

                      </div>

                    </div>

                  </label>
                )
              )}

            </div>
          )}

        </div>


       
        {/* ===============================================
            PAYMENT DATE
        =============================================== */}

        <div>

          <label
            htmlFor="paymentDate"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Payment Date
            <span className="ml-1 text-red-500">
              *
            </span>
          </label>

          <input
            id="paymentDate"
            type="date"
            value={paymentDate}
            max={getTodayDate()}
            onChange={(event) =>
              setPaymentDate(
                event.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 sm:max-w-xs"
          />

        </div>


        {/* ===============================================
            NOTES
        =============================================== */}

        <div>

          <label
            htmlFor="paymentNotes"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Notes
            <span className="ml-2 text-xs font-normal text-gray-400">
              Optional
            </span>
          </label>

          <textarea
            id="paymentNotes"
            value={notes}
            onChange={(event) =>
              setNotes(
                event.target.value
              )
            }
            rows={4}
            maxLength={1000}
            placeholder="Add any payment-related note..."
            className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />

        </div>


        {/* ===============================================
            IMPORTANT NOTICE
        =============================================== */}

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">

          <h3 className="text-sm font-semibold text-amber-900">
            Before submitting
          </h3>

          <ul className="mt-2 space-y-1.5 text-sm leading-5 text-amber-800">

            <li>
              • Make sure the amount paid matches the service price.
            </li>

            <li>
            • After making the payment, submit the correct transaction ID / UTR with your payment proof.
            </li>

            <li>
              • Payment verification is done by the ServDial admin team.
            </li>

            <li>
              • Creating a payment does not automatically approve the associated service.
            </li>

          </ul>

        </div>


        {/* ===============================================
            ACTIONS
        =============================================== */}

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          )}


          <button
            type="submit"
            disabled={
              submitting ||
              availablePaymentMethods.length ===
                0
            }
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {submitting
              ? "Creating Payment..."
              : "Create Payment"}

          </button>

        </div>

      </form>

    </section>
  );
};


export default CreatePayment;