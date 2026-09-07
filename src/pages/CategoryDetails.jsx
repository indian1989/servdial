// frontend/src/pages/CategoryDetails.jsx

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import API from "../api/axios";

import {
  ChevronRight,
  Layers3,
  ArrowRight,
  Grid2X2,
  Search,
} from "lucide-react";

import BusinessCard from "../components/business/BusinessCard";

const CategoryDetails = () => {
  const { citySlug, slug } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

// ================= FETCH CATEGORY =================
useEffect(() => {
  const fetchCategory = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/categories/${slug}/children`
      );

      const parent = res.data?.data?.parent;

      const data = {
        ...parent,
        children: res.data?.data?.children || [],
      };

      console.log("CATEGORY RESPONSE:", data);

      // =====================================================
      // OLD SLUG → CURRENT SLUG
      // /category/tour-operators
      //          ↓
      // /category/tour-operator
      // =====================================================

      const isOldSlug =
        data?.slug &&
        data.slug !== slug &&
        Array.isArray(data?.slugHistory) &&
        data.slugHistory.some(
          (history) => history.slug === slug
        );

      if (isOldSlug) {
  navigate(
    citySlug
      ? `/${citySlug}/${data.slug}`
      : `/category/${data.slug}`,
    {
      replace: true,
    }
  );

  return;
}

      // =====================================================
      // CATEGORY
      // =====================================================

      setCategory(data);

      // =====================================================
// BUSINESSES
// =====================================================

try {
  const businessParams = new URLSearchParams();

  businessParams.set(
    "category",
    slug
  );

  businessParams.set(
    "limit",
    "21"
  );

  let businessRes;

  // ===================================================
  // CITY-SPECIFIC CATEGORY
  // ===================================================

  if (citySlug) {

    if (
      (data.children || []).length === 0
    ) {

      businessParams.set(
        "city",
        citySlug
      );

      businessRes = await API.get(
        `/businesses?${businessParams.toString()}`
      );

    } else {

      businessRes = null;

    }

  }

  // ===================================================
  // GLOBAL CATEGORY
  // RANDOM BUSINESSES ACROSS CITIES
  // ===================================================

  else {

    businessRes = await API.get(
      `/businesses/random-category?${businessParams.toString()}`
    );

  }

  setBusinesses(
    businessRes?.data?.data || []
  );

} catch (e) {

  console.error(
    "Business fetch error:",
    e?.response?.data || e
  );

  setBusinesses([]);

}

    } catch (err) {
      console.error(
        "Category fetch error:",
        err?.response?.data || err
      );

      setCategory(null);
      setBusinesses([]);

    } finally {
      setLoading(false);
    }
  };

  if (slug) {
    fetchCategory();
  }

}, [slug, citySlug, navigate]);

  // ================= SEO =================
const categoryName =
  category?.name ||
  slug?.replace(/-/g, " ") ||
  "Category";

const hasChildren =
  (category?.children || []).length > 0;

const formattedCity = citySlug
  ? citySlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  : "India";

// ================= SEO TITLE =================
const title = citySlug
  ? hasChildren
    ? `${categoryName} in ${formattedCity} | ServDial`
    : `Top ${categoryName} in ${formattedCity} | ServDial`
  : hasChildren
    ? `${categoryName} Services & Subcategories | ServDial`
    : `Top ${categoryName} Businesses in India | ServDial`;

// ================= SEO DESCRIPTION =================
const description = citySlug
  ? hasChildren
    ? `Explore ${categoryName} services and subcategories in ${formattedCity}. Find trusted local businesses and service providers on ServDial.`
    : `Find trusted ${categoryName} businesses in ${formattedCity}. Compare ratings, reviews and contact details of local providers on ServDial.`
  : hasChildren
    ? `Explore ${categoryName} services and subcategories across India. Discover trusted local businesses and service providers on ServDial.`
    : `Find trusted ${categoryName} businesses across India. Compare ratings, reviews and contact details of local providers on ServDial.`;

// ================= CANONICAL =================
const canonicalUrl = citySlug
  ? `https://servdial.com/${citySlug}/${slug}`
  : `https://servdial.com/category/${slug}`;

// ================= OG / SOCIAL SEO =================
const ogTitle = title;

const ogDescription = description;
  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-500">
            Loading category...
          </p>

        </div>

      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

        <div className="bg-white border rounded-3xl shadow-sm p-10 text-center max-w-md w-full">

          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Search size={28} className="text-red-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Category Not Found
          </h2>

          <p className="text-gray-500 mb-6">
            The category you are looking for does not exist.
          </p>

          <Link
            to="/categories"
            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Browse Categories
          </Link>

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

  {/* ================= OPEN GRAPH ================= */}

  <meta
    property="og:type"
    content="website"
  />

  <meta
    property="og:title"
    content={ogTitle}
  />

  <meta
    property="og:description"
    content={ogDescription}
  />

  <meta
    property="og:url"
    content={canonicalUrl}
  />

  <meta
    property="og:site_name"
    content="ServDial"
  />

  {/* ================= TWITTER ================= */}

  <meta
    name="twitter:card"
    content="summary"
  />

  <meta
    name="twitter:title"
    content={ogTitle}
  />

  <meta
    name="twitter:description"
    content={ogDescription}
  />

  {/* ================= BREADCRUMB SCHEMA ================= */}

  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://servdial.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Categories",
          item: "https://servdial.com/categories",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: category.name,
          item: canonicalUrl,
        },
      ],
    })}
  </script>

  {/* ================= COLLECTION PAGE SCHEMA ================= */}

  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      description,
      url: canonicalUrl,
      isPartOf: {
        "@type": "WebSite",
        name: "ServDial",
        url: "https://servdial.com/",
      },
    })}
  </script>
