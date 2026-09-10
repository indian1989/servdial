// frontend/src/pages/admin/ManageTemporaryListings.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TemporaryListingCard from "../../components/temporaryListing/TemporaryListingCard";

import {
  getAllTemporaryListings,
  approveTemporaryListing,
  rejectTemporaryListing,
  deleteTemporaryListing,
} from "../../api/temporaryListingAPI";

const ManageTemporaryListings = () => {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllTemporaryListings();

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
        "Manage Temporary Listings Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load temporary listings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleApprove = async (listing) => {
    if (!listing?._id) return;

    try {
      setActionLoading(listing._id);

      await approveTemporaryListing(listing._id);

      await fetchListings();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to approve temporary listing."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (listing) => {
    if (!listing?._id) return;

    try {
      setActionLoading(listing._id);

      await rejectTemporaryListing(listing._id);

      await fetchListings();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to reject temporary listing."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (listing) => {
    if (!listing?._id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${listing.title}"?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(listing._id);

      await deleteTemporaryListing(listing._id);

      await fetchListings();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete temporary listing."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (listing) => {
    navigate(
      `/admin/temporary-listings/${listing._id}/edit`
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading temporary listings...
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
                Manage Temporary Listings
              </h1>

              <p className="mt-1 text-sm text-gray-600">
                Review, approve, reject and manage temporary
                listings.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/temporary-listings/add"
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
              No Temporary Listings Found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              There are currently no temporary listings to
              manage.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="relative"
              >
                <TemporaryListingCard
                  listing={listing}
                  showStatus
                  showActions
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />

                {/* Admin Actions */}

                <div className="mt-3 flex gap-2">
                  {listing.status !== "approved" && (
                    <button
                      type="button"
                      disabled={
                        actionLoading === listing._id
                      }
                      onClick={() =>
                        handleApprove(listing)
                      }
                      className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {actionLoading === listing._id
                        ? "Processing..."
                        : "Approve"}
                    </button>
                  )}

                  {listing.status !== "rejected" && (
                    <button
                      type="button"
                      disabled={
                        actionLoading === listing._id
                      }
                      onClick={() =>
                        handleReject(listing)
                      }
                      className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {actionLoading === listing._id
                        ? "Processing..."
                        : "Reject"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageTemporaryListings;