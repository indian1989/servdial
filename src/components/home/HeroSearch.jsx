import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const defaultSuggestions = [
  "Plumber",
  "Electrician",
  "Doctor",
  "Lawyer",
  "AC Repair",
  "Interior Designer",
];

const HeroSearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingNearMe, setLoadingNearMe] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [city, setCity] = useState(""); // ✅ city state

  const navigate = useNavigate();

  // Load city from localStorage on mount
  useEffect(() => {
    const storedCity = localStorage.getItem("servdial_city") || "";
    setCity(storedCity.trim());
  }, []);

  // Debounced suggestions
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.length > 1) {
        const filtered = defaultSuggestions.filter((item) =>
          item.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered);
        setHighlightIndex(0);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(
      `/business?city=${city || ""}&search=${encodeURIComponent(query)}`
    );
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation not supported by your browser.");
      return;
    }

    setLoadingNearMe(true);
    setErrorMessage("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        navigate(
          `/business?lat=${position.coords.latitude}&lng=${position.coords.longitude}`
        );
        setLoadingNearMe(false);
        setCity(""); // reset city when using Near Me
      },
      () => {
        setErrorMessage("Location access denied. Please allow location.");
        setLoadingNearMe(false);
      }
    );
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    }

    if (e.key === "ArrowUp") {
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }

    if (e.key === "Enter") {
      setQuery(suggestions[highlightIndex]);
      setSuggestions([]);
      handleSearch();
    }
  };

  return (
    <section className="relative py-1 text-center">
      <div className="max-w-4xl mx-auto px-4">
        {/* Dynamic City Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
          Find Trusted Businesses{" "}
          {city ? `in ${city}` : "Near You"} {/* ✅ city OR Near You */}
        </h2>

        {/* Search Bar */}
        <div className="relative flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search Plumber, Doctor, Electrician..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Search businesses"
            className="flex-grow px-6 py-4 text-black focus:outline-none"
          />

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-4 font-semibold hover:bg-blue-700 transition"
          >
            Search
          </button>

          <button
            onClick={handleNearMe}
            disabled={loadingNearMe}
            className={`px-6 py-4 font-semibold transition ${
              loadingNearMe
                ? "bg-gray-400"
                : "bg-yellow-400 hover:bg-yellow-500 text-black"
            }`}
          >
            {loadingNearMe ? "Detecting..." : "Near Me"}
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-500 mt-2 font-medium">{errorMessage}</p>
        )}

        {/* Auto-suggestions */}
        {suggestions.length > 0 && (
          <div
            role="listbox"
            className="absolute w-full bg-white text-black mt-2 rounded-lg shadow-lg z-50"
          >
            {suggestions.map((item, index) => (
              <div
                key={item}
                onClick={() => {
                  setQuery(item);
                  setSuggestions([]);
                  handleSearch();
                }}
                role="option"
                aria-selected={highlightIndex === index}
                className={`px-4 py-3 cursor-pointer text-left ${
                  highlightIndex === index ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                {item} {city ? `in ${city}` : ""}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSearch;