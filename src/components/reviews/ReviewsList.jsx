import { useState } from "react";

const ReviewsList = ({ reviews = [] }) => {
  const [page, setPage] = useState(1);

  const perPage = 5;

  // ======================================================
  // PAGINATION
  // ======================================================
  const start = (page - 1) * perPage;

  const paginated = reviews.slice(
    start,
    start + perPage
  );

  // ======================================================
  // EMPTY STATE
  // ======================================================
  if (!reviews.length) {
    return (
      <div className="mt-6 text-sm text-gray-500">
        No reviews yet
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* ======================================================
          REVIEW ITEMS
      ====================================================== */}
      {paginated.map((review) => (
        <div
          key={review._id}
          className="border p-4 rounded mb-4 bg-white"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">
                {review.name || "Anonymous"}

                {review.isVerified && (
                  <span className="ml-2 text-green-600 text-xs">
                    ✓ Verified
                  </span>
                )}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(
                  review.createdAt
                ).toLocaleDateString()}
              </p>
            </div>

            {/* RATING */}
            <div className="text-yellow-500 text-sm">
              {"⭐".repeat(review.rating || 0)}
            </div>
          </div>

          {/* COMMENT */}
          {review.comment && (
            <p className="text-gray-600 text-sm mt-3 whitespace-pre-line">
              {review.comment}
            </p>
          )}

          {/* FOOTER */}
          <div className="mt-3 text-xs text-gray-400">
            Helpful votes:{" "}
            {review.helpfulCount || 0}
          </div>
        </div>
      ))}

      {/* ======================================================
          PAGINATION
      ====================================================== */}
      {reviews.length > perPage && (
        <div className="flex gap-2 flex-wrap mt-4">
          {Array.from({
            length: Math.ceil(
              reviews.length / perPage
            ),
          }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded text-sm ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;