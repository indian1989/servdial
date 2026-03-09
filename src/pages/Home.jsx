import { useEffect, useState } from "react";
import API from "../api/axios";

// Sections
import HeroSearch from "../components/home/HeroSearch";
import CategoriesGrid from "../components/home/CategoriesGrid";
import PopularCategories from "../components/home/PopularCategories";
import PopularBusinesses from "../components/home/PopularBusinesses";
import FeaturedBusinesses from "../components/home/FeaturedBusinesses";
import TopRatedBusinesses from "../components/home/TopRatedBusinesses";
import NearbyBusinesses from "../components/home/NearbyBusinesses";
import MapSection from "../components/home/MapSection";
import PopularSearches from "../components/home/PopularSearches";
import FeaturedCities from "../components/home/FeaturedCities";
import WhyChooseServDial from "../components/home/WhyChooseServDial";
import Testimonials from "../components/home/Testimonials";
import DownloadApp from "../components/home/DownloadApp";
import BecomeProvider from "../components/home/BecomeProvider";

// Optional AI recommendation
import RecommendedBusinesses from "../components/recommendation/RecommendedBusinesses";

const Home = () => {

  const [featuredBusinesses,setFeaturedBusinesses] = useState([]);
  const [nearbyBusinesses,setNearbyBusinesses] = useState([]);
  const [topRatedBusinesses,setTopRatedBusinesses] = useState([]);
  const [categories,setCategories] = useState([]);
  const [cities,setCities] = useState([]);
  const [detectedCity,setDetectedCity] = useState(null);
  const [loading,setLoading] = useState(true);

  const [userLocation,setUserLocation] = useState({
    lat:null,
    lng:null
  });

  // ================= DETECT USER LOCATION =================

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

        fetchNearbyBusinesses(lat,lng);

      },
      ()=>{
        console.log("Location permission denied");
      }
    );
  };

  // ================= FETCH NEARBY BUSINESSES =================

  const fetchNearbyBusinesses = async (lat,lng) => {

    if(!lat || !lng) return;

    try{

      const res = await API.get(`/api/business/nearby?lat=${lat}&lng=${lng}&limit=8`);

      setNearbyBusinesses(res?.data?.businesses || []);

      if(res?.data?.city){
        setDetectedCity(res.data.city);
      }

    }catch(err){
      console.log("Nearby fetch failed",err);
    }

  };

  // ================= FETCH HOMEPAGE DATA =================

  const fetchHomepageData = async () => {

    try{

      setLoading(true);

      const [
        featuredRes,
        topRatedRes,
        categoryRes,
        citiesRes
      ] = await Promise.all([

        API.get("/api/business/featured"),
        API.get("/api/business/top-rated?limit=8"),
        API.get("/api/categories"),
        API.get("/api/cities")

      ]);

      setFeaturedBusinesses(featuredRes?.data?.businesses || []);
      setTopRatedBusinesses(topRatedRes?.data?.businesses || []);
      setCategories(categoryRes?.data?.categories || categoryRes?.data || []);
      setCities(citiesRes?.data?.cities || citiesRes?.data || []);

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

      {/* HERO SEARCH */}
      <HeroSearch />

      {/* POPULAR CATEGORIES */}
      <PopularCategories />

      {/* ALL CATEGORIES GRID */}
      <CategoriesGrid categories={categories} />

      {/* FEATURED BUSINESSES */}
      <FeaturedBusinesses
        businesses={featuredBusinesses}
        loading={loading}
      />

      {/* POPULAR BUSINESSES */}
      <PopularBusinesses
        businesses={featuredBusinesses}
        loading={loading}
      />

      {/* TOP RATED BUSINESSES */}
      <TopRatedBusinesses
        businesses={topRatedBusinesses}
        loading={loading}
      />

      {/* NEARBY BUSINESSES */}
      <NearbyBusinesses
        businesses={nearbyBusinesses}
        userLocation={userLocation}
      />

      {/* MAP SECTION */}
      <MapSection businesses={nearbyBusinesses} />

      {/* AI RECOMMENDATION */}
      {detectedCity && (
        <RecommendedBusinesses city={detectedCity} />
      )}

      {/* FEATURED CITIES */}
      <FeaturedCities cities={cities} />

      {/* POPULAR SEARCHES */}
      <PopularSearches />

      {/* WHY SERVDIAL */}
      <WhyChooseServDial />

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* DOWNLOAD APP */}
      <DownloadApp />

      {/* BECOME PROVIDER */}
      <BecomeProvider />

    </div>

  );

};

export default Home;