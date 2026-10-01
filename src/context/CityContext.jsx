// src/context/CityContext.jsx
import { createContext, useContext, useState, useEffect, useRef } from "react";
import API from "../api/axios";

export const CityContext = createContext();

const STORAGE_KEY = "servdial_city";

export const CityProvider = ({ children }) => {
  const [city, setCityState] = useState(null);
  const [loadingCity, setLoadingCity] = useState(true);
  const geoTimeoutRef = useRef(null);

  // ================= SET CITY =================
  // ================================================
// SET CITY
// ================================================
const setCity = (cityObj) => {
  if (!cityObj?._id || !cityObj?.slug) return;

  const safeCity = {
    _id: cityObj._id,
    name: cityObj.name,
    slug: cityObj.slug,
    state: cityObj.state || "",
    district: cityObj.district || "",
  };

  // Client storage
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(safeCity)
  );

  // SSR-readable cookie
  document.cookie =
    `servdial_city_slug=${encodeURIComponent(
      safeCity.slug
    )}; path=/; max-age=31536000; SameSite=Lax`;

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
  console.log("🚀 detectLocation STARTED");

  setLoadingCity(true);

  if (!navigator.geolocation) {
    console.log("❌ Geolocation not supported");

    // Old GPS must not remain
    localStorage.removeItem("user_lat");
    localStorage.removeItem("user_lng");

    fallbackIP();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const {
        latitude,
        longitude,
        accuracy,
      } = pos.coords;

      console.log("✅ GEO SUCCESS COORDS:", {
        latitude,
        longitude,
        accuracy,
      });

      if (geoTimeoutRef.current) {
        clearTimeout(geoTimeoutRef.current);
        geoTimeoutRef.current = null;
      }

      try {
        // ==========================================
        // SAVE FRESH GPS LOCATION
        // ==========================================
        localStorage.setItem(
          "user_lat",
          String(latitude)
        );

        localStorage.setItem(
          "user_lng",
          String(longitude)
        );

        console.log("💾 GPS SAVED:", {
          lat: localStorage.getItem("user_lat"),
          lng: localStorage.getItem("user_lng"),
          accuracy,
        });

        // ==========================================
        // REVERSE LOCATION
        // ==========================================
        const res = await API.get(
          `/location/reverse?lat=${latitude}&lng=${longitude}`
        );

        const detectedName =
          res?.data?.city ||
          res?.data?.data?.city ||
          res?.data?.result?.city ||
          res?.data?.name ||
          "";

        // GPS is valid even if reverse city detection fails.
        // So DO NOT delete user_lat/user_lng here.
        if (!detectedName) {
          console.warn(
            "⚠️ Reverse API did not return city. GPS coordinates retained."
          );

          setLoadingCity(false);
          return;
        }

        const cities = await getCities();

        const normalize = (str = "") =>
          str
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

        const match = cities.find(
          (c) =>
            normalize(c.name) ===
            normalize(detectedName)
        );

        if (match) {
          setCity(match);
        } else {
          console.warn(
            "⚠️ GPS city not found in ServDial city list:",
            detectedName
          );
        }
      } catch (err) {
        console.error(
          "❌ Reverse API error:",
          err
        );

        // IMPORTANT:
        // GPS coordinates are still valid.
        // Keep user_lat/user_lng for distance calculation.
      } finally {
        setLoadingCity(false);
      }
    },

    (err) => {
      console.error(
        "❌ GEO FAILED:",
        err.code,
        err.message
      );

      if (geoTimeoutRef.current) {
        clearTimeout(geoTimeoutRef.current);
        geoTimeoutRef.current = null;
      }

      // ==========================================
      // GPS FAILED → REMOVE OLD STALE COORDINATES
      // ==========================================
      localStorage.removeItem("user_lat");
      localStorage.removeItem("user_lng");

      console.log(
        "🗑️ OLD GPS COORDINATES REMOVED"
      );

      fallbackIP();
    },

    {
      enableHighAccuracy: true,

      // IMPORTANT:
      // Never use an old cached GPS position.
      maximumAge: 0,

      // Give real GPS a little more time.
      timeout: 20000,
    }
  );
};

  // ================= FALLBACK =================
const fallbackIP = async () => {
  try {
    // ==========================================
    // IP LOCATION IS NOT GPS
    // Therefore old GPS coordinates must not
    // remain active.
    // ==========================================
    localStorage.removeItem("user_lat");
    localStorage.removeItem("user_lng");

    console.log(
      "🗑️ GPS COORDINATES CLEARED - USING IP LOCATION"
    );

    const res = await API.get("/location/ip");

    const detectedName =
      res?.data?.city || "";

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
        (c.name || "").toLowerCase() ===
        detectedName.toLowerCase()
    );

    if (match) {
      setCity(match);
    }
  } catch (err) {
    console.error(
      "❌ IP location failed:",
      err
    );
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