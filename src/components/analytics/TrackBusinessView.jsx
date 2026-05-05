// frontend/src/components/TrackBusinessView,jsx
import { useEffect, useRef } from "react";
import API from "../../api/axios";

const TrackBusinessView = ({ businessId }) => {
  const trackedRef = useRef(false);

useEffect(() => {
  if (!businessId || trackedRef.current) return;

  trackedRef.current = true;

  API.post(`/businesses/${businessId}/view`)
    .catch(() => {});
}, [businessId]);

  return null;
};

export default TrackBusinessView;