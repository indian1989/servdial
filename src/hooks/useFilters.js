import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",

    // ✅ ALWAYS STRING
    city:
  searchParams.get("city") || "",

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


  // ================= SYNC URL =================
  useEffect(() => {
  console.log("🌐 URL SYNC FILTERS:", filters);

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

  console.log("🌐 URL WILL BECOME:", cleaned);

  setSearchParams(cleaned);
}, [filters]);

  // ================= UPDATE FILTER =================
  const updateFilter = (key, value) => {
  console.log("🔥 FILTER UPDATE:", {
    key,
    value,
    currentFilters: filters,
    stack: new Error().stack,
  });

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