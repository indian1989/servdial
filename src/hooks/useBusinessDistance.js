// frontend/src/hooks/useBusinessDistance.js

import { useEffect, useState } from "react";
import { getDistance } from "../utils/getDistance";

const useBusinessDistance = (business) => {

  const [distance, setDistance] = useState(null);

  useEffect(() => {

    if (!business) return;

    const userLat = Number(
      localStorage.getItem("user_lat")
    );

    const userLng = Number(
      localStorage.getItem("user_lng")
    );

    const businessLng =
      business?.location?.coordinates?.[0];

    const businessLat =
      business?.location?.coordinates?.[1];

    if (
      userLat &&
      userLng &&
      businessLat &&
      businessLng
    ) {

      const d = getDistance(
        userLat,
        userLng,
        businessLat,
        businessLng
      );

      setDistance(d);

    } else {

      setDistance(null);

    }

  }, [business]);

  return distance;
};

export default useBusinessDistance;