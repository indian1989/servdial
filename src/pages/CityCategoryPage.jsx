// frontend/src/pages/CityCategoryPage.jsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import API from "../api/axios";
import BusinessCard from "../components/business/BusinessCard";
import { normalizeLocation } from "../utils/addressHelper";
import NotFound from "./NotFound";

const CityCategoryPage = () => {
  // ================= URL PARAMS =================
  const params = useParams();
  const citySlug = params.citySlug;
  const categorySlug = params.categorySlug || "all";

  const [notFound, setNotFound] = useState(false);

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subCategories, setSubCategories] = useState([]);
const [categoryInfo, setCategoryInfo] = useState(null);
const [cityInfo,setCityInfo] = useState(null);

  // ================= FETCH BUSINESSES =================
  useEffect(() => {
    // HARD GUARD
    if (!citySlug || !categorySlug) {
      setBusinesses([]);
      setLoading(false);
      return;
    }

    const fetchBusinesses = async () => {
  try {
    setLoading(true);

    const response = await API.get(
  `/seo/${citySlug}/${categorySlug}`
);

const data = response.data;


// "all" page is valid even without category
if (categorySlug !== "all" && !data?.category?.slug) {
  setNotFound(true);
  return;
}


setBusinesses(data?.data || []);


    // ================= SUB CATEGORIES =================

    setSubCategories(
      data?.subCategories || []
    );


    // ================= CATEGORY INFO =================

    setCategoryInfo(
      categorySlug === "all"
       ? null : (data?.category || null) 
      );

    setCityInfo(
 data?.city || null
);

  } catch (error) {

  console.error(
    "SEO PAGE ERROR:",
    error
  );


  if (error?.response?.status === 404) {

   setNotFound(true);

    return;

  }


  setBusinesses([]);
  setSubCategories([]);



  } finally {

    setLoading(false);

  }
};

    fetchBusinesses();

  }, [citySlug, categorySlug]);

  // ================= FORMATTERS =================
const formattedCity = cityInfo?.name
? normalizeLocation(
  cityInfo.name,
  cityInfo.district,
  cityInfo.state,
  cityInfo.country
)
: citySlug
?.replace(/-/g, " ")
?.replace(/\b\w/g, (l) => l.toUpperCase()) || "";

const isAllPage = categorySlug === "all";

console.log({ citySlug, categorySlug, isAllPage, categoryInfo });

const formattedCategory = isAllPage
  
    ? "All Businesses"
    : (categoryInfo?.name ||
      categorySlug
      ?.replace(/-/g, " ")
      ?.replace(/\b\w/g, (l) => l.toUpperCase())) || "Businesses";

  // ================= SEO =================
const title = isAllPage
    ? `Businesses in ${formattedCity} | ServDial`
    : `${formattedCategory} in ${formattedCity} | ServDial`;


  const description = isAllPage
    ? `Find trusted local businesses in ${formattedCity}. Explore
    restaurants, hotels, electricians, plumbers, salons, hospitals and more on ServDial.`
    : `Find trusted ${formattedCategory} services in ${formattedCity}.
    Browse verified local businesses, contact details, ratings and more on ServDial.`;

  const canonicalUrl = `https://servdial.com/${citySlug}/${categorySlug}`;

   
  const schema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: isAllPage
  ? `Businesses in ${formattedCity}`
  : `${formattedCategory} in ${formattedCity}`,
  itemListElement: businesses.map((biz, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
    "@type": "LocalBusiness",
    name: biz?.name,
    image:
    biz?.images?.[0] ||
    "https://servdial.com/default-business.jpg",
    url: `https://servdial.com/${citySlug}/${biz?.categorySlug ||
    biz?.categoryId?.slug}/${biz?.slug}`,
    address: {
    "@type": "PostalAddress",
    addressLocality: cityInfo?.name || "",
    addressRegion: cityInfo?.state || "",
    addressCountry: "IN"
    }
    }
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
    item: `https://servdial.com/${citySlug}`,
    },
    {
    "@type": "ListItem",
    position: 3,
    name: formattedCategory,
    item: canonicalUrl,
    },
    ],
    };

