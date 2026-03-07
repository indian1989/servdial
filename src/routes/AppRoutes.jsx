import { Routes, Route } from "react-router-dom";

import PublicLayout from "./PublicLayout";
import AuthLayout from "./AuthLayout";

import Home from "../pages/Home";
import AllBusinesses from "../pages/AllBusinesses";
import AddBusiness from "../pages/AddBusiness";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageBusinesses from "../pages/admin/businesses/ManageBusinesses";
import ManageCities from "../pages/admin/cities/ManageCities";
import ManageCategories from "../pages/admin/categories/ManageCategories";
import ManageBannerAds from "../pages/admin/banners/ManageBannerAds";
import ManageAdmins from "../pages/admin/admins/ManageAdmins";
import ManageUsers from "../pages/admin/ManageUsers";
import AddBanner from "../pages/admin/banners/AddBanner";
import AddCity from "../pages/admin/cities/AddCity";
import AddCategory from "../pages/admin/categories/AddCategory";
import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";
import ProviderDashboard from "../pages/provider/ProviderDashboard";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

function AppRoutes() {
  return (
    <Routes>

<Route element={<AuthLayout />}>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password/:token" element={<ResetPassword />} />
</Route>

<Route element={<PublicLayout />}>
  <Route path="/" element={<Home />} />
  <Route path="/:city/:service" element={<AllBusinesses />} />
  <Route path="/:city" element={<AllBusinesses />} />

        <Route
          path="/add-business"
          element={
            <ProtectedRoute allowedRoles={["provider", "admin", "superadmin"]}>
              <AddBusiness />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ADMIN DASHBOARD */}
      <Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="add-business" element={<AddBusiness />} />
  <Route path="add-city" element={<AddCity />} />
  <Route path="add-category" element={<AddCategory />} />
  <Route path="add-banner" element={<BannerManager />} />  <Route path="add-category" element={<AddCategory />} />
  <Route path="/admin/businesses" element={<ManageBusinesses />} />
  <Route path="/admin/cities" element={<ManageCities />} />
  <Route path="/admin/categories" element={<ManageCategories />} />
  <Route path="/admin/banners" element={<ManageBannerAds />} />
  <Route path="/admin/admins" element={<ManageAdmins />} />
  <Route path="/admin/users" element={<ManageUsers />} />
  <Route path="/admin/add-banner" element={<AddBanner />} />
</Route>

      <Route
        path="/admin/banners"
        element={
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <BannerManager />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/add-business"
        element={
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <AddBusiness />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/add-city"
        element={
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <AddCity />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/add-category"
        element={
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <AddCategory />
          </ProtectedRoute>
        }
      />



      {/* Provider Dashboard */}
      <Route
  path="/provider/dashboard"
  element={
    <ProtectedRoute allowedRoles={["provider"]}>
      <ProviderDashboard />
    </ProtectedRoute>
  }
/>

      {/* AUTH LAYOUT */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* 404 FALLBACK */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default AppRoutes;