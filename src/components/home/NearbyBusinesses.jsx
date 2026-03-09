import { Link } from "react-router-dom";

const NearbyBusinesses = ({ businesses = [], loading }) => {
  return (
    <section className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-4">

        {/* Section Title */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Nearby Businesses
          </h2>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-gray-500">Loading nearby businesses...</p>
        )}

        {/* Empty State */}
        {!loading && businesses.length === 0 && (
          <p className="text-gray-500">
            No nearby businesses found in your area.
          </p>
        )}

        {/* Businesses Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {businesses.map((biz) => (

            <Link
              key={biz._id}
              to={`/business/${biz._id}`}
              className="bg-white border rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
            >

              {/* Business Image */}
              <div className="h-40 bg-gray-100 overflow-hidden">
                <img
                  src={
                    biz.image ||
                    "https://via.placeholder.com/400x250?text=Business"
                  }
                  alt={biz.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Business Info */}
              <div className="p-4">

                <h3 className="font-semibold text-gray-800 line-clamp-1">
                  {biz.name}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {biz.category}
                </p>

                <p className="text-sm text-gray-500">
                  {biz.city}
                </p>

                {/* Rating */}
                <div className="flex items-center mt-2">

                  <span className="text-yellow-500 mr-1">
                    ⭐
                  </span>

                  <span className="text-sm font-medium">
                    {biz.rating || "4.5"}
                  </span>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>
    </section>
  );
};

export default NearbyBusinesses;