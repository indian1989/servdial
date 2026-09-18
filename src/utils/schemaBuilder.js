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
  business.image ||
  business.images?.[0] ||
  business.logo ||
  "https://www.servdial.com/logo.png",



    telephone:
      business.phone || undefined,

description:
  business.description ||
  `${business.name} is a trusted ${category} in ${titleCase(city)}. Find address, phone number, reviews, photos and services on ServDial.`,

    address:{


      "@type":
        "PostalAddress",


streetAddress:
[
  business.address?.street,
  business.address?.area,
  business.address?.landmark
]
.filter(Boolean)
.join(", "),

      addressLocality:
        titleCase(city),


      addressRegion:
        titleCase(
          business.state || ""
        ),


      postalCode:
        business.pincode || "",


      addressCountry:
  business.countryCode || "IN"

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

...(business.businessHours
  ? {
      openingHoursSpecification:
        Object.entries(
          business.businessHours
        )
        .filter(
          ([, value]) =>
            value &&
            !value.closed &&
            value.open &&
            value.close
        )
        .map(([day, value]) => ({
          "@type":
            "OpeningHoursSpecification",

          dayOfWeek:
            day.charAt(0).toUpperCase() +
            day.slice(1),

          opens:
            value.open,

          closes:
            value.close,
        })),
    }
  : {}
),

areaServed:
business.serviceAreas?.length
?
business.serviceAreas.map(area => ({
  "@type":
    area.type === "city"
      ? "City"
      : area.type === "state"
      ? "State"
      : area.type === "country"
      ? "Country"
      : "AdministrativeArea",

  name: titleCase(area.name)
}))
:
[
 {
   "@type":"City",
   name:titleCase(city)
 }
],

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
  state,
  stateSlug,
  city,
  citySlug,
  parentCategory,
  parentCategorySlug,
  category,
  categorySlug,
  businessName,
  businessSlug,
}) => {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.servdial.com/",
    },
  ];

  let position = 2;

  // ==================================================
  // STATE
  // ==================================================

  if (state && stateSlug) {
    items.push({
      "@type": "ListItem",
      position: position++,
      name: titleCase(state),
      item: `https://www.servdial.com/${stateSlug}`,
    });
  }

  // ==================================================
  // CITY
  // ==================================================

  if (city && citySlug && stateSlug) {
    items.push({
      "@type": "ListItem",
      position: position++,
      name: titleCase(city),
      item: `https://www.servdial.com/${stateSlug}/${citySlug}`,
    });
  }

  // ==================================================
  // PARENT CATEGORY
  // ==================================================

  if (
    parentCategory &&
    parentCategorySlug &&
    stateSlug &&
    citySlug
  ) {
    items.push({
      "@type": "ListItem",
      position: position++,
      name: titleCase(parentCategory),
      item: `https://www.servdial.com/${stateSlug}/${citySlug}/${parentCategorySlug}`,
    });
  }

  // ==================================================
  // SUBCATEGORY / PRIMARY CATEGORY
  // ==================================================

  if (
    category &&
    categorySlug &&
    stateSlug &&
    citySlug
  ) {
    items.push({
      "@type": "ListItem",
      position: position++,
      name: titleCase(category),
      item: `https://www.servdial.com/${stateSlug}/${citySlug}/${categorySlug}`,
    });
  }

  // ==================================================
  // BUSINESS
  // IMPORTANT:
  // Business URL intentionally has NO state slug.
  // ==================================================

  if (
    businessName &&
    businessSlug &&
    citySlug &&
    categorySlug
  ) {
    items.push({
      "@type": "ListItem",
      position: position++,
      name: businessName,
      item: `https://www.servdial.com/${citySlug}/${categorySlug}/${businessSlug}`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
};


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
    "https://www.servdial.com",



  potentialAction:{


    "@type":
      "SearchAction",


    target:
      "https://www.servdial.com/search?q={search_term_string}",


    "query-input":
      "required name=search_term_string"

  }


});