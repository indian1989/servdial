// frontend/src/components/search/SmartSearchBar.jsx
import { useRef, useState, useEffect } from "react";
import API from "../../api/axios";
import { X } from "lucide-react";

const SmartSearchBar = ({
  query,
  setQuery,
  onSearch,
}) => {
  const inputRef = useRef();

  // -----------------------------
  // SUBMIT
  // -----------------------------
  const submitSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
  };

  // -----------------------------
  // CLEAR INPUT
  // -----------------------------
  const clearInput = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  // -----------------------------
  // KEYBOARD HANDLING
  // -----------------------------
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submitSearch(e);
    }
  };

  // -----------------------------
  // SHOW SUGGESTION
  // -----------------------------
  const [suggestions, setSuggestions] = useState([]);

  // =========== SHOW SUGGESTION USE EFFECT ========
  useEffect(() => {
  if (!query || query.length < 2) {
    setSuggestions([]);
    return;
  }

  const fetchSuggestions = async () => {
    try {
      const res = await API.get(`/businesses/suggest?q=${query}`);
      setSuggestions(res.data?.suggestions || []);
    } catch (err) {}
  };

  const delay = setTimeout(fetchSuggestions, 300);
  return () => clearTimeout(delay);
}, [query]);

  return (
    <div className="relative w-full">
      <form onSubmit={submitSearch} className="flex items-center">

        {/* INPUT */}
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Search for local services, e.g. plumbers, electricians, hotels in your city...`}
          className="w-full outline-none text-sm md:text-base placeholder-gray-400"
        />

        {/* CLEAR BUTTON */}
        {query && (
          <button
            type="button"
            onClick={clearInput}
            className="text-gray-400 hover:text-gray-600 mr-2"
          >
            <X size={16} />
          </button>
        )}
      </form>

      {/* SHOW SUGGESTION */}
{suggestions.length > 0 && (
  <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-xl mt-2 z-50">

    {suggestions.map((s) => (
      <div
        key={s._id}
        onClick={() => {
          setQuery(s.name);
          onSearch(s.name);
          setSuggestions([]);
        }}
        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
      >
        {s.name}
      </div>
    ))}

  </div>
)}
    </div>
  );
};

export default SmartSearchBar;