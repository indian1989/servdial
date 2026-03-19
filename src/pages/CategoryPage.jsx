// frontend/src/pages/CategoryPage.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import API from "../api/axios";

const CategoryPage = () => {

  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {
      try {

        const citiesRes = await API.get("/cities");
        const categoriesRes = await API.get("/categories");

        setCities(citiesRes.data.cities || []);
        setCategories(categoriesRes.data.categories || []);

      } catch (err) {

        console.error("Error fetching cities or categories:", err);

      } finally {

        setLoading(false);

      }
    };

    fetchData();

  }, []);

  const title = "Browse Cities & Categories | ServDial";

  const description =
    "Find top service providers in your city. Explore categories and connect with trusted professionals on ServDial.";

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500 text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>

        <title>{title}</title>

        <meta name="description" content={description} />

        <link rel="canonical" href="https://servdial.com/category" />

        <meta name="robots" content="index,follow" />

      </Helmet>

      <div className="min-h-screen bg-gray-50 py-10 px-6">

        <div className="max-w-6xl mx-auto">

          {/* Breadcrumb */}

          <div className="text-sm text-gray-500 mb-4">
            <Link to="/">Home</Link> / Categories
          </div>

          <h1 className="text-3xl font-bold mb-6">
            Browse Cities & Categories
          </h1>

          <p className="text-gray-600 mb-8">
            Select a city and category to find the best services near you.
          </p>

          {/* Cities */}

          <h2 className="text-2xl font-semibold mb-4">
            Cities
          </h2>

          <div className="grid md:grid-cols-4 gap-6 mb-10">

            {cities.map((city) => (

              <Link
                key={city._id}
                to={`/city/${city.slug}`}
                className="bg-white shadow rounded p-6 text-center hover:shadow-lg transition"
              >
                {city.name}
              </Link>

            ))}

          </div>

          {/* Categories */}

          <h2 className="text-2xl font-semibold mb-4">
            Categories
          </h2>

          <div className="grid md:grid-cols-4 gap-6">

            {categories.map((cat) => (

              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                className="bg-white shadow rounded p-6 text-center hover:shadow-lg transition"
              >
                {cat.name}
              </Link>

            ))}

          </div>

          {/* SEO Content */}

          <div className="mt-12 text-gray-700 leading-relaxed">

            <h2 className="text-xl font-semibold mb-3">
              Discover Services Across Cities
            </h2>

            <p>
              ServDial connects you with verified service professionals across
              multiple cities. Whether you need plumbing, electrical work,
              home cleaning, or appliance repair, our directory helps you find
              trusted experts quickly. Browse cities and categories to locate
              the best services near you.
            </p>

          </div>

        </div>

      </div>
    </>
  );
};

export default CategoryPage;