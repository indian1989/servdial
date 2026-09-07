// frontend/src/pages/CategoryPage.jsx

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import API from "../api/axios";
import { useCity } from "../context/CityContext";
import { formatLocationDisplay } from "../utils/addressHelper";

import {
  Layers3,
  ChevronRight,
  Grid2X2,
  MapPin,
  ArrowRight,
  Search,
} from "lucide-react";

import BannerAd from "../components/ads/BannerAd";
import BusinessCard from "../components/business/BusinessCard";

const slugify = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const CategoryPage = () => {

  const { city: contextCity } = useCity();

  const { citySlug } = useParams();

  const [pageCity, setPageCity] =
    useState(null);

  const [cities, setCities] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [citySearch, setCitySearch] =
    useState("");

  const [businesses, setBusinesses] =
  useState([]);

const [businessLoading, setBusinessLoading] =
  useState(false);

  /* =====================================================
   RESOLVE URL CITY
   - Uses single /cities fetch
===================================================== */

useEffect(() => {

 if (!citySlug) {

  setPageCity(
    contextCity
      ? {
          ...contextCity,
          stateSlug:
            contextCity.stateSlug ||
            slugify(contextCity.state),
        }
      : null
  );

  return;
}

  const normalizedCitySlug =
    citySlug.toLowerCase();

  /*
   * Cities are already fetched by
   * the main fetchData() effect.
   *
   * Resolve page city from the
   * existing cities state.
   */

  const matchedCity =
    (cities || []).find(
      (item) =>
        (item?.slug || "")
          .toLowerCase() ===
        normalizedCitySlug
    );

  if (matchedCity) {

    console.log(
      "🏙️ CATEGORY matched city:",
      matchedCity
    );

    setPageCity({
  ...matchedCity,
  stateSlug:
    matchedCity.stateSlug ||
    slugify(matchedCity.state),
});

  } else if (
    !loading &&
    cities.length > 0
  ) {

    console.log(
      "⚠️ CATEGORY city not found:",
      citySlug
    );

    setPageCity(null);

  }

}, [
  citySlug,
  cities,
  loading,
  contextCity,
]);

  /* =====================================================
   FETCH CITY BUSINESSES
===================================================== */

useEffect(() => {

  if (!pageCity?.slug) {

    setBusinesses([]);

    return;

  }

  const fetchBusinesses =
    async () => {

      try {

        setBusinessLoading(true);

        const res =
  await API.get(
    "/businesses/random",
    {
      params: {
        city: pageCity.slug,
        limit: 20,
      },
    }
  );

        const fetchedBusinesses =
          Array.isArray(
            res?.data?.data
          )
            ? res.data.data
            : [];

        console.log(
          "🏢 CATEGORY businesses:",
          fetchedBusinesses.length
        );

        setBusinesses(
          fetchedBusinesses
        );

      } catch (err) {

        console.error(
          "❌ Category businesses fetch error:",
          err?.response?.data ||
            err
        );

        setBusinesses([]);

      } finally {

        setBusinessLoading(false);

      }

    };

  fetchBusinesses();

}, [pageCity?.slug]);

  /* =====================================================
     CITY NORMALIZATION
  ===================================================== */

  const formattedCity =
    pageCity?.name
      ? formatLocationDisplay(
          pageCity.name,
          pageCity.district,
          pageCity.state
        )
      : "your area";


  const citySlugResolved =
    pageCity?.slug ||
    citySlug ||
    "";


  /* =====================================================
     CITY SEARCH
  ===================================================== */

  const filteredCities =
    (cities || []).filter(
      (item) =>
        (item?.name || "")
          .toLowerCase()
          .includes(
            citySearch
              .toLowerCase()
              .trim()
          )
    );


  /* =====================================================
     FEATURED TOP CITIES
  ===================================================== */

  const featuredCitySlugs = [

    "delhi-new-delhi-delhi",

    "mumbai-mumbai-suburban-maharashtra",

    "kolkata-kolkata-west-bengal",

    "bengaluru-bengaluru-urban-karnataka",

    "chennai-chennai-tamil-nadu",

    "hyderabad-hyderabad-telangana",

    "pune-pune-maharashtra",

    "patna-patna-bihar",

  ];


  const featuredCities =
    featuredCitySlugs
      .map(
        (slug) =>
          (cities || []).find(
            (cityItem) =>
              cityItem?.slug === slug
          )
      )
      .filter(Boolean);


  /* =====================================================
     FETCH CITIES + GLOBAL CATEGORIES
  ===================================================== */

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          setLoading(true);


          const [
            citiesRes,
            categoriesRes,
          ] =
            await Promise.all([

              API.get(
                "/cities"
              ),

              API.get(
                "/categories"
              ),

            ]);


          /* -------------------------------------------------
             CITIES
          ------------------------------------------------- */

          const fetchedCities =
            Array.isArray(
              citiesRes?.data?.data
            )
              ? citiesRes.data.data
              : citiesRes?.data?.cities ||
                citiesRes?.data?.data?.cities ||
                [];


          setCities(
  fetchedCities.map((cityItem) => ({
    ...cityItem,
    stateSlug:
      cityItem.stateSlug ||
      slugify(cityItem.state),
  }))
);


          /* -------------------------------------------------
             GLOBAL CATEGORIES
          ------------------------------------------------- */

          const fetchedCategories =
            Array.isArray(
              categoriesRes?.data?.data
            )
              ? categoriesRes.data.data
              : categoriesRes?.data?.categories ||
                categoriesRes?.data?.data?.categories ||
                [];


          setCategories(
            fetchedCategories
          );


        } catch (err) {

          console.error(
            "❌ Error fetching cities or categories:",
            err?.response?.data ||
              err
          );


          setCities([]);

          setCategories([]);

        } finally {

          setLoading(false);

        }

      };


    fetchData();

  }, []);


  /* =====================================================
     GLOBAL PARENT CATEGORIES
  ===================================================== */

  const parentCategories =
    (categories || []).filter(
      (category) =>
        !category.parentCategory
    );


  /* =====================================================
     SEO
  ===================================================== */

  const categoryPageTitle =
    pageCity?.slug
      ? `Business Categories & Local Services in ${formattedCity} | ServDial`
      : "Business Categories & Local Services | ServDial";


  const categoryPageDescription =
    pageCity?.slug
      ? `Explore business categories and local services in ${formattedCity}. Find trusted businesses, professionals, restaurants, healthcare, home services, repair services and more on ServDial.`
      : "Explore business categories and local services on ServDial. Find trusted businesses, professionals, restaurants, healthcare, home services, repair services and more across India.";


  const categoryCanonicalUrl =
    pageCity?.slug
      ? `https://servdial.com/${citySlugResolved}/categories`
      : "https://servdial.com/categories";


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          bg-gray-50
          flex
          items-center
          justify-center
        "
      >

        <div className="text-center">

          <div
            className="
              w-10
              h-10
              border-4
              border-blue-600
              border-t-transparent
              rounded-full
              animate-spin
              mx-auto
              mb-4
            "
          />

          <p className="text-gray-500">

            Loading categories...

          </p>

        </div>

      </div>

    );

  }


  /* =====================================================
     PAGE
  ===================================================== */

  return (

    <>

      {/* =================================================
          SEO
      ================================================= */}

      <Helmet>

        <title>
          {categoryPageTitle}
        </title>


        <meta
          name="description"
          content={categoryPageDescription}
        />


        <link
          rel="canonical"
          href={categoryCanonicalUrl}
        />


        {/* ================= OPEN GRAPH ================= */}

        <meta
          property="og:type"
          content="website"
        />


        <meta
          property="og:title"
          content={categoryPageTitle}
        />


        <meta
          property="og:description"
          content={categoryPageDescription}
        />


        <meta
          property="og:url"
          content={categoryCanonicalUrl}
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
          content={categoryPageTitle}
        />


        <meta
          name="twitter:description"
          content={categoryPageDescription}
        />


        {/* ================= COLLECTION PAGE ================= */}

        <script type="application/ld+json">

          {JSON.stringify({

            "@context":
              "https://schema.org",

            "@type":
              "CollectionPage",

            name:
              categoryPageTitle,

            description:
              categoryPageDescription,

            url:
              categoryCanonicalUrl,

            isPartOf: {

              "@type":
                "WebSite",

              name:
                "ServDial",

              url:
                "https://servdial.com/",

            },

          })}

        </script>

      </Helmet>


      <div className="min-h-screen bg-gray-50">


        {/* =================================================
            HERO
        ================================================= */}

        <section
          className="
            bg-gradient-to-r
            from-blue-600
            to-indigo-700
            text-white
          "
        >

          <div
            className="
              max-w-7xl
              mx-auto
              px-4
              py-14
            "
          >


            {/* ================= BREADCRUMB ================= */}

            <div
              className="
                flex
                items-center
                gap-2
                text-sm
                text-blue-100
                mb-5
                flex-wrap
              "
            >

              <Link
                to="/"
                className="
                  hover:text-white
                  transition
                "
              >
                Home
              </Link>


              <ChevronRight
                size={14}
              />


              {pageCity?.slug && (

                <>

                  <Link
                    to={`/${citySlugResolved}`}
                    className="
                      hover:text-white
                      transition
                    "
                  >
                    {formattedCity}
                  </Link>


                  <ChevronRight
                    size={14}
                  />

                </>

              )}


              <span
                className="
                  text-white
                  font-medium
                "
              >
                Categories
              </span>

            </div>


            {/* ================= HERO CONTENT ================= */}

            <div className="max-w-3xl">


              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  bg-white/10
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  mb-5
                "
              >

                <Layers3
                  size={16}
                />

                <span>
                  Discover local services
                </span>

              </div>


              {/* ================= H1 ================= */}

              <h1
                className="
                  text-4xl
                  md:text-5xl
                  font-bold
                  leading-tight
                  mb-4
                "
              >

                {pageCity?.slug
                  ? `Browse Service Categories in ${formattedCity}`
                  : "Browse Service Categories"}

              </h1>


              {/* ================= HERO DESCRIPTION ================= */}

              <p
                className="
                  text-blue-100
                  text-lg
                  leading-relaxed
                "
              >

                {pageCity?.slug
                  ? `Explore verified businesses, trusted professionals and local services across every category in ${formattedCity} on ServDial.`
                  : "Explore verified businesses, trusted professionals and local services across every category on ServDial."}

              </p>

            </div>

          </div>

        </section>


        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <section
          className="
            max-w-7xl
            mx-auto
            px-4
            py-10
          "
        >


          {/* =================================================
              TOP BANNER AD
          ================================================= */}

          <div className="mb-10">

            <BannerAd
  placement="category_page_top"
  cityId={pageCity?._id}
/>

          </div>


          {/* =================================================
              CATEGORY HEADER
          ================================================= */}

          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-4
              mb-8
            "
          >

            <div>

              <h2
                className="
                  text-2xl
                  font-bold
                  text-gray-800
                "
              >
                Popular Categories
              </h2>


              <p
                className="
                  text-gray-500
                  mt-1
                "
              >

                {parentCategories.length}
                {" "}
                categories available

                {pageCity?.slug
                  ? ` in ${formattedCity}`
                  : ""}

              </p>

            </div>


            <div
              className="
                flex
                items-center
                gap-2
                bg-white
                border
                rounded-xl
                px-4
                py-3
                shadow-sm
              "
            >

              <Grid2X2
                size={18}
                className="text-blue-600"
              />

              <span
                className="
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Explore businesses
              </span>

            </div>

          </div>


          {/* =================================================
              GLOBAL CATEGORY GRID
          ================================================= */}

      {parentCategories.length > 0 ? (

  <div
    className="
      grid
      grid-cols-2
      sm:grid-cols-3
      md:grid-cols-4
      lg:grid-cols-5
      gap-5
    "
  >

    {parentCategories.map(
      (category, index) => (

        <React.Fragment key={category._id}>

          {/* ================= CATEGORY CARD ================= */}

          <Link
            to={
  pageCity?.slug
    ? `/${pageCity.stateSlug}/${citySlugResolved}/${category.slug}`
    : `/category/${category.slug}`
}
            className="
              group
              bg-white
              border
              border-gray-100
              rounded-2xl
              p-5
              hover:shadow-xl
              hover:border-blue-200
              transition-all
              duration-300
            "
          >

            {/* ================= ICON ================= */}

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-blue-50
                flex
                items-center
                justify-center
                mb-4
                group-hover:bg-blue-100
                transition
              "
            >

              {category.icon ? (

                <img
                  src={category.icon}
                  alt={`${category.name} services on ServDial`}
                  className="
                    w-8
                    h-8
                    object-contain
                  "
                />

              ) : (

                <Layers3
                  size={24}
                  className="text-blue-600"
                />

              )}

            </div>

            {/* ================= CATEGORY NAME ================= */}

            <h3
              className="
                font-semibold
                text-gray-800
                text-sm
                leading-6
                group-hover:text-blue-600
                transition
                min-h-[48px]
              "
            >
              {category.name}
            </h3>

            {/* ================= FOOTER ================= */}

            <div
              className="
                flex
                items-center
                justify-between
                mt-4
              "
            >

              <span
                className="
                  text-xs
                  text-gray-500
                "
              >
                View sub categories
              </span>

              <ArrowRight
                size={16}
                className="
                  text-gray-400
                  group-hover:text-blue-600
                  transition
                "
              />

            </div>

          </Link>


          {/* =================================================
              CATEGORY MIDDLE BANNER
              SHOW AFTER 5TH CATEGORY
              ================================================= */}

          {index === 19 && (

            <div
              className="
                col-span-2
                sm:col-span-3
                md:col-span-4
                lg:col-span-5
                my-6
              "
            >

              <BannerAd
                placement="category_page_middle"
                cityId={pageCity?._id}
              />

            </div>

          )}

        </React.Fragment>

      )
    )}

  </div>

) : (

            <div
              className="
                bg-white
                border
                rounded-3xl
                p-10
                text-center
                shadow-sm
              "
            >

              <div
                className="
                  w-16
                  h-16
                  bg-gray-100
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  mx-auto
                  mb-5
                "
              >

                <Search
                  size={28}
                  className="text-gray-400"
                />

              </div>


              <h3
                className="
                  text-xl
                  font-semibold
                  text-gray-700
                  mb-2
                "
              >
                No Categories Found
              </h3>


              <p className="text-gray-500">

                Categories are not available
                right now.

              </p>

            </div>

          )}


          {/* =================================================
              FEATURED CITIES + CITY SEARCH
          ================================================= */}

          {cities.length > 0 && (

            <div className="mt-16">


              {/* ================= HEADER ================= */}

              <div className="mb-6">

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-gray-800
                  "
                >
                  Explore by City
                </h2>


                <p
                  className="
                    text-gray-500
                    mt-1
                  "
                >
                  Browse local businesses and services by city
                </p>

              </div>


              {/* ================= CITY SEARCH ================= */}

              <div
                className="
                  relative
                  max-w-xl
                  mb-8
                "
              >

                <Search
                  size={20}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />


                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) =>
                    setCitySearch(
                      e.target.value
                    )
                  }
                  placeholder="Search any city..."
                  className="
                    w-full
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    pl-12
                    pr-4
                    py-4
                    text-sm
                    text-gray-700
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                    transition
                  "
                />

              </div>


              {/* =================================================
                  SEARCH RESULT
              ================================================= */}

              {citySearch.trim() ? (

                filteredCities.length > 0 ? (

                  <div
                    className="
                      grid
                      grid-cols-2
                      sm:grid-cols-3
                      md:grid-cols-4
                      lg:grid-cols-6
                      gap-4
                    "
                  >

                    {filteredCities.map(
                      (cityItem) => (

                        <Link
                          key={cityItem._id}
                          to={`/${cityItem.slug}/categories`}
                          className="
                            group
                            bg-white
                            border
                            rounded-2xl
                            px-5
                            py-4
                            hover:shadow-lg
                            hover:border-blue-200
                            transition
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >

                            <div
                              className="
                                w-10
                                h-10
                                rounded-xl
                                bg-blue-50
                                flex
                                items-center
                                justify-center
                                group-hover:bg-blue-100
                                transition
                              "
                            >

                              <MapPin
                                size={18}
                                className="text-blue-600"
                              />

                            </div>


                            <div
                              className="
                                min-w-0
                              "
                            >

                              <h3
                                className="
                                  font-semibold
                                  text-sm
                                  text-gray-800
                                  group-hover:text-blue-600
                                  transition
                                  truncate
                                "
                              >
                                {cityItem.name}
                              </h3>


                              <p
                                className="
                                  text-xs
                                  text-gray-500
                                "
                              >
                                Explore services
                              </p>

                            </div>

                          </div>

                        </Link>

                      )
                    )}

                  </div>

                ) : (

                  <div
                    className="
                      bg-white
                      border
                      rounded-2xl
                      p-8
                      text-center
                    "
                  >

                    <Search
                      size={28}
                      className="
                        text-gray-400
                        mx-auto
                        mb-3
                      "
                    />


                    <h3
                      className="
                        font-semibold
                        text-gray-700
                      "
                    >
                      No City Found
                    </h3>


                    <p
                      className="
                        text-sm
                        text-gray-500
                        mt-1
                      "
                    >
                      Try searching with another city name.
                    </p>

                  </div>

                )

              ) : (

                /* =================================================
                   DEFAULT TOP 8 CITIES
                ================================================= */

                <>

                  <div
                    className="
                      grid
                      grid-cols-2
                      sm:grid-cols-3
                      md:grid-cols-4
                      lg:grid-cols-6
                      gap-4
                    "
                  >

                    {featuredCities.map(
                      (cityItem) => (

                        <Link
                          key={cityItem._id}
                          to={`/${cityItem.slug}/categories`}
                          className="
                            group
                            bg-white
                            border
                            rounded-2xl
                            px-5
                            py-4
                            hover:shadow-lg
                            hover:border-blue-200
                            transition
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >

                            <div
                              className="
                                w-10
                                h-10
                                rounded-xl
                                bg-blue-50
                                flex
                                items-center
                                justify-center
                                group-hover:bg-blue-100
                                transition
                              "
                            >

                              <MapPin
                                size={18}
                                className="text-blue-600"
                              />

                            </div>


                            <div
                              className="
                                min-w-0
                              "
                            >

                              <h3
                                className="
                                  font-semibold
                                  text-sm
                                  text-gray-800
                                  group-hover:text-blue-600
                                  transition
                                  truncate
                                "
                              >
                                {cityItem.name}
                              </h3>


                              <p
                                className="
                                  text-xs
                                  text-gray-500
                                "
                              >
                                Explore services
                              </p>

                            </div>

                          </div>

                        </Link>

                      )
                    )}

                  </div>


                  <p
                    className="
                      text-sm
                      text-gray-500
                      mt-5
                    "
                  >

                    Showing{" "}
                    {featuredCities.length}
                    {" "}popular cities.
                    Search above to find any city
                    available on ServDial.

                  </p>

                </>

              )}

            </div>

          )}

