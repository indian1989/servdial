// frontend/src/pages/provider/AddTemporaryListing.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import TemporaryListingForm from "../../components/temporaryListing/TemporaryListingForm";

const AddTemporaryListing = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/provider/temporary-listings");
  };

  const handleCancel = () => {
    navigate("/provider/temporary-listings");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Add Temporary Listing
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Create a temporary listing with an expiry date.
          </p>
        </div>

        {/* Form */}

        <div className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">
          <TemporaryListingForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default AddTemporaryListing;