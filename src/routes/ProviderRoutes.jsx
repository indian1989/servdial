import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ProviderLayout from "../layouts/ProviderLayout";

import ProviderDashboard from "../pages/provider/ProviderDashboard";
import ProviderBusinesses from "../pages/provider/ProviderBusinesses";
import ProviderLeads from "../pages/provider/ProviderLeads";
import ProviderReviews from "../pages/provider/ProviderReviews";
import ProviderSettings from "../pages/provider/ProviderSettings";
import ProviderAnalytics from "../pages/provider/ProviderAnalytics";
import AddBusiness from "../pages/provider/AddBusiness";
import EditBusiness from "../pages/provider/EditBusiness";
import TrackBusinessView from "../pages/provider/TrackBusinessView";
import ProviderOffers from "../pages/provider/ProviderOffers";
import ProviderMessages from "../pages/provider/ProviderMessages";
import ProviderNotifications from "../pages/provider/ProviderNotifications";
import ProviderSubscription from "../pages/provider/ProviderSubscription";
import ProviderProfile from "../pages/provider/ProviderProfile";

/* Business management pages */
import BusinessMediaManager from "../pages/provider/BusinessMediaManager";
import BusinessHoursManager from "../pages/provider/BusinessHoursManager";

import { providerRoutes } from "./routeConfig";

const components = {
  ProviderDashboard,
  ProviderBusinesses,
  ProviderLeads,
  ProviderReviews,
  ProviderSettings,
  ProviderAnalytics,
  AddBusiness,
  ProviderOffers,
  ProviderMessages,
  ProviderNotifications,
  ProviderSubscription,
  ProviderProfile,
};

function ProviderRoutes() {
  return (
    <>
    <Route
      path="/provider/*"
      element={
        <ProtectedRoute allowedRoles={["provider", "admin", "superadmin"]}>
          <ProviderLayout />
        </ProtectedRoute>
      }
    >
      {/* Dynamic sidebar routes */}
      {providerRoutes.map((route) => {
  const Component = components[route.element];

  if (!Component) {
    console.warn("Missing component for route:", route);
    return null;
  }

  return (
    <Route
      key={route.path}
      path={route.path.replace("/provider/", "")}
      element={<Component />}
    />
  );
})}

      {/* Hidden routes (not in sidebar) */}

      <Route path="edit-business/:id" element={<EditBusiness />} />

      <Route path="track-business/:id" element={<TrackBusinessView />} />

      <Route path="business/:id/media" element={<BusinessMediaManager />} />

      <Route path="business/:id/hours" element={<BusinessHoursManager />} />

    </Route>
    </>
  );
}

export default ProviderRoutes;