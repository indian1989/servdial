import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

export const CityContext = createContext();

export const CityProvider = ({ children }) => {
const [city, setCityState] = useState(null); 
// but city = { name, slug }
  const [loadingCity, setLoadingCity] = useState(true);

  // ================= SET CITY =================
  const setCity = (cityObj) => {
  if (!cityObj || !cityObj.slug) return;

  localStorage.setItem("servdial_city", JSON.stringify(cityObj));
  setCityState(cityObj);
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
  setLoadingCity(false); // ✅ FIX
} else {
  fallbackIP();
}

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
    const detectedName = res?.data?.city;

    if (detectedName) {
      const resCity = await API.get(`/cities?search=${detectedName}`);
      const match = resCity.data?.cities?.find(
  c => c.name.toLowerCase() === detectedName.toLowerCase()
);

      if (match) {
        setCity({
  _id: match._id,
  name: match.name,
  slug: match.slug,
});
      } else {
        setCity({
          name: "India",
          slug: "india",
        });
      }
    } else {
      setCity({
        name: "India",
        slug: "india",
      });
    }

  } catch {
    setCity({
      name: "India",
      slug: "india",
    });
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
} else {
  localStorage.removeItem("servdial_city");
  detectLocation();
}
  } catch {}
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