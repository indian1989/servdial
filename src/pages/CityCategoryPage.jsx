// frontend/src/pages/CityCategoryPage.jsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import API from "../api/axios";
import BusinessCard from "../components/business/BusinessCard";

const CityCategoryPage = () => {
  // ================= URL PARAMS =================
  const { citySlug, categorySlug } = useParams();

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH BUSINESSES =================
  useEffect(() => {
    // HARD GUARD
    if (!citySlug || !categorySlug) {
      setBusinesses([]);
      setLoading(false);
      return;
    }

    const fetchBusinesses = async () => {
      try {
        setLoading(true);

        const { data } = await API.get("/business/search", {
          params: {
            citySlug,
            categorySlug,
          },
        });

        const list =
          data?.data ||
          data?.businesses ||
          [];

        setBusinesses(list);

      } catch (error) {
        console.error("Search Error:", error);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();

  }, [citySlug, categorySlug]);

  // ================= FORMATTERS =================
  const formattedCity =
    citySlug
      ?.replace(/-/g, " ")
      ?.replace(/\b\w/g, (l) => l.toUpperCase()) || "";

  const formattedCategory =
    categorySlug
      ?.replace(/-/g, " ")
      ?.replace(/\b\w/g, (l) => l.toUpperCase()) || "";

  // ================= SEO =================
  const title = `${formattedCategory} in ${formattedCity} | ServDial`;

  const description = `Find trusted ${formattedCategory} services in ${formattedCity}. Browse verified local businesses, contact details, ratings and more on ServDial.`;

  const canonicalUrl = `https://servdial.com/${citySlug}/${categorySlug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${formattedCategory} in ${formattedCity}`,
    itemListElement: businesses.map((biz, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: biz?.name,
      url: `https://servdial.com/${citySlug}/${categorySlug}/${biz?.slug}`,
    })),
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-500">
            Loading businesses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>

        <meta
          name="description"
          content={description}
        />

        <link
          rel="canonical"
          href={canonicalUrl}
        />

        <meta
          name="robots"
          content="index,follow"
        />

        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">

        {/* ================= HERO ================= */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">

          <div className="max-w-7xl mx-auto px-4 py-12">

            {/* BREADCRUMB */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-blue-100 mb-5">

              <Link
                to="/"
                className="hover:text-white transition"
              >
                Home
              </Link>

              <span>/</span>

              <Link
                to={`/city/${citySlug}`}
                className="hover:text-white transition capitalize"
              >
                {formattedCity}
              </Link>

              <span>/</span>

              <span className="text-white font-medium capitalize">
                {formattedCategory}
              </span>

            </div>

            {/* HEADING */}
            <h1 className="text-3xl md:text-5xl font-bold capitalize leading-tight">
              {formattedCategory} in {formattedCity}
            </h1>

            <p className="mt-4 text-blue-100 max-w-2xl text-base md:text-lg">
              Discover verified and trusted{" "}
              {formattedCategory.toLowerCase()} businesses
              near you in {formattedCity}.
            </p>

            {/* STATS */}
            <div className="flex flex-wrap gap-4 mt-7">

              <div className="bg-white/10 backdrop-blur px-5 py-3 rounded-2xl border border-white/10">
                <div className="text-2xl font-bold">
                  {businesses.length}
                </div>

                <div className="text-sm text-blue-100">
                  Businesses Found
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur px-5 py-3 rounded-2xl border border-white/10">
                <div className="text-2xl font-bold">
                  100%
                </div>

                <div className="text-sm text-blue-100">
                  Local Results
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ================= CONTENT ================= */}
        <div className="max-w-7xl mx-auto px-4 py-10">

          {/* RESULTS TOPBAR */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Available Businesses
              </h2>

              <p className="text-gray-500 mt-1">
                Showing {businesses.length} businesses in{" "}
                {formattedCategory}
              </p>
            </div>

            <Link
              to={`/city/${citySlug}`}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 transition text-sm font-medium"
            >
              ← Explore More Categories
            </Link>

          </div>

          {/* ================= BUSINESS GRID ================= */}
          {businesses.length > 0 ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

              {businesses.map((biz) => (
                <BusinessCard
                  key={biz._id}
                  business={biz}
                />
              ))}

            </div>

          ) : (

            <div className="bg-white border border-gray-200 rounded-3xl p-10 md:p-16 text-center shadow-sm">

              <div className="text-6xl mb-5">
                🔍
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                No businesses found
              </h2>

              <p className="text-gray-500 max-w-lg mx-auto">
                We could not find any businesses for this
                category in {formattedCity} right now.
              </p>

              <div className="mt-8">
                <Link
                  to={`/city/${citySlug}`}
                  className="inline-flex items-center px-6 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                >
                  Browse Other Categories
                </Link>
              </div>

            </div>

          )}

          {/* ================= SEO CONTENT ================= */}
          <div className="mt-16 bg-white rounded-3xl border border-gray-200 p-8 md:p-10 shadow-sm">

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Best {formattedCategory} Services in {formattedCity}
            </h2>

            <div className="space-y-4 text-gray-600 leading-7">

              <p>
                Looking for trusted{" "}
                {formattedCategory.toLowerCase()} services
                in {formattedCity}? ServDial helps you
                discover verified local businesses with
                ratings, reviews, phone numbers and service
                details.
              </p>

              <p>
                Compare local providers, explore business
                profiles and connect directly with trusted
                professionals near you.
              </p>

            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default CityCategoryPage;