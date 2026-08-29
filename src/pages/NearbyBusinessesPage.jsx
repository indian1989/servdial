
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import BusinessCard from "../components/business/BusinessCard";

const NearbyBusinessesPage = () => {

  const [searchParams, setSearchParams] =
    useSearchParams();

  /* =====================================================
     LOCATION
  ===================================================== */

  const lat =
    searchParams.get("lat");

  const lng =
    searchParams.get("lng");


  /* =====================================================
     PAGE
  ===================================================== */

  const page =
    Number(
      searchParams.get("page")
    ) || 1;


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

      return;

    }


    const fetchNearbyBusinesses =
      async () => {

        setLoading(true);

        setError("");

        try {

          const res =
            await API.get(
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


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <section className="max-w-7xl mx-auto px-4 py-10">

      {/* ================= HEADER ================= */}

      <div className="text-center mb-10">

        <h1 className="text-3xl md:text-4xl font-bold">

          Businesses Near You

        </h1>

        <p className="text-gray-500 mt-2">

          Discover businesses within 5 km of your location

        </p>

      </div>


      {/* ================= ERROR ================= */}

      {!loading &&
        error && (

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

          {[...Array(8)].map(
            (_, index) => (

              <div
                key={index}
                className="h-64 bg-gray-200 rounded-xl animate-pulse"
              />

            )
          )}

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

              {businesses.map(
                (business) => (

                  <BusinessCard
                    key={
                      business._id
                    }
                    business={
                      business
                    }
                  />

                )
              )}

            </div>


            {/* ================= PAGINATION ================= */}

            {pagination.totalPages > 1 && (

              <div className="flex flex-wrap items-center justify-center gap-2 mt-10">

                <button
                  type="button"
                  disabled={
                    !pagination.hasPrevPage
                  }
                  onClick={() =>
                    goToPage(
                      pagination.page -
                      1
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


                {pageNumbers.map(
                  (number) => (

                    <button
                      key={number}
                      type="button"
                      onClick={() =>
                        goToPage(
                          number
                        )
                      }
                      className={`min-w-10 px-3 py-2 rounded-lg text-sm font-semibold ${
                        number ===
                        pagination.page
                          ? "bg-blue-600 text-white"
                          : "bg-white border text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {number}
                    </button>

                  )
                )}


                <button
                  type="button"
                  disabled={
                    !pagination.hasNextPage
                  }
                  onClick={() =>
                    goToPage(
                      pagination.page +
                      1
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

  );

};

export default NearbyBusinessesPage;