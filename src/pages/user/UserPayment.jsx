// frontend/src/pages/user/UserPayment.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API from "../../api/axios.js";

import {
  getPaymentSettings,
  createPayment,
  submitPaymentProof,
} from "../../api/paymentAPI.js";

import { uploadImage } from "../../services/CloudinaryService.js";

import Loader from "../../components/common/Loader.jsx";


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
  return params.bannerId || params.id || "";
};


const getCurrentDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


const getDurationLabel = (durationMonths) => {
  const months = Number(durationMonths);

  if (months === 12) {
    return "1 Year";
  }

  if (months === 1) {
    return "1 Month";
  }

  return `${months || 1} Months`;
};


const getDurationText = (durationMonths) => {
  const months = Number(durationMonths);

  if (months === 12) {
    return "12 Months";
  }

  if (months === 1) {
    return "1 Month";
  }

  return `${months || 1} Months`;
};


const formatPlacement = (placement) => {
  if (!placement) {
    return "Not specified";
  }

  return String(placement)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};


// =========================================================
// COMPONENT
// =========================================================

const UserPayment = () => {
  const { bannerId: routeBannerId, id: routeId } = useParams();

  const navigate = useNavigate();

  const bannerId = getBannerIdFromParams({
    bannerId: routeBannerId,
    id: routeId,
  });


  // =======================================================
  // STATE
  // =======================================================

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [uploadingProof, setUploadingProof] = useState(false);

  const [banner, setBanner] = useState(null);

  const [paymentSettings, setPaymentSettings] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("");

  const [transactionId, setTransactionId] = useState("");

  const [paymentDate, setPaymentDate] =
    useState(getCurrentDate());

  const [notes, setNotes] = useState("");

  const [proofImage, setProofImage] = useState("");

  const [proofPublicId, setProofPublicId] = useState("");

  const [proofPreview, setProofPreview] = useState("");

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [upiCopied, setUpiCopied] = useState(false);


  // =======================================================
  // COPY UPI ID
  // =======================================================

  const copyToClipboard = async (text) => {
    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);

      setUpiCopied(true);

      setTimeout(() => {
        setUpiCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy UPI ID Error:", err);

      setUpiCopied(false);

      setError(
        "Unable to copy UPI ID. Please copy it manually."
      );
    }
  };


  // =======================================================
  // FETCH BANNER + PAYMENT SETTINGS
  // =======================================================

  useEffect(() => {
    let mounted = true;

    const initializePayment = async () => {
      if (!bannerId) {
        setError("Banner ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setSuccess("");

        // ---------------------------------------------------
        // FETCH USER BANNERS
        // ---------------------------------------------------

        const bannerResponse = await API.get(
          "/user/banners"
        );

        if (!mounted) {
          return;
        }

        const rawBanners =
          bannerResponse?.data?.data || [];

        const selectedBanner = rawBanners.find(
          (item) =>
            String(item?._id) ===
            String(bannerId)
        );

        if (!selectedBanner) {
          throw new Error(
            "Banner not found or you are not authorized to access this banner."
          );
        }

        setBanner(selectedBanner);


        // ---------------------------------------------------
        // PAYMENT STATUS
        // ---------------------------------------------------

        if (
          selectedBanner.paymentStatus === "paid"
        ) {
          setSuccess(
            "Payment for this banner has already been completed."
          );
        }


        // ---------------------------------------------------
        // PAYMENT SETTINGS
        // ---------------------------------------------------

        const settingsResponse =
          await getPaymentSettings();

        if (!mounted) {
          return;
        }

        const settings =
          settingsResponse?.data ||
          settingsResponse ||
          null;

        setPaymentSettings(settings);


        // ---------------------------------------------------
        // AVAILABLE PAYMENT METHODS
        // ---------------------------------------------------

        const upiAvailable = Boolean(
          settings?.upi?.enabled &&
          settings?.upi?.upiId
        );

        const bankAvailable = Boolean(
          settings?.bank?.enabled &&
          settings?.bank?.accountNumber &&
          settings?.bank?.ifsc &&
          settings?.bank?.bankName
        );


        // ---------------------------------------------------
        // AUTO SELECT
        // ---------------------------------------------------

        if (upiAvailable) {
          setPaymentMethod("upi");
        } else if (bankAvailable) {
          setPaymentMethod("bank_transfer");
        } else {
          setError(
            "No payment method is currently available."
          );
        }
      } catch (err) {
        console.error(
          "User Banner Payment Init Error:",
          err
        );

        if (!mounted) {
          return;
        }

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load banner payment details."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializePayment();

    return () => {
      mounted = false;
    };
  }, [bannerId]);


  // =======================================================
  // PAYMENT METHOD AVAILABILITY
  // =======================================================

  const isUpiAvailable = Boolean(
    paymentSettings?.upi?.enabled &&
    paymentSettings?.upi?.upiId
  );


  const isBankAvailable = Boolean(
    paymentSettings?.bank?.enabled &&
    paymentSettings?.bank?.accountNumber &&
    paymentSettings?.bank?.ifsc &&
    paymentSettings?.bank?.bankName
  );


  // =======================================================
  // PAYMENT AMOUNT
  // =======================================================

  const amount = Number(banner?.price);


  // =======================================================
  // PAYMENT PROOF UPLOAD
  // =======================================================

  const handleProofUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");


    // -----------------------------------------------------
    // IMAGE VALIDATION
    // -----------------------------------------------------

    if (!file.type?.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );

      event.target.value = "";

      return;
    }


    // -----------------------------------------------------
    // MAXIMUM 5 MB
    // -----------------------------------------------------

    if (file.size > 5 * 1024 * 1024) {
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
          "Cloudinary did not return an image URL."
        );
      }


      setProofImage(secureUrl);

      setProofPublicId(publicId);

      setProofPreview(secureUrl);

      setSuccess(
        "Payment proof uploaded successfully."
      );
    } catch (err) {
      console.error(
        "User Payment Proof Upload Error:",
        err
      );

      setProofImage("");

      setProofPublicId("");

      setProofPreview("");

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to upload payment proof."
      );
    } finally {
      setUploadingProof(false);

      event.target.value = "";
    }
  };


  // =======================================================
  // SUBMIT PAYMENT
  // =======================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setError("");
    setSuccess("");


    // -----------------------------------------------------
    // BANNER
    // -----------------------------------------------------

    if (!banner?._id) {
      setError(
        "Banner information is unavailable."
      );

      return;
    }


    // -----------------------------------------------------
    // PAYMENT STATUS
    // -----------------------------------------------------

    if (
      banner.paymentStatus === "paid"
    ) {
      setError(
        "Payment for this banner has already been completed."
      );

      return;
    }


    // -----------------------------------------------------
    // AMOUNT
    // -----------------------------------------------------

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setError(
        "Invalid banner payment amount."
      );

      return;
    }


    // -----------------------------------------------------
    // PAYMENT METHOD
    // -----------------------------------------------------

    if (
      !["upi", "bank_transfer"].includes(
        paymentMethod
      )
    ) {
      setError(
        "Please select a valid payment method."
      );

      return;
    }


    if (
      paymentMethod === "upi" &&
      !isUpiAvailable
    ) {
      setError(
        "UPI payment is currently unavailable."
      );

      return;
    }


    if (
      paymentMethod === "bank_transfer" &&
      !isBankAvailable
    ) {
      setError(
        "Bank transfer is currently unavailable."
      );

      return;
    }


    // -----------------------------------------------------
    // TRANSACTION ID
    // -----------------------------------------------------

    if (!transactionId.trim()) {
      setError(
        "Transaction ID / UTR is required."
      );

      return;
    }


    // -----------------------------------------------------
    // PAYMENT PROOF
    // -----------------------------------------------------

    if (!proofImage.trim()) {
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
        serviceType: "banner",

        serviceId: banner._id,

        amount,

        currency: "INR",

        paymentMethod,

        paymentDate:
          paymentDate || undefined,

        notes:
          notes.trim() || undefined,
      };


      const paymentResponse =
        await createPayment(
          paymentPayload
        );


      if (
        !paymentResponse?.success ||
        !paymentResponse?.data
      ) {
        throw new Error(
          paymentResponse?.message ||
            "Payment record could not be created."
        );
      }


      const payment =
        paymentResponse.data;


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
              proofPublicId?.trim() || "",

            transactionId:
              transactionId.trim(),
          }
        );


      if (
        !proofResponse?.success
      ) {
        throw new Error(
          proofResponse?.message ||
            "Payment proof submission failed."
        );
      }


      // ===================================================
      // SUCCESS
      // ===================================================

      setSuccess(
        proofResponse?.message ||
          "Payment submitted successfully. Your payment is now under verification."
      );


      setTransactionId("");

      setNotes("");

      setProofImage("");

      setProofPublicId("");

      setProofPreview("");


      // ---------------------------------------------------
      // REDIRECT
      // ---------------------------------------------------

      setTimeout(() => {
        navigate("/user/payments");
      }, 1800);
    } catch (err) {
      console.error(
        "User Banner Payment Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to submit banner payment."
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

  if (!banner && error) {
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-6">

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <h1 className="text-xl font-semibold text-gray-900">
            Banner Payment
          </h1>


          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>


          <button
            type="button"
            onClick={() =>
              navigate("/user/banners")
            }
            className="mt-5 rounded-xl bg-gray-900 px-5 py-3 text-white transition hover:bg-gray-800"
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
            Make the payment using the selected payment method and submit your transaction details with proof.
          </p>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}


        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}


        {/* =================================================
            BANNER DETAILS
        ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 p-5">

            <h2 className="text-lg font-semibold text-gray-900">
              Banner Details
            </h2>

          </div>


          <div className="grid gap-5 p-5 md:grid-cols-[180px_1fr]">


            {/* IMAGE */}

            <div>

              {banner?.image ? (
                <img
                  src={banner.image}
                  alt={
                    banner?.title ||
                    "Banner"
                  }
                  className="h-32 w-full rounded-xl border object-cover md:h-40"
                />
              ) : (
                <div className="flex h-32 items-center justify-center rounded-xl border bg-gray-100 text-sm text-gray-500 md:h-40">
                  No image
                </div>
              )}

            </div>


            {/* DETAILS */}

            <div className="space-y-4">


              {/* TITLE */}

              <div>

                <p className="text-sm text-gray-500">
                  Banner Title
                </p>

                <p className="font-semibold text-gray-900">
                  {banner?.title ||
                    "Untitled Banner"}
                </p>

              </div>


              {/* PLACEMENT */}

              <div>

                <p className="text-sm text-gray-500">
                  Placement
                </p>

                <p className="font-medium text-gray-800">
                  {formatPlacement(
                    banner?.placement
                  )}
                </p>

              </div>


              {/* DURATION */}

              <div>

                <p className="text-sm text-gray-500">
                  Banner Duration
                </p>

                <p className="font-semibold text-gray-900">
                  {getDurationLabel(
                    banner?.durationMonths
                  )}
                </p>

              </div>


              {/* PRICING */}

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
                      {getDurationText(
                        banner?.durationMonths
                      )}
                    </span>
                  </p>


                  {Number(
                    banner?.discountPercent
                  ) > 0 && (
                    <p className="text-sm font-medium text-green-600">
                      Save{" "}
                      {banner.discountPercent}%
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


              {/* STATUS */}

              <div>

                <p className="text-sm text-gray-500">
                  Banner Status
                </p>


                <span
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
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
            MAKE PAYMENT
        ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 p-5">

            <h2 className="text-lg font-semibold text-gray-900">
              Make Payment
            </h2>


            <p className="mt-1 text-sm text-gray-500">

              Complete the payment of{" "}

              <strong>
                {formatCurrency(
                  banner?.price
                )}
              </strong>{" "}

              for{" "}

              <strong>
                {getDurationLabel(
                  banner?.durationMonths
                )}
              </strong>.

            </p>


            {Number(
              banner?.discountPercent
            ) > 0 && (
              <p className="mt-2 text-sm font-medium text-green-600">

                You are saving{" "}
                {banner.discountPercent}%
                {" "}on this duration.

              </p>
            )}

          </div>


          <div className="space-y-5 p-5">


            {/* PAYMENT METHOD */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Payment Method *
              </label>


              <div className="grid gap-3 md:grid-cols-2">


                {/* UPI */}

                {isUpiAvailable && (
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod("upi")
                    }
                    disabled={submitting}
                    className={`rounded-xl border p-4 text-left transition ${
                      paymentMethod === "upi"
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                        : "border-gray-200 hover:border-blue-300"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >

                    <div className="font-semibold text-gray-900">
                      UPI
                    </div>

                    <div className="mt-1 text-sm text-gray-500">
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
                    disabled={submitting}
                    className={`rounded-xl border p-4 text-left transition ${
                      paymentMethod ===
                      "bank_transfer"
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                        : "border-gray-200 hover:border-blue-300"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >

                    <div className="font-semibold text-gray-900">
                      Bank Transfer
                    </div>

                    <div className="mt-1 text-sm text-gray-500">
                      Pay directly to bank account
                    </div>

                  </button>
                )}

              </div>


              {!isUpiAvailable &&
                !isBankAvailable && (
                  <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    No payment method is currently available.
                  </div>
                )}

            </div>


            {/* =================================================
                UPI DETAILS
            ================================================= */}

            {paymentMethod === "upi" &&
              isUpiAvailable && (

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">

                  <h3 className="font-semibold text-gray-900">
                    UPI Payment Details
                  </h3>


                  <div className="mt-4 grid gap-6 md:grid-cols-[180px_1fr]">


                    {/* QR */}

                    <div className="flex flex-col items-center">

                      {paymentSettings?.upi?.qrCode ? (
                        <>
                          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">

                            <img
                              src={
                                paymentSettings
                                  .upi
                                  .qrCode
                              }
                              alt="UPI QR Code"
                              className="h-40 w-40 object-contain"
                            />

                          </div>

                          <p className="mt-2 text-center text-xs text-gray-500">
                            Scan this QR code using your UPI app
                          </p>
                        </>
                      ) : (
                        <div className="flex h-40 w-40 items-center justify-center rounded-xl border border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
                          QR code not available
                        </div>
                      )}

                    </div>


                    {/* UPI INFORMATION */}

                    <div className="space-y-4">


                      {/* UPI ID */}

                      <div>

                        <p className="mb-1 text-sm text-gray-500">
                          UPI ID
                        </p>


                        <div className="flex items-center gap-2">

                          <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3">

                            <p className="break-all font-semibold text-gray-900">
                              {
                                paymentSettings
                                  ?.upi
                                  ?.upiId
                              }
                            </p>

                          </div>


                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(
                                paymentSettings
                                  ?.upi
                                  ?.upiId
                              )
                            }
                            className={`shrink-0 rounded-xl px-4 py-3 font-medium transition ${
                              upiCopied
                                ? "bg-green-600 text-white"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            {upiCopied
                              ? "Copied!"
                              : "Copy"}
                          </button>

                        </div>


                        {upiCopied && (
                          <div className="mt-2 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700">

                            <span>
                              ✓
                            </span>

                            <span>
                              UPI ID copied successfully.
                            </span>

                          </div>
                        )}

                      </div>


                      {/* ACCOUNT NAME */}

                      {paymentSettings?.upi?.accountName && (
                        <div>

                          <p className="text-sm text-gray-500">
                            Account Name
                          </p>

                          <p className="mt-1 font-semibold text-gray-900">
                            {
                              paymentSettings
                                .upi
                                .accountName
                            }
                          </p>

                        </div>
                      )}


                      {/* AMOUNT */}

                      <div className="rounded-xl border border-blue-100 bg-white p-4">

                        <p className="text-sm text-gray-500">
                          Amount to Pay
                        </p>

                        <p className="mt-1 text-2xl font-bold text-blue-600">
                          {formatCurrency(
                            banner?.price
                          )}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* HOW TO PAY */}

                  <div className="mt-5 rounded-xl border border-blue-200 bg-blue-100 p-4">

                    <p className="font-medium text-blue-900">
                      How to pay
                    </p>


                    <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-blue-800">

                      <li>
                        Scan the QR code or copy the UPI ID.
                      </li>

                      <li>
                        Pay the exact amount shown above.
                      </li>

                      <li>
                        Complete the payment using your UPI app.
                      </li>

                      <li>
                        Keep the transaction ID / UTR for payment confirmation.
                      </li>

                    </ol>

                  </div>

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


                  <div className="mt-4 grid gap-4 sm:grid-cols-2">


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

                      <p className="break-all font-semibold text-gray-900">
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


                    {paymentSettings?.bank?.branchName && (
                      <div>

                        <p className="text-sm text-gray-500">
                          Branch
                        </p>

                        <p className="font-semibold text-gray-900">
                          {
                            paymentSettings
                              .bank
                              .branchName
                          }
                        </p>

                      </div>
                    )}

                  </div>


                  <div className="mt-5 rounded-xl border border-blue-200 bg-blue-100 p-4 text-sm text-blue-800">

                    Please transfer the exact amount shown above and keep your transaction ID / UTR.

                  </div>

                </div>
              )}

          </div>

        </div>


        {/* =================================================
            PAYMENT CONFIRMATION
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >

          <div className="border-b border-gray-200 p-5">

            <h2 className="text-lg font-semibold text-gray-900">
              Payment Confirmation
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter the transaction details after completing your payment.
            </p>

          </div>


          <div className="space-y-5 p-5">


            {/* TRANSACTION ID */}

            <div>

              <label
                htmlFor="transactionId"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Transaction ID / UTR *

              </label>


              <input
                id="transactionId"
                type="text"
                value={transactionId}
                onChange={(event) =>
                  setTransactionId(
                    event.target.value
                  )
                }
                placeholder="Enter the exact transaction reference generated by your bank or UPI app."
                autoComplete="off"
                maxLength={100}
                disabled={submitting}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />


              <p className="mt-1 text-xs text-gray-500">
                Enter the exact transaction reference generated by your bank or UPI app.
              </p>

            </div>


            {/* PAYMENT DATE */}

            <div>

              <label
                htmlFor="paymentDate"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Payment Date (MM/DD/YYYY)
              </label>


              <input
                id="paymentDate"
                type="date"
                value={paymentDate}
                readOnly
                disabled={submitting}
                className="w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 outline-none"
              />

            </div>


            {/* NOTES */}

            <div>

              <label
                htmlFor="paymentNotes"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Notes
              </label>


              <textarea
                id="paymentNotes"
                value={notes}
                onChange={(event) =>
                  setNotes(
                    event.target.value
                  )
                }
                rows={3}
                maxLength={1000}
                disabled={submitting}
                placeholder="Optional payment note"
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

            </div>


            {/* PAYMENT PROOF */}

            <div>

              <label
                htmlFor="paymentProof"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Payment Proof *
              </label>


              <input
                id="paymentProof"
                type="file"
                accept="image/*"
                onChange={
                  handleProofUpload
                }
                disabled={
                  uploadingProof ||
                  submitting
                }
                className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm"
              />


              <p className="mt-1 text-xs text-gray-500">
                Upload a clear screenshot/photo of your successful payment. Maximum size: 5 MB.
              </p>

            </div>


            {/* PROOF PREVIEW */}

            {proofPreview && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                <div className="mb-3 flex items-center justify-between">

                  <p className="text-sm font-medium text-gray-700">
                    Payment Proof Preview
                  </p>


                  <button
                    type="button"
                    disabled={
                      submitting ||
                      uploadingProof
                    }
                    onClick={() => {
                      setProofImage("");
                      setProofPublicId("");
                      setProofPreview("");
                    }}
                    className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    Remove
                  </button>

                </div>


                <img
                  src={proofPreview}
                  alt="Payment proof"
                  className="max-h-80 max-w-full rounded-xl border bg-white object-contain"
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
                className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
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
            IMPORTANT
        ================================================= */}

        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

          <h3 className="font-semibold text-yellow-900">
            Important
          </h3>


          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-yellow-800">

            <li>
              Make the payment for the exact amount shown above.
            </li>

            <li>
              Enter the transaction ID / UTR exactly as generated by your payment provider.
            </li>

            <li>
              Upload a clear payment proof.
            </li>

            <li>
              Payment submission does not automatically approve or publish the banner.
            </li>

            <li>
              Your payment will be reviewed by ServDial admin.
            </li>

            <li>
              Banner duration terms: 1 Month = 30 days, 3 Months = 90 days, 6 Months = 180 days, and 1 Year = 360 days.
            </li>

            <li>
              The banner live period starts from the date of admin approval.
            </li>

          </ul>

        </div>

      </div>

    </div>
  );
};


export default UserPayment;