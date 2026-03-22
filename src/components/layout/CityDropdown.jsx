import { useState, useEffect, useRef } from "react";

const defaultCities = [
  "Delhi",
  "Mumbai",
  "Kolkata",
  "Chennai",
  "Bangalore",
  "Hyderabad",
  "Patna",
  "Ahmedabad"
];

const CityDropdown = () => {
  const [cities, setCities] = useState(defaultCities);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("Select City");
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const dropdownRef = useRef(null);

  // Load saved city
  useEffect(() => {
    const savedCity = localStorage.getItem("servdial_city");
    if (savedCity) {
      setSelectedCity(savedCity);
    }
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (city) => {
    setSelectedCity(city);
    localStorage.setItem("servdial_city", city);
    setSearch("");
    setOpen(false);
  };

  // Keyboard Navigation
  const handleKeyDown = (e) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      setHighlightIndex((prev) =>
        prev < filteredCities.length - 1 ? prev + 1 : prev
      );
    }

    if (e.key === "ArrowUp") {
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }

    if (e.key === "Enter") {
      handleSelect(filteredCities[highlightIndex]);
    }
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <button
        onClick={() => setOpen(!open)}
        className="border px-4 py-2 rounded-md bg-gray-50 hover:bg-gray-100 text-sm min-w-[140px]"
      >
        {selectedCity}
      </button>

      {open && (
        <div className="absolute bg-white shadow-lg w-52 mt-2 rounded-md z-50">

          <input
            type="text"
            placeholder="Search city..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setHighlightIndex(0);
            }}
            className="w-full px-3 py-2 border-b outline-none text-sm"
            autoFocus
          />

          <div className="max-h-48 overflow-y-auto">
            {filteredCities.length > 0 ? (
              filteredCities.map((city, index) => (
                <div
                  key={city}
                  onClick={() => handleSelect(city)}
                  className={`px-3 py-2 cursor-pointer text-sm ${
                    highlightIndex === index
                      ? "bg-blue-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {city}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-sm">
                No city found
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default CityDropdown;