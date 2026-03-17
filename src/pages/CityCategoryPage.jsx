// frontend/src/pages/CityCategoryPage.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { Helmet } from "react-helmet-async";
import BusinessCard from "../components/business/BusinessCard";

const CityCategoryPage = () => {
  const { city, category } = useParams();

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH BUSINESSES =================
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const { data } = await API.get(
          `/business/search?city=${city}&category=${category}`
        );
        setBusinesses(data.businesses || []);
      } catch (error) {
        console.error("Search Error:", error);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, [city, category]);

  // ================= SEO =================
  const formattedCity = city.charAt(0).toUpperCase() + city.slice(1);
  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);

  const title = `${formattedCategory} in ${formattedCity} | ServDial`;
  const description = `Find the best ${formattedCategory} services in ${formattedCity}. Contact numbers, address, ratings and reviews on ServDial.`;
  const canonicalUrl = `https://servdial.com/${city}/${category}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${formattedCategory} in ${formattedCity}`,
    itemListElement: businesses.map((biz, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://servdial.com/business/${biz._id}`,
      name: biz.name,
    })),
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading businesses...
        </p>
      </div>
    );
  }

  // ================= PAGE =================
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-10 px-5">
        <div className="max-w-7xl mx-auto">
          {/* Page Heading */}
          <h1 className="text-3xl font-bold mb-2">
            {formattedCategory} in {formattedCity}
          </h1>

          <p className="text-gray-600 mb-8">
            Showing {businesses.length} {businesses.length === 1 ? "result" : "results"}
          </p>

          {/* Businesses Grid */}
          {businesses.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {businesses.map((biz) => (
                <BusinessCard key={biz._id} business={biz} />
              ))}
            </div>
          ) : (
            <div className="text-center mt-20">
              <p className="text-gray-500 text-lg">
                No businesses found in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CityCategoryPage;