import { useNavigate } from "react-router-dom";

const PopularSearches = ({ searches = [], loading = false }) => {
  const navigate = useNavigate();

  const defaultSearches = [
    { category: "Restaurants", city: "Delhi" },
    { category: "Hospitals", city: "Mumbai" },
    { category: "Plumbers", city: "Bangalore" },
    { category: "Hotels", city: "Patna" },
    { category: "Electricians", city: "Chennai" },
    { category: "Car Repair", city: "Pune" }
  ];

  const list = searches.length ? searches : defaultSearches;

  const handleSearch = (category, city) => {
    navigate(`/search?q=${category}&city=${city}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 mt-20">
      {/* TITLE */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold">Popular Searches</h2>
        <p className="text-gray-500 mt-2 text-sm">
          Discover popular services people search for across cities
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? [...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-lg" />
            ))
          : list.map((item, i) => (
              <button
                key={i}
                onClick={() => handleSearch(item.category, item.city)}
                className="text-left border rounded-lg p-4 hover:shadow-md transition bg-white"
              >
                <p className="font-medium text-sm">
                  {item.category} in {item.city}
                </p>
              </button>
            ))}
      </div>
    </section>
  );
};

export default PopularSearches;