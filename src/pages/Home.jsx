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
  if (!currentCity) return;

  if (lastFetchedCity.current === currentCity?.slug) return;

  lastFetchedCity.current = currentCity?.slug;
  setLoading(true);

  try {
    const res = await API.get("/", {
      params: { city: currentCity?.slug },
    });

    const data = res?.data?.data || {};

    setFeaturedBusinesses(data.featuredBusinesses || []);
    setLatestBusinesses(data.latestBusinesses || []);
    setTopRatedBusinesses(data.topRatedBusinesses || []);
    setCategories(data.categories || []);
    setCities(data.cities || []);

  } catch (err) {
    console.error("❌ Homepage load error:", err);

    setFeaturedBusinesses([]);
    setLatestBusinesses([]);
    setTopRatedBusinesses([]);
    setCategories([]);
    setCities([]);

  } finally {
    setLoading(false);
  }
};

  // ================= FETCH NEARBY =================
  const fetchNearbyBusinesses = async (lat, lng) => {
  try {
    const res = await API.get("/businesses/nearby", {
      params: { lat, lng, limit: 8 },
    });

    setNearbyBusinesses(
      Array.isArray(res?.data?.data)
        ? res.data.data
        : []
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
      () => {
        console.log("Location permission denied");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // ================= CITY CHANGE =================
  useEffect(() => {
    if (!loadingCity && city) {
      fetchHomepageData(city);
    }
  }, [city, loadingCity]);

  // ================= FALLBACK (FIRST LOAD) =================
  useEffect(() => {
    if (!city && !loadingCity) {
      const savedCity = localStorage.getItem("servdial_city");

if (savedCity) {
  try {
    const parsed = JSON.parse(savedCity);
    fetchHomepageData(parsed);
  } catch {
    fetchHomepageData({ name: "India", slug: "india" });
  }
} else {
  fetchHomepageData({ name: "India", slug: "india" });
}
    }
  }, [city, loadingCity]);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <HeroSearch city={city} />

      {/* LOCATION LOADING */}
      {loadingCity && (
        <div className="text-center text-sm text-gray-400 py-2 animate-pulse">
          Detecting your location...
        </div>
      )}

      {/* ================= CATEGORIES ================= */}
      <CategoriesGrid
        categories={categories}
        city={city}
        loading={loading || loadingCity}
      />

      {/* ================= FEATURED ================= */}
      <section className="my-14 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Featured Businesses in {city?.name || "your area"}
        </h2>

        <FeaturedBusinesses
          businesses={featuredBusinesses}
          loading={loading || loadingCity}
        />
      </section>

      {/* ================= TOP RATED ================= */}
<section className="my-14 max-w-7xl mx-auto px-4">
  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
    Top Rated Businesses in {city?.name || "your area"}
  </h2>

  <PopularBusinesses
    businesses={topRatedBusinesses}
    loading={loading || loadingCity}
  />
</section>

      {/* ================= LATEST ================= */}
      <section className="my-14 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Newly Added Businesses in {city?.name || "your area"}
        </h2>

        <PopularBusinesses
          businesses={latestBusinesses}
          loading={loading || loadingCity}
        />
      </section>

      {/* ================= NEARBY ================= */}
      <section className="my-14 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-8 text-center">
          Businesses Near You
        </h2>

        <NearbyBusinesses
          businesses={nearbyBusinesses}
          userLocation={userLocation}
          loading={loading || loadingCity}
        />
      </section>

      {/* ================= RECOMMENDED ================= */}
      <section className="my-14 max-w-7xl mx-auto px-4">
        <RecommendedBusinesses city={city?.slug} />
      </section>

      {/* ================= FEATURED CITIES ================= */}
      <section className="my-14 max-w-7xl mx-auto px-4">
        <FeaturedCities cities={cities} loading={loading} />
      </section>

      {/* ================= POPULAR SEARCHES ================= */}
      <section className="my-14">
        <PopularSearches loading={loading} />
      </section>

      {/* ================= TRUST + CTA ================= */}
      <WhyChooseServDial />
      <Testimonials loading={loading} />
      <DownloadApp />
      <BecomeProvider />
    </div>
  );
};

export default Home;
