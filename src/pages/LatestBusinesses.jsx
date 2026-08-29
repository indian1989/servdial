import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams, useParams } from "react-router-dom";

import API from "../api/axios";
import BusinessCard from "../components/business/BusinessCard";
import { formatLocationDisplay } from "../utils/addressHelper";
import BannerAd from "../components/ads/BannerAd";

const LatestBusinesses = () => {

  const { citySlug } = useParams();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const [businesses, setBusinesses] =
    useState([]);

  const [pageCity, setPageCity] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 20,
      total: 0,
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
          await API.get(
            `/cities/${citySlug}`
          );

        const resolvedCity =
          res?.data?.data || null;

        setPageCity(
          resolvedCity
        );

      } catch (err) {

        console.error(
          "❌ Latest city resolve error:",
          err
        );

        setPageCity(null);

      }

    };

    resolveCity();

  }, [citySlug]);


  /* =====================================================
     FETCH LATEST BUSINESSES
  ===================================================== */

  useEffect(() => {

    if (!citySlug) return;

    const fetchBusinesses =
      async () => {

        setLoading(true);

        try {

          const res =
            await API.get(
              "/businesses/latest",
              {
                params: {
                  city:
                    citySlug,

                  page:
                    currentPage,

                  limit:
                    20,
                },
              }
            );


          setBusinesses(
            res?.data?.data ||
            []
          );


          setPagination(
            res?.data?.meta || {

              page:
                currentPage,

              limit:
                20,

              total:
                0,

              totalPages:
                0,

              hasNextPage:
                false,

              hasPrevPage:
                false,

            }
          );

        } catch (err) {

          console.error(
            "❌ Latest fetch error:",
            err
          );

          setBusinesses([]);

          setPagination({

            page:
              currentPage,

            limit:
              20,

            total:
              0,

            totalPages:
              0,

            hasNextPage:
              false,

            hasPrevPage:
              false,

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

  const goToPage =
    (page) => {

      if (
        page < 1 ||
        page >
          pagination.totalPages
      ) {
        return;
      }


      setSearchParams({
        page:
          String(page),
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
     CITY NAME
  ===================================================== */

  /* =====================================================
   CITY NAME
===================================================== */

const cityNameResolved = pageCity?.name
  ? formatLocationDisplay(
      pageCity.name,
      pageCity.district,
      pageCity.state
    )
  : "your area";

/* =====================================================
   SEO
===================================================== */

const citySlugResolved =
  pageCity?.slug ||
  citySlug;

const currentUrl =
  `https://servdial.com/${citySlugResolved}/latest-businesses`;

const isPaginated =
  currentPage > 1;

const seoTitle =
  `Latest Businesses in ${cityNameResolved} | ServDial`;

const seoDescription =
  `Discover the latest businesses near you in ${cityNameResolved} on ServDial. Find newly added local businesses, services and professionals with contact details, ratings and business information.`;

  /* =====================================================
     PAGE NUMBERS
  ===================================================== */

  const pageNumbers =
    Array.from(
      {
        length:
          pagination.totalPages,
      },
      (_, index) =>
        index + 1
    );


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
                  {cityNameResolved}
                </a>
              </li>

              <li className="text-blue-200">
                /
              </li>

              <li
                className="font-semibold text-white"
                aria-current="page"
              >
                Latest Businesses
              </li>

            </ol>

          </nav>


          {/* ================= SEO TITLE ================= */}

          <h1 className="text-3xl md:text-4xl font-bold text-white">

            Latest Businesses in{" "}

            {cityNameResolved}, India

          </h1>


          {/* ================= SEO DESCRIPTION ================= */}

          <p className="text-blue-100 mt-3 text-base md:text-lg">

            Discover the latest businesses near you in{" "}

            {cityNameResolved}

          </p>

        </div>

      {/* ================= HEADER ================= */}

      <div className="mb-10 text-center">

        <h1 className="text-3xl font-bold">

          Latest Businesses in{" "}

          {cityNameResolved}

        </h1>

        <p className="text-gray-500 mt-2">

          Newly added businesses on ServDial

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

      {/* ================= LOADING ================= */}

      {loading ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {[...Array(8)].map(
            (_, i) => (

              <div
                key={i}
                className="h-64 bg-gray-200 rounded-xl animate-pulse"
              />

            )
          )}

        </div>

      ) : businesses.length === 0 ? (

        <div className="text-center py-10 text-gray-400">

          No businesses found

        </div>

      ) : (

        <>

          {/* ================= BUSINESS GRID ================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {businesses.map(
              (biz) => (

                <BusinessCard
                  key={biz._id}
                  business={biz}
                />

              )
            )}

          </div>


          {/* ================= PAGINATION ================= */}

          {pagination.totalPages > 1 && (

            <div className="flex flex-wrap items-center justify-center gap-2 mt-10 mb-12">

              {/* PREVIOUS */}

              <button
                type="button"
                onClick={() =>
                  goToPage(
                    pagination.page - 1
                  )
                }
                disabled={
                  !pagination.hasPrevPage
                }
                className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                  pagination.hasPrevPage
                    ? "bg-white text-gray-700 hover:bg-gray-50"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                ← Previous
              </button>


              {/* PAGE NUMBERS */}

              {pageNumbers.map(
                (page) => (

                  <button
                    key={page}
                    type="button"
                    onClick={() =>
                      goToPage(page)
                    }
                    className={`min-w-10 px-3 py-2 rounded-lg text-sm font-semibold ${
                      page ===
                      pagination.page
                        ? "bg-blue-600 text-white"
                        : "bg-white border text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>

                )
              )}


              {/* NEXT */}

              <button
                type="button"
                onClick={() =>
                  goToPage(
                    pagination.page + 1
                  )
                }
                disabled={
                  !pagination.hasNextPage
                }
                className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                  pagination.hasNextPage
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

export default LatestBusinesses;