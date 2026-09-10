// frontend/src/components/temporaryListing/TemporaryListingCard.jsx

import React from "react";
import { Link } from "react-router-dom";

const TemporaryListingCard = ({
  listing,
  showStatus = false,
  showActions = false,
  onEdit,
  onDelete,
}) => {
  if (!listing) return null;

  const {
    _id,
    title,
    category,
    description,
    price,
    city,
    state,
    pincode,
    phone,
    landline,
    whatsapp,
    images = [],
    expiryDate,
    status,
  } = listing;

  const formatDate = (date) => {
    if (!date) return "Not publicly available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getContactNumber = () => {
    if (phone) return phone;
    if (landline) return landline;
    return "Not publicly available";
  };

  return (
    <article className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
      {/* Image */}

      {images?.length > 0 ? (
        <img
          src={images[0]}
          alt={title || "Temporary Listing"}
          className="h-48 w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-gray-100 text-sm text-gray-500">
          No Image Available
        </div>
      )}

      {/* Content */}

      <div className="p-4">
        {/* Listing Type */}

        <div className="mb-2">
          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            Temporary Listing
          </span>
        </div>

        {/* Title */}

        <h2 className="line-clamp-2 text-lg font-semibold text-gray-900">
          {title}
        </h2>

        {/* Category */}

        {category && (
          <p className="mt-1 text-sm text-gray-500">
            {category}
          </p>
        )}

        {/* Location */}

        {(city || state || pincode) && (
          <p className="mt-2 text-sm text-gray-600">
            {[city, state, pincode]
              .filter(Boolean)
              .join(", ")}
          </p>
        )}

        {/* Description */}

        {description && (
          <p className="mt-3 line-clamp-3 text-sm text-gray-600">
            {description}
          </p>
        )}

        {/* Price */}

        {price !== null &&
          price !== undefined &&
          price !== "" && (
            <p className="mt-3 text-base font-semibold text-gray-900">
              ₹{Number(price).toLocaleString("en-IN")}
            </p>
          )}

        {/* Contact */}

        <div className="mt-3 space-y-1 text-sm">
          <p>
            <span className="font-medium">
              Contact:
            </span>{" "}
            {getContactNumber()}
          </p>

          {whatsapp && (
            <p>
              <span className="font-medium">
                WhatsApp:
              </span>{" "}
              {whatsapp}
            </p>
          )}
        </div>

        {/* Expiry */}

        <p className="mt-3 text-xs text-gray-500">
          Valid until: {formatDate(expiryDate)}
        </p>

        {/* Status */}

        {showStatus && status && (
          <div className="mt-3">
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${
                status === "approved"
                  ? "bg-green-50 text-green-600"
                  : status === "rejected"
                  ? "bg-red-50 text-red-600"
                  : status === "expired"
                  ? "bg-gray-100 text-gray-600"
                  : "bg-yellow-50 text-yellow-600"
              }`}
            >
              {status}
            </span>
          </div>
        )}

        {/* Actions */}

        {showActions ? (
          <div className="mt-4 flex gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(listing)}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Edit
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(listing)}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            )}
          </div>
        ) : (
          <Link
            to={`/temporary-listings/${_id}`}
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            View Listing
          </Link>
        )}
      </div>
    </article>
  );
};

export default TemporaryListingCard;