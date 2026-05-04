// frontend/src/routes/PublicRoutes.jsx

import { Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";

import Home from "../pages/Home";
import SearchResults from "../pages/SearchResults";
import LatestBusinesses from "../pages/LatestBusinesses";
import BusinessPage from "../pages/BusinessPage";
import CategoryPage from "../pages/CategoryPage";
import CategoryDetails from "../pages/CategoryDetails";
import CityCategoryPage from "../pages/CityCategoryPage";
import CityPage from "../pages/CityPage";
import SEOLandingPage from "../pages/seo/SEOLandingPage";
import ClaimBusiness from "../pages/ClaimBusiness";
import RecommendedPage from "../pages/RecommendedPage";

const PublicRoutes = () => {
  return (
    <Route element={<PublicLayout />}>

  {/* HOME */}
  <Route path="/" element={<Home />} />

  {/* SEARCH */}
  <Route path="/search" element={<SearchResults />} />

  {/* LATEST */}
  <Route path="/latest-businesses" element={<LatestBusinesses />} />

  {/* RECOMMENDED */}
<Route path="/recommendations" element={<RecommendedPage />} />

  {/* BUSINESS (MOST SPECIFIC FIRST) */}
  <Route path="/:citySlug/:categorySlug/:slug" element={<BusinessPage />} />

  {/* CITY + CATEGORY */}
  <Route path="/:citySlug/:categorySlug" element={<CityCategoryPage />} />

  {/* CITY */}
  <Route path="/city/:citySlug" element={<CityPage />} />

  {/* CATEGORIES (GLOBAL) */}
  <Route path="/categories" element={<CategoryPage />} />

  {/* SEO */}
  <Route path="/seo/:seoSlug" element={<SEOLandingPage />} />

  {/* CLAIM */}
  <Route path="/claim-business/:businessId" element={<ClaimBusiness />} />

</Route>
  );
};

export default PublicRoutes;