// frontend/src/pages/BusinessPage.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { Helmet } from "react-helmet-async";

import BusinessDetails from "./BusinessDetails";

const BusinessPage = () => {
  const { citySlug, categorySlug, slug } = useParams();

  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH BUSINESS =================
  const fetchBusiness = async () => {
    try {
      const res = await API.get(`/businesses/${slug.trim()}`);

      console.log("🔥 BUSINESS API RESPONSE:", res.data);

      const biz = res.data?.business || null;

      setBusiness(biz);
      setReviews(res.data.reviews || []);

      if (biz?._id) {
        fetchSimilar(biz._id);
      }

    } catch (err) {
  console.error("❌ Fetch error:", err.response?.data || err.message);
  setBusiness(null);
    } finally {
      setLoading(false);
    }
  };

  // ================= SIMILAR =================
  const fetchSimilar = async (id) => {
    try {
      const res = await API.get(`/business/similar/${id}`);
      setSimilar(res.data.businesses || []);
    } catch (err) {
      console.error("Similar error:", err);
    }
  };

  useEffect(() => {
  if (slug) {
  fetchBusiness();
  }
}, [citySlug, categorySlug, slug]);

  // ================= LOADING =================
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

  // ================= SEO =================
  const title = `${business.name} - ${business.categoryId?.name || business.category || "General"} in ${business.city} | ServDial`;

  const description = `${business.name} is a top ${business.categoryId?.name || business.category || "General"} service in ${business.city}. Contact details, reviews, and more on ServDial.`;

  const url = `https://servdial.com/${business.citySlug}/${business.categorySlug}/${business.slug}`;

  const image = business.images?.[0] || "https://servdial.com/default-business.jpg";

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    image,
    description,
    url,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address || "",
      addressLocality: business.city || "",
      addressCountry: "IN",
    },
    telephone: business.phone || "",
    aggregateRating: business.totalReviews
      ? {
          "@type": "AggregateRating",
          ratingValue: business.averageRating || 0,
          ratingCount: business.totalReviews,
        }
      : undefined,
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />

        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      {/* ✅ PURE UI COMPONENT */}
      <BusinessDetails
        business={business}
        reviews={reviews}
        similar={similar}
        refresh={fetchBusiness}
      />
    </>
  );
};

export default BusinessPage;