
import { useEffect } from "react";
import API from "../../api/axios";
import { trackBusinessFunnelEvent } from "../../services/visitorAnalyticsService";

const TrackBusinessView = ({ businessId }) => {
  useEffect(() => {
    if (!businessId) return;

    const storageKey = `servdial_view_${businessId}`;

    let cancelled = false;

    
const trackView = async () => {
  const funnelStorageKey = `servdial_funnel_view_${businessId}`;

  // Preserve the legacy Business.views counter independently.
  if (!sessionStorage.getItem(storageKey)) {
    try {
      await API.post(`/businesses/${businessId}/view`);
      if (cancelled) return;

      sessionStorage.setItem(storageKey, "true");
    } catch (error) {
      console.error("Legacy business view tracking failed:", error);
    }
  }

  if (cancelled) return;

  // Independently attempt the new funnel event.
  if (!sessionStorage.getItem(funnelStorageKey)) {
    try {
      const result = await trackBusinessFunnelEvent({
        event: "business_view",
        businessId,
        path: window.location.pathname + window.location.search,
      });

      if (cancelled) return;

      if (result?.success) {
        sessionStorage.setItem(funnelStorageKey, "true");
        console.log("Business funnel view recorded:", result);
      } else {
        console.error(
          "Business funnel view was not recorded:",
          result?.message || result
        );
      }
    } catch (error) {
      console.error(
        "Business funnel view request failed:",
        error?.response?.data || error
      );
    }
  }
};

    trackView();

    return () => {
      cancelled = true;
    };
  }, [businessId]);

  return null;
};

export default TrackBusinessView;