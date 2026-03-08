import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState(localStorage.getItem("servdial_city") || "");
  const [suggestions, setSuggestions] = useState([]);
  const [cities, setCities] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch cities and top categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cityRes, catRes] = await Promise.all([
          axios.get("/api/cities"),
          axios.get("/api/categories/top")
        ]);
        setCities(cityRes.data.cities || []);
        setTopCategories(catRes.data.categories || []);
      } catch (err) {
        console.error("Error fetching search data:", err);
      }
    };
    fetchData();
  }, []);

  // Autocomplete suggestions with debounce
  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(`/api/business/suggest?q=${search}`);
        setSuggestions(res.data.suggestions || []);
      } catch (err) {
        console.error("Search suggestions error:", err);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  // Navigate to results
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search || !city) return;
    // Analytics event can be triggered here
    console.log("User Search:", { city, search });
    navigate(`/${city}/${search}`);
  };

  return (
    <div className="relative w-full md:max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 justify-center relative">
        <select
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            localStorage.setItem("servdial_city", e.target.value);
          }}
          className="p-3 rounded text-black min-w-[150px]"
        >
          <option value="">Select City</option>
          {cities.map((c) => (
            <option key={c._id} value={c.name}>{c.name}</option>
          ))}
        </select>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search service (plumber, doctor...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 rounded text-black w-full"
          />
          {suggestions.length > 0 && (
            <ul className="absolute bg-white shadow rounded mt-1 w-full max-h-48 overflow-y-auto z-50">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSearch(s);
                    setSuggestions([]);
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded hover:bg-yellow-500 transition"
        >
          Search
        </button>
      </form>

      {/* Top Categories Quick Links */}
      {topCategories.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {topCategories.map((cat) => (
            <span
              key={cat._id}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-gray-300"
              onClick={() => {
                setSearch(cat.name);
                navigate(`/${city}/${cat.name}`);
              }}
            >
              {cat.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;