// frontend/src/components/temporaryListing/TemporaryListingList.jsx

import React, { useEffect, useState } from "react";
import TemporaryListingCard from "./TemporaryListingCard";

import {
  getPublicTemporaryListings,
  getProviderTemporaryListings,
  getAllTemporaryListings,
} from "../../api/temporaryListingAPI";

const TemporaryListingList = ({
  type = "public",
  params = {},
  showStatus = false,
  showActions = false,
  onEdit,
  onDelete,
}) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchListings = async () => {
      try {
        setLoading(true);
        setError("");

        let response;

        if (type === "provider") {
          response = await getProviderTemporaryListings();
        } else if (type === "admin") {
          response = await getAllTemporaryListings(params);
        } else {
          response = await getPublicTemporaryListings(params);
        }

        if (!mounted) return;

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
          "Temporary Listings Fetch Error:",
          err
        );

        if (mounted) {
          setError(
            err?.response?.data?.message ||
              "Failed to load temporary listings."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchListings();

    return () => {
      mounted = false;
    };
  }, [type, JSON.stringify(params)]);

  // Loading

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading temporary listings...
        </p>
      </div>
    );
  }

  // Error

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  // Empty

  if (!listings.length) {
    return (
      <div className="rounded-xl border bg-white px-6 py-10 text-center">
        <h3 className="text-lg font-semibold text-gray-800">
          No Temporary Listings Found
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          There are currently no temporary listings
          available.
        </p>
      </div>
    );
  }

  // Listings

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <TemporaryListingCard
          key={listing._id}
          listing={listing}
          showStatus={showStatus}
          showActions={showActions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TemporaryListingList;