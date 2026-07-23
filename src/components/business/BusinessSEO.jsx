import { Helmet } from "react-helmet-async";

const BusinessSEO = ({ business, currentUrl }) => {
  if (!business) return null;

  const lat = business?.location?.coordinates?.[1];
  const lng = business?.location?.coordinates?.[0];

  const title = `${business.name} ${
    business.categoryId?.name ? `- ${business.categoryId.name}` : ""
  } ${business.city ? `in ${business.city}` : ""} | ServDial`;

  const description =
    business.description ||
    `${business.name} is a trusted ${
      business.categoryId?.name || "business"
    } in ${business.city || ""}. View phone number, address, reviews, photos, business hours and more on ServDial.`;

  const image =
    business.images?.[0] ||
    business.logo ||
    "/logo.png";

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",

    "@id": currentUrl,

    name: business.name,

    image,

    url: currentUrl,

    telephone: business.phone || "",

    description,

    address: {
      "@type": "PostalAddress",

      streetAddress: business.address || "",

      addressLocality:
        business.cityId?.name ||
        business.city ||
        "",

      addressRegion:
        business.state || "",

      postalCode:
        business.pincode || "",

      addressCountry: "IN",
    },

    geo:
      lat && lng
        ? {
            "@type": "GeoCoordinates",

            latitude: lat,

            longitude: lng,
          }
        : undefined,

    aggregateRating:
      business.averageRating
        ? {
            "@type": "AggregateRating",

            ratingValue:
              business.averageRating,

            reviewCount:
              business.totalReviews || 0,
          }
        : undefined,

    openingHoursSpecification:
      business.openingHours || undefined,

    sameAs:
      business.website
        ? [business.website]
        : undefined,
  };

  return (
    <Helmet>

      <title>{title}</title>

      <meta
        name="description"
        content={description}
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
        property="og:type"
        content="business.business"
      />

      <meta
        property="og:url"
        content={currentUrl}
      />

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

      <link
        rel="canonical"
        href={currentUrl}
      />

      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>

    </Helmet>
  );
};

export default BusinessSEO;