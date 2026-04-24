import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import BusinessCard from "../../components/business/BusinessCard";

const SEOLandingPage = () => {
  const { seoSlug } = useParams();

  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const parseSlug = () => {
    if (!seoSlug) return;

    const parts = seoSlug.split("-in-");

    if (parts.length === 2) {
      setCategory(parts[0]);
      setCity(parts[1]);
    }
  };

  const fetchBusinesses = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/business?category=${category}&city=${city}`
      );

      setBusinesses(res.data.businesses || []);
    } catch (err) {
      console.log("SEO page fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    parseSlug();
  }, [seoSlug]);

  useEffect(() => {
    if (category && city) {
      fetchBusinesses();
    }
  }, [category, city]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold mb-6 capitalize">
        {category.replaceAll("-", " ")} in {city} | ServDial
      </h1>

      {loading ? (
        <p>Loading businesses...</p>
      ) : businesses.length === 0 ? (
        <p>No businesses found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {businesses.map((biz) => (
            <BusinessCard key={biz._id} business={biz} />
          ))}
        </div>
      )}

    </div>
  );
};

export default SEOLandingPage;