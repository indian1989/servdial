// src/components/analytics/TrackPageView.jsx

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import {
  initializeVisitorAnalytics,
  trackPageView,
} from "../../services/visitorAnalyticsService";

const TrackPageView = ({ user = null }) => {
  const location = useLocation();

  const initializedRef = useRef(false);
  const previousPathRef = useRef("");

  useEffect(() => {
    let cancelled = false;

    const trackCurrentPage = async () => {
      const currentPath =
  location.pathname +
  location.search;

const isExcludedAdmin =
  user?.role === "admin" ||
  user?.role === "superadmin";

if (isExcludedAdmin) {
  return;
}

if (
  !currentPath ||
  currentPath === previousPathRef.current
) {
  return;
}

      previousPathRef.current = currentPath;

      try {
        if (!initializedRef.current) {
          const initialized =
            await initializeVisitorAnalytics({
              user,
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

        await trackPageView({
          path: currentPath,
          pageTitle:
            typeof document !== "undefined"
              ? document.title
              : "",
        });
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
    user,
  ]);

  return null;
};

export default TrackPageView;