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

const ACQUISITION_STORAGE_KEY =
  "servdial_session_acquisition";

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
      source: "direct",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmTerm: "",
      utmContent: "",
    };
  }

  const searchParams = new URLSearchParams(
    window.location.search
  );

  const currentUtm = {
    utmSource: safeString(searchParams.get("utm_source")),
    utmMedium: safeString(searchParams.get("utm_medium")),
    utmCampaign: safeString(searchParams.get("utm_campaign")),
    utmTerm: safeString(searchParams.get("utm_term")),
    utmContent: safeString(searchParams.get("utm_content")),
  };

  const rawReferrer =
    typeof document !== "undefined"
      ? safeString(document.referrer)
      : "";

  const normalizeHost = (host = "") =>
    safeString(host)
      .toLowerCase()
      .replace(/^www\./i, "");

  const currentHost =
    normalizeHost(window.location.hostname);

  // Current ServDial domain and known previous frontend
  // hosting domains should not count as external referrals.
  const internalHosts = [
    "servdial.com",
    "localhost",
    "127.0.0.1",
    "comforting-tanuki-5ff825.netlify.app",
    "servdial-frontend-ssr.onrender.com",
  ];

  const isInternalHost = (host = "") => {
    const normalizedHost = normalizeHost(host);

    return internalHosts.some(
      (domain) =>
        normalizedHost === domain ||
        normalizedHost.endsWith(`.${domain}`)
    );
  };

  let externalReferrer = "";

  if (rawReferrer) {
    try {
      const referrerUrl = new URL(rawReferrer);
      const referrerHost =
        normalizeHost(referrerUrl.hostname);

      if (
        ["http:", "https:"].includes(referrerUrl.protocol) &&
        !isInternalHost(referrerHost) &&
        referrerHost !== currentHost
      ) {
        externalReferrer = referrerUrl.href;
      }
    } catch {
      // Invalid referrer URLs are ignored.
    }
  }

  const hasCurrentUtm = Object.values(currentUtm).some(
    Boolean
  );

  
  const getNamedSource = (value = "") => {
    let source = safeString(value).toLowerCase();

    if (!source) return "";

    // Accept either a source name or a full URL/domain.
    try {
      if (/^https?:\/\//i.test(source)) {
        source = new URL(source).hostname.toLowerCase();
      }
    } catch {
      // Continue with the original source value.
    }

    source = source
      .replace(/^www\./i, "")
      .replace(/\/+$/, "");

    const knownSources = [
      { pattern: /(^|\.)google\.[a-z.]+$/i, label: "Google" },
      { pattern: /(^|\.)bing\.com$/i, label: "Bing" },
      { pattern: /(^|\.)search\.yahoo\.com$/i, label: "Yahoo" },
      { pattern: /(^|\.)duckduckgo\.com$/i, label: "DuckDuckGo" },
      { pattern: /(^|\.)yandex\.[a-z.]+$/i, label: "Yandex" },
      { pattern: /(^|\.)baidu\.com$/i, label: "Baidu" },

      { pattern: /(^|\.)facebook\.com$/i, label: "Facebook" },
      { pattern: /(^|\.)fb\.com$/i, label: "Facebook" },
      { pattern: /(^|\.)instagram\.com$/i, label: "Instagram" },
      { pattern: /(^|\.)whatsapp\.com$/i, label: "WhatsApp" },
      { pattern: /(^|\.)whatsapp\.net$/i, label: "WhatsApp" },
      { pattern: /(^|\.)linkedin\.com$/i, label: "LinkedIn" },
      { pattern: /(^|\.)twitter\.com$/i, label: "X (Twitter)" },
      { pattern: /(^|\.)x\.com$/i, label: "X" },
      { pattern: /(^|\.)t\.co$/i, label: "X (Twitter)" },
      { pattern: /(^|\.)youtube\.com$/i, label: "YouTube" },
      { pattern: /(^|\.)youtu\.be$/i, label: "YouTube" },
      { pattern: /(^|\.)tiktok\.com$/i, label: "TikTok" },
      { pattern: /(^|\.)pinterest\.com$/i, label: "Pinterest" },
      { pattern: /(^|\.)reddit\.com$/i, label: "Reddit" },
      { pattern: /(^|\.)telegram\.org$/i, label: "Telegram" },
      { pattern: /(^|\.)t\.me$/i, label: "Telegram" },
    ];

    const match = knownSources.find(({ pattern }) =>
      pattern.test(source)
    );

    if (match) return match.label;

    // Preserve the actual domain/name for other sources.
    return source;
  };

  const classifyReferrer = (referrerUrl = "") => {
    if (!referrerUrl) return "";

    try {
      const host = new URL(referrerUrl).hostname;
      return getNamedSource(host) || "";
    } catch {
      return "";
    }
  };

  const classifyUtm = (medium = "") => {
    const normalizedMedium = medium.toLowerCase().trim();

    if (
      ["cpc", "ppc", "paid_search", "paidsearch", "sem"]
        .includes(normalizedMedium)
    ) {
      return "paid_search";
    }

    if (
      ["paid_social", "paidsocial", "social_paid"]
        .includes(normalizedMedium)
    ) {
      return "paid_social";
    }

    if (
      ["email", "e-mail", "newsletter"]
        .includes(normalizedMedium)
    ) {
      return "email";
    }

    
if (
  ["display", "banner", "programmatic"]
    .includes(normalizedMedium)
) {
  return "display";
}

// Organic search traffic.
if (
  ["organic", "seo"].includes(normalizedMedium)
) {
  return "organic";
}

// Unpaid social media traffic.
if (
  ["social", "social-media", "social_media"].includes(
    normalizedMedium
  )
) {
  return "social";
}

if (
  ["referral", "refer"].includes(normalizedMedium)
) {
  return "referral";
}

return "campaign";
  };

  const classifyUtmSource = (source = "", medium = "") => {
  return getNamedSource(source) || classifyUtm(medium);
};

  let savedAcquisition = null;

  try {
    const stored = window.sessionStorage.getItem(
      ACQUISITION_STORAGE_KEY
    );

    if (stored) {
      savedAcquisition = JSON.parse(stored);
    }
  } catch {
    savedAcquisition = null;
  }

  // Only a genuine external referrer or current UTM
  // parameters can establish new session attribution.
  const hasNewAcquisition =
    hasCurrentUtm || Boolean(externalReferrer);

  let acquisition;

  if (hasNewAcquisition) {
    acquisition = {
      source: hasCurrentUtm
        ? classifyUtmSource(
            currentUtm.utmSource,
            currentUtm.utmMedium
          )
        : classifyReferrer(externalReferrer) || "unknown",

      referrer: externalReferrer,

      ...currentUtm,
    };

    // Persist this acquisition for subsequent page views
    // in the same browser tab/session.
    try {
      window.sessionStorage.setItem(
        ACQUISITION_STORAGE_KEY,
        JSON.stringify(acquisition)
      );
    } catch {
      // Analytics must continue if storage is unavailable.
    }
  } else if (
    savedAcquisition &&
    savedAcquisition.source
  ) {
    // Do not replace a known source with "direct" just
    // because the current page has no referrer/UTM.
    acquisition = savedAcquisition;
  } else {
    acquisition = {
      source: "direct",
      referrer: "",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmTerm: "",
      utmContent: "",
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

    referrer: acquisition.referrer || "",
    source: acquisition.source || "unknown",

    utmSource: acquisition.utmSource || "",
    utmMedium: acquisition.utmMedium || "",
    utmCampaign: acquisition.utmCampaign || "",
    utmTerm: acquisition.utmTerm || "",
    utmContent: acquisition.utmContent || "",
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

  source:
    pageContext.source,

  utmSource:
    pageContext.utmSource,

  utmMedium:
    pageContext.utmMedium,

  utmCampaign:
    pageContext.utmCampaign,

  utmTerm:
    pageContext.utmTerm,

  utmContent:
    pageContext.utmContent,

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
 * TRACK BUSINESS FUNNEL EVENT
 * =========================================================
 *
 * Creates a VisitorEvent through the new analytics system.
 * Existing BusinessView / BusinessClick tracking is untouched.
 */
export const trackBusinessFunnelEvent = async ({
  event,
  businessId = null,
  path = "",
  metadata = {},
  user = null,
} = {}) => {
  const normalizedEvent = safeString(event).toLowerCase();

  const allowedEvents = [
    "business_view",
    "call",
    "whatsapp",
    "directions",
    "website_click",
    "share",
    "favorite",
  ];

  if (!allowedEvents.includes(normalizedEvent)) {
    return {
      success: false,
      message: "Invalid business funnel event.",
    };
  }

  // Ensure the backend Visitor record exists before creating an event.
  const initialized = await initializeVisitorAnalytics({ user });

  if (
    !initialized?.success ||
    !initialized?.visitorId ||
    !initialized?.sessionId
  ) {
    return {
      success: false,
      message: "Visitor analytics initialization failed.",
    };
  }

  const pageContext = getCurrentPageContext();

  try {
    const response = await API.post("/analytics/event", {
      visitorId: initialized.visitorId,
      sessionId: initialized.sessionId,
      event: normalizedEvent,
      business: businessId,
      path: safeString(path) || pageContext.path,
      
source: (() => {
  const source = safeString(pageContext.source).toLowerCase();

  if (!source || source === "unknown") return "unknown";
  if (source === "direct") return "direct";

  if (
    ["google", "bing", "yahoo", "duckduckgo"].includes(source)
  ) {
    return "organic";
  }

  if (
    [
      "facebook",
      "instagram",
      "whatsapp",
      "linkedin",
      "x",
      "twitter",
      "youtube",
    ].includes(source)
  ) {
    return "social";
  }

  if (pageContext.utmSource || pageContext.utmCampaign) {
    return "campaign";
  }

  return "referral";
})(),
metadata: {
  ...metadata,
  trafficSource: pageContext.source || "unknown",
  referrer: pageContext.referrer,
  utmSource: pageContext.utmSource,
  utmMedium: pageContext.utmMedium,
  utmCampaign: pageContext.utmCampaign,
  utmTerm: pageContext.utmTerm,
  utmContent: pageContext.utmContent,
},
    });

    return response?.data || { success: false };
  } catch (error) {
    console.warn(
      "Business funnel event tracking failed:",
      normalizedEvent,
      error?.response?.data || error
    );

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Business funnel event tracking failed.",
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
  trackBusinessFunnelEvent,
};