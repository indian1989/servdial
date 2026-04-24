import React from "react";
import { useNavigate } from "react-router-dom";

// ICONS
import home from "../../assets/icons/home.png";
import construction from "../../assets/icons/construction.png";
import health from "../../assets/icons/health.png";
import education from "../../assets/icons/education.png";
import restaurant from "../../assets/icons/restaurant.png";
import automobile from "../../assets/icons/automobile.png";
import realestate from "../../assets/icons/realestate.png";
import travel from "../../assets/icons/travel.png";
import shopping from "../../assets/icons/shopping.png";
import beauty from "../../assets/icons/beauty.png";
import events from "../../assets/icons/events.png";
import it from "../../assets/icons/it.png";
import finance from "../../assets/icons/finance.png";
import legal from "../../assets/icons/legal.png";
import industrial from "../../assets/icons/industrial.png";
import electronics from "../../assets/icons/electronics.png";
import furniture from "../../assets/icons/furniture.png";
import courier from "../../assets/icons/courier.png";
import printing from "../../assets/icons/printing.png";
import agriculture from "../../assets/icons/agriculture.png";

// ICON MAP
const iconMap = {
  "home-services": home,
  "construction-contractors": construction,
  "health-medical": health,
  "education-training": education,
  "restaurants-food": restaurant,
  "automobiles": automobile,
  "real-estate": realestate,
  "travel-transport": travel,
  "shopping-retail": shopping,
  "beauty-personal-care": beauty,
  "events-entertainment": events,
  "it-digital-services": it,
  "financial-services": finance,
  "legal-services": legal,
  "industrial-manufacturing": industrial,
  "electronics-repair": electronics,
  "furniture-interior": furniture,
  "courier-logistics": courier,
  "printing-advertising": printing,
  "agriculture-farming": agriculture,
};

const getParentIcon = (cat) => {
  return iconMap[cat.slug] || null;
};

const CategoriesGrid = ({ categories = [], city, loading = false }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
  if (!city?.slug || !category?.slug) return;

  // 🔥 CITY-BASED FLOW (BUSINESS DISCOVERY)
  navigate(`/category/${category.slug}`);
};

  // ✅ ONLY ACTIVE + TOP 20
  const topCategories = (categories || [])
  .filter((c) => !c.parentCategory) // ONLY PARENTS
  .sort((a, b) => (a.order || 0) - (b.order || 0))
  .slice(0, 20);

  if (!loading && (!categories || categories.length === 0)) {
  return (
    <div className="text-center py-10 text-gray-400">
      No categories found
    </div>
  );
}

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
        {topCategories.map((cat) => {
          const icon = getParentIcon(cat);

          return (
            <div
              key={cat._id}
              onClick={() => handleCategoryClick(cat)}
              className="flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all group bg-white"
            >
              {/* ICON */}
              <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-blue-50 transition">
                {icon ? (
                  <img
                    src={icon}
                    alt={cat.name}
                    className="w-20 h-20 object-contain"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">No Icon</span>
                )}
              </div>

              {/* NAME */}
              <span className="text-xs text-center mt-1 font-medium">
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>
    )}

    {/* VIEW ALL BUTTON */}
    <div className="text-center mt-8">
      <button
        onClick={() => navigate("/categories")}
        className="px-6 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
      >
        View All Categories
      </button>
    </div>

  </section>
);
};

export default CategoriesGrid;