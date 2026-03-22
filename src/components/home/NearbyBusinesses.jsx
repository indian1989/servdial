import BusinessCard from "../business/BusinessCard";

const NearbyBusinesses = ({ businesses = [], loading }) => {
  return (
    <section className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Nearby Businesses
          </h2>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-60 bg-gray-100 animate-pulse rounded-xl"
              />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && businesses.length === 0 && (
          <p className="text-gray-500">
            No nearby businesses found in your area.
          </p>
        )}

        {/* GRID */}
        {!loading && businesses.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {businesses.map((biz) => (
              <BusinessCard key={biz._id} business={biz} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default NearbyBusinesses;