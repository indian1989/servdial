import { useCallback } from "react";

const useBusinessDirections = (business, trackEvent, showToastMsg) => {


  const lat =
    business?.location?.coordinates?.[1];

  const lng =
    business?.location?.coordinates?.[0];


  const openGoogleMaps = useCallback((lat, lng) => {

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );

  }, []);



  const openLeafletDirections = useCallback((lat, lng) => {

    const url =
      `https://www.openstreetmap.org/directions?to=${lat},${lng}`;

    window.open(url, "_blank");

  }, []);



  const handleDirections = useCallback(() => {

    trackEvent?.("direction");


    if (!lat || !lng) {

      showToastMsg?.(
        "Location not available"
      );

      return;

    }


    try {

      openGoogleMaps(lat, lng);

    } catch (err) {

      console.log(
        "⚠️ Google Maps failed → switching to OSM"
      );

      openLeafletDirections(lat, lng);

    }


  }, [
    lat,
    lng,
    trackEvent,
    showToastMsg,
    openGoogleMaps,
    openLeafletDirections
  ]);


  return {
    handleDirections,
    lat,
    lng
  };

};


export default useBusinessDirections;