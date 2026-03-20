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
    <>
    <Route element={<PublicLayout />}>

      {/* Home Page */}
      <Route path="/" element={<Home />} />

      {/* Search */}
      <Route path="/search" element={<SearchResults />} />

      {/* Latest Businesses */}
      <Route path="/latest-businesses" element={<LatestBusinesses />} />

      {/* Business Details */}
      <Route path="/business/:id" element={<BusinessPage />} />

      {/* Category Overview */}
      <Route path="/categories" element={<CategoryPage />} />
<Route path="/category/:slug" element={<CategoryDetails />} />

      {/* City Overview */}
      <Route path="/city/:city" element={<CityPage />} /> {/* NEW */}

      {/* City + Category */}
      <Route path="/:city/:category" element={<CityCategoryPage />} />

      {/* SEO Landing Pages */}
      <Route path="/:seoSlug" element={<SEOLandingPage />} />

      {/* Claim Business */}
      <Route path="/claim-business/:businessId" element={<ClaimBusiness />} />

    </Route>
    </>
  );
};

export default PublicRoutes;