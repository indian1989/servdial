// frontend/src/pages/CityPage.jsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import { Helmet } from "react-helmet-async";
import {
  ChevronRight,
  MapPin,
  Grid2X2,
} from "lucide-react";

const CityPage = () => {
  const { citySlug } = useParams();

  const [categories, setCategories] = useState([]);
  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [categoriesRes, cityRes] = await Promise.all([
          API.get("/categories"),
          API.get(`/cities/${citySlug}`),
        ]);

        setCategories(
          categoriesRes.data?.categories ||
          categoriesRes.data?.data ||
          []
        );

        setCityData(
          cityRes.data?.city ||
          cityRes.data?.data ||
          null
        );

      } catch (err) {
        console.error("City page error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [citySlug]);

  // ================= FILTER PARENT ONLY =================
  const parentCategories = (categories || []).filter(
    (c) => !c.parentCategory
  );

  // ================= SEO =================
  const formattedCity =
    cityData?.name ||
    citySlug?.replace(/-/g, " ") ||
    "City";

  const title = `All Services in ${formattedCity} | ServDial`;

  const description = `Find trusted local businesses, professionals and service providers in ${formattedCity}. Browse all popular categories on ServDial.`;

  const url = `https://servdial.com/city/${citySlug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Services in ${formattedCity}`,
    itemListElement: parentCategories.map((cat, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${cat.name} in ${formattedCity}`,
      url: `https://servdial.com/${citySlug}/${cat.slug}`,
    })),
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">
            Loading services...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>

        <meta
          name="description"
          content={description}
        />

        <link rel="canonical" href={url} />

        <meta
          name="robots"
          content="index,follow"
        />

        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">

        {/* ================= HERO ================= */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">

          <div className="max-w-7xl mx-auto px-4 py-14">

            {/* BREADCRUMB */}
            <div className="flex items-center gap-2 text-sm text-blue-100 mb-5">

              <Link
                to="/"
                className="hover:text-white transition"
              >
                Home
              </Link>

              <ChevronRight size={14} />

              <span className="text-white font-medium">
                {formattedCity}
              </span>

            </div>

            {/* TITLE */}
            <div className="max-w-3xl">

              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm mb-5">
                <MapPin size={16} />
                Explore local services in {formattedCity}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                All Services in {formattedCity}
              </h1>

              <p className="text-blue-100 text-lg leading-relaxed">
                Discover trusted professionals, businesses and local experts across every category in {formattedCity}.
              </p>

            </div>

          </div>

        </section>

        {/* ================= CONTENT ================= */}
        <section className="max-w-7xl mx-auto px-4 py-10">

          {/* TOP INFO */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Browse Categories
              </h2>

              <p className="text-gray-500 mt-1">
                {parentCategories.length} service categories available
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-3 shadow-sm">
              <Grid2X2 size={18} className="text-blue-600" />

              <span className="text-sm font-medium text-gray-700">
                Popular local categories
              </span>
            </div>

          </div>

          {/* ================= GRID ================= */}
          {parentCategories.length > 0 ? (

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">

              {parentCategories.map((cat) => (

                <Link
                  key={cat._id}
                  to={`/category/${cat.slug}`}
                  className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                >

                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">

                    {cat.icon ? (
                      <img
                        src={cat.icon}
                        alt={cat.name}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <Grid2X2
                        size={24}
                        className="text-blue-600"
                      />
                    )}

                  </div>

                  <h3 className="font-semibold text-gray-800 text-sm leading-6 group-hover:text-blue-600 transition">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-gray-500 mt-2">
                    Explore businesses
                  </p>

                </Link>

              ))}

            </div>

          ) : (

            <div className="bg-white rounded-2xl border p-10 text-center">

              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No categories found
              </h3>

              <p className="text-gray-500">
                Categories are not available right now.
              </p>

            </div>

          )}

          {/* ================= SEO CONTENT ================= */}
          <div className="bg-white border rounded-3xl p-8 mt-14 shadow-sm">

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Find Trusted Services in {formattedCity}
            </h2>

            <div className="space-y-4 text-gray-600 leading-8">

              <p>
                ServDial helps users discover reliable local businesses and professionals in {formattedCity}. Browse top-rated services including electricians, plumbers, restaurants, hospitals, hotels, repair services, education institutes and more.
              </p>

              <p>
                Every business listing includes useful details like phone numbers, ratings, reviews, location information and service details so users can easily connect with trusted providers nearby.
              </p>

              <p>
                Whether you need home services, medical support, business solutions or local shops, ServDial makes business discovery simple and fast in {formattedCity}.
              </p>

            </div>

          </div>

        </section>

      </div>
    </>
  );
};

export default CityPage;