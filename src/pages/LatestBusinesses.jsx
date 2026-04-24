import { useEffect, useState } from "react";
import API from "../api/axios";
import BusinessCard from "../components/business/BusinessCard";

const LatestBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await API.get("/businesses/latest");
        setBusinesses(res?.data?.data || res?.data?.businesses || []);
      } catch {
        setBusinesses([]);
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 mt-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">Latest Businesses</h1>
        <p className="text-gray-500 mt-2">
          Newly added businesses on ServDial
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

export default LatestBusinesses;