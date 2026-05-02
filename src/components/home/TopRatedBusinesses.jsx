// components/home/TopRatedBusinesses.jsx

import BusinessCard from "../business/BusinessCard";

const TopRatedBusinesses = ({ businesses = [], city, loading }) => {
  if (!loading && businesses.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">
          Top Rated Businesses
        </h2>
        <p className="text-gray-500 text-sm">
          Best reviewed services in {city?.name || "your area"}
        </p>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-10 animate-pulse">
          Loading top rated businesses...
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((biz) => (
            <BusinessCard key={biz._id} business={biz} />
          ))}
        </div>
      )}
    </section>
  );
};

export default TopRatedBusinesses;