import { useRef, useState, useEffect } from "react";
import API from "../../api/axios";
import { X } from "lucide-react";

const SmartSearchBar = ({
  query,
  setQuery,
  onSearch,
}) => {
  const inputRef = useRef(null);

  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // =============================
  // SUBMIT
  // =============================
  const submitSearch = (e) => {
    e.preventDefault();

    const clean = query?.trim();

    if (!clean) return;

    onSearch(clean);
    setSuggestions([]);
  };

  // =============================
  // CLEAR
  // =============================
  const clearInput = () => {
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  // =============================
  // KEYBOARD
  // =============================
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submitSearch(e);
    }
  };

  // =============================
  // AUTOCOMPLETE
  // =============================
  useEffect(() => {
    const clean = query?.trim();

    if (!clean || clean.length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    const fetchSuggestions = async () => {
      try {
        setLoadingSuggestions(true);

        const res = await API.get("/search/autocomplete", {
          params: { q: clean },
          signal: controller.signal,
        });

        setSuggestions(res?.data?.data || []);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setSuggestions([]);
        }
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300);

    return () => {
      clearTimeout(delay);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="relative w-full">

      {/* ================= SEARCH FORM ================= */}
      <form
        onSubmit={submitSearch}
        className="flex items-center bg-white rounded-xl"
      >

        {/* INPUT */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for local services..."
          autoComplete="off"
          className="w-full outline-none text-sm md:text-base placeholder-gray-400 bg-transparent"
        />

        {/* CLEAR */}
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

      {/* ================= SUGGESTIONS ================= */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-xl mt-2 z-50 overflow-hidden">

          {suggestions.map((s, i) => (
            <button
              key={s._id || i}
              type="button"
              onClick={() => {
                setQuery(s.name);
                onSearch(s.name);
                setSuggestions([]);
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition"
            >
              {s.name}
            </button>
          ))}

        </div>
      )}

      {/* ================= LOADING ================= */}
      {loadingSuggestions && (
        <div className="absolute top-full left-0 mt-2 text-xs text-gray-400">
          Searching...
        </div>
      )}

    </div>
  );
};

export default SmartSearchBar;