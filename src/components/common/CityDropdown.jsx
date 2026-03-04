import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const cityList = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Hajipur",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Bhopal",
  "Coimbatore"
];

const CityDropdown = ({ initialCity }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCity, setSelectedCity] = useState(initialCity || "");
  const [filteredCities, setFilteredCities] = useState(cityList);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter cities based on search text
  useEffect(() => {
    setFilteredCities(
      cityList.filter((city) =>
        city.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText]);

  const handleSelect = (city) => {
    setSelectedCity(city);       // ✅ Set selected city
    setSearchText("");
    setIsOpen(false);
    navigate(`/${city.toLowerCase()}`); // Navigate to city page
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="border px-3 py-2 rounded-md text-sm w-40 text-left flex justify-between items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCity || "Select City"} {/* ✅ Show selected city */}
        <span className="ml-2">▾</span>
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-40 bg-white shadow-lg rounded-md z-50 max-h-56 overflow-y-auto">
          {/* Search Input */}
          <div className="p-2">
            <input
              type="text"
              placeholder="Search city..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full border px-2 py-1 rounded text-sm focus:outline-none"
            />
          </div>

          {/* Suggested Cities */}
          <div className="divide-y">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <div
                  key={city}
                  className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                  onClick={() => handleSelect(city)}
                >
                  {city}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-sm">
                No cities found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CityDropdown;