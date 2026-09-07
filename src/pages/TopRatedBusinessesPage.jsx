// frontend/src/pages/TopRatedBusinessesPage.jsx
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams, useParams } from "react-router-dom";

import API from "../api/axios";
import { formatLocationDisplay } from "../utils/addressHelper";

import BusinessCard from "../components/business/BusinessCard";
import BannerAd from "../components/ads/BannerAd";

const TopRatedBusinessesPage = () => {

  const { citySlug } = useParams();

const [pageCity, setPageCity] =
  useState(null);

  const [searchParams, setSearchParams] =
    useSearchParams();


  const activeCity =
  citySlug?.trim().toLowerCase() || "";

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

        setPageCity(
          match || null
        );

      } catch (err) {

        console.error(
          "❌ Top Rated city resolve error:",
          err
        );

        setPageCity(null);

      }

    };

    resolveCity();

  }, [citySlug]);

  const pageFromUrl =
    Number(
      searchParams.get("page")
    ) || 1;


  const [businesses, setBusinesses] =
    useState([]);

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
     FETCH
  ===================================================== */

  useEffect(() => {

    if (!activeCity) return;


    const fetchBusinesses =
      async () => {

        setLoading(true);


        try {

          const res =
            await API.get(
              "/businesses/top-rated",
              {
                params: {

                  city:
                    activeCity,

                  page:
                    pageFromUrl,

                  limit:
                    20,

                },
              }
            );


          setBusinesses(
            res?.data?.data || []
          );


          setMeta(
            res?.data?.meta || {
              total: 0,
              page: pageFromUrl,
              limit: 20,
              totalPages: 0,
              hasNextPage: false,
              hasPrevPage: false,
            }
          );


        } catch (err) {

          console.error(
            "❌ Top Rated fetch error:",
            err
          );

          setBusinesses([]);

          setMeta({
            total: 0,
            page: pageFromUrl,
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
    activeCity,
    pageFromUrl,
  ]);


  /* =====================================================
     PAGE CHANGE
  ===================================================== */

  const changePage =
    (page) => {

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
     CITY NAME
  ===================================================== */

  const cityName =
    pageCity?.name
      ? formatLocationDisplay(
          pageCity.name,
          pageCity.district
        )
      : "your area";


  /* =====================================================
     SEO
  ===================================================== */

  const cityNameResolved =
    pageCity?.name
      ? formatLocationDisplay(
          pageCity.name,
          pageCity.district
        )
      : "your area";

  const citySlugResolved =
    pageCity?.slug ||
    activeCity;

  const currentUrl =
    `https://servdial.com/${citySlugResolved}/top-rated-businesses`;

  const isPaginated =
    pageFromUrl > 1;

  const seoTitle =
    `Top Rated Businesses in ${cityNameResolved} | ServDial`;

  const seoDescription =
    `Discover top rated and trusted businesses near you in ${cityNameResolved}, India. Find highly rated local businesses, services and professionals on ServDial.`;

  /* =====================================================
     RENDER
  ===================================================== */

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


    <section
      className="
        max-w-7xl
        mx-auto
        px-4
        py-10
      "
    >

 {/* ================= HEADER ================= */}

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
    &gt;
  </li>

  <li>
    <a
      href={`/${pageCity?.stateSlug || ""}`}
      className="text-white hover:text-blue-100"
    >
      {pageCity?.state || "State"}
    </a>
  </li>

  <li className="text-blue-200">
    &gt;
  </li>

  <li>
    <a
      href={`/${pageCity?.stateSlug || ""}/${citySlugResolved}`}
      className="text-white hover:text-blue-100"
    >
      {cityNameResolved}
    </a>
  </li>

  <li className="text-blue-200">
    &gt;
  </li>

  <li
    className="font-semibold text-white"
    aria-current="page"
  >
    Top Rated Businesses
  </li>

</ol>

  </nav>


  {/* ================= SEO TITLE ================= */}

  <h1 className="text-3xl md:text-4xl font-bold text-white">

    Top Rated Businesses in{" "}

    {cityNameResolved}, {pageCity?.state || ""}, India

  </h1>


  {/* ================= SEO DESCRIPTION ================= */}

  <p className="text-blue-100 mt-3 text-base md:text-lg">

    Discover top rated and trusted businesses near you in{" "}

    {cityNameResolved}

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

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-6
          "
        >

          {[...Array(8)].map(
            (_, i) => (

              <div
                key={i}
                className="
                  h-72
                  bg-gray-200
                  rounded-2xl
                  animate-pulse
                "
              />

            )
          )}

        </div>

      ) : businesses.length === 0 ? (

        /* ================= EMPTY ================= */

        <div
          className="
            text-center
            py-16
            text-gray-500
          "
        >

          <div className="text-5xl mb-4">
            ⭐
          </div>

          <h2
            className="
              text-xl
              font-semibold
              text-gray-900
              mb-2
            "
          >
            No top rated businesses found
          </h2>

          <p>
            Try another city or check back later.
          </p>

        </div>

      ) : (

        <>

          {/* ================= RESULT COUNT ================= */}

          <div
            className="
              flex
              items-center
              justify-between
              mb-6
            "
          >

            <p className="text-gray-600">

              Showing{" "}

              <span
                className="
                  font-semibold
                  text-gray-900
                "
              >
                {businesses.length}
              </span>

              {" "}of{" "}

              <span
                className="
                  font-semibold
                  text-gray-900
                "
              >
                {meta.total}
              </span>

              {" "}top rated businesses

            </p>

          </div>


          {/* ================= GRID ================= */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-6
            "
          >

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

          {meta.totalPages > 1 && (

            <div
              className="
                flex
                items-center
                justify-center
                gap-2
                mt-12
                flex-wrap
              "
            >

              {/* PREVIOUS */}

              <button
                type="button"
                disabled={
                  !meta.hasPrevPage
                }
                onClick={() =>
                  changePage(
                    meta.page - 1
                  )
                }
                className="
                  px-4
                  py-2
                  rounded-lg
                  border
                  border-gray-300
                  text-sm
                  font-medium
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  hover:bg-gray-100
                "
              >
                ← Previous
              </button>


              {/* PAGE NUMBERS */}

              {Array.from(
                {
                  length:
                    meta.totalPages,
                },
                (_, index) =>
                  index + 1
              ).map(
                (page) => (

                  <button
                    key={page}
                    type="button"
                    onClick={() =>
                      changePage(page)
                    }
                    className={`
                      min-w-10
                      px-3
                      py-2
                      rounded-lg
                      text-sm
                      font-medium
                      border
                      ${
                        page === meta.page
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    {page}
                  </button>

                )
              )}


              {/* NEXT */}

              <button
                type="button"
                disabled={
                  !meta.hasNextPage
                }
                onClick={() =>
                  changePage(
                    meta.page + 1
                  )
                }
                className="
                  px-4
                  py-2
                  rounded-lg
                  border
                  border-gray-300
                  text-sm
                  font-medium
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  hover:bg-gray-100
                "
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


export default TopRatedBusinessesPage;