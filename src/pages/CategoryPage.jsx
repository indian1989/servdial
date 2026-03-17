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

  const title = `Browse Cities & Categories | ServDial`;
  const description =
    "Find top service providers in your city. Explore categories and connect with the best professionals on ServDial.";

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://servdial.com/category`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Browse Cities & Categories</h1>
          <p className="text-gray-600 mb-8">
            Select a city and category to find the best services near you.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Cities</h2>
          <div className="grid md:grid-cols-4 gap-6 mb-10">
            {cities.map((city) => (
              <Link
                key={city._id}
                to={`/${city.name}/all-categories`}
                className="bg-white shadow rounded p-6 text-center hover:shadow-lg"
              >
                {city.name}
              </Link>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-4">Categories</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/all-cities/${cat.name}`}
                className="bg-white shadow rounded p-6 text-center hover:shadow-lg"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;