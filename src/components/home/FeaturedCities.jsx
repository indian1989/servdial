import { useNavigate } from "react-router-dom";

const FeaturedCities = ({
  cities = [],
  loading = false,
}) => {
  const navigate = useNavigate();

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-28 bg-gray-200 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  // ================= EMPTY =================
  if (!cities.length) {
    return (
      <div className="text-center text-gray-500 py-10">
        No cities available right now
      </div>
    );
  }

  // ================= NAVIGATION =================
  const openCity = (city) => {
    // ✅ Use valid category slug (example: "services")
    navigate(`/${city.slug}/all`);
  };

  // ================= UI =================
  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">
      {/* TITLE */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold">
          Explore Businesses by City
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Discover trusted services across cities
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {cities.map((city) => (
          <div
            key={city._id}
            onClick={() => openCity(city)}
            className="relative rounded-xl overflow-hidden cursor-pointer group"
          >
            <img
              src={city.image || "/no-image.png"} // ✅ safe fallback
              alt={city.name}
              className="h-28 w-full object-cover group-hover:scale-110 transition duration-300"
            />

            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h3 className="text-white font-semibold text-lg">
                {city.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCities;