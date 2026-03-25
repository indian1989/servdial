import { useEffect, useState, useRef } from "react";
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

  const syncedCity = useRef(false);

  // ================= SYNC CITY (FIXED) =================
  useEffect(() => {
    if (!syncedCity.current && city) {
      updateFilter("city", city);
      syncedCity.current = true;
    }
  }, [city]);

  // ================= FETCH USER LOCATION =================
  useEffect(() => {
    if (!filters.lat && !filters.lng) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          updateFilter("lat", pos.coords.latitude);
          updateFilter("lng", pos.coords.longitude);
        },
        () => {}
      );
    }
  }, []);

  // ================= FETCH BUSINESSES =================
  useEffect(() => {
    if (loadingCity) return;

    const fetchBusinesses = async () => {
      try {
        setLoading(true);

        const params = {
          ...filters,
          ...(filters.distance && filters.lat && filters.lng
            ? {
                lat: filters.lat,
                lng: filters.lng,
                distance: filters.distance,
              }
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

      {/* MOBILE FILTER */}
      <MobileFilters filters={filters} updateFilter={updateFilter} />

      {/* SEARCH BAR */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto">
          <SmartSearchBar
            query={filters.q}
            setQuery={(v) => updateFilter("q", v)}
            onSearch={(v) => updateFilter("q", v)}
          />

          {/* SUBTEXT */}
          <p className="text-xs text-gray-400 mt-1">
            Showing results in {filters.city || "your area"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">

        {/* SIDEBAR */}
        <div className="hidden md:block w-64">
          <FiltersSidebar filters={filters} updateFilter={updateFilter} />
        </div>

        {/* MAIN */}
        <div className="flex-1">

          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
              {filters.q || filters.category || "Businesses"} in{" "}
              <span className="text-blue-600">
                {filters.city || "India"}
              </span>
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
              <div className="col-span-full text-center mt-12">
                <p className="text-lg font-semibold text-gray-700">
                  No results found
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  Try different keywords or remove some filters
                </p>

                <button
                  onClick={() => updateFilter("q", "")}
                  className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear Search
                </button>
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
            <div className="flex gap-2 mt-10 flex-wrap justify-center">

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateFilter("page", i + 1)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition ${
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