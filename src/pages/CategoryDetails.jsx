// frontend/src/pages/CategoryDetails.jsx

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import API from "../api/axios";

import {
  ChevronRight,
  Layers3,
  ArrowRight,
  Grid2X2,
  Search,
} from "lucide-react";

const CategoryDetails = () => {
  const { citySlug, slug } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH CATEGORY =================
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);

        const res = await API.get(`/categories/${slug}/children`);

        const data = {
  ...res.data?.data?.parent,
  children: res.data?.data?.children || [],
};

        console.log("CATEGORY RESPONSE:", data);

        setCategory(data);

      } catch (err) {
        console.error("Category fetch error:", err);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategory();
    }
  }, [slug]);

  // ================= SEO =================
  const categoryName =
    category?.name ||
    slug?.replace(/-/g, " ") ||
    "Category";

  const formattedCity =
    citySlug?.replace(/-/g, " ") || "India";

  const title = `${categoryName} Services | ServDial`;

  const description = `Explore sub categories and businesses under ${categoryName} on ServDial.`;

  const canonicalUrl = citySlug
    ? `https://servdial.com/${citySlug}/${slug}`
    : `https://servdial.com/category/${slug}`;

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-500">
            Loading category...
          </p>

        </div>

      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

        <div className="bg-white border rounded-3xl shadow-sm p-10 text-center max-w-md w-full">

          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Search size={28} className="text-red-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Category Not Found
          </h2>

          <p className="text-gray-500 mb-6">
            The category you are looking for does not exist.
          </p>

          <Link
            to="/categories"
            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Browse Categories
          </Link>

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

        <link
          rel="canonical"
          href={canonicalUrl}
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

              <Link
                to="/categories"
                className="hover:text-white transition"
              >
                Categories
              </Link>

              <ChevronRight size={14} />

              <span className="text-white font-medium">
                {category.name}
              </span>

            </div>

            {/* HERO CONTENT */}
            <div className="max-w-3xl">

              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm mb-5">

                <Layers3 size={16} />

                <span>
                  Explore businesses & services
                </span>

              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                {category.name}
              </h1>

              <p className="text-blue-100 text-lg leading-relaxed">
                Browse all sub categories and discover trusted local businesses related to {category.name}.
              </p>

            </div>

          </div>

        </section>

        {/* ================= MAIN ================= */}
        <section className="max-w-7xl mx-auto px-4 py-10">

          {/* TOP INFO */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>

              <h2 className="text-2xl font-bold text-gray-800">
                Sub Categories
              </h2>

              <p className="text-gray-500 mt-1">
                {category.children?.length || 0} sub categories available
              </p>

            </div>

            <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-3 shadow-sm">

              <Grid2X2
                size={18}
                className="text-blue-600"
              />

              <span className="text-sm font-medium text-gray-700">
                Browse services
              </span>

            </div>

          </div>

          {/* ================= CHILDREN ================= */}
          {category.children &&
          category.children.length > 0 ? (

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">

              {category.children.map((child) => (

                <button
                  key={child._id}
                  onClick={() => {
                    if (citySlug) {
                      navigate(`/${citySlug}/${child.slug}`);
                    } else {
                      navigate(`/search?category=${child.slug}`);
                    }
                  }}
                  className="group bg-white border border-gray-100 rounded-2xl p-5 text-left hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                >

                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">

                    {child.icon ? (
                      <img
                        src={child.icon}
                        alt={child.name}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <Layers3
                        size={24}
                        className="text-blue-600"
                      />
                    )}

                  </div>

                  <h3 className="font-semibold text-gray-800 text-sm leading-6 group-hover:text-blue-600 transition min-h-[48px]">
                    {child.name}
                  </h3>

                  <div className="flex items-center justify-between mt-4">

                    <span className="text-xs text-gray-500">
                      Explore businesses
                    </span>

                    <ArrowRight
                      size={16}
                      className="text-gray-400 group-hover:text-blue-600 transition"
                    />

                  </div>

                </button>

              ))}

            </div>

          ) : (

            <div className="bg-white border rounded-3xl p-10 text-center shadow-sm">

              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">

                <Layers3
                  size={28}
                  className="text-gray-400"
                />

              </div>

              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Sub Categories Found
              </h3>

              <p className="text-gray-500 mb-6">
                Businesses will appear here once sub categories are added.
              </p>

              <button
                onClick={() =>
                  navigate(`/search?category=${slug}`)
                }
                className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                View Businesses
              </button>

            </div>

          )}

          {/* ================= SEO CONTENT ================= */}
          <div className="bg-white border rounded-3xl p-8 mt-14 shadow-sm">

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Explore {category.name} Services
            </h2>

            <div className="space-y-4 text-gray-600 leading-8">

              <p>
                ServDial helps users discover trusted businesses and professionals under the {category.name} category. Browse verified local service providers, compare ratings and connect directly with businesses near you.
              </p>

              <p>
                From small local providers to established businesses, users can easily explore multiple services, compare options and contact businesses instantly through phone or WhatsApp.
              </p>

              {citySlug && (
                <p>
                  Explore the best {category.name.toLowerCase()} services in {formattedCity} with updated business listings and trusted recommendations.
                </p>
              )}

            </div>

          </div>

        </section>

      </div>
    </>
  );
};

export default CategoryDetails;