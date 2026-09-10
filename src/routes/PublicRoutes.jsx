// frontend/src/routes/PublicRoutes.jsx
import API from "../api/axios";
import { useEffect, useState } from "react";

import {
  Route,
  Navigate,
  useParams,
} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";

import Home from "../pages/Home";
import SearchResults from "../pages/SearchResults";
import LatestBusinesses from "../pages/LatestBusinesses";
import BusinessPage from "../pages/BusinessPage";
import CategoryPage from "../pages/CategoryPage";
import CategoryDetails from "../pages/CategoryDetails";
import CityCategoryPage from "../pages/CityCategoryPage";
import CityPage from "../pages/CityPage";
import ClaimBusiness from "../pages/ClaimBusiness";
import RecommendedPage from "../pages/RecommendedPage";
import GetBusinessWebsite from "../pages/static/GetBusinessWebsite";
import LegacyCityRedirect from "../pages/LegacyCityRedirect";
import FeaturedBusinessesPage from "../pages/FeaturedBusinessesPage";
import TopRatedBusinessesPage from "../pages/TopRatedBusinessesPage";
import NearbyBusinessesPage from "../pages/NearbyBusinessesPage";
import BannerPricing from "../pages/BannerPricing";
import StatePage from "../pages/StatePage";

const OneSegmentResolver = () => {
  const { stateSlug } = useParams();

  const [loading, setLoading] = useState(true);
  const [resolvedCity, setResolvedCity] = useState(null);
  const [isCity, setIsCity] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const resolveRoute = async () => {
      try {
        const cityResponse = await API.get(
          `/cities/${stateSlug}`
        );

        const city =
          cityResponse?.data?.data ||
          cityResponse?.data ||
          null;

        if (
          city?.slug === stateSlug
        ) {
          if (!cancelled) {
            setResolvedCity(city);
            setIsCity(true);
            setLoading(false);
          }

          return;
        }

        if (!cancelled) {
          setIsCity(false);
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          setIsCity(false);
          setLoading(false);
        }
      }
    };

    resolveRoute();

    return () => {
      cancelled = true;
    };
  }, [stateSlug]);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-gray-500">
          Loading...
        </p>
      </div>
    );
  }

  /*
   * OLD CITY URL
   *
   * /citySlug
   *
   * Example:
   * /chennai-chennai-tamil-nadu
   *
   * Redirect to:
   * /tamil-nadu/chennai-chennai-tamil-nadu
   */
  if (isCity && resolvedCity) {
    const canonicalStateSlug =
      resolvedCity.stateSlug ||
      resolvedCity.state
        ?.toLowerCase()
        .replace(/\s+/g, "-");

    return (
      <Navigate
        to={`/${canonicalStateSlug}/${resolvedCity.slug}`}
        replace
      />
    );
  }

  /*
   * CURRENT STATE URL
   */
  return <StatePage />;
};

const ThreeSegmentResolver = () => {
  const {
    stateSlug,
    citySlug,
    categorySlug,
  } = useParams();

  const [loading, setLoading] = useState(true);
  const [routeType, setRouteType] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const resolveRoute = async () => {
      try {
        /*
         * CATEGORY URL
         *
         * /stateSlug/citySlug/categorySlug
         */
        const cityResponse = await API.get(
          `/cities/${citySlug}`
        );

        const city =
          cityResponse?.data?.data ||
          cityResponse?.data ||
          null;

        if (
          city?.slug === citySlug &&
          city?.stateSlug === stateSlug
        ) {
          if (!cancelled) {
            setRouteType("category");
            setLoading(false);
          }

          return;
        }

        /*
         * BUSINESS URL
         *
         * /citySlug/categorySlug/businessSlug
         */
        if (!cancelled) {
          setRouteType("business");
          setLoading(false);
        }

      } catch (error) {
        /*
         * Second segment is not a valid city,
         * so treat this as the existing business URL.
         */
        if (!cancelled) {
          setRouteType("business");
          setLoading(false);
        }
      }
    };

    resolveRoute();

    return () => {
      cancelled = true;
    };
  }, [
    stateSlug,
    citySlug,
    categorySlug,
  ]);

  if (loading || !routeType) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-gray-500">
          Loading...
        </p>
      </div>
    );
  }

  /*
   * CATEGORY PAGE
   */
  if (routeType === "category") {
    return (
      <CityCategoryPage
        resolvedParams={{
          stateSlug,
          citySlug,
          categorySlug,
        }}
      />
    );
  }

  /*
   * BUSINESS PAGE
   *
   * Resolver route params:
   * stateSlug    = actual citySlug
   * citySlug     = actual categorySlug
   * categorySlug = actual business slug
   */
  return (
    <BusinessPage
      resolvedParams={{
        citySlug: stateSlug,
        categorySlug: citySlug,
        slug: categorySlug,
      }}
    />
  );
};