// ================= FAQ DATA =================
  const faqItems = categorySlug === 'restaurant'
  ? [
    {
      question: `How do I find the best restaurants in ${formattedCity}?`,
      answer: `Browse verified restaurant listings on ServDial,
      compare ratings, photos, menus and customer reviews,
      and contact restaurants directly.`,
    },
    {
      question: `Are the restaurants listed on ServDial verified?`,
      answer: `We show local businesses with contact details and
      profile information to help users discover trusted restaurants
      in ${formattedCity}.`,
    },
    {
      question: `Can I contact restaurants directly from ServDial?`,
      answer: `Yes. You can call the restaurant, open WhatsApp if
      available, and get directions from the listing page.`,
    },
  ] : [
    {
      question: `How do I find the best ${formattedCategory.toLowerCase()}
      services in ${formattedCity}?`,
      answer: `Browse verified local businesses on ServDial, compare ratings,
      reviews, contact details and service information before choosing a
      provider.`,
    },
    {
      question: `Are the businesses on ServDial verified?`,
      answer: `We show local businesses with contact details and profile
      information to help users discover trusted providers in
      ${formattedCity}.`,
    },
    {
      question: `Can I contact businesses directly from ServDial?`,
      answer: `Yes. You can call the business, open WhatsApp if available, and
      get directions from the listing page.`,
    },
  ];
  
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-500">
            Loading businesses...
          </p>
        </div>
      </div>
    );
  }

  // ================= NOT FOUND =================
if (notFound) {
  return <NotFound />;
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

  <meta
    name="robots"
    content="index,follow"
  />

  {/* Open Graph */}
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="ServDial" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonicalUrl} />
  <meta
    property="og:image"
    content="https://servdial.com/og-image.jpg"
  />

  <meta
  property="og:image:alt"
  content={`${formattedCategory} in ${formattedCity} | ServDial`}
/>

<meta
  name="twitter:image:alt"
  content={`${formattedCategory} in ${formattedCity} | ServDial`}
/>

  {/* Twitter */}
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
    content="https://servdial.com/og-image.jpg"
  />

  <script type="application/ld+json">
    {JSON.stringify(schema)}
  </script>

  <script type="application/ld+json">
  {JSON.stringify(breadcrumbSchema)}
</script>

{/* FAQ SCHEMA */}
         <script type="application/ld+json">
         {JSON.stringify(faqSchema)}
         </script>
