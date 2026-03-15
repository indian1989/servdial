import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

const BusinessListPage = () => {
  const { city, category } = useParams();

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinesses();
  }, [city, category]);

  const fetchBusinesses = async () => {
    try {
      const res = await API.get(`/business/search`, {
        params: { city, category },
      });

      setBusinesses(res?.data?.businesses || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching businesses", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-lg">
        Loading businesses...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

<h1 className="text-2xl font-bold mb-6 capitalize">
        <h1 className="text-2xl font-bold mb-6 capitalize">
Best {category} services in {city}
</h1>
      </h1>

      {businesses.length === 0 ? (
        <p>No businesses found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {businesses.map((biz) => (
            <div
              key={biz._id}
              className="bg-white shadow-md rounded-lg p-4"
            >
              <h2 className="text-lg font-semibold">{biz.name}</h2>

              <p className="text-sm text-gray-600">
                {biz.address}
              </p>

              <p className="text-blue-600 font-medium mt-2">
                {biz.phone}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessListPage;