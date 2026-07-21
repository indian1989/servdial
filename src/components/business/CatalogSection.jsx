//frontend/src/components/business/CatalogSection.jsx
import { Package } from "lucide-react";

const CatalogSection = ({
  title = "Catalog",
  items = [],
}) => {
  if (!items?.length) return null;

  return (
    <section
      id="catalog"
      className="bg-white rounded-2xl shadow p-5"
    >
      <div className="flex items-center gap-2 mb-5">
        <Package
          size={22}
          className="text-blue-600"
        />

        <h2 className="text-xl font-bold">
          {title}
        </h2>
      </div>

      <div className="space-y-4">

        {items.map((item, index) => (

          <div
            key={index}
            className="flex justify-between gap-5 border-b pb-4 last:border-none"
          >

            {/* Left */}

            <div className="flex-1">

              <h3 className="font-semibold text-gray-800">
                {item.name}
              </h3>

              {item.description && (

                <p className="text-sm text-gray-500 mt-1">
                  {item.description}
                </p>

              )}

              {item.features?.length > 0 && (

                <ul className="mt-2 space-y-1">

                  {item.features.map((feature, i) => (

                    <li
                      key={i}
                      className="text-xs text-gray-500"
                    >
                      • {feature}
                    </li>

                  ))}

                </ul>

              )}

            </div>

            {/* Right */}

            <div className="text-right shrink-0">

              {item.price && (

                <div className="text-lg font-bold text-green-600">

                  {item.price}

                </div>

              )}

              {item.oldPrice && (

                <div className="text-sm line-through text-gray-400">

                  {item.oldPrice}

                </div>

              )}

              {item.badge && (

                <span className="inline-block mt-2 px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs">

                  {item.badge}

                </span>

              )}

            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default CatalogSection;