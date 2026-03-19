import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import PageLoader from "../components/common/PageLoader";
import PublicRoutes from "./PublicRoutes";
import AuthRoutes from "./AuthRoutes";
import AdminRoutes from "./AdminRoutes";
import ProviderRoutes from "./ProviderRoutes";
import About from "../pages/static/About";
import Contact from "../pages/static/Contact";
import PrivacyPolicy from "../pages/static/PrivacyPolicy";
import Terms from "../pages/static/Terms";
import Disclaimer from "../pages/static/Disclaimer";
import Advertise from "../pages/static/Advertise";

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

        <Route path="/:city/:category/:slug" element={<BusinessPage />}
/>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/advertise" element={<Advertise />} />


      </Routes>
    </Suspense>
  );
}

export default AppRoutes;