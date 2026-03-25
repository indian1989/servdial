import { useRef } from "react";
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
    </div>
  );
};

export default SmartSearchBar;