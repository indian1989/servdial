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
    setLoading(true);

    const citiesRes = await API.get("/cities");
    const categoriesRes = await API.get("/categories");

    setCities(citiesRes.data?.cities || []);

    setCategories(
      categoriesRes.data?.categories ||
      categoriesRes.data?.data ||
      []
    );

  } catch (err) {
    console.error("Error fetching cities or categories:", err);
  } finally {
    setLoading(false);
  }
};

    fetchData();
  }, []);

  const parentCategories = (categories || []).filter(
    (c) => !c.parentCategory
  );

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Browse Categories | ServDial</title>
      </Helmet>

      <div className="max-w-6xl mx-auto py-10 px-6">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6">
          Browse Categories
        </h1>

        <p className="text-gray-600 mb-8">
          Select a category to explore services
        </p>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {parentCategories.map((cat) => (
            <Link
              key={cat._id}
              to={`/category/${cat.slug}`}
              className="bg-white shadow rounded p-6 text-center hover:shadow-lg transition"
            >
              {cat.name}
            </Link>
          ))}

        </div>

      </div>
    </>
  );
};

export default CategoryPage;