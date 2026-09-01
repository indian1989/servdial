// frontend/src/components/payment/SubmitPaymentProof.jsx

import { useEffect, useState } from "react";

import {
  submitPaymentProof,
} from "../../api/paymentAPI.js";

import {
  uploadImage,
} from "../../services/CloudinaryService.js";


// =========================================================
// SUBMIT PAYMENT PROOF
// =========================================================
//
// Used by:
// - User
// - Provider
//
// Backend:
// POST /api/payments/:id/proof
//
// Expected body:
// - proofImage
// - proofPublicId
//
// Cloudinary:
// Existing uploadImage(file) service is used.
//
// Allowed payment statuses:
// - pending
// - processing
//
// After successful submission:
// payment.status = "processing"
//
// =========================================================


const SubmitPaymentProof = ({
  paymentId,
  payment = null,
  onProofSubmitted,
  onCancel,
}) => {

  // =======================================================
  // STATE
  // =======================================================

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [transactionId, setTransactionId] =
    useState("");

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =======================================================
  // CLEANUP PREVIEW URL
  // =======================================================

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(
          previewUrl
        );
      }
    };
  }, [previewUrl]);


  // =======================================================
  // VALIDATE FILE
  // =======================================================

  const validateFile = (file) => {

    if (!file) {
      return "Please select a payment proof image.";
    }

    if (
      !file.type?.startsWith("image/")
    ) {
      return "Please select a valid image file.";
    }

    // Maximum 5 MB.
    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      return "Payment proof image must be 5 MB or smaller.";
    }

    return "";
  };


  // =======================================================
  // FILE CHANGE
  // =======================================================

  const handleFileChange = (
    event
  ) => {

    const file =
      event.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl("");
      return;
    }

    const validationError =
      validateFile(file);

    if (validationError) {
      setSelectedFile(null);
      setPreviewUrl("");
      setError(
        validationError
      );

      event.target.value = "";

      return;
    }

    // Revoke previous preview.
    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl
      );
    }

    setSelectedFile(file);

    setPreviewUrl(
      URL.createObjectURL(file)
    );
  };


  // =======================================================
  // REMOVE SELECTED FILE
  // =======================================================

  const handleRemoveFile = () => {

    setSelectedFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl
      );
    }

    setPreviewUrl("");

    setError("");

    const input =
      document.getElementById(
        "paymentProofImage"
      );

    if (input) {
      input.value = "";
    }
  };


  // =======================================================
  // SUBMIT
  // =======================================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    if (submitting) {
      return;
    }

    setError("");
    setSuccess("");

    // =====================================================
    // PAYMENT ID
    // =====================================================

    if (!paymentId) {
      setError(
        "Payment ID is required."
      );

      return;
    }

    // =====================================================
    // FILE
    // =====================================================

    const validationError =
      validateFile(
        selectedFile
      );

    if (validationError) {
      setError(
        validationError
      );

      return;
    }

    if (!transactionId.trim()) {
  setError(
    "Transaction ID / UTR is required."
  );

  return;
}

    try {

      setSubmitting(true);

      // ===================================================
      // UPLOAD TO CLOUDINARY
      // ===================================================

      const uploadResult =
        await uploadImage(
          selectedFile
        );

      if (
        !uploadResult?.secure_url
      ) {
        throw new Error(
          "Payment proof image upload failed."
        );
      }

      // ===================================================
      // SUBMIT URL + PUBLIC ID
      // ===================================================

      const response =
        await submitPaymentProof(
          paymentId,
          {
        proofImage:
            uploadResult.secure_url,

        proofPublicId:
            uploadResult.public_id ||
            "",

        transactionId:
            transactionId.trim(),
        }
        );

      if (
        !response?.success ||
        !response?.data
      ) {
        throw new Error(
          response?.message ||
            "Payment proof submission failed."
        );
      }

      setSuccess(
        response.message ||
          "Payment proof submitted successfully."
      );

      setSelectedFile(null);

      setTransactionId("");

      if (previewUrl) {
        URL.revokeObjectURL(
          previewUrl
        );
      }

      setPreviewUrl("");

      const input =
        document.getElementById(
          "paymentProofImage"
        );

      if (input) {
        input.value = "";
      }

      // ===================================================
      // CALLBACK
      // ===================================================

      if (
        typeof onProofSubmitted ===
        "function"
      ) {
        onProofSubmitted(
          response.data
        );
      }

    } catch (err) {

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to submit payment proof."
      );

    } finally {

      setSubmitting(false);

    }
  };


  // =======================================================
  // PAYMENT STATUS
  // =======================================================

  const paymentStatus =
    payment?.status || "pending";


  const canSubmit =
    [
      "pending",
      "processing",
    ].includes(
      paymentStatus
    );


  // =======================================================
  // INVALID PAYMENT STATUS
  // =======================================================

  if (!canSubmit) {

    return (
      <section className="w-full rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-5 py-5">

          <h2 className="text-lg font-semibold text-gray-900">
            Submit Payment Proof
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Payment proof cannot be submitted for the current payment status.
          </p>

        </div>

        <div className="p-5">

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">

            <p className="text-sm text-amber-800">
              Current payment status:
              {" "}
              <span className="font-semibold">
                {paymentStatus}
              </span>
            </p>

          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="mt-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Close
            </button>
          )}

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
          Submit Payment Proof
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Upload the payment receipt or transaction proof for verification.
        </p>

      </div>


      {/* =================================================
          PAYMENT SUMMARY
      ================================================= */}

      {payment && (
        <div className="border-b border-gray-200 p-5">

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">

            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Payment Details
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">

              {payment.paymentNumber && (
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Payment Number
                  </p>

                  <p className="mt-1 break-all font-semibold text-gray-900">
                    {payment.paymentNumber}
                  </p>
                </div>
              )}

              {payment.amount !== undefined && (
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Amount
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    ₹
                    {Number(
                      payment.amount
                    ).toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-gray-500">
                  Status
                </p>

                <span className="mt-1 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium capitalize text-amber-700">
                  {paymentStatus}
                </span>
              </div>

            </div>

          </div>

        </div>
      )}


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
          SUCCESS
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
        className="space-y-5 p-5"
      >

{/* ===============================================
    TRANSACTION ID / UTR
=============================================== */}

<div>

  <label
    htmlFor="paymentTransactionId"
    className="mb-2 block text-sm font-medium text-gray-900"
  >
    Transaction ID / UTR
    <span className="ml-1 text-red-500">
      *
    </span>
  </label>

  <input
    id="paymentTransactionId"
    type="text"
    value={transactionId}
    onChange={(event) =>
      setTransactionId(
        event.target.value
      )
    }
    placeholder="Enter your UPI Transaction ID / UTR"
    autoComplete="off"
    maxLength={100}
    disabled={submitting}
    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
  />

  <p className="mt-1.5 text-xs text-gray-500">
    Enter the transaction ID / UTR exactly as shown on your payment receipt.
  </p>

</div>

        {/* ===============================================
            FILE INPUT
        =============================================== */}

        <div>

          <label
            htmlFor="paymentProofImage"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Payment Proof Image
            <span className="ml-1 text-red-500">
              *
            </span>
          </label>

          <input
            id="paymentProofImage"
            type="file"
            accept="image/*"
            onChange={
              handleFileChange
            }
            disabled={submitting}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <p className="mt-1.5 text-xs text-gray-500">
            JPG, PNG, WEBP or another supported image format. Maximum size: 5 MB.
          </p>

        </div>


        {/* ===============================================
            PREVIEW
        =============================================== */}

        {previewUrl && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">

            <div className="mb-3 flex items-center justify-between">

              <h3 className="text-sm font-semibold text-gray-900">
                Preview
              </h3>

              <button
                type="button"
                onClick={
                  handleRemoveFile
                }
                disabled={submitting}
                className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                Remove
              </button>

            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">

              <img
                src={previewUrl}
                alt="Payment proof preview"
                className="max-h-96 w-full object-contain"
              />

            </div>

            {selectedFile && (
              <p className="mt-2 break-all text-xs text-gray-500">
                {selectedFile.name}
              </p>
            )}

          </div>
        )}


        {/* ===============================================
            IMPORTANT NOTICE
        =============================================== */}

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">

          <h3 className="text-sm font-semibold text-blue-900">
            Payment Verification
          </h3>

          <ul className="mt-2 space-y-1.5 text-sm leading-5 text-blue-800">

            <li>
              • Upload a clear payment receipt or transaction proof.
            </li>

            <li>
              • Make sure the transaction ID is visible and matches your submitted payment.
            </li>

            <li>
              • The ServDial admin team will verify the payment.
            </li>

            <li>
              • Payment verification does not automatically approve the associated service.
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
            !selectedFile ||
            !transactionId.trim()
            }
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {submitting
              ? "Uploading & Submitting..."
              : "Submit Payment Proof"}

          </button>

        </div>

      </form>

    </section>
  );
};


export default SubmitPaymentProof;