</Helmet>

      <div className="min-h-screen bg-gray-50">

        {/* ================= HERO ================= */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">

          <div className="max-w-7xl mx-auto px-4 py-12">

            {/* BREADCRUMB */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-blue-100 mb-5">

              <Link
                to="/"
                className="hover:text-white transition"
              >
                Home
              </Link>

              <span>/</span>

              <Link
              to={`/${citySlug}`} className="hover:text-white transition capitalize"
              >
                {formattedCity}
              </Link>

              {categorySlug !== "all" && (
              <>
              <span>/</span>

              <span className="text-white font-medium capitalize">
              {formattedCategory}
              </span>
              </>
              )}

            </div>

            {/* HEADING */}
            <h1 className="text-3xl md:text-5xl font-bold capitalize leading-tight">

                {isAllPage
                ?
                `Businesses in ${formattedCity}`
                :
                `${formattedCategory} in ${formattedCity}`
                }

                </h1>

            <p className="mt-4 text-blue-100 max-w-2xl text-base md:text-lg">

              {
              isAllPage
              ?
              `Discover verified local businesses near you in ${formattedCity}.`
              :
              `Discover verified ${formattedCategory.toLowerCase()} near you in ${formattedCity}.`
              }

              </p>

            {/* STATS */}
            <div className="flex flex-wrap gap-4 mt-7">

              <div className="bg-white/10 backdrop-blur px-5 py-3 rounded-2xl border border-white/10">
                <div className="text-2xl font-bold">
                  {businesses.length}
                </div>

                <div className="text-sm text-blue-100">
                  Businesses Found
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur px-5 py-3 rounded-2xl border border-white/10">
                <div className="text-2xl font-bold">
                  100%
                </div>

                <div className="text-sm text-blue-100">
                  Local Results
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ================= CONTENT ================= */}
        <div className="max-w-7xl mx-auto px-4 py-10">
          {
        subCategories.length > 0 && (

        <div className="max-w-7xl mx-auto px-4 py-8">


        <div className="flex items-center justify-between mb-5"> <div> <h2 className="text-2xl font-bold text-gray-900"> Explore {formattedCategory} </h2> <p className="text-gray-500 mt-1"> {subCategories.length} subcategories available </p> </div> </div>


        <div className="
        grid
        grid-cols-2
        md:grid-cols-4
        gap-4
        ">


        {
        subCategories.map((sub)=>(

        <Link
        key={sub._id}
        to={`/${citySlug}/${sub.slug}`}
        className=" bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group "
        >

        <div className="flex items-start justify-between"> <div> <h3 className="font-semibold text-gray-900 capitalize group-hover:text-blue-600 transition"> {sub.name} </h3> <p className="text-sm text-gray-500 mt-2"> Browse businesses and services </p> </div> <span className="text-blue-600 group-hover:translate-x-1 transition-transform"> → </span> </div>


        </Link>

        ))
        }


        </div>


        </div>

        )
        }
          {/* RESULTS TOPBAR */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>
             <h2 className="text-2xl font-bold text-gray-900"> {subCategories.length > 0 ? `Related ${formattedCategory} Businesses in ${formattedCity}` : categorySlug === "all" ? `Popular Businesses in ${formattedCity}` : `Top ${formattedCategory} Businesses in ${formattedCity}`} </h2>
              <p className="text-gray-500 mt-1"> {subCategories.length > 0 ? `${businesses.length} related businesses from subcategories` : `Showing ${businesses.length} businesses in ${formattedCategory}`} </p>
            </div>

            <Link
            to={`/${citySlug}`} className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 transition text-sm font-medium"
            >
              ← Explore More Categories
            </Link>

          </div>

          {/* ================= BUSINESS CARD ================= */}
          {businesses.length > 0 ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

              {businesses.map((biz) => (
                
                <BusinessCard
                  key={biz._id}
                  business={biz}
                />
              ))}

            </div>

          ) : (

            <div className="bg-white border border-gray-200 rounded-3xl p-10 md:p-16 text-center shadow-sm">

              <div className="text-6xl mb-5">
                🔍
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                No businesses found
              </h2>

              <p className="text-gray-500 max-w-lg mx-auto">
                We could not find any businesses for this
                category in {formattedCity} right now.
              </p>

              <div className="mt-8">
                <Link
                  to={`/${citySlug}`}
                  className="inline-flex items-center px-6 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                >
                  Browse Other Categories
                </Link>
              </div>

            </div>

          )}

          {/* ================= SEO CONTENT ================= */}
          <div className="mt-16 bg-white rounded-3xl border border-gray-200 p-8 md:p-10 shadow-sm">

            <h2 className="text-2xl font-bold text-gray-900 mb-4">

              {
              categorySlug === "all"
              ?
              `Explore Local Businesses in ${formattedCity}`
              :
              `Best ${formattedCategory} Services in ${formattedCity}`
              }

              </h2>

            <div className="space-y-4 text-gray-600 leading-7">

              <p>
                Looking for trusted{" "}
                {formattedCategory.toLowerCase()} services
                in {formattedCity}? ServDial helps you
                discover verified local businesses with
                ratings, reviews, phone numbers and service
                details.
              </p>

              <p>
                Compare local providers, explore business
                profiles and connect directly with trusted
                professionals near you.
              </p>

            </div>

          </div>

          {/* ================= FAQ SECTION ================= */}
          <div
          className="mt-10 bg-white rounded-3xl border
          border-gray-200 p-8 md:p-10 shadow-sm">
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
              </h2>
              
              <div className="space-y-6">
                {faqItems.map((item, index) => (
                  
                  <div
                  key={index}
                  className="border-b border-gray-100 pb-5
                  last:border-0 last:pb-0"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.question}
                      </h3>
                      
                      <p className="text-gray-600 leading-7">
                        {item.answer}
                        </p>
                        </div>
                      ))}
                      </div>
                      </div>

        </div>

      </div>
    </>
  );
};

export default CityCategoryPage;