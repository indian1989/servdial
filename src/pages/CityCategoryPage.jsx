// frontend/src/pages/CityCategoryPage.jsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import { Helmet } from "react-helmet-async";
import BusinessCard from "../components/business/BusinessCard";

const CityCategoryPage = () => {
  const { city, category } = useParams();

  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
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

  // ================= FETCH CATEGORIES (FOR RELATED LINKS) =================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get("/categories");
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Category Fetch Error:", error);
      }
    };

    fetchCategories();
  }, []);

  // ================= SEO =================

  const formattedCity =
    city?.charAt(0).toUpperCase() + city?.slice(1);

  const formattedCategory =
    category?.charAt(0).toUpperCase() + category?.slice(1);

  const title = `${formattedCategory} in ${formattedCity} | ServDial`;

  const description = `Find the best ${formattedCategory} services in ${formattedCity}. Contact numbers, address, ratings and reviews on ServDial.`;

  const canonicalUrl = `https://servdial.com/${city}/${category}`;

  const itemListSchema = {
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://servdial.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: formattedCity,
        item: `https://servdial.com/city/${city}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: formattedCategory,
        item: canonicalUrl,
      },
    ],
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

        <meta name="robots" content="index,follow" />

        {/* OpenGraph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />

        {/* Schema */}
        <script type="application/ld+json">
          {JSON.stringify(itemListSchema)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-10 px-5">
        <div className="max-w-7xl mx-auto">

          {/* Breadcrumb */}

          <div className="text-sm text-gray-500 mb-4">
            <Link to="/">Home</Link> /{" "}
            <Link to={`/city/${city}`}>{formattedCity}</Link> /{" "}
            {formattedCategory}
          </div>

          {/* Page Heading */}

          <h1 className="text-3xl font-bold mb-2">
            {formattedCategory} in {formattedCity}
          </h1>

          <p className="text-gray-600 mb-8">
            Showing {businesses.length}{" "}
            {businesses.length === 1 ? "result" : "results"}
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

          {/* SEO Content */}

          <div className="mt-12 text-gray-700 leading-relaxed">

            <h2 className="text-xl font-semibold mb-3">
              Best {formattedCategory} Services in {formattedCity}
            </h2>

            <p>
              Looking for reliable {formattedCategory.toLowerCase()} services
              in {formattedCity}? ServDial helps you connect with trusted
              professionals near you. Browse verified businesses, compare
              ratings, check contact details and choose the best service
              provider for your needs. Whether you need urgent repairs,
              installations or maintenance services, you can find experienced
              professionals in {formattedCity} quickly on ServDial.
            </p>

          </div>

          {/* ================= RELATED SERVICES ================= */}

          {categories.length > 0 && (
            <div className="mt-16">

              <h2 className="text-2xl font-semibold mb-6">
                Related Services in {formattedCity}
              </h2>

              <div className="grid md:grid-cols-4 gap-4">

                {categories
                  .filter((cat) => cat.slug !== category)
                  .slice(0, 12)
                  .map((cat) => (

                    <Link
                      key={cat._id}
                      to={`/${city}/${cat.slug}`}
                      className="bg-white border rounded p-4 hover:shadow text-center"
                    >

                      {cat.name} in {formattedCity}

                    </Link>

                  ))}

              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default CityCategoryPage;