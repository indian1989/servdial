import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { Helmet } from "react-helmet-async";
import { getUserCity } from "../utils/getUserCity";
import SearchBar from "../components/search/SearchBar";
import CategoryGrid from "../components/home/CategoryGrid";


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

        const featRes = await axios.get("/api/featured");
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

      <div className="bg-blue-600 text-white py-20 px-6">

        <div className="max-w-5xl mx-auto text-center">

          <h1 className="text-4xl font-bold mb-4">
            Find Trusted Local Services
          </h1>

          <p className="text-lg mb-8">
            Discover the best businesses in your city
          </p>

          <SearchBar city={city} cities={cities} />

        </div>

      </div>



      {/* POPULAR CATEGORIES */}

      <CategoryGrid categories={categories} city={city} />

      {/* POPULAR CITIES */}

      <div className="bg-white py-12">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-2xl font-bold mb-8">
            Browse by City
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {cities.slice(0,8).map((c)=>(

              <Link
                key={c._id}
                to={`/${c.name}`}
                className="border rounded-lg p-6 text-center hover:bg-gray-50"
              >

                {c.name}

              </Link>

            ))}

          </div>

        </div>

      </div>



      {/* FEATURED BUSINESSES */}

      <div className="max-w-6xl mx-auto px-6 py-12">

        <h2 className="text-2xl font-bold mb-8">
          Featured Businesses
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {featured.map((biz)=>(

            <Link
              key={biz._id}
              to={`/business/${biz._id}`}
              className="bg-white shadow rounded-lg p-5 hover:shadow-lg"
            >

              {biz.image && (
                <img
                  src={biz.image}
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



      {/* TRENDING SEARCHES */}

      <div className="bg-gray-100 py-12">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-xl font-semibold mb-6">
            Popular Searches
          </h2>

          <div className="grid md:grid-cols-4 gap-3 text-sm">

            <Link to="/delhi/plumber">Plumber in Delhi</Link>
            <Link to="/mumbai/electrician">Electrician in Mumbai</Link>
            <Link to="/patna/hospital">Hospitals in Patna</Link>
            <Link to="/bangalore/restaurant">Restaurants in Bangalore</Link>

          </div>

        </div>

      </div>



      {/* PROVIDER CTA */}

      <div className="bg-blue-600 text-white py-16">

        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-4">
            Own a Business?
          </h2>

          <p className="mb-6">
            List your business on ServDial and reach thousands of customers.
          </p>

          <Link
            to="/add-business"
            className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded"
          >
            Add Your Business
          </Link>

        </div>

      </div>



    </div>

    </>
  );
};

export default Home;