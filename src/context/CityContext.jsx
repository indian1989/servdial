import { createContext, useContext, useState, useEffect, useRef } from "react";
import API from "../api/axios";

export const CityContext = createContext();

const STORAGE_KEY = "servdial_city";

export const CityProvider = ({ children }) => {
  const [city, setCityState] = useState(null);
  const [loadingCity, setLoadingCity] = useState(true);
  const geoTimeoutRef = useRef(null);

  // ================= SET CITY =================
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

  // ================= LOAD =================
  const loadSavedCity = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const parsed = JSON.parse(saved);

      if (parsed?._id && parsed?.slug) return parsed;

      localStorage.removeItem(STORAGE_KEY);
      return null;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  };

  // ================= NORMALIZE CITY RESPONSE =================
  const extractCityName = (res) => {
    return (
      res?.data?.city ||
      res?.data?.data?.city ||
      res?.data?.result?.city ||
      ""
    );
  };

  // ================= GET CITY LIST =================
  const getCities = async () => {
    const res = await API.get("/cities?dropdown=true");

    return (
      res?.data?.data?.cities ||
      res?.data?.cities ||
      []
    );
  };

  // ================= DETECT LOCATION =================
  const detectLocation = () => {
  console.log("🚀 detectLocation triggered");

  setLoadingCity(true);

  if (!navigator.geolocation) {
    console.log("❌ Geolocation not supported");
    fallbackIP();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      console.log("✅ GEO SUCCESS:", pos);

      if (geoTimeoutRef.current) {
        clearTimeout(geoTimeoutRef.current);
        geoTimeoutRef.current = null;
      }

      try {
        const { latitude, longitude } = pos.coords;

        const res = await API.get(
          `/location/reverse?lat=${latitude}&lng=${longitude}`
        );

        const detectedName =
          res?.data?.city ||
          res?.data?.data?.city ||
          res?.data?.result?.city ||
          res?.data?.name ||
          "";

        if (!detectedName) {
          return fallbackIP();
        }

        const cities = await getCities();

        const normalize = (str = "") =>
          str.toLowerCase().replace(/[^a-z0-9]/g, "");

        const match = cities.find(
          (c) => normalize(c.name) === normalize(detectedName)
        );

        if (match) {
          setCity(match);
        } else {
          fallbackIP();
        }
      } catch (err) {
        console.error("❌ Reverse API error:", err);
        fallbackIP();
      } finally {
        setLoadingCity(false);
      }
    },
    (err) => {
      console.error("❌ GEO FAILED:", err.code, err.message);

      if (geoTimeoutRef.current) {
        clearTimeout(geoTimeoutRef.current);
        geoTimeoutRef.current = null;
      }

      fallbackIP();
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    }
  );
};

  // ================= FALLBACK =================
  const fallbackIP = async () => {
    try {
      const res = await API.get("/location/ip");
      const detectedName = res?.data?.city;

      if (!detectedName) {
        setCity({
  _id: "india",
  name: "India",
  slug: "india",
  state: "",
  district: "",
});
        setLoadingCity(false);
        return;
      }

      const cities = await getCities();

      const match = cities.find(
        (c) =>
          (c.name || "").toLowerCase() === detectedName.toLowerCase()
      );

      if (match) {
  setCity(match);
}
    } catch {
      
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

    // ❌ IMPORTANT: do NOT auto-detect (as per your requirement)
    setLoadingCity(false);
  }, []);

  console.log("🔥 CityContext ACTIVE INSTANCE LOADED");

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