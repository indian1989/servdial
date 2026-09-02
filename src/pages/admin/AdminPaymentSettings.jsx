import { useCallback, useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaTrash,
  FaSave,
  FaPlus,
  FaUniversity,
  FaQrcode,
  FaReceipt,
  FaInfoCircle,
  FaPowerOff,
  FaSyncAlt,
} from "react-icons/fa";

import {
  getAdminPaymentSettings,
  getAllPaymentSettings,
  createPaymentSettings,
  updatePaymentSettings,
  activatePaymentSettings,
  deactivatePaymentSettings,
  deletePaymentSettings,
} from "../../api/paymentAPI";

import { uploadImage } from "../../services/CloudinaryService";

// =========================================================
// DEFAULT FORM
// =========================================================

const DEFAULT_FORM = {
  isActive: true,

  upi: {
  enabled: true,
  upiId: "",
  accountName: "",
  qrCode: "",
  qrCodePublicId: "",
},

  bank: {
    enabled: false,
    accountName: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
    branchName: "",
  },

  instructions:
    "Please make the payment using the available payment method and upload the payment proof.",

  receiptRequired: true,
};


// =========================================================
// HELPERS
// =========================================================

const normalizeSettings = (settings = {}) => ({
  isActive:
    settings.isActive !== undefined
      ? Boolean(settings.isActive)
      : true,

  upi: {
  enabled:
    settings.upi?.enabled !== undefined
      ? Boolean(settings.upi.enabled)
      : true,

  upiId:
    settings.upi?.upiId || "",

  accountName:
    settings.upi?.accountName || "",

  qrCode:
    settings.upi?.qrCode || "",

  qrCodePublicId:
    settings.upi?.qrCodePublicId || "",
},

  bank: {
    enabled:
      settings.bank?.enabled !== undefined
        ? Boolean(settings.bank.enabled)
        : false,

    accountName:
      settings.bank?.accountName || "",

    accountNumber:
      settings.bank?.accountNumber || "",

    ifsc:
      settings.bank?.ifsc || "",

    bankName:
      settings.bank?.bankName || "",

    branchName:
      settings.bank?.branchName || "",
  },

  instructions:
    settings.instructions ||
    DEFAULT_FORM.instructions,

  receiptRequired:
    settings.receiptRequired !== undefined
      ? Boolean(settings.receiptRequired)
      : true,
});


const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};


const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};


// =========================================================
// COMPONENT
// =========================================================

