import { useNavigate } from "react-router-dom";

const FeaturedCities = ({ cities = [], loading = false }) => {
  const navigate = useNavigate();

  // Fallback hardcoded cities if no data passed
  const defaultCities = [
    { name: "Delhi", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5" },
    { name: "Mumbai", image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66" },
    { name: "Bangalore", image: "https://images.unsplash.com/photo-1596176530529-78163a4c76c6" },
    { name: "Hyderabad", image: "https://images.unsplash.com/photo-1625123009804-3f3c3f5a5d6c" },
    { name: "Chennai", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41" },
    { name: "Kolkata", image: "https://images.unsplash.com/photo-1558431382-27e303142255" }
  ];

  const list = cities.length ? cities : defaultCities;

  const openCity = (city) => {
    navigate(`/search?city=${city}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">
      {/* TITLE */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold">Explore Businesses by City</h2>
        <p className="text-gray-500 text-sm mt-1">Discover trusted services across major cities</p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {loading
          ? [...Array(6)].map((_, i) => (
              <div key={i} className="h-28 bg-gray-200 animate-pulse rounded-xl" />
            ))
          : list.map((city, i) => (
              <div
                key={i}
                onClick={() => openCity(city.name)}
                className="relative rounded-xl overflow-hidden cursor-pointer group"
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="h-28 w-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="text-white font-semibold text-lg">{city.name}</h3>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
};

export default FeaturedCities;