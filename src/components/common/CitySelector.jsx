import { useEffect, useState, useRef } from "react";
import { MapPin, ChevronDown, Locate, Loader2 } from "lucide-react";
import API from "../../api/axios";
import { useCity } from "../../context/CityContext";

const CitySelector = () => {
  const { city, setCity, detectLocation, loadingCity } = useCity();

  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const ref = useRef();

  // ================= FETCH CITIES =================
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const res = await API.get("/cities?dropdown=true");
        setCities(res.data.cities || []);
      } catch {
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  // ================= CLOSE DROPDOWN =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= FILTER =================
  const filtered = cities.filter((c) =>
    `${c.name} ${c.state || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ================= SELECT =================
  const handleSelect = (cityObj) => {
  if (!cityObj?._id) return;

  setCity({
    _id: cityObj._id,
    name: cityObj.name,
    slug: cityObj.slug,
    state: cityObj.state,
    district: cityObj.district,
  });

  setShow(false);
  setSearch("");
};

  return (
    <div className="relative" ref={ref}>

      {/* BUTTON */}
      <div
        onClick={() => setShow((prev) => !prev)}
        className="flex items-center gap-1 cursor-pointer hover:text-blue-600"
      >
        <MapPin size={16} className="text-blue-500" />

        <span className="text-sm font-medium">
          {loadingCity
  ? "Detecting..."
  : city?.name || "Select City"}
        </span>

        <ChevronDown size={14} />
      </div>

      {/* DROPDOWN */}
      {show && (
        <div className="absolute top-8 left-0 w-72 bg-white border rounded-xl shadow-xl z-50">

          {/* SEARCH */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search city..."
            className="w-full p-3 border-b outline-none text-sm"
          />

          {/* DETECT BUTTON */}
          <button
            onClick={() => {
              detectLocation();
              setShow(false);
            }}
            className="w-full flex items-center gap-2 p-3 text-sm hover:bg-gray-100 border-b"
          >
            <Locate size={16} className="text-green-600" />
            Detect my location
          </button>

          {/* LIST */}
          <div className="max-h-64 overflow-y-auto">

            {loading && (
              <div className="p-4 flex items-center justify-center text-gray-400">
                <Loader2 className="animate-spin mr-2" size={16} />
                Loading cities...
              </div>
            )}

            {!loading && filtered.length > 0 &&
              filtered.map((c) => (
                <div
                  key={c._id}
                  onClick={() => handleSelect(c)}
                  className={`p-3 cursor-pointer text-sm hover:bg-gray-100 ${
                    city?.slug === c.slug ? "bg-blue-50 font-medium" : ""
                  }`}
                >
                  {c.name}
                  {c.state && (
                    <span className="text-gray-400 ml-1">
                      , {c.state}
                    </span>
                  )}
                </div>
              ))
            }

            {!loading && filtered.length === 0 && (
              <div className="p-3 text-gray-400 text-sm">
                No cities found
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
};

export default CitySelector;