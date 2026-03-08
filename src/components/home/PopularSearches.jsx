import { useNavigate } from "react-router-dom";

const PopularSearches = () => {
  const navigate = useNavigate();

  const searches = [
    { category: "Restaurants", city: "Delhi" },
    { category: "Hospitals", city: "Mumbai" },
    { category: "Plumbers", city: "Bangalore" },
    { category: "Hotels", city: "Patna" },
    { category: "Electricians", city: "Chennai" },
    { category: "Car Repair", city: "Pune" },
    { category: "Beauty Salons", city: "Jaipur" },
    { category: "Real Estate", city: "Hyderabad" },
    { category: "Gyms", city: "Kolkata" },
    { category: "Schools", city: "Lucknow" },
    { category: "Pet Shops", city: "Ahmedabad" },
    { category: "Mobile Repair", city: "Chandigarh" }
  ];

  const handleSearch = (category, city) => {
    navigate(`/search?q=${category}&city=${city}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 mt-20">

      {/* TITLE */}
      <div className="text-center mb-10">

        <h2 className="text-2xl md:text-3xl font-bold">
          Popular Searches
        </h2>

        <p className="text-gray-500 mt-2 text-sm">
          Discover popular services people search for across cities
        </p>

      </div>

      {/* SEARCH LINKS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        {searches.map((item, index) => (
          <button
            key={index}
            onClick={() =>
              handleSearch(item.category, item.city)
            }
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