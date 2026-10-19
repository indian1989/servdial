
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const MenuItemsSection = ({ business }) => {
  const menu = (business?.menu || []).filter(
    (item) => item.isAvailable
  );

  const [showAllMenu, setShowAllMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");

// Desktop 4, tablet 2, mobile 1
const [visibleCount, setVisibleCount] = useState(() => {
  if (typeof window === "undefined") return 4;

  if (window.innerWidth >= 1024) return 4;
  if (window.innerWidth >= 640) return 2;
  return 1;
});

  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
  const updateVisibleCount = () => {
    const width = window.innerWidth;

    setVisibleCount(
      width >= 1024 ? 4 : width >= 640 ? 2 : 1
    );
  };

  updateVisibleCount();
  window.addEventListener("resize", updateVisibleCount);

  return () => {
    window.removeEventListener("resize", updateVisibleCount);
  };
}, []);

 
  useEffect(() => {
    if (!showAllMenu) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowAllMenu(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showAllMenu]);

  
  // Group available menu items by category.
  const groupedMenu = menu.reduce((groups, item) => {
    const category = item.category?.trim() || "Other";

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(item);
    return groups;
  }, {});

  const categoryOrder = [
    "Soups",
    "Starters",
    "Biryani Special",
    "Mutton Special",
    "Chicken Special",
    "Mushroom Special",
    "Paneer Special",
    "Rice & Pulao",
    "Tandoori & Grilled",
    "Indian Breads",
    "Main Course",
    "Thali & Combos",
    "Salads",
    "Snacks",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "Pasta",
    "Noodles",
    "Momos",
    "South Indian",
    "Chinese",   
    "Seafood",
    "Special Dishes",
    "Desserts",
    "Ice Cream",
    "Beverages",
    "Tea & Coffee",
    "Other",
  ];

  const sortedCategories = Object.keys(groupedMenu).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);

    if (indexA === -1 && indexB === -1) {
      return a.localeCompare(b);
    }

    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  useEffect(() => {
  if (sortedCategories.length === 0) {
    setActiveCategory("");
    return;
  }

  
  setActiveCategory((current) => {
    // Current category abhi bhi available hai
    if (current && sortedCategories.includes(current)) {
      return current;
    }

    // Default Biryani, agar available hai
    if (sortedCategories.includes("Biryani")) {
      return "Biryani";
    }

    // Warna pehli available category
    return sortedCategories[0];
  });
}, [menu.length, sortedCategories.join("|")]);

const activeMenu = groupedMenu[activeCategory] || [];
 useEffect(() => {
  setStartIndex(0);
}, [activeCategory, visibleCount]);

  useEffect(() => {
  if (activeMenu.length <= visibleCount || showAllMenu) {
    return;
  }

  const timer = setInterval(() => {
    setStartIndex((current) => {
      const nextIndex = current + visibleCount;

      return nextIndex >= activeMenu.length ? 0 : nextIndex;
    });
  }, 6000);

  return () => clearInterval(timer);
}, [activeCategory, activeMenu.length, visibleCount, showAllMenu]);

