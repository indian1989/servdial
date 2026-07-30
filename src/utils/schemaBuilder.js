// frontend/src/utils/schemaBuilder.js


const titleCase = (str = "") =>
  str
    .toString()
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());



/*
====================================================
 LOCAL BUSINESS SCHEMA
====================================================
*/

export const generateLocalBusinessSchema = (
  business = {},
  currentUrl = ""
) => {


  const city =
    business.cityName ||
    business.cityId?.name ||
    "";


  const category =
    business.categoryName ||
    business.categoryId?.name ||
    "Business";


  const lat =
    business.location?.coordinates?.[1];


  const lng =
    business.location?.coordinates?.[0];



  return {


    "@context":
      "https://schema.org",


    "@type":
      "LocalBusiness",



    "@id":
      currentUrl,



    name:
      business.name,



    url:
      currentUrl,



    image:
      business.images?.[0] ||
      business.logo ||
      undefined,



    telephone:
      business.phone || undefined,



    description:
      business.description ||
      `${business.name} ${category} in ${city}`,



    address:{


      "@type":
        "PostalAddress",


      streetAddress:
        business.address || "",


      addressLocality:
        titleCase(city),


      addressRegion:
        titleCase(
          business.state || ""
        ),


      postalCode:
        business.pincode || "",


      addressCountry:
        "IN"

    },



    ...(lat && lng
      ? {

        geo:{

          "@type":
            "GeoCoordinates",

          latitude:
            lat,

          longitude:
            lng

        }

      }

      : {}
    ),



    ...(business.averageRating > 0
      ? {

        aggregateRating:{

          "@type":
            "AggregateRating",

          ratingValue:
            Number(
              business.averageRating
            ).toFixed(1),

          reviewCount:
            business.totalReviews || 1

        }

      }

      : {}
    )


  };

};





/*
====================================================
 BREADCRUMB SCHEMA
====================================================
*/


export const generateBreadcrumbSchema = ({

  city,
  category,
  businessName,

  citySlug,
  categorySlug,
  businessSlug


}) => ({


  "@context":
    "https://schema.org",



  "@type":
    "BreadcrumbList",



  itemListElement:[


    {

      "@type":
        "ListItem",

      position:
        1,

      name:
        "Home",

      item:
        "https://servdial.com"

    },


    {

      "@type":
        "ListItem",

      position:
        2,

      name:
        titleCase(city),

      item:
        `https://servdial.com/${citySlug}`

    },


    {

      "@type":
        "ListItem",

      position:
        3,

      name:
        titleCase(category),

      item:
        `https://servdial.com/${citySlug}/${categorySlug}`

    },


    {

      "@type":
        "ListItem",

      position:
        4,

      name:
        businessName,

      item:
        `https://servdial.com/${citySlug}/${categorySlug}/${businessSlug}`

    }


  ]

});





/*
====================================================
 WEBSITE SCHEMA
====================================================
*/


export const generateWebsiteSchema = () => ({


  "@context":
    "https://schema.org",


  "@type":
    "WebSite",


  name:
    "ServDial",


  url:
    "https://servdial.com",



  potentialAction:{


    "@type":
      "SearchAction",


    target:
      "https://servdial.com/search?q={search_term_string}",


    "query-input":
      "required name=search_term_string"

  }


});