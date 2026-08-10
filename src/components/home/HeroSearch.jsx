import { useState, useEffect } from "react";
import { Mic, Locate } from "lucide-react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useCity } from "../../context/CityContext";
import SmartSearchBar from "../search/SmartSearchBar";

const HeroSearch = ({ city }) => {
  const navigate = useNavigate();

  const { city: globalCity, setCity } = useCity();

  const [query, setQuery] = useState("");
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  
  const currentCity =
    globalCity?.slug
      ? globalCity
      : city?.slug
      ? city
      : null;


  // ================= LOAD TRENDING =================
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await API.get("/search/trending");
        setTrending(res?.data?.data || []);
      } catch {
        setTrending(["Plumber", "Electrician", "Salon", "AC Repair"]);
      }
    };

    fetchTrending();

    const saved = JSON.parse(localStorage.getItem("recent_searches"));
    if (saved) setRecent(saved);
  }, []);

  
  // ================= SAVE RECENT =================
  const saveRecent = (value) => {
    const updated = [value, ...recent.filter((r) => r !== value)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  };

  // ================= EXTRACT CITY FROM QUERY =================
  const extractCityFromQuery = (text = "") => {
    const lower = text.toLowerCase().trim();
    const match = lower.match(/\b(?:in|at|near)\s+([a-z\s]+)$/i);
  
    if (!match) return null;
    
    return match[1].trim();
  };

  // ================= SEARCH =================
  const handleSearch = (value = query) => {
  const cleanValue = value?.trim();

  if (!cleanValue) return;

  saveRecent(cleanValue);

  const explicitCity = extractCityFromQuery(cleanValue);

  const finalCity = explicitCity
    ? explicitCity.toLowerCase().replace(/\s+/g, "-")
    : currentCity?.slug || "";

  navigate(
    `/search?q=${encodeURIComponent(cleanValue)}&city=${encodeURIComponent(finalCity)}`
  );
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
            // ⚠️ FIX: DO NOT call /cities directly (architecture violation fixed)
            const resCity = await API.get(
              `/search/autocomplete?q=${detected}`
            );

            const match = resCity?.data?.data?.find(
              (item) => item.type === "city"
            );

            if (match) {
              setCity({
                name: match.name,
                slug: match.slug,
              });
            }
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
  Find Verified Local Businesses
  <br />
  & Services in{" "}
  <span className="text-blue-600">
    {currentCity?.name || "your city"}
  </span>
</h1>

        <p className="text-gray-500 mt-3 text-sm md:text-base">
          Search restaurants, services, professionals and businesses across India on ServDial
        </p>
      </div>

      <div className="w-full max-w-3xl mx-auto relative">

        {/* SEARCH BAR */}
        <div className="flex items-center border border-gray-300 rounded-xl p-3 bg-white shadow-lg focus-within:ring-2 focus-within:ring-blue-500 transition">

          <div className="flex-1">

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