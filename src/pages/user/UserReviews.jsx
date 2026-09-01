import React, { useEffect, useState } from "react";
import {
  FaStar,
  FaRegStar,
  FaCheckCircle,
  FaCommentAlt,
  FaMapMarkerAlt,
  FaArrowRight,
  FaExclamationCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import API from "../../api/axios";
import Loader from "../../components/common/Loader";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     FETCH MY REVIEWS
  ===================================================== */

  const fetchMyReviews = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/reviews/my-reviews");

      setReviews(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch user reviews:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load your reviews. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReviews();
  }, []);

  /* =====================================================
     RATING
  ===================================================== */

  const renderStars = (rating) => {
    const value = Number(rating) || 0;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) =>
          star <= value ? (
            <FaStar
              key={star}
              className="text-yellow-400 text-sm"
            />
          ) : (
            <FaRegStar
              key={star}
              className="text-gray-300 text-sm"
            />
          )
        )}
      </div>
    );
  };

  /* =====================================================
     DATE
  ===================================================== */

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Date unavailable";
    }
  };

  /* =====================================================
     BUSINESS LINK
  ===================================================== */

  const getBusinessLink = (business) => {
    if (!business?.slug) return null;

    if (business?.citySlug) {
      return `/${business.citySlug}/${business.slug}`;
    }

    return null;
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <Loader />
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-white border rounded-2xl shadow-sm p-8 text-center">

          <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
            <FaExclamationCircle className="text-2xl" />
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Unable to Load Reviews
          </h2>

          <p className="text-sm text-gray-500 mb-5">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchMyReviews}
            className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="p-4 md:p-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center">
            <FaStar className="text-xl" />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              My Reviews
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              View the reviews you have shared with businesses
            </p>
          </div>

        </div>

      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="bg-white border rounded-2xl shadow-sm p-5 mb-6">

        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <FaCommentAlt />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Reviews
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {reviews.length}
              </p>
            </div>

          </div>

          <div className="text-right">
            <p className="text-xs text-gray-400">
              Your contribution
            </p>

            <p className="text-sm font-medium text-gray-700">
              Helping customers discover better businesses
            </p>
          </div>

        </div>

      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {reviews.length === 0 && (
        <div className="bg-white border rounded-2xl shadow-sm p-10 text-center">

          <div className="w-16 h-16 rounded-2xl bg-yellow-100 text-yellow-500 flex items-center justify-center mx-auto mb-4">
            <FaStar className="text-2xl" />
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            You Haven't Written Any Reviews Yet
          </h2>

          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Reviews you submit for businesses will appear here.
            Share your experience to help other customers make
            better decisions.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-5 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
          >
            Discover Businesses
            <FaArrowRight />
          </Link>

        </div>
      )}

      {/* =================================================
          REVIEW LIST
      ================================================= */}

      {reviews.length > 0 && (
        <div className="grid gap-5">

          {reviews.map((review) => {
            const business = review?.businessId;
            const businessLink = getBusinessLink(business);

            return (
              <div
                key={review._id}
                className="bg-white border rounded-2xl shadow-sm p-5 hover:shadow-md transition"
              >

                {/* BUSINESS HEADER */}

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                  <div>

                    <div className="flex items-center gap-2 flex-wrap">

                      {businessLink ? (
                        <Link
                          to={businessLink}
                          className="text-lg md:text-xl font-bold text-gray-900 hover:text-orange-600 transition"
                        >
                          {business?.name || "Business"}
                        </Link>
                      ) : (
                        <h2 className="text-lg md:text-xl font-bold text-gray-900">
                          {business?.name || "Business"}
                        </h2>
                      )}

                      {review.isVerified && (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          <FaCheckCircle />
                          Verified
                        </span>
                      )}

                    </div>

                    {business?.cityName && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>{business.cityName}</span>
                      </div>
                    )}

                  </div>

                  <div className="text-sm text-gray-400">
                    {formatDate(review.createdAt)}
                  </div>

                </div>

                {/* RATING */}

                <div className="flex items-center gap-3 mt-4">

                  {renderStars(review.rating)}

                  <span className="text-sm font-semibold text-gray-700">
                    {Number(review.rating || 0).toFixed(1)}
                  </span>

                </div>

                {/* COMMENT */}

                {review.comment ? (
                  <div className="mt-4 bg-gray-50 border rounded-xl p-4">

                    <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                      {review.comment}
                    </p>

                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic mt-4">
                    No written comment was added to this review.
                  </p>
                )}

                {/* ACTION */}

                {businessLink && (
                  <div className="mt-4 pt-4 border-t">

                    <Link
                      to={businessLink}
                      className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline"
                    >
                      View Business
                      <FaArrowRight />
                    </Link>

                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default UserReviews;