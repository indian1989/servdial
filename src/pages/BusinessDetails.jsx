import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import { Helmet } from "react-helmet-async";

const BusinessDetails = () => {
  const { id } = useParams();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const { data } = await axios.get(`/api/business/${id}`);
        setBusiness(data.business);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load business");
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500 text-lg">Loading business...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!business) return null;

  /* SEO DATA */

  const title = `${business.name} - ${business.category} in ${business.city} | ServDial`;

  const description = `${business.name} is a trusted ${business.category} service in ${business.city}. Contact details, ratings, reviews and address available on ServDial.`;

  const canonicalUrl = `https://servdial.com/business/${business._id}`;

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${business.address}`;

  const whatsappUrl = `https://wa.me/${business.phone}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    image: business.image || "",
    description,
    telephone: business.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address,
      addressLocality: business.city,
      addressCountry: "IN"
    },
    aggregateRating: business.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: business.rating,
          reviewCount: business.reviewCount || 1
        }
      : undefined,
    url: canonicalUrl
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="business.business" />
        <meta property="og:url" content={canonicalUrl} />

        <link rel="canonical" href={canonicalUrl} />

        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-10 px-5">

        <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">

          {/* IMAGE */}
          {business.image && (
            <img
              src={business.image}
              alt={business.name}
              className="w-full h-72 object-cover"
            />
          )}

          <div className="p-8">

            {/* TITLE */}
            <h1 className="text-3xl font-bold mb-2">
              {business.name}
            </h1>

            <p className="text-gray-500 mb-4">
              {business.category} in {business.city}
            </p>

            {/* RATING */}
            <p className="text-yellow-500 font-semibold mb-4 text-lg">
              ⭐ {business.rating || "New Business"}
            </p>

            {/* DESCRIPTION */}
            {business.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                  About {business.name}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {business.description}
                </p>
              </div>
            )}

            {/* CONTACT */}
            <div className="mb-6">

              <h3 className="text-xl font-semibold mb-2">
                Contact Details
              </h3>

              {business.phone && (
                <p className="text-gray-700 mb-2">
                  📞 {business.phone}
                </p>
              )}

              {business.address && (
                <p className="text-gray-700">
                  📍 {business.address}
                </p>
              )}

            </div>

            {/* ACTION BUTTONS */}

            <div className="flex flex-wrap gap-4 mt-6">

              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  📞 Call Now
                </a>
              )}

              {business.phone && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
                >
                  💬 WhatsApp
                </a>
              )}

              {business.address && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-black"
                >
                  🗺 View on Map
                </a>
              )}

            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default BusinessDetails;