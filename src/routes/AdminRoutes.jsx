// src/routes/AdminRoutes.jsx
import { Route } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageBusinesses from "../pages/admin/ManageBusinesses";
import AdminAddBusiness from "../pages/admin/AdminAddBusiness";
import ManageCities from "../pages/admin/ManageCities";
import AddCity from "../pages/admin/AddCity";
import ManageCategories from "../pages/admin/ManageCategories";
import AddCategory from "../pages/admin/AddCategory";
import ManageBannerAds from "../pages/admin/ManageBannerAds";
import AdminAddBanner from "../pages/admin/AdminAddBanner";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageAdmins from "../pages/admin/ManageAdmins";

import Analytics from "../pages/admin/Analytics";
import Reports from "../pages/admin/Reports";
import SystemSettings from "../pages/admin/SystemSettings";
import ActivityLogs from "../pages/admin/ActivityLogs";

const AdminRoutes = () => {
  return (
    <Route
      path="admin/*"
      element={
        <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<AdminDashboard />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="businesses" element={<ManageBusinesses />} />
      <Route path="businesses/add" element={<AdminAddBusiness />} />
      <Route path="cities" element={<ManageCities />} />
      <Route path="cities/add" element={<AddCity />} />
      <Route path="categories" element={<ManageCategories />} />
      <Route path="categories/add" element={<AddCategory />} />
      <Route path="banners" element={<ManageBannerAds />} />
      <Route path="banners/add" element={<AdminAddBanner />} />
      <Route path="users" element={<ManageUsers />} />
      <Route path="admins" element={<ManageAdmins />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="reports" element={<Reports />} />
      <Route path="system-settings" element={<SystemSettings />} />
      <Route path="activity-logs" element={<ActivityLogs />} />
    </Route>
  );
};

export default AdminRoutes;