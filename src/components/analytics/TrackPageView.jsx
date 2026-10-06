// src/components/analytics/TrackPageView.jsx

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
  initializeVisitorAnalytics,
  trackPageView,
} from "../../services/visitorAnalyticsService";

const TrackPageView = ({ user = null }) => {
  const location = useLocation();

  const { user: authUser, loading } = useAuth();

  const currentUser = user ?? authUser;

  const initializedRef = useRef(false);
  const previousPathRef = useRef("");

  useEffect(() => {
    let cancelled = false;

    // ---------------------------------------------------------
    // WAIT UNTIL AUTH STATE IS FULLY RESOLVED
    // ---------------------------------------------------------
    if (loading) {
      return;
    }

    const trackCurrentPage = async () => {
      const currentPath =
        location.pathname + location.search;

      // -------------------------------------------------------
      // EXCLUDE ADMIN / SUPERADMIN
      // -------------------------------------------------------
      const isExcludedAdmin =
        currentUser?.role === "admin" ||
        currentUser?.role === "superadmin";

      if (isExcludedAdmin) {
        return;
      }

      // -------------------------------------------------------
      // PREVENT DUPLICATE PAGE TRACKING
      // -------------------------------------------------------
      if (
        !currentPath ||
        currentPath === previousPathRef.current
      ) {
        return;
      }

      try {
        // -----------------------------------------------------
        // INITIALIZE VISITOR ONLY ONCE
        // -----------------------------------------------------
        if (!initializedRef.current) {
          const initialized =
            await initializeVisitorAnalytics({
              user: currentUser,
            });

          if (cancelled) {
            return;
          }

          if (!initialized?.success) {
            console.warn(
              "Visitor analytics initialization failed."
            );

            return;
          }

          initializedRef.current = true;
        }

        // -----------------------------------------------------
        // TRACK PAGE VIEW
        // -----------------------------------------------------
        await trackPageView({
          path: currentPath,
          pageTitle:
            typeof document !== "undefined"
              ? document.title
              : "",
        });

        // -----------------------------------------------------
        // MARK PATH ONLY AFTER SUCCESSFUL TRACKING
        // -----------------------------------------------------
        if (!cancelled) {
          previousPathRef.current = currentPath;
        }
      } catch (error) {
        if (!cancelled) {
          console.warn(
            "Global page view tracking failed:",
            error
          );
        }
      }
    };

    trackCurrentPage();

    return () => {
      cancelled = true;
    };
  }, [
    location.pathname,
    location.search,
    currentUser,
    loading,
  ]);

  return null;
};

export default TrackPageView;