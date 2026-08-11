// src/components/business/BusinessSEO.jsx

import { Helmet } from "react-helmet-async";

import {
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
} from "../../utils/schemaBuilder";


const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL ||
  "https://servdial.com";


// =========================================================
// ABSOLUTE IMAGE URL
// =========================================================

const absoluteUrl = (url) => {

  if (!url) {
    return `${FRONTEND_URL}/logo.png`;
  }

  return url.startsWith("http")
    ? url
    : `${FRONTEND_URL}${url}`;
};


// =========================================================
// NORMALIZE LOCATION
// =========================================================

const normalizeLocation = (...parts) => {

  return parts
    .filter(Boolean)
    .map((item) => item.toString().trim())
    .filter(Boolean)
    .filter(
      (item, index, arr) =>
        arr.findIndex(
          (x) =>
            x.toLowerCase() === item.toLowerCase()
        ) === index
    )
    .join(", ");
};


// =========================================================
// BUSINESS SEO
// =========================================================

const BusinessSEO = ({
  business,
  currentUrl,
}) => {

  if (!business) return null;


  // =======================================================
  // LOCATION
  // =======================================================

  const cityName =
    business?.cityId?.name ||
    business?.cityName ||
    "";

  const districtName =
    business?.district ||
    business?.cityId?.district ||
    "";

  const stateName =
    business?.state ||
    business?.cityId?.state ||
    "";

  const countryName =
    business?.country ||
    "India";


  // =======================================================
  // ADDRESS
  // =======================================================

  const street =
    business?.address?.street ||
    "";

  const area =
    business?.address?.area ||
    "";

  const landmark =
    business?.address?.landmark ||
    "";


  const addressText =
    normalizeLocation(
      street,
      area,
      landmark
    );


  // =======================================================
  // SEO LOCATION
  // =======================================================

  const locationText =
    normalizeLocation(
      area,
      cityName,
      districtName,
      stateName
    );


  // =======================================================
  // CATEGORY
  // =======================================================

  const categoryName =
    business?.categoryId?.name ||
    business?.categoryName ||
    "Business";


  // =======================================================
  // BUSINESS NAME
  // =======================================================

  const businessName =
    business?.name ||
    "Business";


  // =======================================================
  // BACKEND GENERATED SEO
  // =======================================================

  const seo =
    business?.seo || {};


  // =======================================================
  // FALLBACK TITLE
  // =======================================================

  const fallbackTitle =
    locationText
      ? `${businessName} - ${categoryName} in ${locationText} | ServDial`
      : `${businessName} - ${categoryName} | ServDial`;


  // =======================================================
  // FALLBACK DESCRIPTION
  // =======================================================

  const fallbackDescription =
    `${businessName} is a ${
      business?.isVerified
        ? "Verified "
        : ""
    }${categoryName} in ${
      locationText || countryName
    }. Find address, phone number, business hours, ratings, reviews, photos, services and contact details on ServDial.`
      .replace(/\s+/g, " ")
      .slice(0, 250);


  // =======================================================
  // SEO META — BACKEND FIRST
  // =======================================================

  const title =
    seo?.title ||
    fallbackTitle;


  const description =
    seo?.description ||
    fallbackDescription;


  const keywords =
    Array.isArray(seo?.keywords)
      ? seo.keywords
          .filter(Boolean)
          .join(", ")
      : seo?.keywords ||
        [
          businessName,
          categoryName,
          area,
          cityName,
          districtName,
          stateName,
          `${categoryName} in ${cityName}`,
          `Best ${categoryName} in ${cityName}`,
          `Verified ${categoryName} in ${cityName}`,
          `${businessName} phone number`,
          `${businessName} address`,
          "ServDial",
        ]
          .filter(Boolean)
          .join(", ");


  // =======================================================
  // SEO H1
  // =======================================================

  const h1 =
    seo?.h1 ||
    fallbackTitle.replace(
      " | ServDial",
      ""
    );


  // =======================================================
  // IMAGE
  // =======================================================

  const image =
    absoluteUrl(
      business?.images?.[0] ||
      business?.logo
    );


  // =======================================================
  // CANONICAL URL
  // =======================================================

  const url =
    currentUrl ||
    `${FRONTEND_URL}/${
      business?.citySlug ||
      business?.cityId?.slug ||
      ""
    }/${
      business?.categorySlug ||
      business?.categoryId?.slug ||
      ""
    }/${business?.slug || ""}`;


  // =======================================================
  // LOCAL BUSINESS SCHEMA
  // =======================================================

  const localBusinessSchema =
    generateLocalBusinessSchema({

      ...business,

      categoryName,

      cityName,

      state: stateName,

      country: countryName,

      image,

      url,

      descriptionSEO:
        description,

    });


  // =======================================================
  // BREADCRUMB SCHEMA
  // =======================================================

  const breadcrumbSchema =
    generateBreadcrumbSchema({

      city:
        cityName,

      category:
        categoryName,

      businessName,

      citySlug:
        business?.citySlug ||
        business?.cityId?.slug,

      categorySlug:
        business?.categorySlug ||
        business?.categoryId?.slug,

      businessSlug:
        business?.slug,

    });


  // =======================================================
  // FAQ SCHEMA
  // =======================================================

  const faqSchema =
    Array.isArray(business?.faq) &&
    business.faq.length > 0
      ? {

          "@context":
            "https://schema.org",

          "@type":
            "FAQPage",

          mainEntity:
            business.faq
              .filter(
                (item) =>
                  item?.question &&
                  item?.answer
              )
              .map((item) => ({

                "@type":
                  "Question",

                name:
                  item.question,

                acceptedAnswer: {

                  "@type":
                    "Answer",

                  text:
                    item.answer,

                },

              })),

        }
      : null;


  // =======================================================
  // RENDER
  // =======================================================

  return (

    <Helmet>

      {/* ================= BASIC SEO ================= */}

      <title>
        {title}
      </title>


      <meta
        name="description"
        content={description}
      />


      <meta
        name="keywords"
        content={keywords}
      />


      <meta
        name="robots"
        content="index, follow, max-image-preview:large"
      />


      <link
        rel="canonical"
        href={url}
      />


      {/* ================= H1 ================= */}

      {/* 
        H1 is intentionally NOT rendered here.
        Use `business.seo.h1` in the actual page content.
      */}


      {/* ================= OPEN GRAPH ================= */}

      <meta
        property="og:type"
        content="business.business"
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
        content={url}
      />


      <meta
        property="og:site_name"
        content="ServDial"
      />


      {/* ================= TWITTER ================= */}

      <meta
        name="twitter:card"
        content="summary_large_image"
      />


      <meta
        name="twitter:title"
        content={title}
      />


      <meta
        name="twitter:description"
        content={description}
      />


      <meta
        name="twitter:image"
        content={image}
      />


      {/* ================= LOCAL BUSINESS SCHEMA ================= */}

      {localBusinessSchema && (

        <script
          type="application/ld+json"
        >
          {JSON.stringify(
            localBusinessSchema
          )}
        </script>

      )}


      {/* ================= BREADCRUMB SCHEMA ================= */}

      {breadcrumbSchema && (

        <script
          type="application/ld+json"
        >
          {JSON.stringify(
            breadcrumbSchema
          )}
        </script>

      )}


      {/* ================= FAQ SCHEMA ================= */}

      {faqSchema &&
        faqSchema.mainEntity?.length > 0 && (

          <script
            type="application/ld+json"
          >
            {JSON.stringify(
              faqSchema
            )}
          </script>

        )}

    </Helmet>

  );

};


export default BusinessSEO;