const visibleMenu = Array.from(
  { length: Math.min(visibleCount, activeMenu.length) },
  (_, index) => activeMenu[(startIndex + index) % activeMenu.length]
);

  const renderMenuCard = (item, index, compact = false) => (
    <div
      key={item._id || `${item.name}-${index}`}
      
        className={`w-full min-w-0 box-border border rounded-xl transition-all duration-200 ${
          index % 2 === 0
            ? "bg-white border-gray-500 shadow-sm"
            : "bg-gray-200 border-gray-500 shadow-sm"
        } hover:border-orange-300 hover:shadow-md ${
          compact ? "p-2.5" : "p-3"
        }`}

    >

      {/* Dish name and price */}
      <div className="flex min-w-0 items-start justify-between gap-2 sm:gap-3">
        <h3
          className={`font-semibold text-gray-900 min-w-0 ${
            compact ? "text-sm" : "text-base sm:text-lg"
          }`}
        >
          {item.name}
        </h3>

        <span className="shrink-0 font-bold text-orange-600 whitespace-nowrap">
          ₹{item.price}
        </span>
      </div>

      {/* Description */}
      {item.description && (
        <p
          className={`text-gray-600 mt-2 leading-relaxed ${
            compact ? "text-xs line-clamp-3" : "text-sm line-clamp-3"
          }`}
        >
          {item.description}
        </p>
      )}

      
      {/* Bottom row: Category | Available | View details */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-gray-100">
        <div className="min-w-0 flex-1">
          {item.category && (
            <span className="inline-block max-w-full truncate rounded-full bg-orange-50 text-orange-700 text-xs font-semibold px-2 py-1">
              {item.category}
            </span>
          )}
        </div>

        <span className="shrink-0 rounded-full bg-green-50 text-green-700 text-xs font-semibold px-2 py-1">
          Available
        </span>

        
      </div>

    </div>
  );

  return (
    <section
      id="food-menu"
      
className="w-full min-w-0 max-w-full box-border bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6 mt-4 sm:mt-6 scroll-mt-24"

    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Food Menu
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Explore delicious dishes and signature specials
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center rounded-full bg-orange-50 text-orange-700 px-3 py-2 text-sm font-semibold">
            {menu.length} item{menu.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
      
      {/* Empty State / Category Tabs / Selected Category Menu */}
      {menu.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-8 text-center sm:p-10">
          <h3 className="text-lg font-semibold text-gray-900">
            Menu not available yet
          </h3>
          <p className="mx-auto mt-2 max-w-md text-gray-500">
            The business owner has not added food items yet.
            Please check back later for updated dishes and prices.
          </p>
        </div>
      ) : (
        <div className="mt-5 min-w-0">
          {/* Horizontal Category Tabs */}
          <div
            className="flex min-w-0 gap-2 overflow-x-auto border-b border-gray-200 pb-3"
            role="tablist"
            aria-label="Menu categories"
          >
            {sortedCategories.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  id={`menu-tab-${category.replace(/[^a-zA-Z0-9]/g, "-")}`}
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-orange-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-700"
                  }`}
                >
                  {category}
                  <span className="ml-2 text-xs opacity-80">
                    {groupedMenu[category].length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Category Heading */}
          <div className="mt-4 mb-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3
                id="active-menu-heading"
                className="text-lg font-bold text-gray-900 sm:text-xl"
              >
                {activeCategory}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {activeMenu.length} available item
                {activeMenu.length !== 1 ? "s" : ""}
              </p>
            </div>

            {activeMenu.length > visibleCount && (
              <button
                type="button"
                onClick={() => setShowAllMenu(true)}
                className="shrink-0 rounded-full border border-orange-600 px-3 py-2 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-50"
              >
                View All Menu →
              </button>
            )}
          </div>

          {/* Responsive Menu Cards: Desktop 4, Tablet 2, Mobile 1 */}
          <div
            role="tabpanel"
            aria-labelledby={`menu-tab-${activeCategory.replace(/[^a-zA-Z0-9]/g, "-")}`}
            className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {visibleMenu.map((item, index) =>
              renderMenuCard(item, index)
            )}
          </div>
        </div>
      )}

      {/* View All Menu Popup */}
      {showAllMenu && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/60 p-0 sm:p-6"
          onClick={() => setShowAllMenu(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Complete food menu"
            className="flex h-[100dvh] max-h-[100dvh] w-full min-w-0 max-w-6xl flex-col overflow-hidden rounded-none bg-white sm:h-auto sm:max-h-[90vh] sm:rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Popup header */}
            <div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                {activeCategory} Menu
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {activeMenu.length} available items
              </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAllMenu(false)}
                aria-label="Close menu"
                className="shrink-0 p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            
  {/* All items from the selected category */}
<div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-5">
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
    {activeMenu.map((item, index) =>
      renderMenuCard(item, index, true)
    )}
  </div>
</div>
           </div>
        </div>
      )}
    </section>
  );
};

export default MenuItemsSection;