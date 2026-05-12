// frontend/src/pages/CategoryPage.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import API from "../api/axios";

import {
  Layers3,
  ChevronRight,
  Grid2X2,
  MapPin,
  ArrowRight,
  Search,
} from "lucide-react";

const CategoryPage = () => {
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [citiesRes, categoriesRes] =
          await Promise.all([
            API.get("/cities"),
            API.get("/categories"),
          ]);

        setCities(
          citiesRes.data?.cities ||
          citiesRes.data?.data ||
          []
        );

        setCategories(
          categoriesRes.data?.categories ||
          categoriesRes.data?.data ||
          []
        );

      } catch (err) {
        console.error(
          "Error fetching cities or categories:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ================= PARENT CATEGORIES =================
  const parentCategories = (categories || []).filter(
    (c) => !c.parentCategory
  );

  // ================= FEATURED CITIES =================
  const featuredCities = (cities || []).slice(0, 8);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-500">
            Loading categories...
          </p>

        </div>

      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          Browse Categories | ServDial
        </title>

        <meta
          name="description"
          content="Browse all business and service categories on ServDial. Discover trusted local businesses and professionals near you."
        />

        <link
          rel="canonical"
          href="https://servdial.com/categories"
        />
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
                Categories
              </span>

            </div>

            {/* HERO CONTENT */}
            <div className="max-w-3xl">

              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm mb-5">

                <Layers3 size={16} />

                <span>
                  Discover local services
                </span>

              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Browse Service Categories
              </h1>

              <p className="text-blue-100 text-lg leading-relaxed">
                Explore verified businesses, trusted professionals and local services across every category on ServDial.
              </p>

            </div>

          </div>

        </section>

        {/* ================= MAIN CONTENT ================= */}
        <section className="max-w-7xl mx-auto px-4 py-10">

          {/* ================= HEADER ================= */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>

              <h2 className="text-2xl font-bold text-gray-800">
                Popular Categories
              </h2>

              <p className="text-gray-500 mt-1">
                {parentCategories.length} categories available
              </p>

            </div>

            <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-3 shadow-sm">

              <Grid2X2
                size={18}
                className="text-blue-600"
              />

              <span className="text-sm font-medium text-gray-700">
                Explore businesses
              </span>

            </div>

          </div>

          {/* ================= CATEGORY GRID ================= */}
          {parentCategories.length > 0 ? (

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">

              {parentCategories.map((cat) => (

                <Link
                  key={cat._id}
                  to={`/category/${cat.slug}`}
                  className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                >

                  {/* ICON */}
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">

                    {cat.icon ? (
                      <img
                        src={cat.icon}
                        alt={cat.name}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <Layers3
                        size={24}
                        className="text-blue-600"
                      />
                    )}

                  </div>

                  {/* TITLE */}
                  <h3 className="font-semibold text-gray-800 text-sm leading-6 group-hover:text-blue-600 transition min-h-[48px]">
                    {cat.name}
                  </h3>

                  {/* FOOTER */}
                  <div className="flex items-center justify-between mt-4">

                    <span className="text-xs text-gray-500">
                      View sub categories
                    </span>

                    <ArrowRight
                      size={16}
                      className="text-gray-400 group-hover:text-blue-600 transition"
                    />

                  </div>

                </Link>

              ))}

            </div>

          ) : (

            <div className="bg-white border rounded-3xl p-10 text-center shadow-sm">

              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">

                <Search
                  size={28}
                  className="text-gray-400"
                />

              </div>

              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Categories Found
              </h3>

              <p className="text-gray-500">
                Categories are not available right now.
              </p>

            </div>

          )}

          {/* ================= FEATURED CITIES ================= */}
          {featuredCities.length > 0 && (

            <div className="mt-16">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="text-2xl font-bold text-gray-800">
                    Explore by City
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Browse local businesses city wise
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">

                {featuredCities.map((city) => (

                  <Link
                    key={city._id}
                    to={`/city/${city.slug}`}
                    className="group bg-white border rounded-2xl px-5 py-4 hover:shadow-lg hover:border-blue-200 transition"
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">

                        <MapPin
                          size={18}
                          className="text-blue-600"
                        />

                      </div>

                      <div>

                        <h3 className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition">
                          {city.name}
                        </h3>

                        <p className="text-xs text-gray-500">
                          Explore services
                        </p>

                      </div>

                    </div>

                  </Link>

                ))}

              </div>

            </div>

          )}

          {/* ================= SEO CONTENT ================= */}
          <div className="bg-white border rounded-3xl p-8 mt-16 shadow-sm">

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Find Trusted Local Businesses
            </h2>

            <div className="space-y-4 text-gray-600 leading-8">

              <p>
                ServDial helps users discover reliable businesses and professionals across multiple categories including home services, restaurants, healthcare, education, repair services, travel, beauty and more.
              </p>

              <p>
                Browse sub categories, compare local providers and connect directly with verified businesses through phone and WhatsApp.
              </p>

              <p>
                Whether you are searching for daily services or professional business solutions, ServDial makes local business discovery fast, simple and reliable.
              </p>

            </div>

          </div>

        </section>

      </div>
    </>
  );
};

export default CategoryPage;