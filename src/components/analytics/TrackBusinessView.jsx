import { useEffect } from "react";
import API from "../../api/axios";

const TrackBusinessView = ({ businessId }) => {
  useEffect(() => {
    if (!businessId) return;

    API.post(`/businesses/${businessId}/view`)
      .catch(() => {});
  }, [businessId]);

  return null;
};

export default TrackBusinessView;