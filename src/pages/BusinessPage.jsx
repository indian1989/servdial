import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const BusinessPage = () => {
  const { id } = useParams();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const { data } = await API.get(`/business/${id}`);
        setBusiness(data.business);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading business...
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Business not found
      </div>
    );
  }

  const title = `${business.name} - ${business.category} in ${business.city} | ServDial`;

  const description = `${business.name} is one of the best ${business.category} services in ${business.city}. Contact details, address and ratings available on ServDial.`;
  
  const url = `https://servdial.com/${business.city}/${business.category}/${business.slug}`;
  const image = business.image || "https://servdial.com/default-business.jpg";

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    image: image,
    description: description,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address || "",
      addressLocality: business.city || "",
      addressCountry: "IN"
    },
    telephone: business.phone || "",
    url: url,
    aggregateRating: business.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: business.rating,
          bestRating: "5",
          worstRating: "1",
          ratingCount: "1"
        }
      : undefined
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>

        <meta name="description" content={description} />

        {/* Canonical */}
        <link rel="canonical" href={url} />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="business.business" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        {/* Schema */}
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-10 px-5">
        <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-8">

          {business.image && (
            <img
              src={business.image}
              alt={business.name}
              className="w-full h-64 object-cover rounded mb-6"
            />
          )}

          <h1 className="text-3xl font-bold mb-3">
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

          {business.phone && (
            <p className="text-blue-600 text-lg mb-4">
              📞 {business.phone}
            </p>
          )}

          {business.address && (
            <p className="text-gray-700 mb-4">
              📍 {business.address}
            </p>
          )}

          {business.description && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">
                About {business.name}
              </h2>

              <p className="text-gray-700 leading-relaxed">
                {business.description}
              </p>

              <Link
                to={`/claim-business/${business._id}`}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Claim This Business
              </Link>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default BusinessPage;