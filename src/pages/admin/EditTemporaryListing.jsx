import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TemporaryListingForm from "../../components/temporaryListing/TemporaryListingForm";
import { getTemporaryListing } from "../../api/temporaryListingAPI";

const EditTemporaryListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getTemporaryListing(id);

        setListing(response?.data || response);
      } catch (err) {
        console.error(
          "Failed to load temporary listing:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Failed to load temporary listing."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  const handleSuccess = () => {
    navigate("/admin/temporary-listings");
  };

  const handleCancel = () => {
    navigate("/admin/temporary-listings");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg border bg-white p-6 text-center">
          Loading temporary listing...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/temporary-listings")
          }
          className="mt-4 rounded-lg border px-5 py-2"
        >
          Back to Temporary Listings
        </button>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg border bg-white p-6 text-center">
          Temporary listing not found.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Edit Temporary Listing
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Update temporary listing details as an admin.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <TemporaryListingForm
          initialData={listing}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default EditTemporaryListing;