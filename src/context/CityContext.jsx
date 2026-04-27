import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

export const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [city, setCityState] = useState(null);
  const [loadingCity, setLoadingCity] = useState(true);

  // ================= SET CITY =================
  const setCity = (cityObj) => {
    if (!cityObj || !cityObj.slug) return;

    localStorage.setItem("servdial_city", JSON.stringify(cityObj));
    setCityState(cityObj);
  };

  // ================= DETECT LOCATION =================
  const detectLocation = async () => {
    // 🔥 HARD STOP — DO NOT RUN if city already exists
    if (city?.slug) {
      setLoadingCity(false);
      return;
    }

    // 🔥 HARD STOP — DO NOT RUN if saved city exists
    const savedCity = localStorage.getItem("servdial_city");
    if (savedCity) {
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

          if (detectedName) {
            const resCity = await API.get(`/cities?search=${detectedName}`);
            const match = resCity.data?.cities?.[0];

            if (match) {
              setCity({
                _id: match._id,
                name: match.name,
                slug: match.slug,
              });
            } else {
              fallbackIP();
            }
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

  // ================= FALLBACK =================
  const fallbackIP = async () => {
    // 🔥 ALSO BLOCK HERE
    if (city?.slug) {
      setLoadingCity(false);
      return;
    }

    const savedCity = localStorage.getItem("servdial_city");
    if (savedCity) {
      setLoadingCity(false);
      return;
    }

    try {
      const res = await API.get("/location/ip");
      const detectedName = res?.data?.city;

      if (detectedName) {
        const resCity = await API.get(`/cities?search=${detectedName}`);
        const match = resCity.data?.cities?.find(
          (c) => c.name.toLowerCase() === detectedName.toLowerCase()
        );

        if (match) {
          setCity({
            _id: match._id,
            name: match.name,
            slug: match.slug,
          });
        } else {
          setCity({ name: "India", slug: "india" });
        }
      } else {
        setCity({ name: "India", slug: "india" });
      }
    } catch {
      setCity({ name: "India", slug: "india" });
    } finally {
      setLoadingCity(false);
    }
  };

  // ================= INIT =================
  useEffect(() => {
    const savedCity = localStorage.getItem("servdial_city");

    if (savedCity) {
      try {
        const parsed = JSON.parse(savedCity);

        if (parsed?.slug && parsed?._id) {
          setCityState(parsed);
          setLoadingCity(false);
          return;
        } else {
          localStorage.removeItem("servdial_city");
        }
      } catch {
        localStorage.removeItem("servdial_city");
      }
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