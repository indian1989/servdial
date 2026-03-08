import { useEffect, useState } from "react";
import API from "../api/axios";

// Layout
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// Home Sections
import HeroSearch from "../components/home/HeroSearch";
import Categories from "../components/home/Categories";
import FeaturedBusinesses from "../components/home/FeaturedBusinesses";
import NearbyBusinesses from "../components/home/NearbyBusinesses";
import MapSection from "../components/home/MapSection";
import TopRatedBusinesses from "../components/home/TopRatedBusinesses";
import CitiesSection from "../components/home/CitiesSection";
import BannerAds from "../components/home/BannerAds";
import HowItWorks from "../components/home/HowItWorks";
import BecomeProvider from "../components/home/BecomeProvider";

const Home = () => {

  const [featuredBusinesses,setFeaturedBusinesses] = useState([]);
  const [nearbyBusinesses,setNearbyBusinesses] = useState([]);
  const [topRatedBusinesses,setTopRatedBusinesses] = useState([]);
  const [categories,setCategories] = useState([]);
  const [cities,setCities] = useState([]);
  const [loading,setLoading] = useState(true);

  const [userLocation,setUserLocation] = useState({
    lat:null,
    lng:null
  });

  // ================= GET USER GPS LOCATION =================

  const detectLocation = () => {

    if(!navigator.geolocation){
      console.log("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos)=>{

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setUserLocation({lat,lng});

      },
      (err)=>{
        console.log("Location permission denied");
      }
    );
  };

  // ================= FETCH HOMEPAGE DATA =================

  const fetchHomepageData = async () => {

    try{

      setLoading(true);

      const [
        featuredRes,
        nearbyRes,
        topRatedRes,
        categoryRes,
        citiesRes
      ] = await Promise.all([

        API.get("/api/featured"),
        API.get("/api/business?limit=8"),
        API.get("/api/business?sort=rating&limit=8"),
        API.get("/api/categories"),
        API.get("/api/cities")

      ]);

      setFeaturedBusinesses(featuredRes.data || []);
      setNearbyBusinesses(nearbyRes.data.businesses || []);
      setTopRatedBusinesses(topRatedRes.data.businesses || []);
      setCategories(categoryRes.data || []);
      setCities(citiesRes.data || []);

    }catch(err){

      console.error("Homepage load error",err);

    }finally{

      setLoading(false);

    }

  };

  // ================= LOAD DATA =================

  useEffect(()=>{

    detectLocation();
    fetchHomepageData();

  },[]);

  return (

    <div className="bg-gray-50 min-h-screen">

      {/* HEADER */}
      <Header />

      {/* HERO SEARCH */}
      <HeroSearch />

      {/* POPULAR CATEGORIES */}
      <Categories categories={categories} />

      {/* FEATURED BUSINESSES */}
      <FeaturedBusinesses
        businesses={featuredBusinesses}
        loading={loading}
      />

      {/* NEARBY BUSINESSES */}
      <NearbyBusinesses
        businesses={nearbyBusinesses}
        userLocation={userLocation}
        loading={loading}
      />

      {/* MAP DISCOVERY */}
      <MapSection
        businesses={nearbyBusinesses}
        userLocation={userLocation}
      />

      {/* TOP RATED BUSINESSES */}
      <TopRatedBusinesses
        businesses={topRatedBusinesses}
        loading={loading}
      />

      {/* EXPLORE CITIES */}
      <CitiesSection cities={cities} />

      {/* BANNER ADS */}
      <BannerAds />

      {/* HOW SERVDIAL WORKS */}
      <HowItWorks />

      {/* BECOME PROVIDER CTA */}
      <BecomeProvider />

      {/* FOOTER */}
      <Footer />

    </div>

  );

};

export default Home;