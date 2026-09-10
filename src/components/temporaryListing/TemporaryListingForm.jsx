import React, { useState } from "react";
import {
  createTemporaryListing,
  updateTemporaryListing,
} from "../../api/temporaryListingAPI";

const TemporaryListingForm = ({
  initialData = null,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    listingType: "Temporary Listing",
    title: initialData?.title || "",
    category: initialData?.category || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    pincode: initialData?.pincode || "",
    phone: initialData?.phone || "",
    landline: initialData?.landline || "",
    whatsapp: initialData?.whatsapp || "",
    expiryDate: initialData?.expiryDate
      ? initialData.expiryDate.substring(0, 10)
      : "",
    images: initialData?.images || [],
    metadata: initialData?.metadata || {},
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (
      !formData.phone.trim() &&
      !formData.landline.trim()
    ) {
      setError(
        "Mobile number or landline number is required."
      );
      return;
    }

    if (!formData.expiryDate) {
      setError("Expiry date is required.");
      return;
    }

    const selectedDate = new Date(formData.expiryDate);
    const today = new Date();

    if (selectedDate <= today) {
      setError("Expiry date must be in the future.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,

        // Always fixed by frontend.
        listingType: "Temporary Listing",

        price:
          formData.price === ""
            ? null
            : Number(formData.price),

        images: formData.images,
        metadata: formData.metadata,
      };

      let response;

      if (initialData?._id) {
        response = await updateTemporaryListing(
          initialData._id,
          payload
        );
      } else {
        response = await createTemporaryListing(payload);
      }

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      console.error(
        "Temporary Listing Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to save temporary listing."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Listing Type */}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Listing Type
        </label>

        <input
          type="text"
          value="Temporary Listing"
          readOnly
          className="w-full rounded-lg border bg-gray-100 px-3 py-2 text-gray-600"
        />
      </div>

      {/* Title */}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Title *
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter temporary listing title"
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      {/* Category */}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Category
        </label>

        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Enter category"
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      {/* Description */}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          placeholder="Enter description"
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      {/* Price */}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Price
        </label>

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          placeholder="Enter price"
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      {/* Location */}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            City
          </label>

          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            State
          </label>

          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Pincode
          </label>

          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            maxLength={6}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
      </div>

      {/* Contact */}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Mobile Number
          </label>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Mobile number"
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Landline Number
          </label>

          <input
            type="tel"
            name="landline"
            value={formData.landline}
            onChange={handleChange}
            placeholder="Landline number"
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            WhatsApp Number
          </label>

          <input
            type="tel"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="WhatsApp number"
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
      </div>

      {/* Expiry */}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Expiry Date *
        </label>

        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
          required
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      {/* Actions */}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : initialData?._id
            ? "Update Temporary Listing"
            : "Create Temporary Listing"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border px-5 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TemporaryListingForm;