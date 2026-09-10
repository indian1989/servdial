// frontend/src/pages/TemporaryListings.jsx

import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import TemporaryListingList from "../components/temporaryListing/TemporaryListingList";

const TemporaryListings = () => {
    const { user } = useContext(AuthContext);
const navigate = useNavigate();

const handleAddTemporaryListing = () => {
  if (!user) {
    navigate("/unauthorized");
    return;
  }

  if (user.role === "provider") {
    navigate("/provider/temporary-listings/add");
    return;
  }

  if (user.role === "admin" || user.role === "superadmin") {
    navigate("/admin/temporary-listings/add");
    return;
  }

  navigate("/unauthorized");
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                Temporary Listing
              </span>

              <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                Temporary Listings
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
                Discover businesses, services, offers and other
                time-limited listings available on ServDial.
              </p>
            </div>

            <button
  type="button"
  onClick={handleAddTemporaryListing}
  className="inline-flex w-fit items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
>
  Add Temporary Listing
</button>
          </div>
        </div>
      </section>

      {/* Listings */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <TemporaryListingList />
      </main>
    </div>
  );
};

export default TemporaryListings;