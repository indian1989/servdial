import { useState, useEffect } from "react";
import { Search, Mic, MapPin } from "lucide-react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import SmartSearchBar from "../search/SmartSearchBar";

const HeroSearch = ({ city }) => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);

  const [showSuggestions, setShowSuggestions] = useState(false);

  // -----------------------------
  // LOAD TRENDING CATEGORIES
  // -----------------------------
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await API.get("/categories/trending");
        setTrending(res.data);
      } catch {
        setTrending([
          "Restaurants",
          "Hospitals",
          "Electricians",
          "Hotels",
          "Real Estate",
          "Schools",
        ]);
      }
    };

    fetchTrending();

    const saved = JSON.parse(localStorage.getItem("recent_searches"));
    if (saved) setRecent(saved);
  }, []);

  // -----------------------------
  // SEARCH SUGGESTIONS
  // -----------------------------
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await API.get(`/search/suggestions?q=${query}&city=${city}`);
        setSuggestions(res.data);
      } catch {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query, city]);

  // -----------------------------
  // SAVE RECENT SEARCH
  // -----------------------------
  const saveRecent = (value) => {
    const updated = [value, ...recent.filter((r) => r !== value)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  };

  // -----------------------------
  // SEARCH SUBMIT
  // -----------------------------
  const handleSearch = (value = query) => {
    if (!value) return;

    saveRecent(value);

    navigate(`/search?q=${value}&city=${city}`);
  };

  // -----------------------------
  // CLICK TRENDING
  // -----------------------------
  const handleTrending = (value) => {
    setQuery(value);
    handleSearch(value);
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative">

      {/* SEARCH BAR */}
      <div className="flex items-center border border-gray-300 rounded-xl p-3 bg-white shadow-lg">

        <MapPin className="text-gray-400 mr-2" size={18} />

        <span className="text-gray-600 text-sm mr-3">
          {city || "Select City"}
        </span>

       <SmartSearchBar />
        <button className="text-gray-400 mr-2">
          <Mic size={18} />
        </button>

        <button
          onClick={() => handleSearch()}
          className="bg-blue-600 text-white p-2 rounded-lg"
        >
          <Search size={18} />
        </button>
      </div>

      {/* SUGGESTIONS */}
      {showSuggestions && (suggestions.length > 0 || query) && (
        <div className="absolute w-full bg-white border rounded-xl shadow-lg mt-2 z-50 max-h-80 overflow-y-auto">

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
        </div>
      )}

      {/* TRENDING */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {trending.map((item, i) => (
          <button
            key={i}
            onClick={() => handleTrending(item)}
            className="px-4 py-1 text-sm border rounded-full hover:bg-blue-50"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroSearch;