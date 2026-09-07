
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import API from "../api/axios";
import BusinessCard from "../components/business/BusinessCard";
import { formatLocationDisplay } from "../utils/addressHelper";

const NearbyBusinessesPage = () => {

  const [searchParams, setSearchParams] =
    useSearchParams();

  /* =====================================================
     LOCATION
  ===================================================== */

  const lat =
  searchParams.get("lat") ||
  localStorage.getItem("user_lat");

const lng =
  searchParams.get("lng") ||
  localStorage.getItem("user_lng");


  /* =====================================================
     PAGE
  ===================================================== */

  const page =
    Number(
      searchParams.get("page")
    ) || 1;

  const [pageCity, setPageCity] = useState(null);

  const [businesses, setBusinesses] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

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
     FETCH
  ===================================================== */

  useEffect(() => {
  if (!lat || !lng) {
    setError(
      "Your location is required to find nearby businesses."
    );

    setLoading(false);
    return;
  }

  const fetchNearbyBusinesses = async () => {
    setLoading(true);
    setError("");

    try {
      /* =========================================
         RESOLVE CURRENT CITY
      ========================================= */

      try {
        const savedCity = localStorage.getItem("servdial_city");

        if (savedCity) {
          const parsedCity = JSON.parse(savedCity);

          if (parsedCity?.slug) {
            const cityRes = await API.get(
              `/cities/${parsedCity.slug}`
            );

            setPageCity(
              cityRes.data?.data || null
            );
          }
        }
      } catch (cityErr) {
        console.error(
          "❌ Nearby city resolve error:",
          cityErr
        );

        setPageCity(null);
      }

      /* =========================================
         FETCH NEARBY BUSINESSES
      ========================================= */

      const res = await API.get(
        "/businesses/nearby",
        {
          params: {
            lat,
            lng,
            page,
            limit: 20,
            radius: 5000,
          },
        }
      );

      setBusinesses(
        res?.data?.data || []
      );

      setPagination(
        res?.data?.meta || {
          page,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        }
      );

    } catch (err) {
      console.error(
        "❌ Nearby fetch error:",
        err
      );

      setBusinesses([]);

      setError(
        err?.response?.data?.message ||
        "Unable to load nearby businesses."
      );

    } finally {
      setLoading(false);
    }
  };

  fetchNearbyBusinesses();

}, [
  lat,
  lng,
  page,
]);

  /* =====================================================
     PAGE CHANGE
  ===================================================== */

  const goToPage =
    (nextPage) => {

      if (
        nextPage < 1 ||
        nextPage >
          pagination.totalPages
      ) {
        return;
      }


      const params =
        new URLSearchParams(
          searchParams
        );


      params.set(
        "page",
        String(nextPage)
      );


      setSearchParams(
        params
      );


      window.scrollTo({

        top: 0,

        behavior:
          "smooth",

      });

    };


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

const cityNameResolved = pageCity
  ? formatLocationDisplay(
      pageCity.name,
      pageCity.district
    )
  : "";

const seoTitle = cityNameResolved
  ? `Businesses Near You in ${cityNameResolved}, ${pageCity.state}, India | ServDial`
  : "Businesses Near You | ServDial";

const seoDescription = cityNameResolved
  ? `Discover businesses within 5 km of your location in ${cityNameResolved}, ${pageCity.state}, India. Explore local businesses, services, contact details and more on ServDial.`
  : "Discover nearby local businesses, services and contact details within 5 km of your location on ServDial.";

  /* =====================================================
     RENDER
  ===================================================== */

  return (
  <div className="min-h-screen bg-gray-50">

    {/* =========================================
        SEO
    ========================================= */}

    <Helmet>
      <title>{seoTitle}</title>

      <meta
        name="description"
        content={seoDescription}
      />

      <link
        rel="canonical"
        href="https://servdial.com/nearby-businesses"
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
        content="https://servdial.com/nearby-businesses"
      />

      <meta
        name="twitter:title"
        content={seoTitle}
      />

      <meta
        name="twitter:description"
        content={seoDescription}
      />
    </Helmet>

    {/* =========================================
        BLUE PAGE HEADER
    ========================================= */}

    <div className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}

        <div className="mb-5 flex items-center gap-2 text-sm">

          <Link
            to="/"
            className="hover:text-blue-100"
          >
            Home
          </Link>

          {pageCity?.state && (
            <>
              <span>&gt;</span>

              <Link
                to={`/${pageCity.stateSlug}`}
                className="hover:text-blue-100"
              >
                {pageCity.state}
              </Link>
            </>
          )}

          {cityNameResolved && pageCity?.slug && (
            <>
              <span>&gt;</span>

              <Link
                to={`/${pageCity.stateSlug}/${pageCity.slug}`}
                className="hover:text-blue-100"
              >
                {cityNameResolved}
              </Link>
            </>
          )}

          <span>&gt;</span>

          <span className="font-medium text-white">
            Nearby Businesses
          </span>

        </div>

        {/* Page Heading */}

        <div className="text-center">

          <h1 className="text-3xl md:text-4xl font-bold">
            {cityNameResolved
              ? `Businesses Near You in ${cityNameResolved}, ${pageCity.state}, India`
              : "Businesses Near You"}
          </h1>

          <p className="mt-3 text-blue-100">
            {cityNameResolved
              ? `Discover businesses within 5 km of your location in ${cityNameResolved}, ${pageCity.state}, India.`
              : "Discover businesses within 5 km of your location"}
          </p>

        </div>

      </div>
    </div>

    {/* =========================================
        BUSINESS CONTENT
    ========================================= */}

    <section className="max-w-7xl mx-auto px-4 py-10">

      {/* ================= ERROR ================= */}

      {!loading && error && (
        <div className="text-center py-12">

          <div className="text-5xl mb-4">
            📍
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            Location Required
          </h2>

          <p className="text-gray-500 mt-2">
            {error}
          </p>

        </div>
      )}

      {/* ================= LOADING ================= */}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="h-64 bg-gray-200 rounded-xl animate-pulse"
            />
          ))}

        </div>
      )}

      {/* ================= EMPTY ================= */}

      {!loading &&
        !error &&
        businesses.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No nearby businesses found within 5 km.
          </div>
        )}

      {/* ================= BUSINESSES ================= */}

      {!loading &&
        !error &&
        businesses.length > 0 && (
          <>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {businesses.map((business) => (
                <BusinessCard
                  key={business._id}
                  business={business}
                />
              ))}

            </div>

            {/* ================= PAGINATION ================= */}

            {pagination.totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-10">

                <button
                  type="button"
                  disabled={!pagination.hasPrevPage}
                  onClick={() =>
                    goToPage(
                      pagination.page - 1
                    )
                  }
                  className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                    pagination.hasPrevPage
                      ? "bg-white text-gray-700 hover:bg-gray-50"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  ← Previous
                </button>

                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() =>
                      goToPage(number)
                    }
                    className={`min-w-10 px-3 py-2 rounded-lg text-sm font-semibold ${
                      number === pagination.page
                        ? "bg-blue-600 text-white"
                        : "bg-white border text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() =>
                    goToPage(
                      pagination.page + 1
                    )
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

    </section>
  </div>
);

};

export default NearbyBusinessesPage;