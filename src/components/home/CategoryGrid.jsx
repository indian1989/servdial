import { Link } from "react-router-dom";

const CategoryGrid = ({ categories, city }) => {

  if (!categories.length) return null;

  return (

    <div className="max-w-6xl mx-auto px-6 py-12">

      <h2 className="text-2xl font-bold mb-8 text-center">
        Popular Services
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">

        {categories.slice(0,12).map((cat) => (

          <Link
            key={cat._id}
            to={`/${city}/${cat.slug || cat.name.toLowerCase()}`}
            className="bg-white rounded-xl shadow hover:shadow-lg p-6 text-center transition"
          >

            {/* ICON */}

            {cat.icon ? (
              <img
                src={cat.icon}
                alt={cat.name}
                className="w-12 h-12 mx-auto mb-3"
              />
            ) : (
              <div className="text-3xl mb-3">🔧</div>
            )}

            <p className="text-sm font-medium">
              {cat.name}
            </p>

          </Link>

        ))}

      </div>

    </div>

  );
};

export default CategoryGrid;