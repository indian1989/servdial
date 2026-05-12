import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useCity } from "../context/CityContext";

const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { city: globalCity } = useCity();

  // ✅ SAFE CITY SLUG
  const globalCitySlug =
    typeof globalCity === "object"
      ? globalCity?.slug
      : globalCity || "";

  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",

    // ✅ ALWAYS STRING
    city:
      searchParams.get("city") ||
      globalCitySlug ||
      "",

    category: searchParams.get("category") || "",
    rating: searchParams.get("rating") || "",
    price: searchParams.get("price") || "",

    openNow:
      searchParams.get("openNow") === "true",

    distance:
      Number(searchParams.get("distance")) || 5000,

    lat: searchParams.get("lat") || "",
    lng: searchParams.get("lng") || "",

    sort: searchParams.get("sort") || "popular",

    page:
      Number(searchParams.get("page")) || 1,
  });

  // ================= SYNC GLOBAL CITY =================
  useEffect(() => {
    if (
      globalCitySlug &&
      globalCitySlug !== filters.city
    ) {
      setFilters((prev) => ({
        ...prev,
        city: globalCitySlug,
        page: 1,
      }));
    }
  }, [globalCitySlug]);

  // ================= SYNC URL =================
  useEffect(() => {
    const cleaned = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== "" &&
        value !== null &&
        value !== undefined
      ) {
        cleaned[key] = value;
      }
    });

    cleaned.openNow = filters.openNow
      ? "true"
      : "false";

    setSearchParams(cleaned);
  }, [filters]);

  // ================= UPDATE FILTER =================
  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  return {
    filters,
    updateFilter,
  };
};

export default useFilters;