{/* =================================================
    BUSINESSES IN CITY
================================================= */}

{pageCity?.slug && (

  <section className="mt-16">

    <div
      className="
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-3
        mb-6
      "
    >

      <div>

        <h2
          className="
            text-2xl
            font-bold
            text-gray-800
          "
        >
          Businesses in {formattedCity}
        </h2>

        <p
          className="
            text-gray-500
            mt-1
          "
        >
          Discover local businesses and services
          available in {formattedCity}.
        </p>

      </div>

      {!businessLoading &&
        businesses.length > 0 && (

          <span
            className="
              text-sm
              font-medium
              text-blue-600
              bg-blue-50
              px-4
              py-2
              rounded-full
            "
          >
            {businesses.length} businesses
          </span>

        )}

    </div>


    {/* ================= LOADING ================= */}

    {businessLoading ? (

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-5
        "
      >

        {[1, 2, 3, 4, 5, 6].map(
          (item) => (

            <div
              key={item}
              className="
                bg-white
                border
                rounded-2xl
                p-5
                animate-pulse
              "
            >

              <div
                className="
                  h-40
                  bg-gray-200
                  rounded-xl
                  mb-4
                "
              />

              <div
                className="
                  h-5
                  bg-gray-200
                  rounded
                  w-3/4
                  mb-3
                "
              />

              <div
                className="
                  h-4
                  bg-gray-200
                  rounded
                  w-1/2
                "
              />

            </div>

          )
        )}

      </div>

    ) : businesses.length > 0 ? (

      /* ================= BUSINESSES ================= */

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-5
        "
      >

        {businesses.map(
          (business) => (

            <BusinessCard
              key={business._id}
              business={business}
            />

          )
        )}

      </div>

    ) : (

      /* ================= NO BUSINESSES ================= */

      <div
        className="
          bg-white
          border
          rounded-3xl
          p-10
          text-center
          shadow-sm
        "
      >

        <Search
          size={30}
          className="
            text-gray-400
            mx-auto
            mb-4
          "
        />

        <h3
          className="
            text-xl
            font-semibold
            text-gray-700
          "
        >
          No Businesses Found
        </h3>

        <p
          className="
            text-gray-500
            mt-2
          "
        >
          No approved businesses are currently
          available in {formattedCity}.
        </p>

      </div>

    )}

  </section>

)}
          {/* =================================================
              SEO CONTENT
          ================================================= */}

          <div
            className="
              bg-white
              border
              rounded-3xl
              p-8
              mt-16
              shadow-sm
            "
          >

            <h2
              className="
                text-2xl
                font-bold
                text-gray-800
                mb-4
              "
            >

              {pageCity?.slug
                ? `Find Trusted Local Businesses in ${formattedCity}`
                : "Find Trusted Local Businesses"}

            </h2>


            <div
              className="
                space-y-4
                text-gray-600
                leading-8
              "
            >

              <p>

                {pageCity?.slug
                  ? `ServDial helps users discover reliable businesses and professionals across multiple categories in ${formattedCity}, including home services, restaurants, healthcare, education, repair services, travel, beauty and more.`
                  : "ServDial helps users discover reliable businesses and professionals across multiple categories including home services, restaurants, healthcare, education, repair services, travel, beauty and more."}

              </p>


              <p>

                {pageCity?.slug
                  ? `Browse business categories and local services in ${formattedCity}, compare providers and connect directly with verified businesses through phone and WhatsApp.`
                  : "Browse sub categories, compare local providers and connect directly with verified businesses through phone and WhatsApp."}

              </p>


              <p>

                {pageCity?.slug
                  ? `Whether you are looking for everyday services or professional business solutions in ${formattedCity}, ServDial makes local business discovery fast, simple and reliable.`
                  : "Whether you are searching for daily services or professional business solutions, ServDial makes local business discovery fast, simple and reliable."}

              </p>

            </div>

          </div>


        {/* =================================================
    BOTTOM BANNER AD
================================================= */}

<div className="mt-10">

  <BannerAd
    placement="category_page_bottom"
    cityId={pageCity?._id}
  />

</div>


        </section>

      </div>

    </>

  );

};


export default CategoryPage;