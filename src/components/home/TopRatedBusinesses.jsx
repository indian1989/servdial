import { useEffect, useState } from "react";
import API from "../../api/axios";
import BusinessCard from "../business/BusinessCard";

const TopRatedBusinesses = ({ city }) => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await API.get(`/businesses/top-rated?city=${city}`);
        setBusinesses(res?.data?.businesses || []);
      } catch {
        setBusinesses([]);
      }
    };

    fetchBusinesses();
  }, [city]);

  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">
          Top Rated Businesses
        </h2>
        <p className="text-gray-500 text-sm">
          Best reviewed services in {city}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((biz) => (
          <BusinessCard key={biz._id} business={biz} />
        ))}
      </div>
    </section>
  );
};

export default TopRatedBusinesses;