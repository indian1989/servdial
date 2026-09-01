import { useEffect, useState } from "react";
import axios from "../../api/axios.js";


// =========================================================
// PAYMENT INSTRUCTIONS
// =========================================================
//
// Shows currently active payment settings.
//
// Used by:
// - User
// - Provider
//
// Backend:
// GET /api/payment-settings/active
//
// =========================================================

const PaymentInstructions = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =======================================================
  // FETCH ACTIVE PAYMENT SETTINGS
  // =======================================================

  useEffect(() => {
    let mounted = true;

    const fetchPaymentSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "/payment-settings/active"
        );

        if (!mounted) return;

        if (response.data?.success) {
          setSettings(response.data.data);
        } else {
          setError(
            response.data?.message ||
              "Payment settings are unavailable"
          );
        }
      } catch (err) {
        if (!mounted) return;

        setError(
          err.response?.data?.message ||
            "Payment settings are currently unavailable"
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchPaymentSettings();

    return () => {
      mounted = false;
    };
  }, []);

  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <div className="w-full rounded-xl border border-gray-200 bg-white p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-48 rounded bg-gray-200" />
          <div className="h-20 rounded-lg bg-gray-100" />
          <div className="h-20 rounded-lg bg-gray-100" />
        </div>
      </div>
    );
  }

  // =======================================================
  // ERROR / UNAVAILABLE
  // =======================================================

  if (error || !settings) {
    return (
      <div className="w-full rounded-xl border border-red-200 bg-red-50 p-5">
        <h3 className="text-base font-semibold text-red-700">
          Payment Instructions
        </h3>

        <p className="mt-2 text-sm text-red-600">
          {error ||
            "Payment settings are currently unavailable."}
        </p>
      </div>
    );
  }

  const upiEnabled = Boolean(
    settings.upi?.enabled
  );

  const bankEnabled = Boolean(
    settings.bank?.enabled
  );

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <section className="w-full rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Payment Instructions
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Use one of the available payment methods below.
        </p>
      </div>


      {/* =================================================
          PAYMENT METHODS
      ================================================= */}

      <div className="space-y-4 p-5">

        {/* ===============================================
            UPI
        =============================================== */}

        {upiEnabled && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">

            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                UPI Payment
              </h3>

              <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                Available
              </span>
            </div>

            <div className="space-y-2 text-sm">

              {settings.upi?.upiId && (
                <div className="flex flex-wrap gap-2">
                  <span className="font-medium text-gray-600">
                    UPI ID:
                  </span>

                  <span className="font-semibold text-gray-900 break-all">
                    {settings.upi.upiId}
                  </span>
                </div>
              )}

              {settings.upi?.accountName && (
                <div className="flex flex-wrap gap-2">
                  <span className="font-medium text-gray-600">
                    Account Name:
                  </span>

                  <span className="text-gray-900">
                    {settings.upi.accountName}
                  </span>
                </div>
              )}

            </div>
          </div>
        )}


        {/* ===============================================
            BANK TRANSFER
        =============================================== */}

        {bankEnabled && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">

            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                Bank Transfer
              </h3>

              <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                Available
              </span>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-2">

              {settings.bank?.accountName && (
                <div>
                  <p className="font-medium text-gray-500">
                    Account Name
                  </p>

                  <p className="mt-1 text-gray-900">
                    {settings.bank.accountName}
                  </p>
                </div>
              )}

              {settings.bank?.accountNumber && (
                <div>
                  <p className="font-medium text-gray-500">
                    Account Number
                  </p>

                  <p className="mt-1 break-all text-gray-900">
                    {settings.bank.accountNumber}
                  </p>
                </div>
              )}

              {settings.bank?.ifsc && (
                <div>
                  <p className="font-medium text-gray-500">
                    IFSC
                  </p>

                  <p className="mt-1 font-medium text-gray-900">
                    {settings.bank.ifsc}
                  </p>
                </div>
              )}

              {settings.bank?.bankName && (
                <div>
                  <p className="font-medium text-gray-500">
                    Bank Name
                  </p>

                  <p className="mt-1 text-gray-900">
                    {settings.bank.bankName}
                  </p>
                </div>
              )}

              {settings.bank?.branchName && (
                <div>
                  <p className="font-medium text-gray-500">
                    Branch
                  </p>

                  <p className="mt-1 text-gray-900">
                    {settings.bank.branchName}
                  </p>
                </div>
              )}

            </div>
          </div>
        )}


        {/* ===============================================
            INSTRUCTIONS
        =============================================== */}

        {settings.instructions && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">

            <h3 className="font-semibold text-gray-900">
              How to Pay
            </h3>

            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
              {settings.instructions}
            </p>

          </div>
        )}


        {/* ===============================================
            RECEIPT REQUIREMENT
        =============================================== */}

        <div className="rounded-lg border border-gray-200 p-4">

          <div className="flex items-start gap-3">

            <div
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                settings.receiptRequired
                  ? "bg-amber-100 text-amber-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              <span className="text-xs font-bold">
                {settings.receiptRequired
                  ? "!"
                  : "✓"}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Payment Proof
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                {settings.receiptRequired
                  ? "Please keep your payment receipt/proof ready. It may be required when submitting your payment."
                  : "Payment proof is not required for this payment configuration."}
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default PaymentInstructions;