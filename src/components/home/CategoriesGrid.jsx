import React from "react";
import { useNavigate } from "react-router-dom";

const CategoriesGrid = ({ categories, city, loading = false }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    if (!city) return;
    navigate(`/search?q=${category.name}&city=${city}`);
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8">
      {/* TITLE */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Explore Popular Services</h2>
        <p className="text-gray-500 text-sm mt-1">
          Find trusted local businesses near you
        </p>
      </div>

      {/* GRID */}
      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => handleCategoryClick(cat)}
              className="flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all group"
            >
              {/* IMAGE ICON */}
              <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition">
                <img
                  src={cat.icon || "/default-icon.png"}
                  alt={cat.name}
                  className="w-10 h-10 object-contain"
                />
              </div>

              {/* NAME */}
              <span className="text-xs text-center mt-2 font-medium">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoriesGrid;