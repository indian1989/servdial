import { useMemo, useState } from "react";

const generateFingerprint = () => {
  return btoa(
    [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    ].join("|")
  );
};

const ReviewForm = ({
  user,
  onSubmitAttempt,
  loading = false,
}) => {
  const [rating, setRating] = useState(0);

  const [comment, setComment] = useState("");

  const [guestName, setGuestName] = useState("");

  // ======================================================
  // STABLE DEVICE FINGERPRINT
  // ======================================================
  const fingerprint = useMemo(() => {
    return generateFingerprint();
  }, []);

  // ======================================================
  // SUBMIT
  // ======================================================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!rating) {
      alert("Please select rating");
      return;
    }

    const finalName =
      user?.name || guestName.trim();

    if (!finalName) {
      alert("Please enter your name");
      return;
    }

    const reviewData = {
      rating,
      comment: comment.trim(),

      name: finalName,

      fingerprint,
    };

    // 🚀 parent handles auth/API logic
    onSubmitAttempt(reviewData);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6">
      <h2 className="font-semibold mb-3">
        Write a Review
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* ======================================================
            GUEST NAME
        ====================================================== */}
        {!user && (
          <input
            type="text"
            value={guestName}
            onChange={(e) =>
              setGuestName(e.target.value)
            }
            placeholder="Your name"
            maxLength={120}
            className="w-full border p-2 rounded"
          />
        )}

        {/* ======================================================
            STAR RATING
        ====================================================== */}
        <div className="flex gap-2 text-2xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              className={
                star <= rating
                  ? "text-yellow-400"
                  : "text-gray-300"
              }
            >
              ★
            </button>
          ))}
        </div>

        {/* ======================================================
            COMMENT
        ====================================================== */}
        <textarea
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
          placeholder="Share your experience..."
          maxLength={2000}
          className="w-full border p-2 rounded h-24"
        />

        <div className="text-xs text-gray-400 text-right">
          {comment.length}/2000
        </div>

        {/* ======================================================
            SUBMIT
        ====================================================== */}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white w-full py-2 rounded disabled:opacity-50"
        >
          {loading
            ? "Submitting..."
            : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;