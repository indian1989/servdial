import React, { Suspense, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Lazy load components
const BannerAd = React.lazy(() => import("../components/ads/BannerAd"));
const PopularCategories = React.lazy(() =>
  import("../components/home/PopularCategories")
);
const FeaturedBusinesses = React.lazy(() =>
  import("../components/home/FeaturedBusinesses")
);
const LatestBusinesses = React.lazy(() =>
  import("../components/home/LatestBusinesses")
);
const HeroSearch = React.lazy(() => import("../components/home/HeroSearch"));

const Home = () => {
  const { user } = useContext(AuthContext);

  // Placeholder banners and businesses (admin/superadmin added)
  const banners = [];
  const featuredBusinesses = [];
  const latestBusinesses = [];

  const isPaidFeatureAvailable = user?.role === "admin" || user?.role === "superadmin";

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* Hero Search */}
      <Suspense fallback={<div className="text-center py-10">Loading Search...</div>}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <HeroSearch onSearch={(query) => console.log("Search query:", query)} />
        </div>
      </Suspense>

      {/* Banner */}
      <Suspense fallback={<div className="text-center py-10">Loading Banner...</div>}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          {isPaidFeatureAvailable ? (
            <BannerAd banners={banners} />
          ) : (
            <div className="border border-dashed border-gray-300 p-6 text-center rounded-md bg-white shadow-sm">
              <p className="text-gray-600 font-medium">
                Banner ads will be visible here.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                This feature will be available soon for user and provider.
              </p>
            </div>
          )}
        </div>
      </Suspense>

      {/* Popular Categories */}
      <Suspense fallback={<div className="text-center py-10">Loading Categories...</div>}>
        <PopularCategories />
      </Suspense>

      {/* Featured Businesses */}
      <Suspense
        fallback={<div className="text-center py-10">Loading Featured Businesses...</div>}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          {isPaidFeatureAvailable ? (
            <FeaturedBusinesses businesses={featuredBusinesses} />
          ) : (
            <div className="border border-dashed border-gray-300 p-6 text-center rounded-md bg-white shadow-sm">
              <p className="text-gray-600 font-medium">
                Featured Businesses added by Admin/Superadmin.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                This feature will be available soon for user and provider.
              </p>
            </div>
          )}
        </div>
      </Suspense>

      {/* Latest Businesses */}
      <Suspense fallback={<div className="text-center py-10">Loading Latest Businesses...</div>}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <LatestBusinesses businesses={latestBusinesses} />
        </div>
      </Suspense>
    </div>
  );
};

export default Home;