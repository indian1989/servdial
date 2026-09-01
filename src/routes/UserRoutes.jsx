// frontend/src/routes/UserRoutes.jsx

import React, { useContext } from "react";
import { Route, Navigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import PrivateRoute from "./PrivateRoute";

// ================= USER LAYOUT =================

import UserLayout from "../layouts/UserLayout";

// ================= USER PAGES =================

import UserDashboard from "../pages/user/UserDashboard";
import UserAddBanner from "../pages/user/UserAddBanner";
import UserManageBanners from "../pages/user/UserManageBanners";
import UserSavedBusinesses from "../pages/user/UserSavedBusinesses";
import UserReviews from "../pages/user/UserReviews";
import UserRecommendations from "../pages/user/UserRecommendations";
import UserNotifications from "../pages/user/UserNotifications";
import UserMessages from "../pages/user/UserMessages";
import UserProfile from "../pages/user/UserProfile";
import UserSettings from "../pages/user/UserSettings";
import UserChangePassword from "../pages/user/UserChangePassword";

/**
 * ==================================================
 * 👤 USER ROUTES
 * ==================================================
 *
 * USER-ONLY AUTHENTICATED AREA
 *
 * SECURITY:
 * - User must be logged in
 * - Only role === "user" is allowed
 * - Provider / Admin / Superadmin cannot access
 *
 * LAYOUT:
 * - UserLayout
 *   ├── UserHeader
 *   ├── UserSidebar
 *   └── User page content
 *
 * ==================================================
 */

// ==================================================
// USER ROLE GUARD
// ==================================================

const UserRouteGuard = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Auth initialization
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Only normal users
  if (user.role !== "user") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};


// ==================================================
// USER ROUTES
// ==================================================

const UserRoutes = () => {
  return (
    <Route
      element={
        <PrivateRoute>
          <UserRouteGuard>
            <UserLayout />
          </UserRouteGuard>
        </PrivateRoute>
      }
    >

      {/* =================================================
          DASHBOARD
      ================================================= */}

      <Route
        path="/user/dashboard"
        element={<UserDashboard />}
      />


      {/* =================================================
          BANNERS
      ================================================= */}

      <Route
        path="/user/add-banner"
        element={<UserAddBanner />}
      />

      <Route
        path="/user/manage-banners"
        element={<UserManageBanners />}
      />


      {/* =================================================
          SAVED BUSINESSES
      ================================================= */}

      <Route
        path="/user/saved-businesses"
        element={<UserSavedBusinesses />}
      />


      {/* =================================================
          REVIEWS
      ================================================= */}

      <Route
        path="/user/reviews"
        element={<UserReviews />}
      />


      {/* =================================================
          RECOMMENDATIONS
      ================================================= */}

      <Route
        path="/user/recommendations"
        element={<UserRecommendations />}
      />


      {/* =================================================
          MESSAGES
      ================================================= */}

      <Route
        path="/user/messages"
        element={<UserMessages />}
      />


      {/* =================================================
          NOTIFICATIONS
      ================================================= */}

      <Route
        path="/user/notifications"
        element={<UserNotifications />}
      />


      {/* =================================================
          PROFILE
      ================================================= */}

      <Route
        path="/user/profile"
        element={<UserProfile />}
      />


      {/* =================================================
          SETTINGS
      ================================================= */}

      <Route
        path="/user/settings"
        element={<UserSettings />}
      />


      {/* =================================================
          CHANGE PASSWORD
      ================================================= */}

      <Route
        path="/user/change-password"
        element={<UserChangePassword />}
      />

    </Route>
  );
};

export default UserRoutes;