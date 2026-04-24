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

        const data = res.data?.category || null;

        setCategory(data);

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
    return <div className="p-6">Category not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6">
        {category.name}
      </h1>

      {/* CHILD CATEGORIES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {category.children && category.children.length > 0 ? (
          category.children.map((child) => (
            <Link
              key={child._id}
              to={`/${child.slug}`} 
              className="bg-white shadow rounded p-4 text-center hover:shadow-lg"
            >
              {child.name}
            </Link>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">
            No subcategories found
          </p>
        )}

      </div>

    </div>
  );
};

export default CategoryDetails;