import { Routes, Route } from "react-router-dom";

import PublicLayout from "./PublicLayout";
import AuthLayout from "./AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

import AdminLayout from "../layouts/AdminLayout";

/* PUBLIC PAGES */
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import CityCategoryPage from "../pages/CityCategoryPage";
import CategoryPage from "../pages/CategoryPage";
import BusinessPage from "../pages/BusinessPage";
import LatestBusinesses from "../pages/LatestBusinesses";
import SearchResults from "../pages/SearchResults";
import SEOLandingPage from "../pages/seo/SEOLandingPage";

/* AUTH */
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

/* PROVIDER */
import ProviderDashboard from "../pages/provider/ProviderDashboard";

/* ADMIN DASHBOARD */
import AdminDashboard from "../pages/admin/AdminDashboard";

/* ADMIN - BUSINESSES */
import ManageBusinesses from "../pages/admin/ManageBusinesses";
import AddBusiness from "../pages/admin/AddBusiness";

/* ADMIN - CITIES */
import ManageCities from "../pages/admin/ManageCities";
import AddCity from "../pages/admin/AddCity";

/* ADMIN - CATEGORIES */
import ManageCategories from "../pages/admin/ManageCategories";
import AddCategory from "../pages/admin/AddCategory";

/* ADMIN - BANNERS */
import ManageBannerAds from "../pages/admin/ManageBannerAds";
import AddBanner from "../pages/admin/AddBanner";

/* ADMIN - USERS & ADMINS */
import ManageUsers from "../pages/admin/ManageUsers";
import ManageAdmins from "../pages/admin/ManageAdmins";

function AppRoutes() {
  return (
    <Routes>

      {/* ================= AUTH ROUTES ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

{/* ================= PUBLIC WEBSITE ================= */}
<Route element={<PublicLayout />}>

  {/* Homepage */}
  <Route path="/" element={<Home />} />

  {/* Search */}
  <Route path="/search" element={<SearchResults />} />

  {/* Latest Businesses */}
  <Route path="/latest-businesses" element={<LatestBusinesses />} />

  {/* Business Details */}
  <Route path="/business/:id" element={<BusinessPage />} />

  {/* SEO Category Page */}
  <Route path="/category/:category" element={<CategoryPage />} />

  {/* SEO City + Category */}
  <Route path="/:city/:category" element={<CityCategoryPage />} />

  {/* Add Business */}
  <Route
    path="/add-business"
    element={
      <ProtectedRoute allowedRoles={["provider", "admin", "superadmin"]}>
        <AddBusiness />
      </ProtectedRoute>
    }
  />

  {/* Modern SEO URL */}
  <Route path="/:seoSlug" element={<SEOLandingPage />} />

</Route>

      {/* ================= ADMIN PANEL ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
<Route path="dashboard" element={<AdminDashboard />} />

        {/* BUSINESSES */}
        <Route path="businesses" element={<ManageBusinesses />} />
        <Route path="businesses/add" element={<AddBusiness />} />

        {/* CITIES */}
        <Route path="cities" element={<ManageCities />} />
        <Route path="cities/add" element={<AddCity />} />

        {/* CATEGORIES */}
        <Route path="categories" element={<ManageCategories />} />
        <Route path="categories/add" element={<AddCategory />} />

        {/* BANNERS */}
        <Route path="banners" element={<ManageBannerAds />} />
        <Route path="banners/add" element={<AddBanner />} />

        {/* USERS */}
        <Route path="users" element={<ManageUsers />} />

        {/* ADMINS */}
        <Route path="admins" element={<ManageAdmins />} />
      </Route>

      {/* ================= PROVIDER DASHBOARD ================= */}
      <Route
        path="/provider/dashboard"
        element={
          <ProtectedRoute allowedRoles={["provider"]}>
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= 404 ================= */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default AppRoutes;