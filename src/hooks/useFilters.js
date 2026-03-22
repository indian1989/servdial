import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useCity } from "../context/CityContext";

const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { city: globalCity } = useCity(); // get global city

  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    city: searchParams.get("city") || globalCity || "",
    category: searchParams.get("category") || "",
    rating: searchParams.get("rating") || "",
    price: searchParams.get("price") || "",
    openNow: searchParams.get("openNow") === "true",
    distance: Number(searchParams.get("distance")) || 5000,
    lat: searchParams.get("lat") || "",
    lng: searchParams.get("lng") || "",
    sort: searchParams.get("sort") || "popular",
    page: Number(searchParams.get("page")) || 1,
  });

  // ================= SYNC GLOBAL CITY =================
  useEffect(() => {
    if (globalCity && globalCity !== filters.city) {
      setFilters((prev) => ({ ...prev, city: globalCity, page: 1 }));
    }
  }, [globalCity]);

  // ================= SYNC URL =================
  useEffect(() => {
    setSearchParams({
      ...filters,
      openNow: filters.openNow ? "true" : "false",
    });
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // reset page on filter change
    }));
  };

  return { filters, updateFilter };
};

export default useFilters;