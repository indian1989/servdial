import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams, useParams } from "react-router-dom";
import API from "../api/axios";
import { formatLocationDisplay } from "../utils/addressHelper";

import BusinessCard from "../components/business/BusinessCard";
import BannerAd from "../components/ads/BannerAd";

const FeaturedBusinessesPage = () => {

  const { citySlug } = useParams();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const [businesses, setBusinesses] =
    useState([]);

  const [pageCity, setPageCity] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [meta, setMeta] =
    useState({
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    });


  /* =====================================================
     CURRENT PAGE
  ===================================================== */

  const currentPage =
    Math.max(
      Number(
        searchParams.get("page")
      ) || 1,
      1
    );

      /* =====================================================
     RESOLVE URL CITY
  ===================================================== */

  useEffect(() => {

    if (!citySlug) return;

    const resolveCity = async () => {

      try {

        const res =
          await API.get("/cities?dropdown=true");

        const cities =
  Array.isArray(res?.data?.data)
    ? res.data.data
    : res?.data?.data?.cities ||
      res?.data?.cities ||
      [];

        const match =
          cities.find(
            (c) =>
              (c?.slug || "").toLowerCase() ===
              citySlug.toLowerCase()
          );

          
        setPageCity(match || null);

      } catch (err) {

        console.error(
          "❌ City resolve error:",
          err
        );

        setPageCity(null);

      }

    };

    resolveCity();

  }, [citySlug]);

    /* =====================================================
     FETCH FEATURED BUSINESSES
  ===================================================== */

  useEffect(() => {

    if (!citySlug) return;

    const fetchBusinesses = async () => {

      setLoading(true);

      try {

        const res =
          await API.get(
            "/businesses/featured",
            {
              params: {
                city: citySlug,
                page: currentPage,
                limit: 20,
              },
            }
          );

        setBusinesses(
          res?.data?.data || []
        );

        setMeta(
          res?.data?.meta || {
            total: 0,
            page: currentPage,
            limit: 20,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          }
        );

      } catch (err) {

        console.error(
          "❌ Featured fetch error:",
          err
        );

        setBusinesses([]);

        setMeta({
          total: 0,
          page: currentPage,
          limit: 20,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        });

      } finally {

        setLoading(false);

      }

    };

    fetchBusinesses();

  }, [
    citySlug,
    currentPage,
  ]);


  /* =====================================================
     PAGE CHANGE
  ===================================================== */

  const goToPage = (page) => {

    if (
      page < 1 ||
      page > meta.totalPages
    ) {
      return;
    }

    setSearchParams({
      page: String(page),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


    /* =====================================================
     CITY LOADING
  ===================================================== */

  if (!pageCity) {

  return (
    <section className="max-w-7xl mx-auto px-4 mt-10">

      <div className="text-center py-10 text-gray-400 animate-pulse">
        Loading city...
      </div>

    </section>
  );

}


/* =====================================================
   SEO
===================================================== */

const cityName = pageCity?.name
  ? formatLocationDisplay(
      pageCity.name,
      pageCity.district,
      pageCity.state
    )
  : "your area";

const citySlugResolved =
  pageCity?.slug ||
  citySlug;

const currentUrl =
  `https://servdial.com/${citySlugResolved}/featured-businesses`;

const isPaginated =
  currentPage > 1;

const seoTitle =
  `Featured Businesses in ${cityName} | ServDial`;

const seoDescription =
  `Discover featured and trusted businesses in ${cityName} on ServDial. Find local businesses, services and professionals with contact details, ratings and business information.`;

    return (

    <>

      <Helmet>

        <title>
          {seoTitle}
        </title>

        <meta
          name="description"
          content={seoDescription}
        />

        <meta
          name="robots"
          content={
            isPaginated
              ? "noindex,follow"
              : "index,follow"
          }
        />

        <link
          rel="canonical"
          href={currentUrl}
        />

        {/* Open Graph */}

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:title"
          content={seoTitle}
        />

        <meta
          property="og:description"
          content={seoDescription}
        />

        <meta
          property="og:url"
          content={currentUrl}
        />

        <meta
          property="og:site_name"
          content="ServDial"
        />

        <meta
          property="og:image"
          content="https://servdial.com/og-image.jpg"
        />

        {/* Twitter */}

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content={seoTitle}
        />

        <meta
          name="twitter:description"
          content={seoDescription}
        />

        <meta
          name="twitter:image"
          content="https://servdial.com/og-image.jpg"
        />

      </Helmet>


      {/* =================================================
          MAIN SECTION
      ================================================= */}

      <section className="max-w-7xl mx-auto px-4 mt-6 mb-16">


        {/* =================================================
            BLUE SEO HEADER
        ================================================= */}

        <div className="bg-blue-600 rounded-2xl px-6 py-7 mb-10">

          {/* ================= BREADCRUMB ================= */}

          <nav
            aria-label="Breadcrumb"
            className="mb-5"
          >

            <ol className="flex flex-wrap items-center gap-2 text-sm">

              <li>
                <a
                  href="/"
                  className="text-white hover:text-blue-100"
                >
                  Home
                </a>
              </li>

              <li className="text-blue-200">
                /
              </li>

              <li>
                <a
                  href={`/${citySlugResolved}`}
                  className="text-white hover:text-blue-100"
                >
                  {cityName}
                </a>
              </li>

              <li className="text-blue-200">
                /
              </li>

              <li
                className="font-semibold text-white"
                aria-current="page"
              >
                Featured Businesses
              </li>

            </ol>

          </nav>


          {/* ================= SEO TITLE ================= */}

          <h1 className="text-3xl md:text-4xl font-bold text-white">

            Featured Businesses in{" "}

            {cityName}, India

          </h1>


          {/* ================= SEO DESCRIPTION ================= */}

          <p className="text-blue-100 mt-3 text-base md:text-lg">

            Discover featured and trusted businesses near you in{" "}

            {cityName}{" "}

          </p>

        </div>

        {/* =================================================
    TOP BANNER AD
================================================= */}

<div className="mb-8">
  <BannerAd
    placement="business_listing_top"
    cityId={pageCity?._id}
  />
</div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {[...Array(20)].map(
              (_, index) => (

                <div
                  key={index}
                  className="h-72 bg-gray-200 animate-pulse rounded-xl shadow-sm"
                />

              )
            )}

          </div>

        ) : businesses.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================= */

          <div className="text-center py-16">

            <div className="text-5xl mb-4">
              ⭐
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">

              No featured businesses found

            </h2>

            <p className="text-gray-500">

              There are currently no featured businesses
              available in {pageCity?.name || "your area"}.

            </p>

          </div>

        ) : (

          <>

            {/* =================================================
                RESULT COUNT
            ================================================= */}

            <div className="flex items-center justify-between mb-6">

              <p className="text-gray-600">

                Showing{" "}

                <span className="font-semibold text-gray-900">

                  {(
                    (currentPage - 1) *
                      meta.limit
                  ) + 1}

                </span>

                {" – "}

                <span className="font-semibold text-gray-900">

                  {Math.min(
                    currentPage *
                      meta.limit,
                    meta.total
                  )}

                </span>

                {" of "}

                <span className="font-semibold text-gray-900">

                  {meta.total}

                </span>

                {" featured businesses"}

              </p>

            </div>


            {/* =================================================
                BUSINESS GRID
            ================================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {businesses.map(
                (biz) => (

                  <BusinessCard
                    key={biz._id}
                    business={biz}
                    showCallButton
                  />

                )
              )}

            </div>


            {/* =================================================
                PAGINATION
            ================================================= */}

            {meta.totalPages > 1 && (

              <div className="flex flex-wrap items-center justify-center gap-2 mt-12">

                {/* PREVIOUS */}

                <button
                  type="button"
                  disabled={!meta.hasPrevPage}
                  onClick={() =>
                    goToPage(
                      currentPage - 1
                    )
                  }
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                    meta.hasPrevPage
                      ? "bg-white text-gray-700 hover:bg-gray-50"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  ← Previous
                </button>


                {/* PAGE NUMBERS */}

                {Array.from(
                  {
                    length:
                      meta.totalPages,
                  },
                  (_, index) => {

                    const page =
                      index + 1;

                    return (

                      <button
                        key={page}
                        type="button"
                        onClick={() =>
                          goToPage(page)
                        }
                        className={`min-w-10 h-10 px-3 rounded-lg border text-sm font-semibold transition ${
                          page === currentPage
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>

                    );

                  }
                )}


                {/* NEXT */}

                <button
                  type="button"
                  disabled={!meta.hasNextPage}
                  onClick={() =>
                    goToPage(
                      currentPage + 1
                    )
                  }
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                    meta.hasNextPage
                      ? "bg-white text-gray-700 hover:bg-gray-50"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next →
                </button>

              </div>

            )}

          </>

        )}

        {/* =================================================
    BOTTOM BANNER AD
================================================= */}

<div className="mt-10">
  <BannerAd
    placement="business_listing_bottom"
    cityId={pageCity?._id}
  />
</div>

      </section>

    </>

  );

};

export default FeaturedBusinessesPage;