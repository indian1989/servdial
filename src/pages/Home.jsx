import { useEffect, useState, useRef } from "react";
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
  const [topRatedBusinesses, setTopRatedBusinesses] = useState([]);
  const [latestBusinesses, setLatestBusinesses] = useState([]);
  const [nearbyBusinesses, setNearbyBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(false);

  const lastFetchedCity = useRef(null);

  // ================= FETCH HOMEPAGE =================
  const fetchHomepageData = async (currentCity) => {
    if (!currentCity?.slug) return;

    if (lastFetchedCity.current === currentCity.slug) return;

    lastFetchedCity.current = currentCity.slug;
    setLoading(true);

    try {
      const res = await API.get("/homepage", {
        params: { city: currentCity.slug },
      });

      const data = res?.data?.data || {};

      // 🔥 SAFE NORMALIZATION
      setCategories(Array.isArray(data.categories) ? data.categories : []);
      setFeaturedBusinesses(Array.isArray(data.featuredBusinesses) ? data.featuredBusinesses : []);
      setTopRatedBusinesses(Array.isArray(data.topRatedBusinesses) ? data.topRatedBusinesses : []);
      setLatestBusinesses(Array.isArray(data.latestBusinesses) ? data.latestBusinesses : []);
      setNearbyBusinesses(Array.isArray(data.nearbyBusinesses) ? data.nearbyBusinesses : []);
      setCities(Array.isArray(data.cities) ? data.cities : []);

    } catch (err) {
      console.error("❌ Homepage load error:", err);

      setCategories([]);
      setFeaturedBusinesses([]);
      setTopRatedBusinesses([]);
      setLatestBusinesses([]);
      setNearbyBusinesses([]);
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH NEARBY (GPS) =================
  const fetchNearbyBusinesses = async (lat, lng) => {
    try {
      const res = await API.get("/businesses/nearby", {
        params: { lat, lng, limit: 8 },
      });

      setNearbyBusinesses(
        Array.isArray(res?.data?.data) ? res.data.data : []
      );
    } catch (err) {
      console.error("❌ Nearby fetch failed:", err);
      setNearbyBusinesses([]);
    }
  };

  // ================= GET USER LOCATION =================
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setUserLocation({ lat, lng });
        fetchNearbyBusinesses(lat, lng);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // ================= CITY CHANGE =================
  useEffect(() => {
    if (!loadingCity && city?.slug) {
      fetchHomepageData(city);
    }
  }, [city?.slug, loadingCity]);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <HeroSearch city={city} />

      {/* CATEGORIES */}
      <CategoriesGrid
        categories={categories}
        city={city}
        loading={loading || loadingCity}
      />

      {/* FEATURED */}
      {featuredBusinesses.length > 0 && (
        <section className="my-14 max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Featured Businesses in {city?.name || "your area"}
          </h2>

          <FeaturedBusinesses
            businesses={featuredBusinesses}
            loading={loading || loadingCity}
          />
        </section>
      )}

      {/* TOP RATED */}
      {topRatedBusinesses.length > 0 && (
        <section className="my-14 max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Top Rated Businesses in {city?.name || "your area"}
          </h2>

          <PopularBusinesses
            businesses={topRatedBusinesses}
            loading={loading || loadingCity}
          />
        </section>
      )}

      {/* LATEST */}
      {latestBusinesses.length > 0 && (
        <section className="my-14 max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Newly Added Businesses in {city?.name || "your area"}
          </h2>

          <PopularBusinesses
            businesses={latestBusinesses}
            loading={loading || loadingCity}
          />
        </section>
      )}

      {/* NEARBY */}
      {nearbyBusinesses.length > 0 && (
        <section className="my-14 max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Businesses Near You
          </h2>

          <NearbyBusinesses
            businesses={nearbyBusinesses}
            userLocation={userLocation}
            loading={loading || loadingCity}
          />
        </section>
      )}

      {/* RECOMMENDED */}
      <section className="my-14 max-w-7xl mx-auto px-4">
        <RecommendedBusinesses city={city?.slug} />
      </section>

      {/* CITIES */}
      {cities.length > 0 && (
        <section className="my-14 max-w-7xl mx-auto px-4">
          <FeaturedCities cities={cities} loading={loading} />
        </section>
      )}

      {/* STATIC */}
      <PopularSearches loading={loading} />
      <WhyChooseServDial />
      <Testimonials loading={loading} />
      <DownloadApp />
      <BecomeProvider />
    </div>
  );
};

export default Home;