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
  "Home Services": home,
  "Construction & Contractors": construction,
  "Health & Medical": health,
  "Education & Training": education,
  "Restaurants & Food": restaurant,
  "Automobiles": automobile,
  "Real Estate": realestate,
  "Travel & Transport": travel,
  "Shopping & Retail": shopping,
  "Beauty & Personal Care": beauty,
  "Events & Entertainment": events,
  "It & Digital Services": it,
  "Financial Services": finance,
  "Legal Services": legal,
  "Industrial & Manufacturing": industrial,
  "Electronics Repair": electronics,
  "Furniture & Interior": furniture,
  "Courier & Logistics": courier,
  "Printing & Advertising": printing,
  "Agriculture & Farming": agriculture,
};

const CategoriesGrid = ({ categories = [], city, loading = false }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    if (!city) return;
    navigate(`/search?q=${category.name}&city=${city}`);
  };

  // ✅ ONLY ACTIVE + TOP 20
  const topCategories = categories
    .filter((c) => c.status === "active")
    .sort((a, b) => a.order - b.order)
    .slice(0, 20);

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
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
            {topCategories.map((cat) => {
              const icon = iconMap[cat.name];

              return (
                <div
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat)}
                  className="flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all group bg-white"
                >
                  {/* ICON */}
                  <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-blue-50 transition">
                    <img
                      src={icon}
                      alt={cat.name}
                      className="w-12 h-12 object-contain"
                    />
                  </div>

                  {/* NAME */}
                  <span className="text-xs text-center mt-2 font-medium">
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* VIEW ALL BUTTON */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/categories")}
              className="px-6 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
            >
              View All Categories
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default CategoriesGrid;