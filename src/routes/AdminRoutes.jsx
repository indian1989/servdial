// src/routes/AdminRoutes.jsx

import { Route } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageBusinesses from "../pages/admin/ManageBusinesses";
import AdminAddBusiness from "../pages/admin/AdminAddBusiness";
import ManageCities from "../pages/admin/ManageCities";
import ManageCategories from "../pages/admin/ManageCategories";
import ManageBannerAds from "../pages/admin/ManageBannerAds";
import AdminAddBanner from "../pages/admin/AdminAddBanner";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageAdmins from "../pages/admin/ManageAdmins";
import AdminLeads from "../pages/admin/AdminLeads";

import Analytics from "../pages/admin/Analytics";
import Reports from "../pages/admin/Reports";
import SystemSettings from "../pages/admin/SystemSettings";
import ActivityLogs from "../pages/admin/ActivityLogs";
import AdminNotifications from "../pages/admin/AdminNotifications";

// =========================================================
// PAYMENT MANAGEMENT
// =========================================================

import AdminPaymentManagement from "../pages/admin/AdminPaymentManagement";
import AdminPaymentVerification from "../pages/admin/AdminPaymentVerification";
import AdminPaymentSettings from "../pages/admin/AdminPaymentSettings";


const AdminRoutes = () => {
  return (
    <Route
      path="admin/*"
      element={
        <ProtectedRoute
          allowedRoles={[
            "admin",
            "superadmin",
          ]}
        >
          <AdminLayout />
        </ProtectedRoute>
      }
    >

      {/* ===================================================
          DASHBOARD
      =================================================== */}

      <Route
        index
        element={<AdminDashboard />}
      />

      <Route
        path="dashboard"
        element={<AdminDashboard />}
      />


      {/* ===================================================
          BUSINESS ENGINE
      =================================================== */}

      <Route
        path="businesses"
        element={<ManageBusinesses />}
      />

      <Route
        path="businesses/add"
        element={<AdminAddBusiness />}
      />


      {/* ===================================================
          LOCATION ENGINE
      =================================================== */}

      <Route
        path="cities"
        element={<ManageCities />}
      />


      {/* ===================================================
          CATEGORY ENGINE
      =================================================== */}

      <Route
        path="categories"
        element={<ManageCategories />}
      />


      {/* ===================================================
          BANNER MANAGEMENT
      =================================================== */}

      <Route
        path="banners"
        element={<ManageBannerAds />}
      />

      <Route
        path="banners/add"
        element={<AdminAddBanner />}
      />


      {/* ===================================================
          PAYMENT MANAGEMENT
      =================================================== */}

      <Route
        path="payments"
        element={<AdminPaymentManagement />}
      />

      <Route
        path="payments/verification"
        element={<AdminPaymentVerification />}
      />

      <Route
        path="payment-settings"
        element={<AdminPaymentSettings />}
      />


      {/* ===================================================
          USERS
      =================================================== */}

      <Route
        path="users"
        element={<ManageUsers />}
      />


      {/* ===================================================
          LEAD MANAGEMENT
      =================================================== */}

      <Route
        path="leads"
        element={<AdminLeads />}
      />


      {/* ===================================================
          SYSTEM / SUPERADMIN
      =================================================== */}

      <Route
        path="admins"
        element={<ManageAdmins />}
      />

      <Route
        path="analytics"
        element={<Analytics />}
      />

      <Route
        path="reports"
        element={<Reports />}
      />

      <Route
        path="system-settings"
        element={<SystemSettings />}
      />

      <Route
        path="activity-logs"
        element={<ActivityLogs />}
      />

      <Route
  path="notifications"
  element={<AdminNotifications />}
/>

    </Route>
  );
};


export default AdminRoutes;