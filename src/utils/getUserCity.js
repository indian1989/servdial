import API from "../api/axios";

export const getUserCity = async () => {
  if (!navigator.geolocation) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const res = await API.get(
            `/location/reverse?lat=${lat}&lng=${lng}`
          );

          const city =
            res?.data?.city ||
            res?.data?.data?.city ||
            res?.data?.result?.city ||
            res?.data?.name ||
            null;

          resolve(city);
        } catch (error) {
          console.error("Location error:", error);
          resolve(null);
        }
      },
      () => resolve(null),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
};