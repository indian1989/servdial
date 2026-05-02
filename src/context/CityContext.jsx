import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

export const CityContext = createContext();

const STORAGE_KEY = "servdial_city";

export const CityProvider = ({ children }) => {
  const [city, setCityState] = useState(null);
  const [loadingCity, setLoadingCity] = useState(true);

  // ================= SET CITY (STRICT) =================
  const setCity = (cityObj) => {
    if (!cityObj?._id || !cityObj?.slug) return;

    const safeCity = {
      _id: cityObj._id,
      name: cityObj.name,
      slug: cityObj.slug,
      state: cityObj.state || "",
      district: cityObj.district || "",
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeCity));
    setCityState(safeCity);
  };

  // ================= LOAD SAVED CITY =================
  const loadSavedCity = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) return null;

      const parsed = JSON.parse(saved);

      if (parsed?._id && parsed?.slug) {
        return parsed;
      }

      localStorage.removeItem(STORAGE_KEY);
      return null;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  };

  // ================= GEO DETECTION =================
  const detectLocation = async () => {
    const saved = loadSavedCity();

    if (saved) {
      setCityState(saved);
      setLoadingCity(false);
      return;
    }

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

          const detectedName = res?.data?.city;

          if (!detectedName) return fallbackIP();

          const cityRes = await API.get(
            `/cities?search=${detectedName}`
          );

          const match = cityRes?.data?.cities?.find(
            (c) =>
              c.name.toLowerCase() === detectedName.toLowerCase()
          );

          if (match) {
            setCity(match);
          } else {
            fallbackIP();
          }
        } catch {
          fallbackIP();
        } finally {
          setLoadingCity(false);
        }
      },
      () => fallbackIP(),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // ================= IP FALLBACK =================
  const fallbackIP = async () => {
    const saved = loadSavedCity();

    if (saved) {
      setCityState(saved);
      setLoadingCity(false);
      return;
    }

    try {
      const res = await API.get("/location/ip");
      const detectedName = res?.data?.city;

      if (!detectedName) {
        setCityState({ _id: "india", name: "India", slug: "india" });
        setLoadingCity(false);
        return;
      }

      const cityRes = await API.get(
        `/cities?search=${detectedName}`
      );

      const match = cityRes?.data?.cities?.find(
        (c) =>
          c.name.toLowerCase() === detectedName.toLowerCase()
      );

      if (match) {
        setCity(match);
      } else {
        setCityState({ _id: "india", name: "India", slug: "india" });
      }
    } catch {
      setCityState({ _id: "india", name: "India", slug: "india" });
    } finally {
      setLoadingCity(false);
    }
  };

  // ================= INIT =================
  useEffect(() => {
    const saved = loadSavedCity();

    if (saved) {
      setCityState(saved);
      setLoadingCity(false);
      return;
    }

    detectLocation();
  }, []);

  return (
    <CityContext.Provider
      value={{
        city,
        setCity,
        detectLocation,
        loadingCity,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);