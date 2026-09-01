// frontend/src/pages/provider/ProviderBannerPayment.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API from "../../api/axios";
import {
  getPaymentSettings,
  createPayment,
  submitPaymentProof,
} from "../../api/paymentAPI";

import { uploadImage } from "../../services/CloudinaryService";

import Loader from "../../components/common/Loader";

// =========================================================
// HELPERS
// =========================================================

const formatCurrency = (amount) => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "₹0";
  }

  return `₹${numericAmount.toLocaleString("en-IN")}`;
};

const getBannerIdFromParams = (params = {}) => {
  return (
    params.bannerId ||
    params.id ||
    ""
  );
};

const getCurrentDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// =========================================================
// COMPONENT
// =========================================================

const ProviderBannerPayment = () => {
  const { bannerId: routeBannerId, id: routeId } =
    useParams();

  const navigate = useNavigate();

  const bannerId =
    getBannerIdFromParams({
      bannerId: routeBannerId,
      id: routeId,
    });

  // =======================================================
  // STATE
  // =======================================================

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [uploadingProof, setUploadingProof] =
    useState(false);

  const [banner, setBanner] =
    useState(null);

  const [paymentSettings, setPaymentSettings] =
    useState(null);

  const [paymentMethod, setPaymentMethod] =
    useState("");

  const [transactionId, setTransactionId] =
    useState("");

  const [paymentDate, setPaymentDate] =
  useState(getCurrentDate());

  const [notes, setNotes] =
    useState("");

  const [proofImage, setProofImage] =
    useState("");

  const [proofPublicId, setProofPublicId] =
    useState("");

  const [proofPreview, setProofPreview] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =======================================================
  // FETCH BANNER + PAYMENT SETTINGS
  // =======================================================

  useEffect(() => {
    const initializePayment = async () => {
      if (!bannerId) {
        setError(
          "Banner ID is missing"
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // -------------------------------------------------
        // Fetch provider banners
        // -------------------------------------------------

        const bannerResponse =
          await API.get(
            "/provider/banners"
          );

        const rawBanners =
          bannerResponse?.data?.data ||
          [];

        const selectedBanner =
          rawBanners.find(
            (item) =>
              String(item?._id) ===
              String(bannerId)
          );

        if (!selectedBanner) {
          throw new Error(
            "Banner not found or you are not authorized to access this banner"
          );
        }

        setBanner(
          selectedBanner
        );

        // -------------------------------------------------
        // Banner status checks
        // -------------------------------------------------

        if (
          selectedBanner.paymentStatus ===
          "paid"
        ) {
          setSuccess(
            "Payment for this banner has already been completed."
          );
        }

        // -------------------------------------------------
        // Payment settings
        // -------------------------------------------------

        const settingsResponse =
          await getPaymentSettings();

        const settings =
          settingsResponse?.data ||
          settingsResponse ||
          null;

        setPaymentSettings(
          settings
        );

        // -------------------------------------------------
        // Select first available payment method
        // -------------------------------------------------

        const upiAvailable =
          Boolean(
            settings?.upi?.enabled &&
              settings?.upi?.upiId
          );

        const bankAvailable =
          Boolean(
            settings?.bank?.enabled &&
              settings?.bank?.accountNumber &&
              settings?.bank?.ifsc &&
              settings?.bank?.bankName
          );

        if (upiAvailable) {
          setPaymentMethod(
            "upi"
          );
        } else if (
          bankAvailable
        ) {
          setPaymentMethod(
            "bank_transfer"
          );
        } else {
          setError(
            "No payment method is currently available."
          );
        }
      } catch (err) {
        console.error(
          "Provider Banner Payment Init Error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load banner payment details"
        );
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [bannerId]);

  // =======================================================
  // PAYMENT METHOD AVAILABILITY
  // =======================================================

  const isUpiAvailable =
    Boolean(
      paymentSettings?.upi?.enabled &&
        paymentSettings?.upi?.upiId
    );

  const isBankAvailable =
    Boolean(
      paymentSettings?.bank?.enabled &&
        paymentSettings?.bank?.accountNumber &&
        paymentSettings?.bank?.ifsc &&
        paymentSettings?.bank?.bankName
    );

  // =======================================================
  // PROOF UPLOAD
  // =======================================================

  const handleProofUpload = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");

    // -----------------------------------------------------
    // Basic validation
    // -----------------------------------------------------

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setError(
        "Please select a valid image file."
      );

      event.target.value = "";
      return;
    }

    // 5 MB frontend safety check
    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Payment proof image must be 5 MB or smaller."
      );

      event.target.value = "";
      return;
    }

    try {
      setUploadingProof(true);

      const uploadResponse =
        await uploadImage(file);

      const secureUrl =
        uploadResponse?.secure_url ||
        uploadResponse?.url ||
        "";

      const publicId =
        uploadResponse?.public_id ||
        uploadResponse?.publicId ||
        "";

      if (!secureUrl) {
        throw new Error(
          "Cloudinary did not return an image URL"
        );
      }

      setProofImage(
        secureUrl
      );

      setProofPublicId(
        publicId
      );

      setProofPreview(
        secureUrl
      );

      setSuccess(
        "Payment proof uploaded successfully."
      );
    } catch (err) {
      console.error(
        "Payment Proof Upload Error:",
        err
      );

      setProofImage("");
      setProofPublicId("");
      setProofPreview("");

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to upload payment proof"
      );
    } finally {
      setUploadingProof(false);

      event.target.value = "";
    }
  };

  // =======================================================
  // SUBMIT PAYMENT
  // =======================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // -----------------------------------------------------
    // Banner validation
    // -----------------------------------------------------

    if (!banner?._id) {
      setError(
        "Banner information is unavailable."
      );
      return;
    }

    if (
      banner.paymentStatus ===
      "paid"
    ) {
      setError(
        "Payment for this banner has already been completed."
      );
      return;
    }

    // -----------------------------------------------------
    // Amount validation
    // -----------------------------------------------------

    const amount =
      Number(
        banner?.price
      );

    if (
      !Number.isFinite(
        amount
      ) ||
      amount <= 0
    ) {
      setError(
        "Invalid banner payment amount."
      );
      return;
    }

    // -----------------------------------------------------
    // Payment method
    // -----------------------------------------------------

    if (
      ![
        "upi",
        "bank_transfer",
      ].includes(
        paymentMethod
      )
    ) {
      setError(
        "Please select a valid payment method."
      );
      return;
    }

    // -----------------------------------------------------
    // Transaction ID
    // -----------------------------------------------------

    if (
      !transactionId.trim()
    ) {
      setError(
        "Transaction ID / UTR is required."
      );
      return;
    }

    // -----------------------------------------------------
    // Payment proof
    // -----------------------------------------------------

    if (!proofImage) {
      setError(
        "Please upload your payment proof."
      );
      return;
    }

    setSubmitting(true);

    try {
      // ===================================================
      // STEP 1 — CREATE PAYMENT
      // ===================================================

      const paymentPayload = {
        serviceType:
          "banner",

        serviceId:
          banner._id,

        // Backend validates this against Banner.price.
        amount,

        currency:
          "INR",

        paymentMethod,

        transactionId:
          transactionId.trim(),

        paymentDate:
          paymentDate ||
          undefined,

        notes:
          notes.trim() ||
          undefined,
      };

      const paymentResponse =
        await createPayment(
          paymentPayload
        );

      const payment =
        paymentResponse?.data ||
        null;

      const paymentId =
        payment?._id;

      if (!paymentId) {
        throw new Error(
          "Payment record was created but payment ID was not returned."
        );
      }

      // ===================================================
      // STEP 2 — SUBMIT PAYMENT PROOF
      // ===================================================

      const proofResponse =
        await submitPaymentProof(
          paymentId,
          {
            proofImage:
              proofImage.trim(),

            proofPublicId:
              proofPublicId?.trim() ||
              "",
          }
        );

      // ===================================================
      // SUCCESS
      // ===================================================

      setSuccess(
        proofResponse?.message ||
          "Payment submitted successfully. Your payment is now under verification."
      );

      // Payment is submitted for admin verification.
      // Banner itself is NOT automatically approved.
      //
      // This follows the backend architecture:
      //
      // Payment verification
      // +
      // Banner moderation
      // are separate processes.

      setTimeout(() => {
        navigate(
          "/provider/banners"
        );
      }, 1800);
    } catch (err) {
      console.error(
        "Provider Banner Payment Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to submit banner payment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // =======================================================
  // ERROR WITHOUT BANNER
  // =======================================================

  if (
    !banner &&
    error
  ) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">
            Banner Payment
          </h1>

          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error}
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/provider/banners"
              )
            }
            className="mt-5 px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800"
          >
            Back to My Banners
          </button>
        </div>
      </div>
    );
  }

  // =======================================================
  // MAIN UI
  // =======================================================

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="grid gap-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Complete Banner Payment
          </h1>

          <p className="mt-1 text-gray-600">
            Make the payment using the selected
            payment method and submit your
            transaction details with proof.
          </p>
        </div>

        {/* =================================================
            GLOBAL ERROR
        ================================================= */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* =================================================
            GLOBAL SUCCESS
        ================================================= */}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">
            {success}
          </div>
        )}

        {/* =================================================
            BANNER SUMMARY
        ================================================= */}

        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Banner Details
            </h2>
          </div>

          <div className="p-5 grid md:grid-cols-[180px_1fr] gap-5">

            {/* IMAGE */}

            <div>
              {banner?.image ? (
                <img
                  src={banner.image}
                  alt={
                    banner.title ||
                    "Banner"
                  }
                  className="w-full h-32 md:h-40 object-cover rounded-xl border"
                />
              ) : (
                <div className="h-32 md:h-40 rounded-xl border bg-gray-100 flex items-center justify-center text-gray-500">
                  No image
                </div>
              )}
            </div>

            {/* DETAILS */}

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">
                  Banner Title
                </p>

                <p className="font-semibold text-gray-900">
                  {banner?.title ||
                    "Untitled Banner"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Placement
                </p>

                <p className="font-medium text-gray-800">
                  {String(
                    banner?.placement ||
                      ""
                  )
                    .replace(
                      /_/g,
                      " "
                    )
                    .replace(
                      /\b\w/g,
                      (char) =>
                        char.toUpperCase()
                    )}
                </p>
              </div>

              <div>
  <p className="text-sm text-gray-500">
    Banner Duration
  </p>

  <p className="font-semibold text-gray-900">
    {Number(banner?.durationMonths) === 12
      ? "1 Year"
      : `${banner?.durationMonths || 1} ${
          Number(banner?.durationMonths) === 1
            ? "Month"
            : "Months"
        }`}
  </p>
</div>

<div>
  <p className="text-sm text-gray-500">
    Pricing
  </p>

  <div className="mt-1 space-y-1">
    <p className="text-sm text-gray-500">
      Base Price:{" "}
      <span className="font-medium text-gray-800">
        {formatCurrency(
          banner?.basePrice
        )}
        /month
      </span>
    </p>

    <p className="text-sm text-gray-500">
      Duration:{" "}
      <span className="font-medium text-gray-800">
        {Number(banner?.durationMonths) === 12
          ? "12 Months"
          : `${banner?.durationMonths || 1} ${
              Number(banner?.durationMonths) === 1
                ? "Month"
                : "Months"
            }`}
      </span>
    </p>

    {Number(banner?.discountPercent) > 0 && (
      <p className="text-sm text-green-600 font-medium">
        Save {banner?.discountPercent}%
      </p>
    )}

    <p className="pt-1">
      <span className="text-sm text-gray-500">
        Amount Payable
      </span>

      <span className="block text-2xl font-bold text-blue-600">
        {formatCurrency(
          banner?.price
        )}
      </span>
    </p>
  </div>
</div>

              <div>
                <p className="text-sm text-gray-500">
                  Banner Status
                </p>

                <span
                  className={`inline-flex mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                    banner?.paymentStatus ===
                    "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {banner?.paymentStatus ===
                  "paid"
                    ? "Paid"
                    : "Payment Pending"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            PAYMENT DESTINATION
        ================================================= */}

        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Make Payment
            </h2>

            <p className="text-sm text-gray-500 mt-1">
  Complete the payment of{" "}
  <strong>
    {formatCurrency(
      banner?.price
    )}
  </strong>{" "}
  for{" "}
  <strong>
    {Number(banner?.durationMonths) === 12
      ? "1 Year"
      : `${banner?.durationMonths || 1} ${
          Number(banner?.durationMonths) === 1
            ? "Month"
            : "Months"
        }`}
  </strong>.
</p>

{Number(banner?.discountPercent) > 0 && (
  <p className="text-sm text-green-600 font-medium mt-2">
    You are saving{" "}
    {banner?.discountPercent}% on this
    duration.
  </p>
)}
          </div>

          <div className="p-5 space-y-5">

            {/* PAYMENT METHOD */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>

              <div className="grid md:grid-cols-2 gap-3">

                {/* UPI */}

                {isUpiAvailable && (
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod(
                        "upi"
                      )
                    }
                    className={`text-left border rounded-xl p-4 transition ${
                      paymentMethod ===
                      "upi"
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900">
                      UPI
                    </div>

                    <div className="text-sm text-gray-500 mt-1">
                      Pay using UPI
                    </div>
                  </button>
                )}

                {/* BANK */}

                {isBankAvailable && (
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod(
                        "bank_transfer"
                      )
                    }
                    className={`text-left border rounded-xl p-4 transition ${
                      paymentMethod ===
                      "bank_transfer"
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900">
                      Bank Transfer
                    </div>

                    <div className="text-sm text-gray-500 mt-1">
                      Pay directly to bank account
                    </div>
                  </button>
                )}

              </div>
            </div>

            {/* =================================================
                UPI DETAILS
            ================================================= */}

            {paymentMethod ===
              "upi" &&
              isUpiAvailable && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                  <h3 className="font-semibold text-gray-900">
                    UPI Payment Details
                  </h3>

                  <div className="mt-4 grid sm:grid-cols-2 gap-4">

                    <div>
                      <p className="text-sm text-gray-500">
                        UPI ID
                      </p>

                      <p className="font-semibold text-gray-900 break-all">
                        {
                          paymentSettings
                            ?.upi
                            ?.upiId
                        }
                      </p>
                    </div>

                    {paymentSettings
                      ?.upi
                      ?.accountName && (
                      <div>
                        <p className="text-sm text-gray-500">
                          Account Name
                        </p>

                        <p className="font-semibold text-gray-900">
                          {
                            paymentSettings
                              ?.upi
                              ?.accountName
                          }
                        </p>
                      </div>
                    )}

                  </div>

                  <p className="mt-4 text-sm text-blue-800">
                    Please transfer the exact
                    amount shown above and keep
                    your transaction ID / UTR.
                  </p>
                </div>
              )}

            {/* =================================================
                BANK DETAILS
            ================================================= */}

            {paymentMethod ===
              "bank_transfer" &&
              isBankAvailable && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                  <h3 className="font-semibold text-gray-900">
                    Bank Transfer Details
                  </h3>

                  <div className="mt-4 grid sm:grid-cols-2 gap-4">

                    <div>
                      <p className="text-sm text-gray-500">
                        Account Name
                      </p>

                      <p className="font-semibold text-gray-900">
                        {
                          paymentSettings
                            ?.bank
                            ?.accountName
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Bank Name
                      </p>

                      <p className="font-semibold text-gray-900">
                        {
                          paymentSettings
                            ?.bank
                            ?.bankName
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Account Number
                      </p>

                      <p className="font-semibold text-gray-900 break-all">
                        {
                          paymentSettings
                            ?.bank
                            ?.accountNumber
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        IFSC
                      </p>

                      <p className="font-semibold text-gray-900">
                        {
                          paymentSettings
                            ?.bank
                            ?.ifsc
                        }
                      </p>
                    </div>

                  </div>

                  <p className="mt-4 text-sm text-blue-800">
                    Please transfer the exact
                    amount shown above and keep
                    your transaction ID / UTR.
                  </p>
                </div>
              )}

          </div>
        </div>

        {/* =================================================
            TRANSACTION + PROOF FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="p-5 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Payment Confirmation
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Enter the transaction details after
              completing your payment.
            </p>
          </div>

          <div className="p-5 space-y-5">

            {/* TRANSACTION ID */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction ID / UTR *
              </label>

              <input
                type="text"
                value={transactionId}
                onChange={(event) =>
                  setTransactionId(
                    event.target.value
                  )
                }
                placeholder="Enter transaction ID / UTR"
                autoComplete="off"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

              <p className="text-xs text-gray-500 mt-1">
                Enter the exact transaction reference
                generated by your bank or UPI app.
              </p>
            </div>

            {/* PAYMENT DATE */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date (MM/DD/YYYY)
              </label>

              <input
                type="date"
                value={paymentDate}
                readOnly
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none bg-gray-100 cursor-not-allowed"
                />
            </div>

            {/* NOTES */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>

              <textarea
                value={notes}
                onChange={(event) =>
                  setNotes(
                    event.target.value
                  )
                }
                rows={3}
                placeholder="Optional payment note"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* PROOF */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Proof *
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleProofUpload
                }
                disabled={
                  uploadingProof ||
                  submitting
                }
                className="block w-full text-sm border border-gray-300 rounded-xl px-4 py-3"
              />

              <p className="text-xs text-gray-500 mt-1">
                Upload a clear screenshot/photo of
                your successful payment.
              </p>
            </div>

            {/* PROOF PREVIEW */}

            {proofPreview && (
              <div className="border rounded-xl p-4 bg-gray-50">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Payment Proof Preview
                </p>

                <img
                  src={proofPreview}
                  alt="Payment proof"
                  className="max-h-80 max-w-full rounded-xl border object-contain bg-white"
                />
              </div>
            )}

            {/* SUBMIT */}

            <div className="pt-2">

              <button
                type="submit"
                disabled={
                  submitting ||
                  uploadingProof ||
                  !banner?._id ||
                  banner?.paymentStatus ===
                    "paid"
                }
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition"
              >
                {uploadingProof
                  ? "Uploading Proof..."
                  : submitting
                  ? "Submitting Payment..."
                  : "Submit Payment"}
              </button>

            </div>

          </div>
        </form>

        {/* =================================================
            INFORMATION
        ================================================= */}

        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
          <h3 className="font-semibold text-yellow-900">
            Important
          </h3>

          <ul className="mt-2 text-sm text-yellow-800 space-y-1 list-disc pl-5">
            <li>
              Make the payment for the exact
              amount shown above.
            </li>

            <li>
              Enter the transaction ID / UTR
              exactly as generated by your payment
              provider.
            </li>

            <li>
              Upload a clear payment proof.
            </li>

            <li>
              Payment submission does not
              automatically approve or publish the
              banner.
            </li>

            <li>
              Your payment will be reviewed by
              ServDial admin.
            </li>

            <li>
  Banner duration terms: 1 Month = 30 days,
  3 Months = 90 days, 6 Months = 180 days,
  and 1 Year = 360 days.
</li>

<li>
  The banner live period starts from the
  date of admin approval.
</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default ProviderBannerPayment;