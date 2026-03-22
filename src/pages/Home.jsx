// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useCity } from "../context/CityContext";

// Sections
import HeroSearch from "../components/home/HeroSearch";
import CategoriesGrid from "../components/home/CategoriesGrid";
import PopularBusinesses from "../components/home/PopularBusinesses";
import FeaturedBusinesses from "../components/home/FeaturedBusinesses";
import NearbyBusinesses from "../components/home/NearbyBusinesses";
import PopularSearches from "../components/home/PopularSearches";
import FeaturedCities from "../components/home/FeaturedCities";
import WhyChooseServDial from "../components/home/WhyChooseServDial";
import Testimonials from "../components/home/Testimonials";
import DownloadApp from "../components/home/DownloadApp";
import BecomeProvider from "../components/home/BecomeProvider";
import RecommendedBusinesses from "../components/recommendation/RecommendedBusinesses";

const Home = () => {
  const { city, setCity } = useCity();

  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [latestBusinesses, setLatestBusinesses] = useState([]);
  const [nearbyBusinesses, setNearbyBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [detectedCity, setDetectedCity] = useState(null);

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });

  // =================== Nearby Businesses ===================
  const fetchNearbyBusinesses = async (lat, lng) => {
    try {
      const res = await API.get(`/business/nearby?lat=${lat}&lng=${lng}&limit=8`);
      setNearbyBusinesses(res?.data?.businesses || []);

      if (res?.data?.city) {
        setDetectedCity(res.data.city);
        setCity(res.data.city);
        localStorage.setItem("servdial_city", res.data.city);
      }
    } catch (err) {
      console.log("Nearby fetch failed", err);
    }
  };

  // =================== Fallback IP Location ===================
  const fallbackIP = async () => {
    try {
      const res = await API.get("/location/ip");
      const cityName = res?.data?.city;

      if (cityName && cityName !== "India") {
        setDetectedCity(cityName);
        setCity(cityName);
        localStorage.setItem("servdial_city", cityName);
      } else {
        setDetectedCity("India");
        setCity("India");
      }
    } catch {
      setDetectedCity("India");
      setCity("India");
    } finally {
      setLocationLoading(false);
    }
  };

  // =================== Detect User Location ===================
  const detectLocation = async () => {
    const savedCity = localStorage.getItem("servdial_city");
    if (savedCity) {
      setDetectedCity(savedCity);
      setCity(savedCity);
      setLocationLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      fallbackIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setUserLocation({ lat, lng });

        try {
          const res = await API.get(`/location/reverse?lat=${lat}&lng=${lng}`);
          const cityName = res?.data?.city;

          if (cityName && cityName !== "India") {
            setDetectedCity(cityName);
            setCity(cityName);
            localStorage.setItem("servdial_city", cityName);
            fetchNearbyBusinesses(lat, lng);
          } else {
            fallbackIP();
          }
        } catch {
          fallbackIP();
        } finally {
          setLocationLoading(false);
        }
      },
      () => fallbackIP(),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // =================== Fetch Homepage Data ===================
  const fetchHomepageData = async (currentCity) => {
    try {
      setLoading(true);
      const res = await API.get("/homepage", {
        params: { city: currentCity || city || detectedCity },
      });
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

  // =================== Load on Mount ===================
  useEffect(() => {
    detectLocation();
    fetchHomepageData();
  }, []);

  // =================== Refetch Featured Businesses on City Change ===================
  useEffect(() => {
    if (city) fetchHomepageData(city);
  }, [city]);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO SEARCH */}
      <HeroSearch city={city || detectedCity} />

      {/* LOCATION DETECT LOADING */}
      {locationLoading && (
        <div className="px-4 py-4 text-xs text-gray-400 animate-pulse">
          Detecting location...
        </div>
      )}

      {/* CATEGORIES */}
      {categories?.length > 0 && (
        <CategoriesGrid categories={categories} city={city || detectedCity} />
      )}

      {/* FEATURED BUSINESSES */}
      <section className="my-12 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
          Featured Businesses in {city || detectedCity}
        </h2>

        <FeaturedBusinesses
          businesses={featuredBusinesses}
          loading={loading}
        />
      </section>

      {/* LATEST BUSINESSES */}
      {latestBusinesses?.length > 0 && (
        <PopularBusinesses businesses={latestBusinesses} loading={loading} />
      )}

      {/* NEARBY BUSINESSES */}
      {nearbyBusinesses?.length > 0 && (
        <NearbyBusinesses businesses={nearbyBusinesses} userLocation={userLocation} />
      )}

      {/* RECOMMENDED */}
      {(city || detectedCity) && (
        <RecommendedBusinesses city={city || detectedCity} />
      )}

      {/* FEATURED CITIES */}
      {cities?.length > 0 && <FeaturedCities cities={cities} />}

      {/* OTHER SECTIONS */}
      <PopularSearches />
      <WhyChooseServDial />
      <Testimonials />
      <DownloadApp />
      <BecomeProvider />

    </div>
  );
};

export default Home;