// frontend/src/pages/CityCategoryPage.jsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
      setLoading(true);

      const { data } = await API.get(
        `/business/search?citySlug=${city}&categorySlug=${category}`
      );

      const list = data?.data || [];

      setBusinesses(list);

    } catch (error) {
      console.error("Search Error:", error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  fetchBusinesses();
}, [city, category]);

  // ================= SEO TEXT =================
  const formattedCity = city?.replace(/-/g, " ");
  const formattedCategory = category?.replace(/-/g, " ");

  const title = `${formattedCategory} in ${formattedCity} | ServDial`;
  const description = `Find the best ${formattedCategory} services in ${formattedCity}.`;

  const canonicalUrl = `https://servdial.com/${city}/${category}`;

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500 animate-pulse">
          Loading businesses...
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-10 px-5">
        <div className="max-w-7xl mx-auto">

          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-4">
            <Link to="/">Home</Link> /{" "}
            <Link to={`/city/${city}`}>{formattedCity}</Link> /{" "}
            {formattedCategory}
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold mb-2">
            {formattedCategory} in {formattedCity}
          </h1>

          <p className="text-gray-600 mb-8">
            Showing {businesses.length} results
          </p>

          {/* ================= BUSINESS FIRST (ONLY LOGIC) ================= */}
          {businesses.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {businesses.map((biz) => (
                <BusinessCard key={biz._id} business={biz} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-10">
              No businesses found in this category.
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default CityCategoryPage;