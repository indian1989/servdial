import { Utensils, Image as ImageIcon } from "lucide-react";

const MenuItemsSection = ({ business }) => {
  const menu = (business?.menu || []).filter((item) => item.isAvailable);

  return (
    <section
      id="food-menu"
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6 scroll-mt-24"
    >

      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
            <Utensils className="w-7 h-7 text-orange-600" />
          </div>

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Food Menu
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Explore delicious dishes and signature specials
            </p>

          </div>

        </div>

        <div className="inline-flex items-center rounded-full bg-orange-50 text-orange-700 px-4 py-2 text-sm font-semibold">
          {menu.length} item{menu.length !== 1 ? "s" : ""}
        </div>

      </div>

      {/* Empty State */}

      {menu.length === 0 ? (

        <div className="border border-dashed border-gray-300 rounded-2xl p-10 text-center mt-6">

          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900">
            Menu not available yet
          </h3>

          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            The business owner has not added food items yet. Please check back later for updated dishes and prices.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">

          {menu.map((item, index) => (

            <div
              key={index}
              className="group border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >

              {/* Image */}

              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">

                {item.image ? (

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                ) : (

                  <div className="w-full h-full flex items-center justify-center">
                    <Utensils className="w-10 h-10 text-gray-400" />
                  </div>

                )}

                {item.category && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-gray-800 shadow-sm">
                      {item.category}
                    </span>
                  </div>
                )}

              </div>

              {/* Content */}

              <div className="p-5">

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                      {item.name}
                    </h3>

                  </div>

                  <div className="shrink-0 text-right">

                    <div className="text-lg font-bold text-orange-600">
                      ₹{item.price}
                    </div>

                  </div>

                </div>

                {item.description && (
                  <p className="text-gray-600 text-sm mt-3 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                )}

                {/* Footer */}

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">

                  <span className="inline-flex items-center rounded-full bg-green-50 text-green-700 text-xs font-semibold px-3 py-1">
                    Available
                  </span>

                  <button
                    type="button"
                    className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    View details
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </section>
  );
};

export default MenuItemsSection;