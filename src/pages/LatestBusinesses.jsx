import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams, useParams } from "react-router-dom";

import API from "../api/axios";
import BusinessCard from "../components/business/BusinessCard";
import { formatLocationDisplay } from "../utils/addressHelper";
import BannerAd from "../components/ads/BannerAd";

const LatestBusinesses = ({ ssrLatest }) => {

  const { citySlug } = useParams();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const [businesses, setBusinesses] =
  useState(
    ssrLatest?.businesses ||
    []
  );

  const [pageCity, setPageCity] =
  useState(
    ssrLatest?.city ||
    null
  );

  const [loading, setLoading] =
  useState(!ssrLatest);

  const [pagination, setPagination] =
  useState(
    ssrLatest?.meta || {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    }
  );


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

  if (!citySlug || ssrLatest?.city) return;

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

  }, [
  citySlug,
  ssrLatest,
]);


  /* =====================================================
     FETCH LATEST BUSINESSES
  ===================================================== */

  useEffect(() => {

  if (!citySlug) return;

  if (
  ssrLatest &&
  String(ssrLatest.meta?.page || 1) ===
    String(currentPage)
) {
  setLoading(false);
  return;
}

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
  ssrLatest,
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


      if (page === 1) {
  setSearchParams({});
} else {
  setSearchParams({
    page: String(page),
  });
}


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
      pageCity.district
    )
  : "your area";

/* =====================================================
   SEO
===================================================== */

const citySlugResolved =
  pageCity?.slug ||
  citySlug;

const currentUrl =
  currentPage > 1
    ? `https://www.servdial.com/${citySlugResolved}/latest-businesses?page=${currentPage}`
    : `https://www.servdial.com/${citySlugResolved}/latest-businesses`;

const seoTitle =
  `Latest Businesses in ${cityNameResolved} | ServDial`;

const seoDescription =
  `Discover the latest businesses near you in ${cityNameResolved} on ServDial. Find newly added local businesses, services and professionals with contact details, ratings and business information.`;

  
/* =====================================================
   PAGE NUMBERS: 4 PREVIOUS + CURRENT + 4 NEXT
===================================================== */

const startPage = Math.max(1, currentPage - 4);

const endPage = Math.min(
  pagination.totalPages,
  currentPage + 4
);

const pageNumbers = Array.from(
  {
    length: Math.max(0, endPage - startPage + 1),
  },
  (_, index) => startPage + index
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
  content="index,follow"
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
          content="https://www.servdial.com/og-image.jpg"
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
          content="https://www.servdial.com/og-image.jpg"
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
    Latest Businesses
  </li>

</ol>

          </nav>


          {/* ================= SEO TITLE ================= */}

          <h1 className="text-3xl md:text-4xl font-bold text-white">

            Latest Businesses in{" "}

            {cityNameResolved}, {pageCity?.state || ""}, India

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
  <div className="mt-10 mb-12 flex flex-wrap items-center justify-center gap-2">

    {/* PREVIOUS */}
    <button
      type="button"
      onClick={() => goToPage(currentPage - 1)}
      disabled={!pagination.hasPrevPage}
      className="rounded-lg border px-4 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
    >
      ← Previous
    </button>

    {/* FIRST PAGE */}
    {startPage > 1 && (
      <>
        <button
          type="button"
          onClick={() => goToPage(1)}
          className="rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-50"
        >
          1
        </button>

        {startPage > 2 && (
          <span className="px-1 text-gray-500">...</span>
        )}
      </>
    )}

    {/* PAGE NUMBERS */}
    {pageNumbers.map((page) => (
      <button
        key={page}
        type="button"
        onClick={() => goToPage(page)}
        aria-current={page === currentPage ? "page" : undefined}
        className={`min-w-10 rounded-lg border px-3 py-2 text-sm font-semibold ${
          page === currentPage
            ? "border-blue-600 bg-blue-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        {page}
      </button>
    ))}

    {/* LAST PAGE */}
    {endPage < pagination.totalPages && (
      <>
        {endPage < pagination.totalPages - 1 && (
          <span className="px-1 text-gray-500">...</span>
        )}

        <button
          type="button"
          onClick={() => goToPage(pagination.totalPages)}
          className="rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-50"
        >
          {pagination.totalPages}
        </button>
      </>
    )}

    {/* NEXT */}
    <button
      type="button"
      onClick={() => goToPage(currentPage + 1)}
      disabled={!pagination.hasNextPage}
      className="rounded-lg border px-4 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Next →
    </button>

    {/* JUMP TO PAGE */}
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();

        const input = e.currentTarget.elements.jumpPage;
        const page = Number(input.value);

        if (
          Number.isInteger(page) &&
          page >= 1 &&
          page <= pagination.totalPages
        ) {
          goToPage(page);
          input.value = "";
        } else {
          alert(
            `Please enter a page between 1 and ${pagination.totalPages}`
          );
        }
      }}
    >
      <label
        htmlFor="jumpPage"
        className="text-sm text-gray-600"
      >
        Jump to:
      </label>

      <input
        id="jumpPage"
        name="jumpPage"
        type="number"
        min="1"
        max={pagination.totalPages}
        placeholder="Page"
        required
        className="w-20 rounded-lg border px-2 py-2 text-sm"
      />

      <button
        type="submit"
        className="rounded-lg bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700"
      >
        Go
      </button>
    </form>

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