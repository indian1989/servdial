// frontend/src/pages/TemporaryListingDetails.jsx

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTemporaryListing } from "../api/temporaryListingAPI";

const TemporaryListingDetails = () => {
  const { id } = useParams();

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
          "Temporary Listing Details Error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Temporary listing not found."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "Not publicly available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">
          Loading temporary listing...
        </p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Temporary Listing Not Found
        </h1>

        <p className="mt-2 text-gray-500">
          {error ||
            "This temporary listing is no longer available."}
        </p>

        <Link
          to="/temporary-listings"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Back to Temporary Listings
        </Link>
      </div>
    );
  }

  const {
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
  } = listing;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}

      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="text-sm text-gray-500">
            <Link
              to="/"
              className="hover:text-blue-600"
            >
              Home
            </Link>

            <span className="mx-2">›</span>

            <Link
              to="/temporary-listings"
              className="hover:text-blue-600"
            >
              Temporary Listings
            </Link>

            <span className="mx-2">›</span>

            <span className="text-gray-700">
              {title}
            </span>
          </div>
        </div>
      </div>

      {/* Main */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}

          <div className="space-y-6 lg:col-span-2">
            {/* Images */}

            {images.length > 0 ? (
              <div className="overflow-hidden rounded-xl border bg-white">
                <img
                  src={images[0]}
                  alt={title || "Temporary Listing"}
                  className="h-72 w-full object-cover sm:h-96"
                />

                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 p-2">
                    {images.slice(1, 5).map(
                      (image, index) => (
                        <img
                          key={`${image}-${index}`}
                          src={image}
                          alt={`${title} ${index + 2}`}
                          className="h-20 w-full rounded-lg object-cover"
                          loading="lazy"
                        />
                      )
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-72 items-center justify-center rounded-xl border bg-white text-gray-500 sm:h-96">
                No Image Available
              </div>
            )}

            {/* Information */}

            <section className="rounded-xl border bg-white p-6">
              <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                Temporary Listing
              </span>

              <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                {title}
              </h1>

              {category && (
                <p className="mt-2 text-sm font-medium text-gray-500">
                  {category}
                </p>
              )}

              {description && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Description
                  </h2>

                  <p className="mt-2 whitespace-pre-line leading-7 text-gray-600">
                    {description}
                  </p>
                </div>
              )}

              {price !== null &&
                price !== undefined &&
                price !== "" && (
                  <div className="mt-6">
                    <h2 className="text-sm font-medium text-gray-500">
                      Price
                    </h2>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      ₹
                      {Number(price).toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                )}
            </section>
          </div>

          {/* Sidebar */}

          <aside className="space-y-6">
            {/* Contact */}

            <section className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Contact Information
              </h2>

              <div className="mt-4 space-y-4">
                {phone && (
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">
                      Mobile
                    </p>

                    <a
                      href={`tel:${phone}`}
                      className="mt-1 block font-medium text-blue-600 hover:underline"
                    >
                      {phone}
                    </a>
                  </div>
                )}

                {landline && (
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">
                      Landline
                    </p>

                    <a
                      href={`tel:${landline}`}
                      className="mt-1 block font-medium text-blue-600 hover:underline"
                    >
                      {landline}
                    </a>
                  </div>
                )}

                {whatsapp && (
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">
                      WhatsApp
                    </p>

                    <a
                      href={`https://wa.me/${whatsapp.replace(
                        /\D/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block font-medium text-green-600 hover:underline"
                    >
                      {whatsapp}
                    </a>
                  </div>
                )}
              </div>
            </section>

            {/* Location */}

            <section className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Location
              </h2>

              <p className="mt-3 leading-6 text-gray-600">
                {[city, state, pincode]
                  .filter(Boolean)
                  .join(", ") ||
                  "Not publicly available"}
              </p>
            </section>

            {/* Expiry */}

            <section className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Listing Validity
              </h2>

              <p className="mt-3 text-sm text-gray-600">
                Valid until
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {formatDate(expiryDate)}
              </p>
            </section>

            <Link
              to="/temporary-listings"
              className="block rounded-lg border bg-white px-5 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              ← Back to Temporary Listings
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default TemporaryListingDetails;