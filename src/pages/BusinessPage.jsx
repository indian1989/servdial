// frontend/src/pages/BusinessPage.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { Helmet } from "react-helmet-async";

import BusinessDetails from "./BusinessDetails";
import NotFound from "./NotFound";

const BusinessPage = () => {
  const { citySlug, categorySlug, slug } = useParams();

  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // ================= FETCH BUSINESS =================
const fetchBusiness = async () => {
  try {

    const res = await API.get(`/businesses/${slug}`);


    const biz =
      res?.data?.data?.business ||
      res?.data?.data ||
      null;

    if (!biz) {
  setNotFound(true);
  return;
}

if (
  biz.citySlug !== citySlug ||
  biz.categorySlug !== categorySlug
) {
  setNotFound(true);
  return;
}

setBusiness(biz);


    const reviewsData =
      res?.data?.data?.reviews ||
      biz?.reviews ||
      [];


    setReviews(
      Array.isArray(reviewsData)
        ? reviewsData
        : []
    );


    if (biz?._id) {
      fetchSimilar(biz._id);
    }


  } catch (err) {

  console.error(
    "Business error:",
    err
  );


  if (err?.response?.status === 404) {
    setNotFound(true);
  }



  } finally {

    setLoading(false);

  }
};

  // ================= SIMILAR =================
  const fetchSimilar = async (id) => {
  if (!id) return;

  try {
    const res = await API.get(`/businesses/similar/${id}`);
    setSimilar(res.data.data || []);
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

   // ================= NOT FOUND =================
  if (notFound) {
    return <NotFound />;
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