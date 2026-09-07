import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import API from "../api/axios";
import BusinessCard from "../components/business/BusinessCard";
import { formatLocationDisplay } from "../utils/addressHelper";

const RecommendedPage = () => {
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city");

  const [pageCity, setPageCity] = useState(null);

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchData = async () => {
    try {
      if (city) {
        const cityRes = await API.get(`/cities/${city}`);
        setPageCity(cityRes.data?.data || null);
      } else {
        setPageCity(null);
      }

      const res = await API.get("/recommendations", {
        params: { city },
      });

      setBusinesses(res.data?.data || []);
    } catch (err) {
      console.error("Recommendation page error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [city]);

const cityNameResolved = pageCity
  ? formatLocationDisplay(pageCity.name, pageCity.district)
  : "";

const seoTitle = cityNameResolved
  ? `Recommended Businesses in ${cityNameResolved}, ${pageCity.state}, India | ServDial`
  : "Recommended Businesses Near You | ServDial";

const seoDescription = cityNameResolved
  ? `Discover top recommended businesses in ${cityNameResolved}, ${pageCity.state}, India. Explore trusted local businesses, services, contact details and more on ServDial.`
  : "Discover top recommended local businesses, services and trusted business listings near you on ServDial.";


  return (
  <div className="min-h-screen bg-gray-50">

    {/* Blue Page Header */}
    <div className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-sm">
          <Link
            to="/"
            className="hover:text-blue-100"
          >
            Home
          </Link>

          <span>&gt;</span>

          {pageCity?.state && (
            <>
              <Link
                to={`/${pageCity.stateSlug}`}
                className="hover:text-blue-100"
              >
                {pageCity.state}
              </Link>

              <span>&gt;</span>
            </>
          )}

          {cityNameResolved && pageCity?.slug && (
            <>
              <Link
                to={`/${pageCity.stateSlug}/${pageCity.slug}`}
                className="hover:text-blue-100"
              >
                {cityNameResolved}
              </Link>

              <span>&gt;</span>
            </>
          )}

          <span className="font-medium text-white">
            Recommended Businesses
          </span>
        </div>

        {/* Page Heading */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold">
            {cityNameResolved
              ? `Recommended Businesses in ${cityNameResolved}, ${pageCity.state}, India`
              : "Recommended Businesses Near You"}
          </h1>

          <p className="mt-3 text-blue-100">
            {cityNameResolved
              ? `Discover top recommended businesses in ${cityNameResolved}, ${pageCity.state}, India`
              : "Discover top recommended local businesses near you"}
          </p>
        </div>

      </div>
    </div>

    {/* Business Content */}
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-72 bg-white rounded-2xl shadow-sm animate-pulse"
            />
          ))}
        </div>

      ) : businesses.length === 0 ? (

        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
          <div className="text-5xl mb-4">📍</div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No recommendations found
          </h2>

          <p className="text-gray-500">
            Try another city or check back later.
          </p>
        </div>

      ) : (

        /* Business Results */
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {businesses.length}
              </span>{" "}
              recommended businesses
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {businesses.map((biz) => (
              <BusinessCard
                key={biz._id}
                business={biz}
              />
            ))}
          </div>
        </>
      )}

    </div>
  </div>
);
};

export default RecommendedPage;