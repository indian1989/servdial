// frontend/src/pages/provider/ProviderTemporaryListings.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TemporaryListingCard from "../../components/temporaryListing/TemporaryListingCard";

import {
  getProviderTemporaryListings,
  deleteTemporaryListing,
} from "../../api/temporaryListingAPI";

const ProviderTemporaryListings = () => {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getProviderTemporaryListings();

      const data = response?.data;

      setListings(
        Array.isArray(data)
          ? data
          : Array.isArray(response)
          ? response
          : []
      );
    } catch (err) {
      console.error(
        "Provider Temporary Listings Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load your temporary listings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleEdit = (listing) => {
    navigate(
      `/provider/temporary-listings/${listing._id}/edit`
    );
  };

  const handleDelete = async (listing) => {
    if (!listing?._id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${listing.title}"?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(listing._id);
      setError("");

      await deleteTemporaryListing(listing._id);

      await fetchListings();
    } catch (err) {
      console.error(
        "Delete Temporary Listing Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to delete temporary listing."
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading your temporary listings...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                My Temporary Listings
              </h1>

              <p className="mt-1 text-sm text-gray-600">
                Manage your temporary listings and their
                expiry dates.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/provider/temporary-listings/add"
                )
              }
              className="w-fit rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Temporary Listing
            </button>
          </div>
        </div>
      </div>

      {/* Content */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {!listings.length ? (
          <div className="rounded-xl border bg-white px-6 py-12 text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              No Temporary Listings Yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              You have not created any temporary listings
              yet.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/provider/temporary-listings/add"
                )
              }
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Temporary Listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <div key={listing._id}>
                <TemporaryListingCard
                  listing={listing}
                  showStatus
                  showActions
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />

                {actionLoading === listing._id && (
                  <p className="mt-2 text-center text-xs text-gray-500">
                    Processing...
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProviderTemporaryListings;