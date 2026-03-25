import { useState, useEffect, useRef } from "react";
import { Search, Mic, Loader2, Locate } from "lucide-react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useCity } from "../../context/CityContext";
import SmartSearchBar from "../search/SmartSearchBar";

const HeroSearch = ({ city }) => {
  const navigate = useNavigate();
  const wrapperRef = useRef();

  const { city: globalCity, setCity } = useCity();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const currentCity = globalCity || city;

  // ================= CLOSE DROPDOWN =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= LOAD TRENDING =================
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await API.get("/categories/trending");
        const list = res?.data?.categories?.map((c) => c.name) || [];
        setTrending(list);
      } catch {
        setTrending(["Plumber", "Electrician", "Salon", "AC Repair"]);
      }
    };

    fetchTrending();

    const saved = JSON.parse(localStorage.getItem("recent_searches"));
    if (saved) setRecent(saved);
  }, []);

  // ================= SUGGESTIONS =================
  useEffect(() => {
    if (!query || !currentCity) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoadingSuggestions(true);

        const res = await API.get(
          `/search/suggestions?q=${query}&city=${currentCity}`
        );

        setSuggestions(res?.data || []);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query, currentCity]);

  // ================= SAVE RECENT =================
  const saveRecent = (value) => {
    const updated = [value, ...recent.filter((r) => r !== value)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  };

  // ================= SEARCH =================
  const handleSearch = (value = query) => {
    if (!value || !currentCity) return;

    saveRecent(value);
    navigate(`/search?q=${value}&city=${currentCity}`);
    setShowSuggestions(false);
  };

  // ================= DETECT LOCATION =================
  const handleDetectLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await API.get(
            `/location/reverse?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`
          );

          const detected = res?.data?.city;

          if (detected) {
            setCity(detected);
            localStorage.setItem("servdial_city", detected);
          }
        } catch {}
      },
      () => {}
    );
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-14 px-4">
      {/* HEADLINE */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
          Find Trusted Services in{" "}
          <span className="text-blue-600">
            {currentCity || "your city"}
          </span>
        </h1>

        <p className="text-gray-500 mt-3 text-sm md:text-base">
          Discover verified professionals for home services, repairs, and more
        </p>
      </div>

      <div ref={wrapperRef} className="w-full max-w-3xl mx-auto relative">

        {/* SEARCH BAR */}
        <div className="flex items-center border border-gray-300 rounded-xl p-3 bg-white shadow-lg focus-within:ring-2 focus-within:ring-blue-500 transition">

          <div
            className="flex-1"
            onFocus={() => setShowSuggestions(true)}
          >
            <SmartSearchBar
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch}
            />
          </div>

          {/* LOCATION */}
          <button
            onClick={handleDetectLocation}
            className="text-gray-400 hover:text-blue-600 mr-2"
            title="Detect location"
          >
            <Locate size={18} />
          </button>

          {/* MIC */}
          <button className="text-gray-400 mr-2 hover:text-blue-500">
            <Mic size={18} />
          </button>

          {/* SEARCH */}
          <button
            onClick={() => handleSearch()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm"
          >
            Search
          </button>
        </div>

        {/* DROPDOWN */}
        {showSuggestions && (
          <div className="absolute w-full bg-white border rounded-xl shadow-xl mt-2 z-50 max-h-96 overflow-y-auto">

            {/* LOADING */}
            {loadingSuggestions && (
              <div className="p-4 text-center text-gray-400 flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                Searching...
              </div>
            )}

            {/* SUGGESTIONS */}
            {!loadingSuggestions && suggestions.length > 0 && (
              <>
                <div className="px-3 pt-3 text-xs text-gray-400">
                  Suggestions
                </div>
                {suggestions.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleSearch(item.name)}
                    className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  >
                    <Search size={16} className="text-gray-400" />
                    {item.name}
                  </div>
                ))}
              </>
            )}

            {/* EMPTY */}
            {!loadingSuggestions && query && suggestions.length === 0 && (
              <div className="p-3 text-sm text-gray-400">
                No results found for "{query}"
              </div>
            )}

            {/* RECENT */}
            {recent.length > 0 && (
              <>
                <div className="px-3 pt-3 text-xs text-gray-400">
                  Recent Searches
                </div>
                {recent.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleSearch(item)}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                  >
                    {item}
                  </div>
                ))}
              </>
            )}

            {/* TRENDING */}
            {!query && trending.length > 0 && (
              <>
                <div className="px-3 pt-3 text-xs text-gray-400">
                  Trending
                </div>
                {trending.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleSearch(item)}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                  >
                    🔥 {item}
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* TRENDING CHIPS */}
        <div className="flex flex-wrap gap-2 mt-6 justify-center">
          {trending.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSearch(item)}
              className="px-4 py-1.5 text-sm border rounded-full hover:bg-blue-100 transition"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSearch;