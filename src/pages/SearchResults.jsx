import { useEffect, useState } from "react";
import API from "../api/axios";

import BusinessCard from "../components/business/BusinessCard";
import SmartSearchBar from "../components/search/SmartSearchBar";
import FiltersSidebar from "../components/filters/FiltersSidebar";
import FilterChips from "../components/filters/FilterChips";
import MobileFilters from "../components/filters/MobileFilters";

import useFilters from "../hooks/useFilters";
import { useCity } from "../context/CityContext";

const SearchResults = () => {
  const { filters, updateFilter } = useFilters();
  const { city, loadingCity } = useCity();

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [userCoords, setUserCoords] = useState({ lat: null, lng: null });

  // ================= SYNC CITY =================
  useEffect(() => {
    if (city && city !== filters.city) {
      updateFilter("city", city);
    }
  }, [city]);

  // ================= FETCH USER COORDS =================
  useEffect(() => {
    if (!filters.lat || !filters.lng) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserCoords({ lat, lng });
          updateFilter("lat", lat);
          updateFilter("lng", lng);
        },
        () => {
          // fallback: do nothing, city-based search will work
          setUserCoords({ lat: null, lng: null });
        }
      );
    }
  }, [filters.lat, filters.lng]);

  // ================= FETCH BUSINESSES =================
  useEffect(() => {
    if (loadingCity) return;

    const fetchBusinesses = async () => {
      try {
        setLoading(true);

        const params = {
          ...filters,
          ...(filters.distance && filters.lat && filters.lng
            ? { lat: filters.lat, lng: filters.lng, distance: filters.distance }
            : {}),
        };

        const res = await API.get("/business/search", { params });

        setBusinesses(res.data.businesses || []);
        setTotalPages(res.data.pages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [filters, loadingCity]);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* 🔥 MOBILE FILTER BUTTON */}
      <MobileFilters filters={filters} updateFilter={updateFilter} />

      {/* SEARCH */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-40">
        <SmartSearchBar
          query={filters.q}
          setQuery={(v) => updateFilter("q", v)}
          onSearch={(v) => updateFilter("q", v)}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">

        {/* SIDEBAR */}
        <div className="hidden md:block">
          <FiltersSidebar filters={filters} updateFilter={updateFilter} />
        </div>

        {/* MAIN */}
        <div className="flex-1">

          {/* HEADER */}
          <div className="mb-4">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
              {filters.q || filters.category || "Businesses"} in{" "}
              {filters.city || "India"}
            </h1>

            {!loading && (
              <p className="text-sm text-gray-500 mt-1">
                {businesses.length} results found
              </p>
            )}
          </div>

          {/* ACTIVE FILTERS */}
          <FilterChips filters={filters} updateFilter={updateFilter} />

          {/* RESULTS */}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6">

            {/* LOADING */}
            {loading &&
              [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-60 bg-gray-200 animate-pulse rounded-xl"
                />
              ))}

            {/* EMPTY */}
            {!loading && businesses.length === 0 && (
              <div className="col-span-full text-center text-gray-500 mt-10">
                <p className="text-lg font-medium">
                  No businesses found
                </p>
                <p className="text-sm mt-1">
                  Try changing filters or search keyword
                </p>
              </div>
            )}

            {/* DATA */}
            {!loading &&
              businesses.map((biz) => (
                <BusinessCard key={biz._id} business={biz} />
              ))}

          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex gap-2 mt-8 flex-wrap justify-center">

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateFilter("page", i + 1)}
                  className={`px-3 py-1 text-sm border rounded ${
                    filters.page === i + 1
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SearchResults;