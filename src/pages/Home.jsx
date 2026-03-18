import { useEffect, useState } from "react";
import API from "../api/axios";

// Sections
import HeroSearch from "../components/home/HeroSearch";
import CategoriesGrid from "../components/home/CategoriesGrid";
import PopularBusinesses from "../components/home/PopularBusinesses";
import FeaturedBusinesses from "../components/home/FeaturedBusinesses";
import TopRatedBusinesses from "../components/home/TopRatedBusinesses";
import NearbyBusinesses from "../components/home/NearbyBusinesses";
import PopularSearches from "../components/home/PopularSearches";
import FeaturedCities from "../components/home/FeaturedCities";
import WhyChooseServDial from "../components/home/WhyChooseServDial";
import Testimonials from "../components/home/Testimonials";
import DownloadApp from "../components/home/DownloadApp";
import BecomeProvider from "../components/home/BecomeProvider";

import RecommendedBusinesses from "../components/recommendation/RecommendedBusinesses";

const Home = () => {
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [latestBusinesses, setLatestBusinesses] = useState([]);
  const [topRatedBusinesses, setTopRatedBusinesses] = useState([]);
  const [nearbyBusinesses, setNearbyBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const [detectedCity, setDetectedCity] = useState(null);
  const [loading, setLoading] = useState(true);

  const [userLocation, setUserLocation] = useState({
    lat: null,
    lng: null,
  });

  // ================= Detect Location =================
  const detectLocation = () => {
    const savedCity = localStorage.getItem("servdial_city");
    if (savedCity) {
      setDetectedCity(savedCity);
      return;
    }
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({ lat, lng });
        fetchNearbyBusinesses(lat, lng);
      },
      () => console.log("Location permission denied")
    );
  };

  // ================= Nearby Businesses =================
  const fetchNearbyBusinesses = async (lat, lng) => {
    if (!lat || !lng) return;
    try {
      const res = await API.get(
        `/business/nearby?lat=${lat}&lng=${lng}&limit=8`
      );
      const businesses = res?.data?.businesses || [];
      setNearbyBusinesses(businesses);

      if (res?.data?.city) {
        setDetectedCity(res.data.city);
        localStorage.setItem("servdial_city", res.data.city);
      }
    } catch (err) {
      console.log("Nearby fetch failed", err);
    }
  };

  // ================= Homepage Data =================
  const fetchHomepageData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/homepage");
      const data = res.data || {};

      setFeaturedBusinesses(data.featuredBusinesses || []);
      setLatestBusinesses(data.latestBusinesses || []);
      setTopRatedBusinesses(data.topRatedBusinesses || []);
      setCategories(data.categories || []);
      setCities(data.cities || []);
    } catch (err) {
      console.error("Homepage load error", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= Load Data =================
  useEffect(() => {
    detectLocation();
    fetchHomepageData();
  }, []);

  // ================= Loading UI =================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Loading ServDial...
      </div>
    );
  }

  // ================= Render =================
  return (
    <div className="bg-gray-50 min-h-screen">
      <HeroSearch city={detectedCity} />

      {Array.isArray(categories) && categories.length > 0 && (
        <CategoriesGrid
          categories={categories}
          city={detectedCity}
        />
      )}

      {featuredBusinesses.length > 0 && (
        <FeaturedBusinesses businesses={featuredBusinesses} loading={loading} />
      )}

      {latestBusinesses.length > 0 && (
        <PopularBusinesses businesses={latestBusinesses} loading={loading} />
      )}

      {/* {topRatedBusinesses.length > 0 && (
        <TopRatedBusinesses businesses={topRatedBusinesses} loading={loading} />
      )} */}

      {nearbyBusinesses.length > 0 && (
        <NearbyBusinesses businesses={nearbyBusinesses} userLocation={userLocation} />
      )}

      {detectedCity && <RecommendedBusinesses city={detectedCity} />}

      {cities.length > 0 && <FeaturedCities cities={cities} />}

      <PopularSearches />

      <WhyChooseServDial />

      <Testimonials />

      <DownloadApp />

      <BecomeProvider />
    </div>
  );
};

export default Home;