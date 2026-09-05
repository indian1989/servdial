// frontend/src/services/visitorAnalyticsService.js

import API from "../api/axios";

/**
 * =========================================================
 * 📊 SERVDIAL VISITOR ANALYTICS SERVICE
 * =========================================================
 *
 * RESPONSIBILITY:
 *
 * Visitor
 *   ↓
 * Session
 *   ↓
 * Page View
 *
 * This service manages the browser-side analytics identity.
 *
 * IMPORTANT:
 * - visitorId is NOT based on IP.
 * - Guest visitorId is persisted in localStorage.
 * - Same browser keeps the same visitor identity.
 * - Backend remains the source of truth for Visitor records.
 * - BusinessView tracking remains separate.
 * =========================================================
 */

const VISITOR_STORAGE_KEY =
  "servdial_visitor_id";

const SESSION_STORAGE_KEY =
  "servdial_session_id";

/**
 * =========================================================
 * HELPERS
 * =========================================================
 */

const safeString = (value = "") =>
  String(value || "").trim();

/**
 * Generate a browser-safe unique ID.
 */
const generateId = (prefix) => {
  try {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return `${prefix}_${crypto.randomUUID()}`;
    }
  } catch {
    // Fallback below.
  }

  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 12)}`;
};

/**
 * =========================================================
 * VISITOR ID
 * =========================================================
 *
 * Guest visitor identity is stored locally.
 *
 * We intentionally do NOT use:
 * - IP address
 * - user agent as identity
 * - browser fingerprint as identity
 */
export const getVisitorId = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    let visitorId =
      window.localStorage.getItem(
        VISITOR_STORAGE_KEY
      );

    if (!visitorId) {
      visitorId = generateId("visitor");

      window.localStorage.setItem(
        VISITOR_STORAGE_KEY,
        visitorId
      );
    }

    return visitorId;
  } catch (error) {
    console.warn(
      "Visitor ID storage unavailable:",
      error
    );

    return null;
  }
};

/**
 * =========================================================
 * SET VISITOR ID
 * =========================================================
 *
 * Useful when backend/client identity needs to be restored.
 */
export const setVisitorId = (visitorId) => {
  if (typeof window === "undefined") {
    return null;
  }

  const value = safeString(visitorId);

  if (!value) {
    return null;
  }

  try {
    window.localStorage.setItem(
      VISITOR_STORAGE_KEY,
      value
    );

    return value;
  } catch (error) {
    console.warn(
      "Unable to store visitor ID:",
      error
    );

    return null;
  }
};

/**
 * =========================================================
 * CLEAR VISITOR ID
 * =========================================================
 *
 * Normally this should NOT be called during normal navigation.
 */
export const clearVisitorId = () => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(
      VISITOR_STORAGE_KEY
    );
  } catch (error) {
    console.warn(
      "Unable to clear visitor ID:",
      error
    );
  }
};

/**
 * =========================================================
 * SESSION ID
 * =========================================================
 *
 * Session ID is kept separately from visitor identity.
 *
 * Backend remains responsible for the actual
 * 30-minute inactivity session logic.
 */
export const getSessionId = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    let sessionId =
      window.sessionStorage.getItem(
        SESSION_STORAGE_KEY
      );

    if (!sessionId) {
      sessionId = generateId("session");

      window.sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        sessionId
      );
    }

    return sessionId;
  } catch (error) {
    console.warn(
      "Session ID storage unavailable:",
      error
    );

    return null;
  }
};

/**
 * =========================================================
 * CLEAR SESSION ID
 * =========================================================
 */
export const clearSessionId = () => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.removeItem(
      SESSION_STORAGE_KEY
    );
  } catch (error) {
    console.warn(
      "Unable to clear session ID:",
      error
    );
  }
};

/**
 * =========================================================
 * CURRENT PAGE CONTEXT
 * =========================================================
 */
export const getCurrentPageContext = () => {
  if (typeof window === "undefined") {
    return {
      path: "",
      pageTitle: "",
      referrer: "",
    };
  }

  return {
    path:
      window.location.pathname +
      window.location.search,

    pageTitle:
      typeof document !== "undefined"
        ? document.title
        : "",

    referrer:
      typeof document !== "undefined"
        ? document.referrer
        : "",
  };
};

/**
 * =========================================================
 * TRACK / IDENTIFY VISITOR
 * =========================================================
 *
 * POST /api/analytics/visitor
 */
export const trackVisitor = async ({
  user = null,
  context = {},
} = {}) => {
  const isExcludedAdmin =
    user?.role === "admin" ||
    user?.role === "superadmin";

  if (isExcludedAdmin) {
    return {
      success: false,
      excluded: true,
      visitorId: null,
      visitor: null,
      message:
        "Admin visitors are excluded from visitor analytics.",
    };
  }

  const visitorId = getVisitorId();

  if (!visitorId) {
    return {
      success: false,
      message:
        "Visitor identity could not be created.",
    };
  }

  try {
    const response = await API.post(
      "/analytics/visitor",
      {
        visitorId,
        context: {
          ...getCurrentPageContext(),
          ...context,
        },
      }
    );

    return (
      response?.data || {
        success: false,
        message:
          "Visitor tracking failed.",
      }
    );
  } catch (error) {
    console.warn(
      "Visitor tracking failed:",
      error
    );

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Visitor tracking request failed.",
    };
  }
};

/**
 * =========================================================
 * TOUCH VISITOR
 * =========================================================
 *
 * POST /api/analytics/visitor/touch
 */
export const touchVisitor = async () => {
  const visitorId = getVisitorId();

  if (!visitorId) {
    return {
      success: false,
      message:
        "Visitor ID is unavailable.",
    };
  }

  try {
    const response = await API.post(
      "/analytics/visitor/touch",
      {
        visitorId,
      }
    );

    return (
      response?.data || {
        success: false,
      }
    );
  } catch (error) {
    console.warn(
      "Visitor touch failed:",
      error
    );

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Visitor touch request failed.",
    };
  }
};

/**
 * =========================================================
 * TRACK PAGE VIEW
 * =========================================================
 *
 * NOTE:
 * The dedicated backend PageView route will be connected
 * separately.
 *
 * This function keeps the frontend contract centralized,
 * so page components will not directly call axios.
 */
export const trackPageView = async ({
  path,
  pageTitle,
  pageType,
  businessId,
  categoryId,
  cityId,
  query,
  context = {},
} = {}) => {
  const visitorId = getVisitorId();
  const sessionId = getSessionId();

  if (!visitorId || !sessionId) {
    return {
      success: false,
      message:
        "Visitor or session identity unavailable.",
    };
  }

  const pageContext =
    getCurrentPageContext();

  const payload = {
    visitorId,
    sessionId,

    path:
      safeString(path) ||
      pageContext.path,

    pageTitle:
      safeString(pageTitle) ||
      pageContext.pageTitle,

    pageType:
      safeString(pageType) || "other",

    businessId:
      businessId || null,

    categoryId:
      categoryId || null,

    cityId:
      cityId || null,

    query:
      safeString(query),

    referrer:
      pageContext.referrer,

    context,
  };

  try {
    const response = await API.post(
      "/analytics/page-view",
      payload
    );

    return (
      response?.data || {
        success: false,
        message:
          "Page view tracking failed.",
      }
    );
  } catch (error) {
    console.warn(
      "Page view tracking failed:",
      error
    );

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Page view request failed.",
    };
  }
};

/**
 * =========================================================
 * INITIALIZE ANALYTICS
 * =========================================================
 *
 * Called once when the public application starts.
 *
 * Flow:
 *
 * 1. Get/create visitorId
 * 2. Get/create sessionId
 * 3. Identify visitor on backend
 *
 * PageView itself is intentionally handled separately.
 */
export const initializeVisitorAnalytics =
  async ({
    user = null,
    context = {},
  } = {}) => {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();

    if (!visitorId || !sessionId) {
      return {
        success: false,
        visitorId,
        sessionId,
      };
    }

    const visitorResult =
      await trackVisitor({
        user,
        context,
      });

    return {
      success:
        visitorResult?.success !== false,

      visitorId,
      sessionId,

      visitor:
        visitorResult?.data ||
        visitorResult?.visitor ||
        null,
    };
  };

export default {
  getVisitorId,
  setVisitorId,
  clearVisitorId,

  getSessionId,
  clearSessionId,

  getCurrentPageContext,

  trackVisitor,
  touchVisitor,
  trackPageView,

  initializeVisitorAnalytics,
};