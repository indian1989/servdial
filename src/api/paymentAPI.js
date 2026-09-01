// frontend/src/api/paymentAPI.js

import api from "./axios.js";


// =========================================================
// PAYMENT SETTINGS
// =========================================================

/**
 * Get active payment settings.
 *
 * User / Provider
 */
export const getPaymentSettings = async () => {
  const response = await api.get(
    "/payment-settings/active"
  );

  return response.data;
};


// =========================================================
// ADMIN — GET ALL PAYMENT SETTINGS
// =========================================================

/**
 * Get all payment settings configurations.
 *
 * Admin / Superadmin
 *
 * Used for payment settings history / management.
 */
export const getAllPaymentSettings = async () => {
  const response = await api.get(
    "/payment-settings/admin/all"
  );

  return response.data;
};


// =========================================================
// ADMIN — GET CURRENT PAYMENT SETTINGS
// =========================================================

/**
 * Get the currently active payment settings.
 *
 * Admin / Superadmin
 */
export const getAdminPaymentSettings = async () => {
  const response = await api.get(
    "/payment-settings/admin/current"
  );

  return response.data;
};


// =========================================================
// ADMIN — CREATE PAYMENT SETTINGS
// =========================================================

/**
 * Create a new payment settings configuration.
 *
 * Admin / Superadmin
 *
 * @param {Object} settingsData
 */
export const createPaymentSettings = async (
  settingsData
) => {
  const response = await api.post(
    "/payment-settings/admin",
    settingsData
  );

  return response.data;
};


// =========================================================
// ADMIN — UPDATE PAYMENT SETTINGS
// =========================================================

/**
 * Update an existing payment settings configuration.
 *
 * Admin / Superadmin
 *
 * @param {string} settingsId
 * @param {Object} settingsData
 */
export const updatePaymentSettings = async (
  settingsId,
  settingsData
) => {
  const response = await api.patch(
    `/payment-settings/admin/${settingsId}`,
    settingsData
  );

  return response.data;
};


// =========================================================
// ADMIN — ACTIVATE PAYMENT SETTINGS
// =========================================================

/**
 * Activate a payment settings configuration.
 *
 * Admin / Superadmin
 *
 * Activating one configuration automatically
 * deactivates other active configurations on server.
 *
 * @param {string} settingsId
 */
export const activatePaymentSettings = async (
  settingsId
) => {
  const response = await api.patch(
    `/payment-settings/admin/${settingsId}/activate`
  );

  return response.data;
};


// =========================================================
// ADMIN — DEACTIVATE PAYMENT SETTINGS
// =========================================================

/**
 * Deactivate a payment settings configuration.
 *
 * Admin / Superadmin
 *
 * Server prevents deactivation when it would
 * leave the payment system without an active
 * configuration.
 *
 * @param {string} settingsId
 */
export const deactivatePaymentSettings = async (
  settingsId
) => {
  const response = await api.patch(
    `/payment-settings/admin/${settingsId}/deactivate`
  );

  return response.data;
};


// =========================================================
// ADMIN — DELETE PAYMENT SETTINGS
// =========================================================

/**
 * Delete an inactive payment settings configuration.
 *
 * Superadmin only.
 *
 * Active settings cannot be deleted by server.
 *
 * @param {string} settingsId
 */
export const deletePaymentSettings = async (
  settingsId
) => {
  const response = await api.delete(
    `/payment-settings/admin/${settingsId}`
  );

  return response.data;
};


// =========================================================
// CREATE PAYMENT
// =========================================================

/**
 * Create a new payment.
 *
 * User / Provider
 *
 * IMPORTANT:
 * Transaction ID / UTR is NOT submitted here.
 * It is submitted later with payment proof.
 *
 * @param {Object} paymentData
 */
export const createPayment = async (
  paymentData
) => {
  const response = await api.post(
    "/payments",
    paymentData
  );

  return response.data;
};


// =========================================================
// MY PAYMENTS
// =========================================================