function AdminPaymentSettings() {
  const [settings, setSettings] = useState(null);

  const [history, setHistory] = useState([]);

  const [form, setForm] =
    useState(DEFAULT_FORM);

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [qrUploading, setQrUploading] =
  useState(false);

  const [actionId, setActionId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);


  // =======================================================
  // LOAD DATA
  // =======================================================

  const loadSettings = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const [
          currentResponse,
          allResponse,
        ] = await Promise.all([
          getAdminPaymentSettings(),
          getAllPaymentSettings(),
        ]);

        setSettings(
          currentResponse?.data || null
        );

        setHistory(
          Array.isArray(allResponse?.data)
            ? allResponse.data
            : []
        );
      } catch (err) {
        const message =
          getErrorMessage(err);

        /*
         * No active settings is not necessarily
         * a fatal page error.
         *
         * History may still exist.
         */

        setError(message);

        try {
          const allResponse =
            await getAllPaymentSettings();

          setHistory(
            Array.isArray(
              allResponse?.data
            )
              ? allResponse.data
              : []
          );
        } catch {
          // Keep original error.
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );


  useEffect(() => {
    loadSettings();
  }, [loadSettings]);


  // =======================================================
  // FORM HELPERS
  // =======================================================

  const resetForm = () => {
    setForm({
      ...DEFAULT_FORM,
      upi: {
        ...DEFAULT_FORM.upi,
      },
      bank: {
        ...DEFAULT_FORM.bank,
      },
    });

    setEditingId(null);
  };


  const startCreate = () => {
    resetForm();
    setError("");
    setSuccess("");
    setShowForm(true);
  };


  const startEdit = (item) => {
    setForm(
      normalizeSettings(item)
    );

    setEditingId(item._id);

    setError("");
    setSuccess("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    resetForm();
  };


  // =======================================================
  // INPUT HANDLERS
  // =======================================================

  const updateTopLevel = (
    field,
    value
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };


  const updateUpi = (
    field,
    value
  ) => {
    setForm((previous) => ({
      ...previous,

      upi: {
        ...previous.upi,
        [field]: value,
      },
    }));
  };


  const updateBank = (
    field,
    value
  ) => {
    setForm((previous) => ({
      ...previous,

      bank: {
        ...previous.bank,
        [field]: value,
      },
    }));
  };

  // =======================================================
// UPI QR CODE UPLOAD
// =======================================================

const handleQrCodeUpload = async (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  // Basic client-side validation
  if (!file.type.startsWith("image/")) {
    setError("Please select a valid QR code image.");
    event.target.value = "";
    return;
  }

  // Optional size protection
  if (file.size > 5 * 1024 * 1024) {
    setError("QR code image must be 5 MB or smaller.");
    event.target.value = "";
    return;
  }

  try {
    setQrUploading(true);
    setError("");
    setSuccess("");

    const result = await uploadImage(file);

    if (!result?.secure_url) {
      throw new Error(
        "QR code upload failed. Cloudinary URL was not returned."
      );
    }

    updateUpi(
  "qrCode",
  result.secure_url
);

updateUpi(
  "qrCodePublicId",
  result.public_id || ""
);

    setSuccess(
      "UPI QR code uploaded successfully."
    );
  } catch (err) {
    setError(
      getErrorMessage(err)
    );
  } finally {
    setQrUploading(false);

    // Allow selecting the same file again
    event.target.value = "";
  }
};


  // =======================================================
  // CLIENT VALIDATION
  // =======================================================

  const validateForm = () => {
    const upiEnabled =
      Boolean(form.upi.enabled);

    const bankEnabled =
      Boolean(form.bank.enabled);

    if (
      !upiEnabled &&
      !bankEnabled
    ) {
      return "At least one payment method must be enabled.";
    }

    if (upiEnabled) {
  const hasUpiId =
    Boolean(form.upi.upiId.trim());

  const hasQrCode =
    Boolean(form.upi.qrCode.trim());

  if (!hasUpiId && !hasQrCode) {
    return "UPI ID or UPI QR code is required when UPI is enabled.";
  }

  if (!form.upi.accountName.trim()) {
    return "UPI account name is required when UPI is enabled.";
  }
}

    if (bankEnabled) {
      if (!form.bank.accountName.trim()) {
        return "Bank account name is required when bank transfer is enabled.";
      }

      if (!form.bank.accountNumber.trim()) {
        return "Bank account number is required when bank transfer is enabled.";
      }

      if (!form.bank.ifsc.trim()) {
        return "Bank IFSC is required when bank transfer is enabled.";
      }

      if (!form.bank.bankName.trim()) {
        return "Bank name is required when bank transfer is enabled.";
      }
    }

    return "";
  };


  // =======================================================
  // SAVE
  // =======================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      isActive:
        Boolean(form.isActive),

  upi: {
  enabled:
    Boolean(form.upi.enabled),

  upiId:
    form.upi.upiId.trim(),

  accountName:
    form.upi.accountName.trim(),

  qrCode:
    form.upi.qrCode.trim(),

  qrCodePublicId:
    form.upi.qrCodePublicId.trim(),
},

      bank: {
        enabled:
          Boolean(form.bank.enabled),

        accountName:
          form.bank.accountName.trim(),

        accountNumber:
          form.bank.accountNumber.trim(),

        ifsc:
          form.bank.ifsc
            .trim()
            .toUpperCase(),

        bankName:
          form.bank.bankName.trim(),

        branchName:
          form.bank.branchName.trim(),
      },

      instructions:
        form.instructions.trim(),

      receiptRequired:
        Boolean(form.receiptRequired),
    };

    try {
      setSaving(true);

      let response;

      if (editingId) {
        response =
          await updatePaymentSettings(
            editingId,
            payload
          );
      } else {
        response =
          await createPaymentSettings(
            payload
          );
      }

      setSuccess(
        response?.message ||
          (
            editingId
              ? "Payment settings updated successfully."
              : "Payment settings created successfully."
          )
      );

      setShowForm(false);
      resetForm();

      await loadSettings();
    } catch (err) {
      setError(
        getErrorMessage(err)
      );
    } finally {
      setSaving(false);
    }
  };


  // =======================================================
  // ACTIVATE
  // =======================================================

  const handleActivate = async (
    id
  ) => {
    if (!id) return;

    const confirmed =
      window.confirm(
        "Activate this payment configuration?\n\nThe currently active configuration will be deactivated automatically."
      );

    if (!confirmed) return;

    try {
      setActionId(id);
      setError("");
      setSuccess("");

      const response =
        await activatePaymentSettings(
          id
        );

      setSuccess(
        response?.message ||
          "Payment settings activated successfully."
      );

      await loadSettings();
    } catch (err) {
      setError(
        getErrorMessage(err)
      );
    } finally {
      setActionId(null);
    }
  };


  // =======================================================
  // DEACTIVATE
  // =======================================================

  const handleDeactivate = async (
    id
  ) => {
    if (!id) return;

    const confirmed =
      window.confirm(
        "Deactivate this payment configuration?"
      );

    if (!confirmed) return;

    try {
      setActionId(id);
      setError("");
      setSuccess("");

      const response =
        await deactivatePaymentSettings(
          id
        );

      setSuccess(
        response?.message ||
          "Payment settings deactivated successfully."
      );

      await loadSettings();
    } catch (err) {
      setError(
        getErrorMessage(err)
      );
    } finally {
      setActionId(null);
    }
  };


  // =======================================================
  // DELETE
  // =======================================================

  const handleDelete = async (
    id
  ) => {
    if (!id) return;

    const confirmed =
      window.confirm(
        "Delete this inactive payment configuration permanently?\n\nThis action cannot be undone."
      );

    if (!confirmed) return;

    try {
      setActionId(id);
      setError("");
      setSuccess("");

      const response =
        await deletePaymentSettings(
          id
        );

      setSuccess(
        response?.message ||
          "Payment settings deleted successfully."
      );

      await loadSettings();
    } catch (err) {
      setError(
        getErrorMessage(err)
      );
    } finally {
      setActionId(null);
    }
  };


  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">

          <FaSyncAlt
            className="animate-spin mx-auto text-indigo-600"
            size={28}
          />

          <p className="mt-3 text-sm text-gray-500">
            Loading payment settings...
          </p>

        </div>
      </div>
    );
  }


  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Payment Settings
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage ServDial payment methods, payment
            destination and receipt settings.
          </p>
        </div>


        <div className="flex gap-2">

          <button
            type="button"
            onClick={loadSettings}
            disabled={loading}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              border
              border-gray-200
              bg-white
              text-gray-700
              text-sm
              font-medium
              hover:bg-gray-50
              disabled:opacity-50
            "
          >
            <FaSyncAlt size={13} />
            Refresh
          </button>


          {!showForm && (
            <button
              type="button"
              onClick={startCreate}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-4
                py-2.5
                rounded-xl
                bg-indigo-600
                text-white
                text-sm
                font-semibold
                hover:bg-indigo-700
                shadow-sm
              "
            >
              <FaPlus size={13} />
              New Configuration
            </button>
          )}

        </div>

      </div>


      {/* ===================================================
          ALERTS
      =================================================== */}

      {error && (
        <div
          className="
            mb-5
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            flex
            items-start
            gap-3
            text-sm
            text-red-700
          "
        >
          <FaTimesCircle
            className="mt-0.5 shrink-0"
          />

          <span>
            {error}
          </span>
        </div>
      )}


      {success && (
        <div
          className="
            mb-5
            rounded-xl
            border
            border-green-200
            bg-green-50
            px-4
            py-3
            flex
            items-start
            gap-3
            text-sm
            text-green-700
          "
        >
          <FaCheckCircle
            className="mt-0.5 shrink-0"
          />

          <span>
            {success}
          </span>
        </div>
      )}


      {/* ===================================================
          CURRENT ACTIVE SETTINGS
      =================================================== */}

      <section className="mb-8">

        <div className="flex items-center justify-between mb-3">

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Current Active Configuration
            </h2>

            <p className="text-sm text-gray-500">
              This configuration is used by user/provider
              payment instructions.
            </p>
          </div>

        </div>


        {settings ? (
          <div
            className="
              bg-white
              border
              border-green-200
              rounded-2xl
              shadow-sm
              overflow-hidden
            "
          >

            {/* STATUS HEADER */}

            <div
              className="
                px-5
                py-4
                bg-green-50
                border-b
                border-green-100
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-3
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-green-100
                    text-green-600
                    flex
                    items-center
                    justify-center
                  "
                >
                  <FaCheckCircle />
                </div>

                <div>

                  <p className="font-semibold text-green-800">
                    Payment System Active
                  </p>

                  <p className="text-xs text-green-700">
                    Last updated{" "}
                    {formatDate(
                      settings.updatedAt
                    )}
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={() =>
                  startEdit(settings)
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-3
                  py-2
                  rounded-lg
                  bg-white
                  border
                  border-green-200
                  text-green-700
                  text-sm
                  font-medium
                  hover:bg-green-100
                "
              >
                <FaEdit size={13} />
                Edit
              </button>

            </div>


            <div className="p-5">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* UPI */}

                <div
                  className="
                    rounded-xl
                    border
                    border-gray-200
                    p-4
                  "
                >

                  <div className="flex items-center gap-3 mb-4">

                    <div
                      className="
                        w-9
                        h-9
                        rounded-lg
                        bg-indigo-50
                        text-indigo-600
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <FaQrcode />
                    </div>

                    <div>

                      <h3 className="font-semibold text-gray-900">
                        UPI Payment
                      </h3>

                      <p className="text-xs text-gray-500">
                        {settings.upi?.enabled
                          ? "Enabled"
                          : "Disabled"}
                      </p>

                    </div>

                  </div>


                  {settings.upi?.enabled ? (
                    <div className="space-y-2 text-sm">

                      <InfoRow
                        label="UPI ID"
                        value={
                          settings.upi?.upiId
                        }
                      />

                      <InfoRow
                        label="Account Name"
                        value={
                          settings.upi?.accountName
                        }
                      />

                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      UPI payment is disabled.
                    </p>
                  )}

                </div>


                {/* BANK */}

                <div
                  className="
                    rounded-xl
                    border
                    border-gray-200
                    p-4
                  "
                >

                  <div className="flex items-center gap-3 mb-4">

                    <div
                      className="
                        w-9
                        h-9
                        rounded-lg
                        bg-blue-50
                        text-blue-600
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <FaUniversity />
                    </div>

                    <div>

                      <h3 className="font-semibold text-gray-900">
                        Bank Transfer
                      </h3>

                      <p className="text-xs text-gray-500">
                        {settings.bank?.enabled
                          ? "Enabled"
                          : "Disabled"}
                      </p>

                    </div>

                  </div>


                  {settings.bank?.enabled ? (
                    <div className="space-y-2 text-sm">

                      <InfoRow
                        label="Account Name"
                        value={
                          settings.bank?.accountName
                        }
                      />

                      <InfoRow
                        label="Account Number"
                        value={
                          settings.bank?.accountNumber
                        }
                      />

                      <InfoRow
                        label="IFSC"
                        value={
                          settings.bank?.ifsc
                        }
                      />

                      <InfoRow
                        label="Bank"
                        value={
                          settings.bank?.bankName
                        }
                      />

                      <InfoRow
                        label="Branch"
                        value={
                          settings.bank?.branchName ||
                          "Not specified"
                        }
                      />

                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Bank transfer is disabled.
                    </p>
                  )}

                </div>

              </div>


              {/* INSTRUCTIONS */}

              <div
                className="
                  mt-5
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  p-4
                "
              >

                <div className="flex items-center gap-2 mb-2">

                  <FaInfoCircle className="text-indigo-600" />

                  <h3 className="font-semibold text-gray-900">
                    Payment Instructions
                  </h3>

                </div>

                <p className="text-sm text-gray-600 leading-6 whitespace-pre-line">
                  {settings.instructions ||
                    "No payment instructions configured."}
                </p>

              </div>


              {/* RECEIPT */}

              <div
                className="
                  mt-4
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-gray-700
                "
              >
                <FaReceipt className="text-gray-400" />

                <span>
                  Receipt required:
                </span>

                <strong>
                  {settings.receiptRequired
                    ? "Yes"
                    : "No"}
                </strong>
              </div>

            </div>

          </div>
        ) : (
          <div
            className="
              rounded-2xl
              border
              border-yellow-200
              bg-yellow-50
              p-5
              text-sm
              text-yellow-800
            "
          >
            <div className="flex items-start gap-3">

              <FaInfoCircle className="mt-0.5" />

              <div>

                <p className="font-semibold">
                  No active payment settings
                </p>

                <p className="mt-1">
                  Create and activate a payment
                  configuration before users/providers
                  can make payments.
                </p>

              </div>

            </div>

          </div>
        )}

      </section>


      {/* ===================================================
          CREATE / EDIT FORM
      =================================================== */}

      {showForm && (
        <section className="mb-8">

          <div
            className="
              bg-white
              border
              border-gray-200
              rounded-2xl
              shadow-sm
              overflow-hidden
            "
          >

            <div
              className="
                px-5
                py-4
                border-b
                border-gray-200
                flex
                items-center
                justify-between
                gap-3
              "
            >

              <div>

                <h2 className="text-lg font-bold text-gray-900">
                  {editingId
                    ? "Edit Payment Configuration"
                    : "Create Payment Configuration"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Configure the payment destination used
                  by ServDial.
                </p>

              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="
                  text-sm
                  font-medium
                  text-gray-500
                  hover:text-gray-900
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

            </div>


            <form
              onSubmit={handleSubmit}
              className="p-5"
            >

              {/* =================================================
                  SYSTEM STATUS
              ================================================= */}

              <div
                className="
                  rounded-xl
                  border
                  border-gray-200
                  p-4
                  mb-5
                "
              >

                <ToggleRow
                  label="Active Configuration"
                  description="Make this configuration the active payment destination."
                  checked={form.isActive}
                  onChange={(value) =>
                    updateTopLevel(
                      "isActive",
                      value
                    )
                  }
                />

              </div>


              {/* =================================================
                  UPI
              ================================================= */}

              <div
                className="
                  rounded-xl
                  border
                  border-gray-200
                  p-5
                  mb-5
                "
              >

                <div className="flex items-center gap-3 mb-5">

                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-indigo-50
                      text-indigo-600
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FaQrcode />
                  </div>

                  <div>

                    <h3 className="font-bold text-gray-900">
                      UPI Payment
                    </h3>

                    <p className="text-xs text-gray-500">
                      Configure UPI payment destination.
                    </p>

                  </div>

                </div>


                <ToggleRow
                  label="Enable UPI"
                  description="Allow users and providers to pay through UPI."
                  checked={form.upi.enabled}
                  onChange={(value) =>
                    updateUpi(
                      "enabled",
                      value
                    )
                  }
                />


                

    {form.upi.enabled && (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

      <InputField
        label="UPI ID"
        value={form.upi.upiId}
        onChange={(value) =>
          updateUpi(
            "upiId",
            value
          )
        }
        placeholder="example@upi"
        required
      />

      <InputField
        label="UPI Account Name"
        value={
          form.upi.accountName
        }
        onChange={(value) =>
          updateUpi(
            "accountName",
            value
          )
        }
        placeholder="Account holder name"
        required
      />

    </div>

    {/* UPI QR CODE */}

<div className="mt-5">

  <span className="block text-sm font-medium text-gray-700 mb-1.5">
    UPI QR Code
  </span>

  <p className="text-xs text-gray-500 mb-3">
    Upload the UPI QR code image. Users can scan this QR code to make payment.
  </p>

  <div className="flex flex-col sm:flex-row sm:items-start gap-4">

    {/* UPLOAD BUTTON */}

    <label
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        px-4
        py-2.5
        rounded-xl
        border
        border-indigo-200
        bg-indigo-50
        text-indigo-700
        text-sm
        font-medium
        cursor-pointer
        hover:bg-indigo-100
        transition
        ${qrUploading ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >

      <FaQrcode size={14} />

      {qrUploading
        ? "Uploading..."
        : form.upi.qrCode
          ? "Change QR Code"
          : "Upload QR Code"}

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleQrCodeUpload}
        disabled={qrUploading || saving}
      />

    </label>


    {/* REMOVE BUTTON */}

    {form.upi.qrCode && !qrUploading && (
      <button
        type="button"
        onClick={() => {
        updateUpi("qrCode", "");
        updateUpi("qrCodePublicId", "");

        setError("");
        setSuccess("");
        }}
        disabled={saving}
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          px-4
          py-2.5
          rounded-xl
          border
          border-red-200
          bg-red-50
          text-red-600
          text-sm
          font-medium
          hover:bg-red-100
          disabled:opacity-50
        "
      >
        <FaTimesCircle size={14} />
        Remove QR
      </button>
    )}

  </div>


  {/* QR PREVIEW */}

  {form.upi.qrCode && (
    <div className="mt-4">

      <p className="text-xs font-medium text-gray-500 mb-2">
        QR Code Preview
      </p>

      <div
        className="
          w-44
          h-44
          rounded-xl
          border
          border-gray-200
          bg-white
          p-2
          flex
          items-center
          justify-center
          shadow-sm
        "
      >

        <img
          src={form.upi.qrCode}
          alt="UPI QR Code"
          className="
            w-full
            h-full
            object-contain
            rounded-lg
          "
        />

      </div>

    </div>
  )}

</div>
  </>
)}

              </div>


              {/* =================================================
                  BANK
              ================================================= */}

              <div
                className="
                  rounded-xl
                  border
                  border-gray-200
                  p-5
                  mb-5
                "
              >

                <div className="flex items-center gap-3 mb-5">

                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-blue-50
                      text-blue-600
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FaUniversity />
                  </div>

                  <div>

                    <h3 className="font-bold text-gray-900">
                      Bank Transfer
                    </h3>

                    <p className="text-xs text-gray-500">
                      Configure bank transfer payment destination.
                    </p>

                  </div>

                </div>


                <ToggleRow
                  label="Enable Bank Transfer"
                  description="Allow users and providers to pay through bank transfer."
                  checked={form.bank.enabled}
                  onChange={(value) =>
                    updateBank(
                      "enabled",
                      value
                    )
                  }
                />


                {form.bank.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

                    <InputField
                      label="Account Name"
                      value={
                        form.bank.accountName
                      }
                      onChange={(value) =>
                        updateBank(
                          "accountName",
                          value
                        )
                      }
                      placeholder="Account holder name"
                      required
                    />

                    <InputField
                      label="Account Number"
                      value={
                        form.bank.accountNumber
                      }
                      onChange={(value) =>
                        updateBank(
                          "accountNumber",
                          value
                        )
                      }
                      placeholder="Bank account number"
                      required
                    />

                    <InputField
                      label="IFSC"
                      value={form.bank.ifsc}
                      onChange={(value) =>
                        updateBank(
                          "ifsc",
                          value
                            .toUpperCase()
                        )
                      }
                      placeholder="SBIN0000000"
                      required
                    />

                    <InputField
                      label="Bank Name"
                      value={
                        form.bank.bankName
                      }
                      onChange={(value) =>
                        updateBank(
                          "bankName",
                          value
                        )
                      }
                      placeholder="Bank name"
                      required
                    />

                    <InputField
                      label="Branch Name"
                      value={
                        form.bank.branchName
                      }
                      onChange={(value) =>
                        updateBank(
                          "branchName",
                          value
                        )
                      }
                      placeholder="Branch name"
                    />

                  </div>
                )}

              </div>


              {/* =================================================
                  INSTRUCTIONS
              ================================================= */}

              <div
                className="
                  rounded-xl
                  border
                  border-gray-200
                  p-5
                  mb-5
                "
              >

                <div className="flex items-center gap-3 mb-4">

                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-gray-100
                      text-gray-600
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FaInfoCircle />
                  </div>

                  <div>

                    <h3 className="font-bold text-gray-900">
                      Payment Instructions
                    </h3>

                    <p className="text-xs text-gray-500">
                      Instructions displayed during payment.
                    </p>

                  </div>

                </div>


                <textarea
                  value={
                    form.instructions
                  }
                  onChange={(event) =>
                    updateTopLevel(
                      "instructions",
                      event.target.value
                    )
                  }
                  rows={5}
                  placeholder="Enter payment instructions..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    px-4
                    py-3
                    text-sm
                    text-gray-900
                    outline-none
                    focus:ring-2
                    focus:ring-indigo-500
                    focus:border-indigo-500
                    resize-y
                  "
                />

              </div>


              {/* =================================================
                  RECEIPT
              ================================================= */}

              <div
                className="
                  rounded-xl
                  border
                  border-gray-200
                  p-4
                  mb-6
                "
              >

                <ToggleRow
                  label="Receipt Required"
                  description="Require a receipt for verified payments."
                  checked={
                    form.receiptRequired
                  }
                  onChange={(value) =>
                    updateTopLevel(
                      "receiptRequired",
                      value
                    )
                  }
                />

              </div>


              {/* =================================================
                  ACTIONS
              ================================================= */}

              <div className="flex flex-col sm:flex-row sm:justify-end gap-3">

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="
                    px-5
                    py-2.5
                    rounded-xl
                    border
                    border-gray-300
                    bg-white
                    text-gray-700
                    text-sm
                    font-medium
                    hover:bg-gray-50
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={saving}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    px-5
                    py-2.5
                    rounded-xl
                    bg-indigo-600
                    text-white
                    text-sm
                    font-semibold
                    hover:bg-indigo-700
                    disabled:opacity-50
                  "
                >

                  {saving ? (
                    <>
                      <FaSyncAlt
                        className="animate-spin"
                        size={13}
                      />

                      Saving...
                    </>
                  ) : (
                    <>
                      {editingId ? (
                        <FaSave size={13} />
                      ) : (
                        <FaPlus size={13} />
                      )}

                      {editingId
                        ? "Update Settings"
                        : "Create Settings"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </section>
      )}


      {/* ===================================================
          HISTORY
      =================================================== */}

      <section>

        <div className="mb-4">

          <h2 className="text-lg font-bold text-gray-900">
            Payment Settings History
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Previous payment configurations are retained
            for audit and history.
          </p>

        </div>


        {history.length === 0 ? (
          <div
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-8
              text-center
            "
          >
            <FaInfoCircle
              className="mx-auto text-gray-300"
              size={28}
            />

            <p className="mt-3 text-sm text-gray-500">
              No payment settings history found.
            </p>

          </div>
        ) : (
          <div className="space-y-4">

            {history.map((item) => {

              const isActive =
                Boolean(item.isActive);

              const isBusy =
                actionId === item._id;

              return (
                <div
                  key={item._id}
                  className="
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    shadow-sm
                    overflow-hidden
                  "
                >

                  {/* HEADER */}

                  <div
                    className="
                      px-5
                      py-4
                      border-b
                      border-gray-100
                      flex
                      flex-col
                      lg:flex-row
                      lg:items-center
                      lg:justify-between
                      gap-4
                    "
                  >

                    <div className="flex items-center gap-3">

                      <div
                        className={`
                          w-10
                          h-10
                          rounded-xl
                          flex
                          items-center
                          justify-center
                          ${
                            isActive
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400"
                          }
                        `}
                      >
                        {isActive ? (
                          <FaCheckCircle />
                        ) : (
                          <FaTimesCircle />
                        )}
                      </div>

                      <div>

                        <div className="flex items-center gap-2 flex-wrap">

                          <h3 className="font-semibold text-gray-900">
                            Payment Configuration
                          </h3>

                          <span
                            className={`
                              inline-flex
                              items-center
                              px-2
                              py-1
                              rounded-full
                              text-[11px]
                              font-semibold
                              ${
                                isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }
                            `}
                          >
                            {isActive
                              ? "ACTIVE"
                              : "INACTIVE"}
                          </span>

                        </div>

                        <p className="text-xs text-gray-500 mt-1">
                          Created{" "}
                          {formatDate(
                            item.createdAt
                          )}
                        </p>

                      </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="flex flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          startEdit(item)
                        }
                        disabled={isBusy}
                        className="
                          inline-flex
                          items-center
                          gap-2
                          px-3
                          py-2
                          rounded-lg
                          border
                          border-gray-200
                          bg-white
                          text-gray-700
                          text-xs
                          font-medium
                          hover:bg-gray-50
                          disabled:opacity-50
                        "
                      >
                        <FaEdit size={12} />
                        Edit
                      </button>


                      {isActive ? (
                        <button
                          type="button"
                          onClick={() =>
                            handleDeactivate(
                              item._id
                            )
                          }
                          disabled={isBusy}
                          className="
                            inline-flex
                            items-center
                            gap-2
                            px-3
                            py-2
                            rounded-lg
                            border
                            border-yellow-200
                            bg-yellow-50
                            text-yellow-700
                            text-xs
                            font-medium
                            hover:bg-yellow-100
                            disabled:opacity-50
                          "
                        >

                          {isBusy ? (
                            <FaSyncAlt
                              className="animate-spin"
                              size={12}
                            />
                          ) : (
                            <FaPowerOff
                              size={12}
                            />
                          )}

                          Deactivate

                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            handleActivate(
                              item._id
                            )
                          }
                          disabled={isBusy}
                          className="
                            inline-flex
                            items-center
                            gap-2
                            px-3
                            py-2
                            rounded-lg
                            bg-green-600
                            text-white
                            text-xs
                            font-medium
                            hover:bg-green-700
                            disabled:opacity-50
                          "
                        >

                          {isBusy ? (
                            <FaSyncAlt
                              className="animate-spin"
                              size={12}
                            />
                          ) : (
                            <FaCheckCircle
                              size={12}
                            />
                          )}

                          Activate

                        </button>
                      )}


                      {!isActive && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              item._id
                            )
                          }
                          disabled={isBusy}
                          className="
                            inline-flex
                            items-center
                            gap-2
                            px-3
                            py-2
                            rounded-lg
                            border
                            border-red-200
                            bg-red-50
                            text-red-600
                            text-xs
                            font-medium
                            hover:bg-red-100
                            disabled:opacity-50
                          "
                        >

                          {isBusy ? (
                            <FaSyncAlt
                              className="animate-spin"
                              size={12}
                            />
                          ) : (
                            <FaTrash
                              size={12}
                            />
                          )}

                          Delete

                        </button>
                      )}

                    </div>

                  </div>


                  {/* DETAILS */}

                  <div className="p-5">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      {/* UPI */}

                      <HistoryCard
                        icon={FaQrcode}
                        title="UPI"
                        enabled={
                          item.upi?.enabled
                        }
                      >

                        {item.upi?.enabled && (
                          <>
                            <InfoRow
                              label="UPI ID"
                              value={
                                item.upi?.upiId
                              }
                            />

                            <InfoRow
                              label="Account Name"
                              value={
                                item.upi?.accountName
                              }
                            />
                          </>
                        )}

                      </HistoryCard>


                      {/* BANK */}

                      <HistoryCard
                        icon={FaUniversity}
                        title="Bank Transfer"
                        enabled={
                          item.bank?.enabled
                        }
                      >

                        {item.bank?.enabled && (
                          <>
                            <InfoRow
                              label="Account Name"
                              value={
                                item.bank?.accountName
                              }
                            />

                            <InfoRow
                              label="Account Number"
                              value={
                                item.bank?.accountNumber
                              }
                            />

                            <InfoRow
                              label="IFSC"
                              value={
                                item.bank?.ifsc
                              }
                            />

                            <InfoRow
                              label="Bank"
                              value={
                                item.bank?.bankName
                              }
                            />

                            <InfoRow
                              label="Branch"
                              value={
                                item.bank?.branchName ||
                                "Not specified"
                              }
                            />
                          </>
                        )}

                      </HistoryCard>

                    </div>


                    <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">

                      <div
                        className="
                          rounded-xl
                          bg-gray-50
                          border
                          border-gray-100
                          p-4
                        "
                      >

                        <div className="flex items-center gap-2 mb-2">

                          <FaInfoCircle className="text-indigo-500" />

                          <p className="text-xs font-semibold text-gray-700">
                            Instructions
                          </p>

                        </div>

                        <p className="text-sm text-gray-600 whitespace-pre-line leading-6">
                          {item.instructions ||
                            "No instructions configured."}
                        </p>

                      </div>


                      <div
                        className="
                          rounded-xl
                          bg-gray-50
                          border
                          border-gray-100
                          p-4
                        "
                      >

                        <div className="flex items-center gap-2 mb-2">

                          <FaReceipt className="text-gray-500" />

                          <p className="text-xs font-semibold text-gray-700">
                            Receipt Required
                          </p>

                        </div>

                        <p className="text-sm font-semibold text-gray-900">
                          {item.receiptRequired
                            ? "Yes"
                            : "No"}
                        </p>

                        {item.updatedBy && (
                          <p className="text-xs text-gray-500 mt-3">
                            Updated by{" "}
                            <strong>
                              {item.updatedBy.name ||
                                item.updatedBy.email ||
                                "Admin"}
                            </strong>
                          </p>
                        )}

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </section>

    </div>
  );
}


// =========================================================
// INFO ROW
// =========================================================

function InfoRow({
  label,
  value,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-1.5 border-b border-gray-100 last:border-0">

      <span className="text-xs text-gray-500">
        {label}
      </span>

      <span className="text-sm font-medium text-gray-900 break-all sm:text-right">
        {value || "Not configured"}
      </span>

    </div>
  );
}


// =========================================================
// INPUT FIELD
// =========================================================

function InputField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <label className="block">

      <span className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}

        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}
      </span>

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required={required}
        className="
          w-full
          rounded-xl
          border
          border-gray-300
          px-4
          py-2.5
          text-sm
          text-gray-900
          outline-none
          focus:ring-2
          focus:ring-indigo-500
          focus:border-indigo-500
        "
      />

    </label>
  );
}


