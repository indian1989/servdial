import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [city, setCityState] = useState(null);
  const [loadingCity, setLoadingCity] = useState(true);

  // ================= SET CITY =================
  const setCity = (newCity) => {
    if (!newCity) return;

    localStorage.setItem("servdial_city", newCity);
    setCityState(newCity);
  };

  // ================= DETECT LOCATION =================
  const detectLocation = () => {
    if (!navigator.geolocation) {
      fallbackIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await API.get(
            `/location/reverse?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`
          );

          const detected = res?.data?.city || null;

          if (detected) {
            setCity(detected);
          } else {
            fallbackIP();
          }

        } catch {
          fallbackIP();
        }
      },
      () => fallbackIP(),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // ================= FALLBACK =================
  const fallbackIP = async () => {
    try {
      const res = await API.get("/location/ip");
      const detected = res?.data?.city || "India";

      setCity(detected);

    } catch {
      setCity("India");
    } finally {
      setLoadingCity(false);
    }
  };

  // ================= INIT =================
  useEffect(() => {
    const savedCity = localStorage.getItem("servdial_city");

    if (savedCity) {
      setCityState(savedCity);
      setLoadingCity(false);
    } else {
      detectLocation();
    }
  }, []);

  return (
    <CityContext.Provider
      value={{
        city,
        setCity,
        detectLocation,
        loadingCity
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);