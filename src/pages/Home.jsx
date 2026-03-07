import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { Helmet } from "react-helmet-async";
import { getUserCity } from "../utils/getUserCity";
import SearchBar from "../components/search/SearchBar";

const Home = () => {

  const [categories,setCategories] = useState([]);
  const [cities,setCities] = useState([]);
  const [featured,setFeatured] = useState([]);

  const [city,setCity] = useState(
    localStorage.getItem("servdial_city") || ""
  );

  useEffect(()=>{

    const detectCity = async ()=>{

      const userCity = await getUserCity();

      if(userCity){
        setCity(userCity);
        localStorage.setItem("servdial_city", userCity);
      }

    };

    detectCity();

    const fetchData = async ()=>{

      try{

        const catRes = await axios.get("/api/categories");
        setCategories(catRes.data.categories || []);

        const cityRes = await axios.get("/api/cities");
        setCities(cityRes.data.cities || []);

        const featRes = await axios.get("/api/businesses?sort=featured&limit=6");
        setFeatured(featRes.data.businesses || []);

      }catch(err){
        console.log(err);
      }

    };

    fetchData();

  },[]);

  return (

  <>
  <Helmet>

  <title>ServDial - Find Local Services Near You</title>

  <meta
  name="description"
  content="ServDial helps you find the best local businesses like plumbers, electricians, doctors, restaurants and more in your city."
  />

  <link rel="canonical" href="https://servdial.onrender.com/" />

  </Helmet>

  <div className="bg-gray-50 min-h-screen">

  {/* HERO */}

  <div className="bg-blue-600 text-white py-20">

  <div className="max-w-6xl mx-auto text-center px-6">

  <h1 className="text-4xl font-bold mb-4">
  Find Local Services Near You
  </h1>

  <p className="mb-8 text-lg">
  Search trusted businesses in your city
  </p>

  <SearchBar />

  </div>

  </div>

  {/* POPULAR CATEGORIES */}

  <div className="max-w-6xl mx-auto px-6 py-12">

  <h2 className="text-2xl font-bold mb-6">
  Popular Categories
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

  {categories.slice(0,8).map((cat)=>(

  <Link
  key={cat._id}
  to={`/category/${cat.slug}`}
  className="bg-white shadow rounded p-6 text-center hover:shadow-lg"
  >

  <h3 className="font-semibold">
  {cat.name}
  </h3>

  </Link>

  ))}

  </div>

  </div>

  {/* POPULAR CITIES */}

  <div className="bg-white py-12">

  <div className="max-w-6xl mx-auto px-6">

  <h2 className="text-2xl font-bold mb-6">
  Browse by City
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

  {cities.slice(0,8).map((c)=>(

  <Link
  key={c._id}
  to={`/${c.name}`}
  className="border p-6 rounded text-center hover:bg-gray-50"
  >

  {c.name}

  </Link>

  ))}

  </div>

  </div>

  </div>

  {/* FEATURED BUSINESSES */}

  <div className="max-w-6xl mx-auto px-6 py-12">

  <h2 className="text-2xl font-bold mb-6">
  Featured Businesses
  </h2>

  <div className="grid md:grid-cols-3 gap-6">

  {featured.map((biz)=>(

  <Link
  key={biz._id}
  to={`/business/${biz._id}`}
  className="bg-white shadow rounded-lg p-5 hover:shadow-lg"
  >

  {biz.images?.[0] && (

  <img
  src={biz.images[0]}
  alt={biz.name}
  className="w-full h-40 object-cover rounded mb-3"
  />

  )}

  <h3 className="text-lg font-semibold">
  {biz.name}
  </h3>

  <p className="text-gray-500 text-sm">
  {biz.category}
  </p>

  <p className="text-yellow-500 text-sm mt-1">
  ⭐ {biz.rating || "New"}
  </p>

  </Link>

  ))}

  </div>

  </div>

  </div>

  </>

  );

};

export default Home;