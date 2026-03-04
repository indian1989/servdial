import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { Helmet } from "react-helmet-async";

const AllBusinesses = () => {
  const { city, service } = useParams();
  const navigate = useNavigate();

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {};
        if (city) params.city = city;
        if (service) params.search = service;

        const { data } = await axios.get("/api/business", { params });
        setBusinesses(data.businesses || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch businesses"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [city, service]);

  /* 🔥 SEO SECTION */

  const formattedCity = city
    ? city.charAt(0).toUpperCase() + city.slice(1)
    : null;

  const formattedService = service
    ? service.charAt(0).toUpperCase() + service.slice(1)
    : null;

  const title = service && city
    ? `${formattedService} in ${formattedCity} | ServDial`
    : city
    ? `Businesses in ${formattedCity} | ServDial`
    : "All Businesses in India | ServDial";

  const description = service && city
    ? `Find the best ${formattedService} in ${formattedCity}. Compare ratings, reviews and contact details on ServDial.`
    : city
    ? `Discover top businesses in ${formattedCity}. Verified listings with ratings and contact details.`
    : "Explore verified local businesses across India. Search by city and service on ServDial.";

  const canonicalUrl = service && city
    ? `https://servdial.com/${city}/${service}`
    : city
    ? `https://servdial.com/${city}`
    : "https://servdial.com/business";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description: description,
    url: canonicalUrl,
  };

  return (
    <>
      {/* ✅ SEO META */}
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />

        <link rel="canonical" href={canonicalUrl} />

        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-3xl font-bold mb-6 capitalize">
            {service
              ? `${formattedService} in ${formattedCity}`
              : city
              ? `Businesses in ${formattedCity}`
              : "All Businesses"}
          </h1>

          {loading && (
            <p className="text-gray-500">Loading businesses...</p>
          )}

          {error && (
            <p className="text-red-500">{error}</p>
          )}

          {!loading && !error && businesses.length === 0 && (
            <p className="text-gray-500">No businesses found.</p>
          )}

          {!loading && !error && businesses.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <div
                  key={business._id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                >
                  <h2 className="text-xl font-semibold mb-2">
                    {business.name}
                  </h2>

                  <p className="text-gray-600">
                    Category: {business.category}
                  </p>

                  <p className="text-gray-600">
                    City: {business.city}
                  </p>

                  <p className="text-yellow-500 font-semibold mt-2">
                    ⭐ {business.rating || "New"}
                  </p>

                  <button
                    onClick={() =>
                      navigate(`/business/${business._id}`)
                    }
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default AllBusinesses;