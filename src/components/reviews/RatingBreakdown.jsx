const RatingBreakdown = ({ reviews = [] }) => {
  // ======================================================
  // SAFETY
  // ======================================================
  const safeReviews = Array.isArray(reviews)
    ? reviews
    : [];

  const total = safeReviews.length;

  // ======================================================
  // STAR COUNTS
  // ======================================================
  const counts = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  for (const review of safeReviews) {
    const rating = Number(review?.rating);

    if (counts[rating] !== undefined) {
      counts[rating]++;
    }
  }

  // ======================================================
  // AVERAGE RATING
  // ======================================================
  const averageRating = total
    ? (
        safeReviews.reduce(
          (acc, r) => acc + (r.rating || 0),
          0
        ) / total
      ).toFixed(1)
    : "0.0";

  return (
    <div className="border p-4 rounded bg-white">
      {/* ======================================================
          HEADER
      ====================================================== */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg">
          Rating Breakdown
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {averageRating} average from{" "}
          {total} review
          {total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ======================================================
          EMPTY STATE
      ====================================================== */}
      {total === 0 && (
        <p className="text-sm text-gray-500">
          No ratings yet
        </p>
      )}

      {/* ======================================================
          BREAKDOWN
      ====================================================== */}
      {total > 0 &&
        [5, 4, 3, 2, 1].map((star) => {
          const count = counts[star];

          const percent = total
            ? (count / total) * 100
            : 0;

          return (
            <div
              key={star}
              className="flex items-center gap-3 mb-3"
            >
              {/* STAR */}
              <span className="w-10 text-sm">
                {star} ⭐
              </span>

              {/* BAR */}
              <div className="flex-1 bg-gray-200 h-2 rounded overflow-hidden">
                <div
                  style={{
                    width: `${percent}%`,
                  }}
                  className="bg-yellow-400 h-2 rounded"
                />
              </div>

              {/* COUNT */}
              <span className="text-sm text-gray-600 w-8 text-right">
                {count}
              </span>
            </div>
          );
        })}
    </div>
  );
};

export default RatingBreakdown;