</Helmet>

      <div className="min-h-screen bg-gray-50">

        {/* ================= HERO ================= */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">

          <div className="max-w-7xl mx-auto px-4 py-14">

            {/* BREADCRUMB */}
            <div className="flex items-center gap-2 text-sm text-blue-100 mb-5">

              <Link
                to="/"
                className="hover:text-white transition"
              >
                Home
              </Link>

              <ChevronRight size={14} />

              <Link
                to="/categories"
                className="hover:text-white transition"
              >
                Categories
              </Link>

              <ChevronRight size={14} />

              <span className="text-white font-medium">
                {category.name}
              </span>

            </div>

            {/* HERO CONTENT */}
            <div className="max-w-3xl">

              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm mb-5">

                <Layers3 size={16} />

                <span>
                  Explore businesses & services
                </span>

              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
  {citySlug
    ? hasChildren
      ? `${category.name} in ${formattedCity}`
      : `Top ${category.name} in ${formattedCity}`
    : hasChildren
      ? `${category.name} Services in India`
      : `Top ${category.name} Businesses in India`}
</h1>

              <p className="text-blue-100 text-lg leading-relaxed">
  {citySlug
    ? hasChildren
      ? `Browse ${category.name} services and subcategories in ${formattedCity} on ServDial.`
      : `Discover trusted ${category.name} businesses in ${formattedCity} on ServDial. Compare ratings, reviews and contact details to find the right local provider.`
    : hasChildren
      ? `Browse ${category.name} services and subcategories across India on ServDial.`
      : `Discover trusted ${category.name} businesses across India on ServDial. Compare ratings, reviews and contact details to find the right provider.`}
</p>

            </div>

          </div>

        </section>

        {/* ================= MAIN ================= */}
        <section className="max-w-7xl mx-auto px-4 py-10">

          {/* TOP INFO */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>

              <h2 className="text-2xl font-bold text-gray-800">
                {category.children?.length > 0 ? "Sub Categories" : "Businesses"}
              </h2>

              <p className="text-gray-500 mt-1">
                {category.children?.length > 0
                ? `${category.children.length} sub categories available`
                : `${businesses.length} businesses available`}
              </p>

            </div>

            <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-3 shadow-sm">

              <Grid2X2
                size={18}
                className="text-blue-600"
              />

              <span className="text-sm font-medium text-gray-700">
                Browse services
              </span>

            </div>

          </div>

   {/* ================= CHILDREN ================= */}

{category.children?.length > 0 && (
  <>
    {/* ===== MAIN CATEGORY → SHOW SUBCATEGORIES ===== */}

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">

      {category.children.map((sub) => (
        <Link
          key={sub._id}
          to={
            citySlug
              ? `/${citySlug}/${category.slug}/${sub.slug}`
              : `/category/${category.slug}/${sub.slug}`
          }
          className="group bg-white border border-gray-100 rounded-2xl p-5
          hover:shadow-xl hover:border-blue-200 transition-all duration-300"
        >

          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center
          justify-center mb-4 group-hover:bg-blue-100 transition">

            {sub.icon ? (
              <img
                src={sub.icon}
                alt={sub.name}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <Layers3 size={24} className="text-blue-600" />
            )}

          </div>

          <h3 className="font-semibold text-gray-800 text-sm leading-6
          group-hover:text-blue-600 transition min-h-[48px]">
            {sub.name}
          </h3>

          <div className="flex items-center justify-between mt-4">

            <span className="text-xs text-gray-500">
              Explore businesses
            </span>

            <ArrowRight
              size={16}
              className="text-gray-400 group-hover:text-blue-600 transition"
            />

          </div>

        </Link>
      ))}

    </div>
  </>
)}


{/* ================= BUSINESSES ================= */}

{businesses.length > 0 && (
  <section className="mt-14">

    <div className="flex items-center justify-between mb-6">

      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Businesses in {category.name}
        </h2>

        <p className="text-gray-500 mt-1">
          Explore businesses and service providers in this category.
        </p>
      </div>

    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

      {businesses.map((b) => (
        <BusinessCard
          key={b._id}
          business={b}
        />
      ))}

    </div>

  </section>
)}


{/* ================= TRULY EMPTY ================= */}

{category.children?.length === 0 &&
  businesses.length === 0 && (
    <div className="bg-white border rounded-3xl p-10 text-center shadow-sm">

      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center
      justify-center mx-auto mb-5">

        <Layers3
          size={28}
          className="text-gray-400"
        />

      </div>

      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No Businesses Found
      </h3>

      <p className="text-gray-500">
        No businesses are available in this category right now.
      </p>

    </div>
  )}
          {/* ================= SEO CONTENT ================= */}
          <div className="bg-white border rounded-3xl p-8 mt-14 shadow-sm">

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Explore {category.name} Services
            </h2>

            <div className="space-y-4 text-gray-600 leading-8">

              <p>
                ServDial helps users discover trusted businesses and professionals under the {category.name} category. Browse verified local service providers, compare ratings and connect directly with businesses near you.
              </p>

              <p>
                From small local providers to established businesses, users can easily explore multiple services, compare options and contact businesses instantly through phone or WhatsApp.
              </p>

              {citySlug && (
                <p>
                  Explore the best {category.name.toLowerCase()} services in {formattedCity} with updated business listings and trusted recommendations.
                </p>
              )}

            </div>

          </div>

        </section>

      </div>
    </>
  );
};

export default CategoryDetails;