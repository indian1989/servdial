import { useEffect, useState, useRef } from "react";
import { useCity } from "../context/CityContext";
import API from "../api/axios";
import { Helmet } from "react-helmet-async";

// Sections
import HeroSearch from "../components/home/HeroSearch";
import CategoriesGrid from "../components/home/CategoriesGrid";
import FeaturedBusinesses from "../components/home/FeaturedBusinesses";
import PopularBusinesses from "../components/home/PopularBusinesses";
import NearbyBusinesses from "../components/home/NearbyBusinesses";
import FeaturedCities from "../components/home/FeaturedCities";
import PopularSearches from "../components/home/PopularSearches";
import WhyChooseServDial from "../components/home/WhyChooseServDial";
import Testimonials from "../components/home/Testimonials";
import DownloadApp from "../components/home/DownloadApp";
import BecomeProvider from "../components/home/BecomeProvider";
import BannerAd from "../components/ads/BannerAd";

const Home = () => {
  const { city, loadingCity } = useCity();

  const [data, setData] = useState({
    featured: [],
    topRated: [],
    latest: [],
    nearby: [],
    recommended: [],
    categories: [],
    cities: [],
  });

  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(false);

  const lastFetchKey = useRef(null);

  /* ================= FETCH HOMEPAGE ================= */
  const fetchHomepageData = async ({ citySlug, lat, lng }) => {
    if (!citySlug) return;

    const key = `${citySlug}_${lat || "0"}_${lng || "0"}`;

    if (lastFetchKey.current === key) return;
    lastFetchKey.current = key;

    setLoading(true);

    try {
      const res = await API.get("/homepage", {
        params: {
          city: citySlug,
          lat,
          lng,
        },
      });

      const d = res?.data?.data || {};

setData({
  featured: d.featuredBusinesses || [],
  topRated: d.topRatedBusinesses || [],
  latest: d.latestBusinesses || [],
  nearby: d.nearbyBusinesses || [],
  recommended: d.recommendedBusinesses || [],
  categories: d.categories || [],
  cities: d.cities || [],
});

    } catch (err) {
      console.error("❌ Homepage error:", err);

      setData({
        featured: [],
        topRated: [],
        latest: [],
        recommended: [],
        nearby: [],
        categories: [],
        cities: [],
      });

    } finally {
      setLoading(false);
    }
  };

  /* ================= GET LOCATION ================= */
useEffect(() => {

  const lat = localStorage.getItem("user_lat");
  const lng = localStorage.getItem("user_lng");


  if (lat && lng) {

    console.log("🔥 USING SAVED GPS:", {
      lat,
      lng
    });


    setUserLocation({
      lat: Number(lat),
      lng: Number(lng),
    });

    return;
  }


  console.log(
    "⚠️ GPS NOT FOUND - WAITING FOR CityContext"
  );


}, []);

  // 🔥 ONLY showing changed parts

/* ================= MAIN FETCH TRIGGER ================= */
useEffect(() => {
  if (loadingCity) return;

  const citySlug = city?.slug || "india";

  fetchHomepageData({
    citySlug,
    lat: userLocation.lat || undefined,
    lng: userLocation.lng || undefined,
  });

}, [city, loadingCity, userLocation.lat, userLocation.lng]);

const cityName = city?.name || "your area";

  return (

    <>
  <Helmet>
    <title>
      ServDial - Find Trusted Local Businesses & Services in {cityName}
    </title>

    <meta
      name="description"
      content={`Discover trusted local businesses, home services, electricians, plumbers, salons, AC repair, restaurants and more in ${cityName} with ServDial.`}
    />

    <meta
      name="keywords"
      content="local business directory, electricians, plumbers, salons, AC repair, nearby services, trusted businesses, ServDial"
    />

    <link rel="canonical" href="https://servdial.com/" />

    {/* Open Graph */}
    <meta property="og:type" content="website" />
    <meta property="og:title" content={`ServDial - Trusted Services in ${cityName}`} />
    <meta
      property="og:description"
      content={`Find verified businesses and local services in ${cityName} with ServDial.`}
    />
    <meta property="og:url" content="https://servdial.com/" />
    <meta property="og:site_name" content="ServDial" />

    <meta
  property="og:image"
  content="https://servdial.com/og-image.jpg"
/>

<meta
  name="twitter:image"
  content="https://servdial.com/og-image.jpg"
/>

    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:title"
      content={`ServDial - Trusted Services in ${cityName}`}
    />
    <meta
      name="twitter:description"
      content={`Find trusted local businesses and services in ${cityName}.`}
    />

    {/* JSON-LD */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "ServDial",
        url: "https://servdial.com",
        potentialAction: {
          "@type": "SearchAction",
          target:
            "https://servdial.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      })}
    </script>
  </Helmet>

    <div className="bg-gray-50 min-h-screen">

      {/* SEO H1 */}
<h1 className="sr-only">
  ServDial - Find Trusted Local Businesses and Services in {cityName}
</h1>

{/* HERO */}
<HeroSearch city={city} />

{/* 🔥 TOP BANNER */}
<BannerAd placement="homepage_top" />

      {/* LOCATION LOADING */}
      {loadingCity && (
        <div className="text-center text-sm text-gray-400 py-2 animate-pulse">
          Detecting your location...
        </div>
      )}

      {/* ================= CATEGORIES ================= */}
      <CategoriesGrid
        categories={data.categories}
        city={city}
        loading={loading || loadingCity}
      />


      {/* ================= FEATURED ================= */}
      <section className="my-14 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Featured Businesses in {cityName}
        </h2>

        <FeaturedBusinesses
  businesses={data.featured}
  loading={loading || loadingCity}
  city={city}
/>
      </section>

      
      {/* 🔥 MIDDLE BANNER */}
<BannerAd placement="homepage_middle" />

      {/* ================= TOP RATED ================= */}
      <section className="my-14 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Top Rated Businesses in {cityName}
        </h2>

        <PopularBusinesses
          businesses={data.topRated}
          loading={loading || loadingCity}
          city={city}
          title="top rated businesses"
        />
      </section>

      {/* ================= LATEST ================= */}
      <section className="my-14 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Newly Added Businesses in {cityName}
        </h2>

        <PopularBusinesses
  businesses={data.latest}
  loading={loading || loadingCity}
  city={city}
  title="new businesses"
/>
      </section>

      {/* ================= NEARBY ================= */}
      <section className="my-14 max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Businesses Near You
        </h2>

        <NearbyBusinesses
          businesses={data.nearby}
          userLocation={userLocation}
          loading={loading || loadingCity}
        />
      </section>

      {/* ================= RECOMMENDED ================= */}
      <section className="my-14 max-w-7xl mx-auto px-4">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold">
      Recommended for You
    </h2>

    <button
      onClick={() => window.location.href = `/recommendations?city=${city?.slug || "india"}`}
      className="text-blue-600 font-semibold hover:underline"
    >
      View All →
    </button>
  </div>

  <PopularBusinesses
    businesses={data.recommended}
    loading={loading || loadingCity}
    city={city}
    title="recommended businesses"
  />
</section>

{/* 🔥 BOTTOM BANNER */}
<BannerAd placement="homepage_bottom" />

      {/* ================= CITIES ================= */}
      <section className="my-14 max-w-7xl mx-auto px-4">
        <FeaturedCities cities={data.cities} loading={loading} />
      </section>

      <section className="my-14">
        <PopularSearches loading={loading} />
      </section>

      <WhyChooseServDial />
      <Testimonials loading={loading} />
      <DownloadApp />
      <BecomeProvider />
    </div>
</>
);
};

export default Home;