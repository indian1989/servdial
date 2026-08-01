// src/components/business/BusinessSEO.jsx

import { Helmet } from "react-helmet-async";
import {
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
} from "../../utils/schemaBuilder";

const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL ||
  "https://servdial.com";

const absoluteUrl = (url) => {
  if (!url) return `${FRONTEND_URL}/logo.png`;
  return url.startsWith("http") ? url : `${FRONTEND_URL}${url}`;
};

const BusinessSEO = ({ business, currentUrl }) => {

 
  if (!business) return null;

  /* ================= LOCATION ================= */
const cityName =
  business?.cityId?.name ||
  business?.cityName ||
  "";

const districtName =
  business?.district ||
  "";

const stateName =
  business?.state ||
  "";

const countryName =
  business?.country ||
  "India";


const normalizeLocation = (...parts) => {
  return parts
    .filter(Boolean)
    .map((item) => item.trim())
    .filter(
      (item, index, arr) =>
        arr.findIndex(
          (x) =>
            x.toLowerCase() === item.toLowerCase()
        ) === index
    )
    .join(", ");
};

/* ================= ADDRESS ================= */

const street =
  business?.address?.street ||
  "";

const area =
  business?.address?.area ||
  "";

const landmark =
  business?.address?.landmark ||
  "";


const addressText = normalizeLocation(
  street,
  area,
  landmark
);


/* ================= SEO LOCATION ================= */

const locationText = normalizeLocation(
  area,
  cityName,
  districtName,
  stateName
);

  /* ================= CATEGORY ================= */

  const categoryName =
    business?.categoryId?.name ||
    business?.categoryName ||
    "Business";

  /* ================= TITLE ================= */

const titleLocation = locationText
  ? ` in ${locationText}`
  : "";

const title =
  `${business.name} - ${categoryName}${titleLocation} | ServDial`;


/* ================= DESCRIPTION ================= */

const seoLocation = normalizeLocation(
  area,
  cityName,
  districtName,
  stateName
);


const description =
`${business.name} is a trusted & Verified ${categoryName} in ${seoLocation}. Find address, phone number, reviews, photos, services and contact details on ServDial.`
.replace(/\s+/g, " ")
.slice(0, 250);

  /* ================= IMAGE ================= */

  const image = absoluteUrl(
    business?.images?.[0] ||
      business?.logo
  );

  /* ================= URL ================= */

  const url =
    currentUrl ||
    `${FRONTEND_URL}/${business.citySlug}/${business.categorySlug}/${business.slug}`;

  /* ================= KEYWORDS ================= */

  const keywords = [
  business.name,
  categoryName,

  area,
  cityName,
  districtName,
  stateName,

  area && `${categoryName} in ${area}`,
  cityName && `${categoryName} in ${cityName}`,
  `Best ${categoryName} in ${cityName}`,
  `Verified ${categoryName} in ${cityName}`,

  `${business.name} phone number`,
  `${business.name} address`,

  "ServDial",
]
.filter(Boolean)
.join(", ");

  /* ================= SCHEMAS ================= */

  const localBusinessSchema =
    generateLocalBusinessSchema(
    {
    ...business,
    categoryName,
    cityName,
    state: stateName,
    image,
    descriptionSEO: description,
    },
    url
    );

    console.log(
  "LOCAL BUSINESS SCHEMA:",
  localBusinessSchema
);

  const breadcrumbSchema =
    generateBreadcrumbSchema({
      city: cityName,
      category: categoryName,
      businessName: business.name,
      citySlug: business.citySlug,
      categorySlug: business.categorySlug,
      businessSlug: business.slug,
    });

    const faqSchema =
  business?.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": business.faq.map((item) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer,
          },
        })),
      }
    : null;

  return (
    <Helmet>

      {/* ================= BASIC ================= */}

      <title>{title}</title>

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

      {/* ================= OPEN GRAPH ================= */}

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="ServDial" />

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

      {/* ================= STRUCTURED DATA ================= */}

      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>

      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>

      {
  faqSchema && (
    <script type="application/ld+json">
      {JSON.stringify(faqSchema)}
    </script>
  )
}

    </Helmet>
  );
};

export default BusinessSEO;