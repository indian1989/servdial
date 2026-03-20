import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

const CategoryDetails = () => {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await API.get(`/categories/slug/${slug}`);
        setCategory(res.data.category);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  if (loading) return <p>Loading...</p>;

  if (!category) return <p>Category not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{category.name}</h1>
      <p className="text-gray-500 mt-2">Slug: {category.slug}</p>
    </div>
  );
};

export default CategoryDetails;