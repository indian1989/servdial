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
import ManageBusinesses from "../pages/admin/businesses/ManageBusinesses";
import AddBusiness from "../pages/admin/businesses/AddBusiness";

/* ADMIN - CITIES */
import ManageCities from "../pages/admin/cities/ManageCities";
import AddCity from "../pages/admin/cities/AddCity";

/* ADMIN - CATEGORIES */
import ManageCategories from "../pages/admin/categories/ManageCategories";
import AddCategory from "../pages/admin/categories/AddCategory";

/* ADMIN - BANNERS */
import ManageBannerAds from "../pages/admin/banners/ManageBannerAds";
import AddBanner from "../pages/admin/banners/AddBanner";

/* ADMIN - USERS & ADMINS */
import ManageUsers from "../pages/admin/users/ManageUsers";
import ManageAdmins from "../pages/admin/admins/ManageAdmins";

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

        {/* Business Details */}
        <Route path="/business/:id" element={<BusinessPage />} />

        {/* SEO Category Pages */}
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