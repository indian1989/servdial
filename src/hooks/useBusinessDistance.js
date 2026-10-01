import { useEffect, useState } from "react";
import { getDistance } from "../utils/getDistance";

const useBusinessDistance = (business) => {

  const [distance, setDistance] =
    useState(null);

  useEffect(() => {

    if (!business) {
      setDistance(null);
      return;
    }

    const calculateDistance = () => {

      const storedLat =
        localStorage.getItem("user_lat");

      const storedLng =
        localStorage.getItem("user_lng");

      const userLat =
        Number(storedLat);

      const userLng =
        Number(storedLng);

      const businessLng =
        Number(
          business?.location?.coordinates?.[0]
        );

      const businessLat =
        Number(
          business?.location?.coordinates?.[1]
        );

      /* =========================================
         VALIDATE USER LOCATION
      ========================================= */

      if (
        !Number.isFinite(userLat) ||
        !Number.isFinite(userLng)
      ) {
        setDistance(null);
        return false;
      }

      /* =========================================
         VALIDATE BUSINESS LOCATION
      ========================================= */

      if (
        !Number.isFinite(businessLat) ||
        !Number.isFinite(businessLng)
      ) {
        setDistance(null);
        return false;
      }

      /* =========================================
         CALCULATE DISTANCE
      ========================================= */

      const d = getDistance(
        userLat,
        userLng,
        businessLat,
        businessLng
      );

      if (Number.isFinite(d)) {
        setDistance(d);
        return true;
      }

      setDistance(null);
      return false;
    };


    /* =========================================
       INITIAL CHECK
    ========================================= */

    const hasLocation =
      calculateDistance();

    if (hasLocation) {
      return;
    }


    /* =========================================
       WAIT FOR LOCATION TO BECOME AVAILABLE
    ========================================= */

    const checkLocation =
      setInterval(() => {

        const found =
          calculateDistance();

        if (found) {
          clearInterval(
            checkLocation
          );
        }

      }, 500);


    /* =========================================
       TAB / PAGE RETURN
    ========================================= */

    const handleVisibility =
      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {
          calculateDistance();
        }

      };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );


    const handleFocus =
      () => {
        calculateDistance();
      };

    window.addEventListener(
      "focus",
      handleFocus
    );


    return () => {

      clearInterval(
        checkLocation
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );

      window.removeEventListener(
        "focus",
        handleFocus
      );

    };

  }, [business]);

  return distance;
};

export default useBusinessDistance;