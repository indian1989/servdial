// src/components/business/BusinessSEO.jsx

import { Helmet } from "react-helmet-async";


const BusinessSEO = ({
  business,
  currentUrl,
}) => {

  if (!business) return null;


  /* ================= LOCATION ================= */

  const cityName =
    business?.cityId?.name ||
    business?.cityName ||
    "";


  const stateName =
    business?.state ||
    "";


  const countryName =
    business?.country ||
    "";


  const locationText =
    [
      cityName,
      stateName,
      countryName,
    ]
    .filter(Boolean)
    .join(", ");



  /* ================= CATEGORY ================= */

  const categoryName =
    business?.categoryId?.name ||
    "Business";



  /* ================= GEO ================= */

  const lat =
    business?.location?.coordinates?.[1];


  const lng =
    business?.location?.coordinates?.[0];



  /* ================= SEO TITLE ================= */


  const title =
    `${business.name} - ${categoryName}${
      cityName
        ? ` in ${cityName}`
        : ""
    } | ServDial`;



  /* ================= DESCRIPTION ================= */


  const description =
    business.description ||
    `${business.name} is a trusted ${categoryName}${
      locationText
        ? ` in ${locationText}`
        : ""
    }. Find contact details, address, reviews, photos, services and business information on ServDial.`;



  /* ================= IMAGE ================= */


  const image =
    business?.images?.[0] ||
    business?.logo ||
    "/logo.png";



  /* ================= SCHEMA ================= */


  const schema = {

    "@context": "https://schema.org",

    "@type": "LocalBusiness",


    "@id": currentUrl,


    name:
      business.name,


    url:
      currentUrl,


    image,


    description,



    telephone:
      business.phone || "",



    address: {

      "@type":
        "PostalAddress",


      streetAddress:
        business.address || "",


      addressLocality:
        cityName,


      addressRegion:
        stateName,


      postalCode:
        business.pincode || "",


      addressCountry:
        countryName,

    },

    "@type": [
  "LocalBusiness",
  "Service"
],

areaServed: {
  "@type": "City",
  name: cityName
},

hasOfferCatalog: {
 "@type":"OfferCatalog",
 "name": categoryName
},


    ...(lat && lng
      ? {

        geo: {

          "@type":
            "GeoCoordinates",

          latitude:
            lat,

          longitude:
            lng,

        }

      }

      : {}
    ),




    ...(business.averageRating > 0
      ? {

        aggregateRating: {

          "@type":
            "AggregateRating",


          ratingValue:
            business.averageRating,


          reviewCount:
            business.totalReviews || 0,

        }

      }

      : {}
    ),




    ...(business.website
      ? {

        sameAs:[
          business.website
        ]

      }

      : {}
    ),


  };



  return (

    <Helmet>


      {/* TITLE */}

      <title>
        {title}
      </title>



      {/* DESCRIPTION */}

      <meta
        name="description"
        content={description}
      />



      {/* CANONICAL */}

      <link
        rel="canonical"
        href={currentUrl}
      />



      {/* OPEN GRAPH */}


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
        content={currentUrl}
      />


      <meta
        property="og:type"
        content="business.business"
      />



      {/* TWITTER */}


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



      {/* GOOGLE STRUCTURED DATA */}


      <script type="application/ld+json">

        {JSON.stringify(schema)}

      </script>


    </Helmet>

  );

};


export default BusinessSEO;