// =========================================================
// TOGGLE ROW
// =========================================================

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <div className="min-w-0">

        <p className="text-sm font-semibold text-gray-900">
          {label}
        </p>

        {description && (
          <p className="text-xs text-gray-500 mt-1 leading-5">
            {description}
          </p>
        )}

      </div>


      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() =>
          onChange(!checked)
        }
        className={`
          relative
          shrink-0
          w-12
          h-7
          rounded-full
          transition
          ${
            checked
              ? "bg-indigo-600"
              : "bg-gray-300"
          }
        `}
      >

        <span
          className={`
            absolute
            top-1
            w-5
            h-5
            rounded-full
            bg-white
            shadow
            transition-transform
            ${
              checked
                ? "translate-x-6"
                : "translate-x-1"
            }
          `}
        />

      </button>

    </div>
  );
}


// =========================================================
// HISTORY CARD
// =========================================================

function HistoryCard({
  icon: Icon,
  title,
  enabled,
  children,
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-gray-200
        p-4
      "
    >

      <div className="flex items-center justify-between gap-3 mb-3">

        <div className="flex items-center gap-2">

          <div
            className="
              w-8
              h-8
              rounded-lg
              bg-gray-100
              text-gray-600
              flex
              items-center
              justify-center
            "
          >
            <Icon size={14} />
          </div>

          <h3 className="text-sm font-semibold text-gray-900">
            {title}
          </h3>

        </div>


        <span
          className={`
            px-2
            py-1
            rounded-full
            text-[10px]
            font-semibold
            ${
              enabled
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }
          `}
        >
          {enabled
            ? "ENABLED"
            : "DISABLED"}
        </span>

      </div>


      {enabled ? (
        <div className="space-y-1">
          {children}
        </div>
      ) : (
        <p className="text-xs text-gray-500">
          This payment method is disabled.
        </p>
      )}

    </div>
  );
}


export default AdminPaymentSettings;