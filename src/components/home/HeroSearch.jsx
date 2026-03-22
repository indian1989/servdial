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

  const [currentCity, setCurrentCity] = useState(city || globalCity);

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

  // ================= SYNC CITY =================
  useEffect(() => {
    const finalCity = globalCity || city;
    setCurrentCity(finalCity);
  }, [city, globalCity]);

  // ================= LOAD TRENDING =================
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await API.get("/categories/trending");
        const list = res?.data?.categories?.map((c) => c.name) || [];
        setTrending(list);
      } catch {
        setTrending([
          "Plumber",
          "Electrician",
          "Salon",
          "AC Repair",
          "Carpenter",
        ]);
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

  const handleTrending = (value) => {
    setQuery(value);
    handleSearch(value);
  };

  // ================= DETECT LOCATION =================
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

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
        } catch {
          alert("Unable to detect location");
        }
      },
      () => alert("Location permission denied")
    );
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Find Trusted Local Services in{" "}
          <span className="text-blue-600">
            {currentCity || "your city"}
          </span>
        </h1>

        <p className="text-gray-500 mt-2">
          Search from thousands of verified businesses near you
        </p>
      </div>

      <div ref={wrapperRef} className="w-full max-w-3xl mx-auto relative">

        {/* SEARCH BAR */}
        <div className="flex items-center border border-gray-300 rounded-xl p-3 bg-white shadow-xl">

          {/* INPUT */}
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

          {/* LOCATION BUTTON */}
          <button
            onClick={handleDetectLocation}
            className="text-gray-400 hover:text-blue-600 mr-2"
            title="Detect location"
          >
            <Locate size={18} />
          </button>

          {/* MIC (future use) */}
          <button className="text-gray-400 mr-2 hover:text-blue-500">
            <Mic size={18} />
          </button>

          {/* SEARCH BUTTON */}
          <button
            onClick={() => handleSearch()}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
          >
            <Search size={18} />
          </button>
        </div>

        {/* DROPDOWN */}
        {showSuggestions && (
          <div className="absolute w-full bg-white border rounded-xl shadow-xl mt-2 z-50 max-h-80 overflow-y-auto">

            {loadingSuggestions && (
              <div className="p-4 text-center text-gray-400 flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                Searching...
              </div>
            )}

            {!loadingSuggestions &&
              suggestions.map((item, i) => (
                <div
                  key={i}
                  onClick={() => handleSearch(item.name)}
                  className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <Search size={16} className="text-gray-400" />
                  {item.name}
                </div>
              ))}

            {!loadingSuggestions && suggestions.length === 0 && query && (
              <div className="p-3 text-sm text-gray-400">
                No results found
              </div>
            )}

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
          </div>
        )}

        {/* TRENDING */}
        <div className="flex flex-wrap gap-2 mt-6 justify-center">
          {trending.map((item, i) => (
            <button
              key={i}
              onClick={() => handleTrending(item)}
              className="px-4 py-1 text-sm border rounded-full hover:bg-blue-100 transition"
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