/**
 * Get payments created by logged-in user/provider.
 *
 * User / Provider
 *
 * Supports query params:
 * - serviceType
 * - status
 * - page
 * - limit
 *
 * @param {Object} params
 */
export const getMyPayments = async (
  params = {}
) => {
  const response = await api.get(
    "/payments/my",
    {
      params,
    }
  );

  return response.data;
};


// =========================================================
// GET PAYMENT BY ID
// =========================================================

/**
 * Get a single payment.
 *
 * User / Provider / Admin / Superadmin
 *
 * @param {string} paymentId
 */
export const getPaymentById = async (
  paymentId
) => {
  const response = await api.get(
    `/payments/${paymentId}`
  );

  return response.data;
};


// =========================================================
// SUBMIT PAYMENT PROOF
// =========================================================

/**
 * Submit payment proof for a payment.
 *
 * User / Provider
 *
 * Transaction ID / UTR is submitted here,
 * not during payment creation.
 *
 * @param {string} paymentId
 * @param {Object|FormData} proofData
 */
export const submitPaymentProof = async (
  paymentId,
  proofData
) => {
  const response = await api.post(
    `/payments/${paymentId}/proof`,
    proofData
  );

  return response.data;
};


// =========================================================
// ADMIN — GET ALL PAYMENTS
// =========================================================

/**
 * Get all payments.
 *
 * Admin / Superadmin
 *
 * Supports query params:
 * - status
 * - serviceType
 * - payerRole
 * - page
 * - limit
 *
 * @param {Object} params
 */

export const getAllPayments = async (
  params = {}
) => {

  console.log(
    "💳 getAllPayments() CALLED",
    {
      params,
      stack: new Error().stack,
    }
  );

  const response = await api.get(
    "/payments/admin/all",
    {
      params,
    }
  );

  console.log(
    "💳 getAllPayments() RESPONSE",
    response.data
  );

  return response.data;
};


// =========================================================
// ADMIN — VERIFY PAYMENT
// =========================================================

/**
 * Verify a payment.
 *
 * Admin / Superadmin
 *
 * @param {string} paymentId
 */
export const verifyPayment = async (
  paymentId
) => {
  const response = await api.patch(
    `/payments/admin/${paymentId}/verify`
  );

  return response.data;
};


// =========================================================
// ADMIN — REJECT PAYMENT
// =========================================================

/**
 * Reject a payment.
 *
 * Admin / Superadmin
 *
 * @param {string} paymentId
 * @param {Object} data
 */
export const rejectPayment = async (
  paymentId,
  data = {}
) => {
  const response = await api.patch(
    `/payments/admin/${paymentId}/reject`,
    data
  );

  return response.data;
};


// =========================================================
// ADMIN — REFUND PAYMENT
// =========================================================

/**
 * Refund a payment.
 *
 * Admin / Superadmin
 *
 * @param {string} paymentId
 * @param {Object} data
 */
export const refundPayment = async (
  paymentId,
  data = {}
) => {
  const response = await api.patch(
    `/payments/admin/${paymentId}/refund`,
    data
  );

  return response.data;
};


// =========================================================
// ADMIN — CANCEL PAYMENT
// =========================================================

/**
 * Cancel a payment.
 *
 * Admin / Superadmin
 *
 * @param {string} paymentId
 * @param {Object} data
 */
export const cancelPayment = async (
  paymentId,
  data = {}
) => {
  const response = await api.patch(
    `/payments/admin/${paymentId}/cancel`,
    data
  );

  return response.data;
};


// =========================================================
// DEFAULT EXPORT
// =========================================================

const paymentAPI = {
  // Payment Settings
  getPaymentSettings,
  getAllPaymentSettings,
  getAdminPaymentSettings,
  createPaymentSettings,
  updatePaymentSettings,
  activatePaymentSettings,
  deactivatePaymentSettings,
  deletePaymentSettings,

  // Payments
  createPayment,
  getMyPayments,
  getPaymentById,
  submitPaymentProof,
  getAllPayments,
  verifyPayment,
  rejectPayment,
  refundPayment,
  cancelPayment,
};

export default paymentAPI;