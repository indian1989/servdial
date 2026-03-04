import { createContext, useContext, useState, useEffect } from "react";

const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [city, setCity] = useState("Select City");

  useEffect(() => {
    const savedCity = localStorage.getItem("servdial_city");
    if (savedCity) setCity(savedCity);
  }, []);

  const updateCity = (newCity) => {
    localStorage.setItem("servdial_city", newCity);
    setCity(newCity);
  };

  return (
    <CityContext.Provider value={{ city, updateCity }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);