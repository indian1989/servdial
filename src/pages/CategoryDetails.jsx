import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";

const CategoryDetails = () => {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);

        const res = await API.get(`/categories/${slug}`);

        // 🔥 IMPORTANT FIX: correct extraction
        const data = res.data?.category;

        console.log("CATEGORY RESPONSE:", data);

        setCategory(data || null);

      } catch (err) {
        console.error("Category fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!category) {
    return <div className="p-6 text-red-500">Category not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-2">
        {category.name}
      </h1>

      <p className="text-gray-500 mb-6">
        Explore sub categories
      </p>

      {/* CHILDREN */}
      {category.children && category.children.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {category.children.map((child) => (
            <Link
              key={child._id}
              to={`/category/${child.slug}`}
              className="bg-white shadow rounded p-5 text-center hover:shadow-lg transition"
            >
              {child.name}
            </Link>
          ))}

        </div>
      ) : (
        <div className="text-gray-400">
          No sub categories found
        </div>
      )}

    </div>
  );
};

export default CategoryDetails;