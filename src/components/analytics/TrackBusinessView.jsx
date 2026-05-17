import { useEffect } from "react";
import API from "../../api/axios";

const TrackBusinessView = ({ businessId }) => {
  useEffect(() => {
    if (!businessId) return;

    const storageKey = `servdial_view_${businessId}`;

    // same session me already counted
    if (sessionStorage.getItem(storageKey)) return;

    const trackView = async () => {
      try {
        await API.post(`/businesses/${businessId}/view`);
        sessionStorage.setItem(storageKey, "true");
      } catch (err) {
        console.error("View tracking failed:", err);
      }
    };

    trackView();
  }, [businessId]);

  return null;
};

export default TrackBusinessView;