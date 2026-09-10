// frontend/src/routes/temporaryListingRoutes.jsx

import React from "react";
import { Route } from "react-router-dom";

import TemporaryListings from "../pages/TemporaryListings";
import TemporaryListingDetails from "../pages/TemporaryListingDetails";

import AddTemporaryListing from "../pages/provider/AddTemporaryListing";
import ProviderTemporaryListings from "../pages/provider/ProviderTemporaryListings";
import ProviderEditTemporaryListing from "../pages/provider/EditTemporaryListing";

import AdminAddTemporaryListing from "../pages/admin/AddTemporaryListing";
import ManageTemporaryListings from "../pages/admin/ManageTemporaryListings";
import AdminEditTemporaryListing from "../pages/admin/EditTemporaryListing";

const TemporaryListingRoutes = () => {
  return (
    <>
    
      {/* Public */}

      <Route
        path="/temporary-listings"
        element={<TemporaryListings />}
      />

      <Route
        path="/temporary-listings/:id"
        element={<TemporaryListingDetails />}
      />

      {/* Provider */}

      <Route
        path="/provider/temporary-listings"
        element={<ProviderTemporaryListings />}
      />

      <Route
        path="/provider/temporary-listings/add"
        element={<AddTemporaryListing />}
      />

      <Route
  path="/provider/temporary-listings/:id/edit"
  element={<ProviderEditTemporaryListing />}
/>

      {/* Admin */}

      <Route
        path="/admin/temporary-listings"
        element={<ManageTemporaryListings />}
      />

      <Route
        path="/admin/temporary-listings/add"
        element={<AdminAddTemporaryListing />}
      />

      <Route
  path="/admin/temporary-listings/:id/edit"
  element={<AdminEditTemporaryListing />}
/>
    
    </>
  );
};

export default TemporaryListingRoutes;