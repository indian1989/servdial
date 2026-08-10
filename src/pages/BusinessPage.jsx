// frontend/src/pages/BusinessPage.jsx

import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import API from "../api/axios";
import { Helmet } from "react-helmet-async";

import BusinessDetails from "./BusinessDetails";
import NotFound from "./NotFound";


// =========================================================
// 🏢 BUSINESS PAGE
// =========================================================

const BusinessPage = () => {

  const {
    citySlug,
    categorySlug,
    slug,
  } = useParams();

  const navigate = useNavigate();


  // =======================================================
  // STATE
  // =======================================================

  const [business, setBusiness] =
    useState(null);

  const [reviews, setReviews] =
    useState([]);

  const [similar, setSimilar] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [notFound, setNotFound] =
    useState(false);


  // =======================================================
  // 🔗 FETCH SIMILAR BUSINESSES
  // =======================================================

  const fetchSimilar = async (businessId) => {

    if (!businessId) {
      return;
    }

    try {

      const res =
        await API.get(
          `/businesses/similar/${businessId}`
        );

      setSimilar(
        Array.isArray(
          res?.data?.data
        )
          ? res.data.data
          : []
      );

    } catch (error) {

      console.error(
        "❌ Similar businesses error:",
        error
      );

      setSimilar([]);

    }

  };


  // =======================================================
  // 🔎 FETCH BUSINESS
  // =======================================================

  const fetchBusiness = async () => {

    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    try {

      setLoading(true);
      setNotFound(false);


      // =================================================
      // API
      // =================================================

      const res =
        await API.get(
          `/businesses/${slug}`
        );


      // =================================================
      // RESPONSE
      // =================================================

      const biz =
        res?.data?.data?.business ||
        res?.data?.data ||
        null;


      if (!biz) {

        setNotFound(true);
        return;

      }


      // =================================================
      // CANONICAL CITY SLUG
      // =================================================
      //
      // Prefer explicit stored slug.
      // Fallback to populated cityId.slug.
      //
      // =================================================

      const businessCitySlug =
        biz.citySlug ||
        biz.cityId?.slug ||
        "";


      // =================================================
      // CANONICAL CATEGORY SLUG
      // =================================================

      const businessCategorySlug =
        biz.categorySlug ||
        biz.categoryId?.slug ||
        "";


      // =================================================
      // BUSINESS SLUG
      // =================================================

      const businessSlug =
        biz.slug ||
        biz._id ||
        "";


      // =================================================
      // 🚨 CITY SLUG MISMATCH
      // =================================================
      //
      // Example:
      //
      // requested:
      // patna-patna-bihar
      //
      // business:
      // patna-bihar
      //
      // Do not show 404.
      //
      // Redirect to canonical URL.
      //
      // =================================================

      if (
        citySlug &&
        businessCitySlug &&
        citySlug !== businessCitySlug
      ) {

        console.warn(
          "⚠️ City slug mismatch.",
          {
            requested: citySlug,
            received: businessCitySlug,
          }
        );

        if (
          businessCategorySlug &&
          businessSlug
        ) {

          navigate(
            `/${businessCitySlug}/${businessCategorySlug}/${businessSlug}`,
            {
              replace: true,
            }
          );

          return;

        }

      }


      // =================================================
      // 🚨 CATEGORY SLUG MISMATCH
      // =================================================
      //
      // Example:
      //
      // URL:
      // restaurant
      //
      // Database:
      // restaurants
      //
      // Redirect to actual canonical category slug.
      //
      // =================================================

      if (
        categorySlug &&
        businessCategorySlug &&
        categorySlug !==
          businessCategorySlug
      ) {

        console.warn(
          "⚠️ Category slug mismatch.",
          {
            requested: categorySlug,
            received: businessCategorySlug,
          }
        );


        if (
          businessCitySlug &&
          businessSlug
        ) {

          navigate(
            `/${businessCitySlug}/${businessCategorySlug}/${businessSlug}`,
            {
              replace: true,
            }
          );

          return;

        }

      }


      // =================================================
      // ✅ BUSINESS FOUND
      // =================================================

      setBusiness(biz);


      // =================================================
      // ⭐ REVIEWS
      // =================================================

      const reviewsData =
        res?.data?.data?.reviews ||
        biz?.reviews ||
        [];

      setReviews(
        Array.isArray(reviewsData)
          ? reviewsData
          : []
      );


      // =================================================
      // 🔗 SIMILAR
      // =================================================

      if (biz?._id) {

        fetchSimilar(
          biz._id
        );

      }

    } catch (error) {

      console.error(
        "❌ Business fetch error:",
        error
      );


      if (
        error?.response?.status === 404
      ) {

        setNotFound(true);

      }

    } finally {

      setLoading(false);

    }

  };


  // =======================================================
  // 🚀 LOAD
  // =======================================================

  useEffect(() => {

    fetchBusiness();

  }, [
    citySlug,
    categorySlug,
    slug,
  ]);


  // =======================================================
  // ⏳ LOADING
  // =======================================================

  if (loading) {

    return (
      <div className="py-16 text-center">

        <p className="text-sm text-gray-500">

          Loading business...

        </p>

      </div>
    );

  }


  // =======================================================
  // ❌ NOT FOUND
  // =======================================================

  if (notFound) {

    return <NotFound />;

  }


  // =======================================================
  // SAFETY
  // =======================================================

  if (!business) {

    return (
      <div className="py-16 text-center">

        <h2 className="text-lg font-semibold text-gray-800">

          Business not found

        </h2>

      </div>
    );

  }


  // =======================================================
  // 📍 DISPLAY DATA
  // =======================================================

  const businessCity =
    business.city ||
    business.cityName ||
    business.cityId?.name ||
    "";

  const businessCategory =
    business.categoryId?.name ||
    business.category ||
    "";


  // =======================================================
  // 🔗 CANONICAL SLUGS
  // =======================================================

  const canonicalCitySlug =
    business.citySlug ||
    business.cityId?.slug ||
    citySlug ||
    "";

  const canonicalCategorySlug =
    business.categorySlug ||
    business.categoryId?.slug ||
    categorySlug ||
    "";

  const canonicalBusinessSlug =
    business.slug ||
    business._id;


  // =======================================================
  // 🔗 CANONICAL URL
  // =======================================================

  const canonicalUrl =
    `https://servdial.com/` +
    `${canonicalCitySlug}/` +
    `${canonicalCategorySlug}/` +
    `${canonicalBusinessSlug}`;


  // =======================================================
  // 🏷️ SEO TITLE
  // =======================================================

  const title =
    `${business.name} - ` +
    `${businessCategory || "Business"} in ` +
    `${businessCity || "India"} | ServDial`;


  // =======================================================
  // 📝 SEO DESCRIPTION
  // =======================================================

  const description =
    `${business.name} is a ` +
    `${businessCategory || "business"} in ` +
    `${businessCity || "India"}. ` +
    `Find contact details, location, reviews ` +
    `and more on ServDial.`;


  // =======================================================
  // 🖼️ IMAGE
  // =======================================================

  const image =
    business.images?.[0] ||
    "https://servdial.com/default-business.jpg";


  // =======================================================
  // 📊 STRUCTURED DATA
  // =======================================================

  const schema = {

    "@context":
      "https://schema.org",

    "@type":
      "LocalBusiness",

    name:
      business.name,

    image,

    description,

    url:
      canonicalUrl,

    address: {

      "@type":
        "PostalAddress",

      streetAddress:
        typeof business.address ===
        "string"
          ? business.address
          : business.address?.street ||
            "",

      addressLocality:
        businessCity,

      addressRegion:
        business.state ||
        "",

      addressCountry:
        "IN",

    },

    telephone:
      business.phone ||
      "",

    ...(business.totalReviews
      ? {

          aggregateRating: {

            "@type":
              "AggregateRating",

            ratingValue:
              business.averageRating ||
              0,

            ratingCount:
              business.totalReviews,

          },

        }
      : {}),

  };


  // =======================================================
  // 🖥️ RENDER
  // =======================================================

  return (
    <>

      {/* =================================================
          SEO
      ================================================= */}

      <Helmet>

        <title>
          {title}
        </title>


        <meta
          name="description"
          content={description}
        />


        <meta
          name="robots"
          content="index,follow"
        />


        <link
          rel="canonical"
          href={canonicalUrl}
        />


        <meta
          property="og:title"
          content={title}
        />


        <meta
          property="og:description"
          content={description}
        />


        <meta
          property="og:image"
          content={image}
        />


        <meta
          property="og:url"
          content={canonicalUrl}
        />


        <meta
          property="og:type"
          content="business.business"
        />


        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>

      </Helmet>


      {/* =================================================
          BUSINESS DETAILS
      ================================================= */}

      <BusinessDetails

        business={
          business
        }

        reviews={
          reviews
        }

        similar={
          similar
        }

        refresh={
          fetchBusiness
        }

      />

    </>
  );

};


export default BusinessPage;