const TwoSegmentResolver = () => {
  const {
    stateSlug,
    citySlug,
  } = useParams();

  const [loading, setLoading] = useState(true);
  const [routeType, setRouteType] = useState(null);
  const [resolvedCity, setResolvedCity] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const resolveRoute = async () => {
      try {
        /*
         * OLD CATEGORY URL
         *
         * /citySlug/categorySlug
         *
         * Example:
         * /hajipur-vaishali-bihar/home-services
         */
        const cityResponse = await API.get(
          `/cities/${stateSlug}`
        );

        const city =
          cityResponse?.data?.data ||
          cityResponse?.data ||
          null;

        /*
         * First segment is an actual city
         *
         * Therefore this is the old
         * city/category URL.
         */
        if (
          city?.slug === stateSlug
        ) {
          if (!cancelled) {
            setResolvedCity(city);
            setRouteType("category");
            setLoading(false);
          }

          return;
        }

        /*
         * Otherwise this is the current
         * state/city URL.
         */
        if (!cancelled) {
          setRouteType("city");
          setLoading(false);
        }

      } catch (error) {

        /*
         * First segment is not a city.
         * Keep existing state/city behavior.
         */
        if (!cancelled) {
          setRouteType("city");
          setLoading(false);
        }
      }
    };

    resolveRoute();

    return () => {
      cancelled = true;
    };
  }, [
    stateSlug,
    citySlug,
  ]);

  if (loading || !routeType) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-gray-500">
          Loading...
        </p>
      </div>
    );
  }

  /*
   * OLD CITY + CATEGORY URL
   *
   * Existing CityCategoryPage will handle
   * the canonical redirect.
   */
  if (routeType === "category") {
  const canonicalStateSlug =
    resolvedCity?.stateSlug ||
    resolvedCity?.state
      ?.toLowerCase()
      .replace(/\s+/g, "-");

  const canonicalUrl =
    `/${canonicalStateSlug}/${resolvedCity.slug}/${citySlug}`;

  return (
    <Navigate
      to={canonicalUrl}
      replace
    />
  );
}

  /*
   * CURRENT STATE + CITY URL
   */
  return <CityPage />;
};

const PublicRoutes = () => {
  return (
    <Route element={<PublicLayout />}>

  {/* HOME */}
  <Route path="/" element={<Home />} />

  {/* SEARCH */}
  <Route path="/search" element={<SearchResults />} />


  {/* STATE */}
<Route
  path="/:stateSlug"
  element={<OneSegmentResolver />}
/>

{/* CITY */}
<Route
  path="/:stateSlug/:citySlug"
  element={<TwoSegmentResolver />}
/>

  {/* FEATURED */}
<Route
  path="/:citySlug/featured-businesses"
  element={<FeaturedBusinessesPage />}
/>

{/* TOP RATED */}
<Route
  path="/:citySlug/top-rated-businesses"
  element={<TopRatedBusinessesPage />}
/>

  {/* LATEST */}
  <Route
  path="/:citySlug/latest-businesses"
  element={<LatestBusinesses />}
/>

{/* NEARBY */}
<Route
  path="/nearby-businesses"
  element={<NearbyBusinessesPage />}
/>

  {/* RECOMMENDED */}
<Route path="/recommendations" element={<RecommendedPage />} />

<Route
  path="/banner-pricing"
  element={<BannerPricing />}
/>

<Route
  path="/city/:citySlug"
  element={<LegacyCityRedirect />}
/>

  {/* BUSINESS (MOST SPECIFIC FIRST) */}
  
 <Route
  path="/:stateSlug/:citySlug/:categorySlug"
  element={<ThreeSegmentResolver />}
/>

  {/* CATEGORIES (GLOBAL) */}
<Route path="/categories" element={<CategoryPage />} />

<Route
  path="/:stateSlug/:citySlug/categories"
  element={<CategoryPage />}
/>

{/* CATEGORY DETAILS */}
<Route
  path="/category/:parentSlug/:slug"
  element={<CategoryDetails />}
/>

<Route
  path="/category/:slug"
  element={<CategoryDetails />}
/>

<Route path="/recommendation" element={<Navigate to="/recommendations" replace />} />


{/* WEBSITE SERVICE LANDING */}
<Route
path="/business-website"
element={<GetBusinessWebsite />}
/>


  {/* CLAIM */}
  <Route path="/claim-business/:businessId" element={<ClaimBusiness />} />

</Route>
  );
};

export default PublicRoutes;