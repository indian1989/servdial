import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import PageLoader from "../components/common/PageLoader";
import PublicRoutes from "./PublicRoutes";
import AuthRoutes from "./AuthRoutes";
import AdminRoutes from "./AdminRoutes";
import ProviderRoutes from "./ProviderRoutes";

const Unauthorized = lazy(() => import("../pages/Unauthorized"));
const NotFound = lazy(() => import("../pages/NotFound"));

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* AUTH */}
        {AuthRoutes()}

        {/* PUBLIC */}
        {PublicRoutes()}

        {/* ADMIN */}
        {AdminRoutes()}

        {/* PROVIDER */}
        {ProviderRoutes()}

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}

export default AppRoutes;