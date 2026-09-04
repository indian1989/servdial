// src/services/searchTrackingService.js

import API from "../api/axios";
import {
  getVisitorId,
  getSessionId,
} from "./visitorAnalyticsService";

/**
 * =========================================================
 * 🔎 SEARCH TRACKING SERVICE
 * =========================================================
 *
 * RESPONSIBILITY:
 *
 * - Track frontend search events
 * - Send visitor/session identity
 * - Track zero-result searches
 * - Track search result count
 * - Never break actual search if analytics fails
 *
 * =========================================================
 */

export const trackSearchEvent = async ({
  query = "",
  path = "/search",
  resultCount = 0,
  citySlug = "",
  categorySlug = "",
  searchType = "",
  intent = "",
  filters = {},
  sort = "",
  distance = null,
  nearby = false,
  useLocation = false,
} = {}) => {
  /* =======================================================
     🚫 ADMIN / SUPERADMIN EXCLUSION
     ======================================================= */

  try {
    const storedUser =
      localStorage.getItem("servdial_user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);

      const role = parsed?.user?.role;

      if (
        role === "admin" ||
        role === "superadmin"
      ) {
        return {
          success: false,
          skipped: true,
          excluded: true,
          message:
            "Admin search analytics are excluded.",
        };
      }
    }
  } catch {
    // Ignore malformed localStorage.
  }

  /* =======================================================
     🔎 QUERY VALIDATION
     ======================================================= */

  const cleanedQuery =
    String(query || "").trim();

  if (!cleanedQuery) {
    return {
      success: false,
      skipped: true,
      message: "Empty search query.",
    };
  }

  /* =======================================================
     👤 VISITOR / SESSION IDENTITY
     ======================================================= */

  const visitorId = getVisitorId();
  const sessionId = getSessionId();

  if (!visitorId || !sessionId) {
    console.warn(
      "⚠️ Search analytics skipped: visitor/session ID missing",
      {
        visitorId,
        sessionId,
      }
    );

    return {
      success: false,
      skipped: true,
      message:
        "Visitor/session ID missing.",
    };
  }

  /* =======================================================
     📊 SEND SEARCH EVENT
     ======================================================= */

  try {
    const response = await API.post(
      "/analytics/search-event",
      {
        visitorId,
        sessionId,

        query: cleanedQuery,

        path,

        resultCount:
          Number(resultCount) || 0,

        metadata: {
          citySlug:
            citySlug || "",

          categorySlug:
            categorySlug || "",

          searchType:
            searchType || "",

          intent:
            intent || "",

          hasResults:
            Number(resultCount) > 0,

          noResults:
            Number(resultCount) === 0,

          filters:
            filters || {},

          sort:
            sort || "",

          distance:
            distance !== null
              ? Number(distance)
              : null,

          nearby:
            nearby === true,

          useLocation:
            useLocation === true,
        },
      }
    );

    return (
      response?.data || {
        success: true,
      }
    );
  } catch (error) {
    console.warn(
      "⚠️ Search analytics tracking failed:",
      error
    );

    return {
      success: false,
      analyticsError: true,
      error,
    };
  }
};

export default {
  trackSearchEvent,
};