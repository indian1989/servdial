import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import { Helmet } from "react-helmet-async";

const BusinessDetails = () => {
  const { id } = useParams();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axios.get(`/api/business/${id}`);
        setBusiness(data.business);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch business details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading business details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!business) return null;

  const title = `${business.name} - ${business.category} in ${business.city} | ServDial`;

  const description = `${business.name} is one of the best ${business.category} in ${business.city}. Contact details, address, ratings and reviews available on ServDial.`;

  const canonicalUrl = `https://servdial.com/business/${business._id}`;

  /* 🔥 JSON-LD STRUCTURED DATA */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    image: business.image || "",
    description: description,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address || "",
      addressLocality: business.city,
      addressCountry: "IN",
    },
    telephone: business.phone || "",
    aggregateRating: business.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: business.rating,
          reviewCount: business.reviewCount || 1,
        }
      : undefined,
    url: canonicalUrl,
  };

  return (
    <>
      {/* SEO META */}
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="business.business" />
        <meta property="og:url" content={canonicalUrl} />

        {/* Canonical */}
        <link rel="canonical" href={canonicalUrl} />

        {/* 🔥 JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">

          <h1 className="text-3xl font-bold mb-4">
            {business.name}
          </h1>

          <p className="text-gray-600 mb-2">
            Category: <strong>{business.category}</strong>
          </p>

          <p className="text-gray-600 mb-2">
            City: <strong>{business.city}</strong>
          </p>

          <p className="text-yellow-500 font-semibold mb-4">
            ⭐ {business.rating || "New"}
          </p>

          {business.description && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">
                About {business.name}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {business.description}
              </p>
            </div>
          )}

          {business.phone && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">
                Contact Information
              </h3>
              <p className="text-gray-700 mt-2">
                📞 {business.phone}
              </p>
            </div>
          )}

          {business.address && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">
                Address
              </h3>
              <p className="text-gray-700 mt-2">
                {business.address}
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default BusinessDetails;