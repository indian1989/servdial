// frontend/src/pages/CityPage.jsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import { Helmet } from "react-helmet-async";

const CityPage = () => {
  const { city } = useParams();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get("/categories");
        setCategories(data.categories || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  const formattedCity = city.charAt(0).toUpperCase() + city.slice(1);

  const title = `All Services in ${formattedCity} | ServDial`;
  const description = `Find all service categories in ${formattedCity}. Connect with top professionals in your city on ServDial.`;

  const url = `https://servdial.com/city/${city}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Services in ${formattedCity}`,
    itemListElement: categories.map((cat, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${cat.name} in ${formattedCity}`,
      url: `https://servdial.com/${city}/${cat.slug}`
    }))
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>

        <meta name="description" content={description} />

        <link rel="canonical" href={url} />

        <meta name="robots" content="index,follow" />

        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-10 px-6">

        <div className="max-w-6xl mx-auto">

          {/* Breadcrumb */}

          <div className="text-sm text-gray-500 mb-4">
            <Link to="/">Home</Link> / {formattedCity}
          </div>

          <h1 className="text-3xl font-bold mb-6">
            All Services in {formattedCity}
          </h1>

          <p className="text-gray-600 mb-8">
            Choose a category to explore services in {formattedCity}.
          </p>

          <div className="grid md:grid-cols-4 gap-6">

            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/${city}/${cat.slug}`}
                className="bg-white shadow rounded p-6 text-center hover:shadow-lg"
              >
                {cat.name} in {formattedCity}
              </Link>
            ))}

          </div>

          {/* SEO Content */}

          <div className="mt-12 text-gray-700 leading-relaxed">

            <h2 className="text-xl font-semibold mb-3">
              Find Trusted Services in {formattedCity}
            </h2>

            <p>
              ServDial helps you discover reliable professionals in {formattedCity}.
              Browse categories like plumbers, electricians, AC repair services
              and many more. Each service provider listed on ServDial includes
              contact details, ratings and business information to help you
              choose the best option near you.
            </p>

          </div>

        </div>

      </div>
    </>
  );
};

export default CityPage;