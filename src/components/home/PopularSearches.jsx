import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

const PopularSearches = ({
  city = null,
  loading: parentLoading = false,
}) => {

  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(false);


  /* =====================================================
     FETCH POPULAR SEARCHES
  ===================================================== */

  useEffect(() => {

    if (!city?.slug) {
      setSearches([]);
      return;
    }


    const fetchPopularSearches =
      async () => {

        setLoading(true);

        try {

          const res =
            await API.get(
              "/businesses/popular-searches",
              {
                params: {
                  city:
                    city.slug,

                  limit:
                    6,
                },
              }
            );


          setSearches(
            res?.data?.data || []
          );


        } catch (err) {

          console.error(
            "❌ Popular searches error:",
            err
          );

          setSearches([]);

        } finally {

          setLoading(false);

        }

      };


    fetchPopularSearches();

  }, [city?.slug]);


  /* =====================================================
     LOADING
  ===================================================== */

  if (
    parentLoading ||
    loading
  ) {

    return (
      <section className="max-w-7xl mx-auto px-4">

        <div className="text-center mb-8">

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Popular Searches
          </h2>

          <p className="text-gray-500 mt-2">
            Discover popular services people search for across cities
          </p>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {[...Array(6)].map((_, index) => (

            <div
              key={index}
              className="h-14 bg-gray-200 animate-pulse rounded-xl"
            />

          ))}

        </div>

      </section>
    );

  }


  /* =====================================================
     EMPTY
  ===================================================== */

  if (!searches.length) {

    return null;

  }


  /* =====================================================
     DATA
  ===================================================== */

  return (

    <section className="max-w-7xl mx-auto px-4">

      <div className="text-center mb-8">

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Popular Searches
        </h2>

        <p className="text-gray-500 mt-2">
          Discover popular services people search for across cities
        </p>

      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {searches.map(
          (search) => (

            <Link
              key={search.categorySlug}
              to={search.url}
              className="
                bg-white
                border
                border-gray-200
                rounded-xl
                px-5
                py-4
                font-semibold
                text-gray-800
                hover:border-blue-500
                hover:text-blue-600
                hover:shadow-md
                transition
              "
            >

              {search.title}

            </Link>

          )
        )}

      </div>

    </section>

  );

};

export default PopularSearches;