// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useCity } from "../context/CityContext";
import API from "../api/axios";

// Sections
import HeroSearch from "../components/home/HeroSearch";
import CategoriesGrid from "../components/home/CategoriesGrid";
import FeaturedBusinesses from "../components/home/FeaturedBusinesses";
import PopularBusinesses from "../components/home/PopularBusinesses";
import NearbyBusinesses from "../components/home/NearbyBusinesses";
import RecommendedBusinesses from "../components/recommendation/RecommendedBusinesses";
import FeaturedCities from "../components/home/FeaturedCities";
import PopularSearches from "../components/home/PopularSearches";
import WhyChooseServDial from "../components/home/WhyChooseServDial";
import Testimonials from "../components/home/Testimonials";
import DownloadApp from "../components/home/DownloadApp";
import BecomeProvider from "../components/home/BecomeProvider";

const Home = () => {
  const { city, loadingCity } = useCity();

  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [latestBusinesses, setLatestBusinesses] = useState([]);
  const [nearbyBusinesses, setNearbyBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });

  const [loading, setLoading] = useState(false);

  // =================== Fetch Homepage Data ===================
  const fetchHomepageData = async (currentCity) => {
    if (!currentCity) return;
    setLoading(true);
    try {
      const res = await API.get("/homepage", { params: { city: currentCity } });
      const data = res.data || {};
      setFeaturedBusinesses(data.featuredBusinesses || []);
      setLatestBusinesses(data.latestBusinesses || []);
      setCategories(data.categories || []);
      setCities(data.cities || []);
    } catch (err) {
      console.error("Homepage load error", err);
    } finally {
      setLoading(false);
    }
  };

  // =================== Fetch Nearby Businesses ===================
  const fetchNearbyBusinesses = async (lat, lng) => {
    try {
      const res = await API.get(`/business/nearby?lat=${lat}&lng=${lng}&limit=8`);
      setNearbyBusinesses(res?.data?.businesses || []);
    } catch (err) {
      console.error("Nearby fetch failed", err);
    }
  };

  // =================== Get User Location ===================
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({ lat, lng });
        fetchNearbyBusinesses(lat, lng);
      },
      (err) => console.warn("Geolocation error:", err),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // =================== Refetch Data on City Change ===================
  useEffect(() => {
    if (city) fetchHomepageData(city);
  }, [city]);

  // =================== Initial Load Fallback ===================
  useEffect(() => {
    const savedCity = localStorage.getItem("servdial_city") || "India";
    if (!city) fetchHomepageData(savedCity);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO SEARCH */}
      <HeroSearch city={city} />

      {/* LOADING CITY */}
      {loadingCity && (
        <div className="px-4 py-4 text-xs text-gray-400 animate-pulse">
          Detecting location...
        </div>
      )}

      {/* CATEGORIES */}
      <CategoriesGrid categories={categories} city={city} loading={loading || loadingCity} />

      {/* FEATURED BUSINESSES */}
      <section className="my-12 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
          Featured Businesses in {city || "your city"}
        </h2>
        <FeaturedBusinesses businesses={featuredBusinesses} loading={loading || loadingCity} />
      </section>

      {/* LATEST BUSINESSES */}
      <section className="my-12 max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 text-center">
          Latest Businesses in {city || "your city"}
        </h2>
        <PopularBusinesses businesses={latestBusinesses} loading={loading || loadingCity} />
      </section>

      {/* NEARBY BUSINESSES */}
      <section className="my-12 max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 text-center">
          Businesses Near You
        </h2>
        <NearbyBusinesses businesses={nearbyBusinesses} userLocation={userLocation} loading={loading || loadingCity} />
      </section>

      {/* RECOMMENDED BUSINESSES */}
      {city && (
        <section className="my-12 max-w-7xl mx-auto px-4">
          <RecommendedBusinesses city={city} />
        </section>
      )}

      {/* FEATURED CITIES */}
      <section className="my-12 max-w-7xl mx-auto px-4">
        <FeaturedCities cities={cities} loading={loading} />
      </section>

      {/* POPULAR SEARCHES */}
      <PopularSearches loading={loading} />

      {/* OTHER SECTIONS */}
      <WhyChooseServDial />
      <Testimonials loading={loading} />
      <DownloadApp />
      <BecomeProvider />
    </div>
  );
};

export default Home;