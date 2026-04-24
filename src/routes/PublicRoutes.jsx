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

const PublicRoutes = () => {
  return (
    <Route element={<PublicLayout />}>

      {/* HOME */}
      <Route path="/" element={<Home />} />

      {/* SEARCH */}
      <Route path="/search" element={<SearchResults />} />

      {/* LATEST */}
      <Route path="/latest-businesses" element={<LatestBusinesses />} />

      {/* BUSINESS PAGE */}
      <Route
        path="/:citySlug/:categorySlug/:slug"
        element={<BusinessPage />}
      />

      {/* CATEGORY PAGES */}
      <Route path="/categories" element={<CategoryPage />} />
      <Route path="/category/:slug" element={<CategoryDetails />} />

      {/* CITY PAGE */}
      <Route path="/city/:city" element={<CityPage />} />

      {/* CITY + CATEGORY */}
      <Route path="/:city/:category" element={<CityCategoryPage />} />

      {/* ================= SEO FIXED (IMPORTANT) ================= */}
      <Route path="/seo/:seoSlug" element={<SEOLandingPage />} />

      {/* CLAIM BUSINESS */}
      <Route path="/claim-business/:businessId" element={<ClaimBusiness />} />

    </Route>
  );
};

export default PublicRoutes;