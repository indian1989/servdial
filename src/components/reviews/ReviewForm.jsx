// src/components/reviews/ReviewForm.jsx

import { useState } from "react";

const ReviewForm = ({ user, onSubmitAttempt }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!rating) {
      alert("Please select rating");
      return;
    }

    const reviewData = {
      rating,
      comment
    };

    // 🚀 ONLY HAND OFF TO PARENT (NO API, NO AUTH LOGIC HERE)
    onSubmitAttempt(reviewData);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6">
      <h2 className="font-semibold mb-3">Write a Review</h2>

      <form onSubmit={handleSubmit} className="space-y-3">

        {/* STAR RATING */}
        <div className="flex gap-2 text-2xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              className={star <= rating ? "text-yellow-400" : "text-gray-300"}
            >
              ★
            </button>
          ))}
        </div>

        {/* COMMENT */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          className="w-full border p-2 rounded h-24"
        />

        {/* SUBMIT */}
        <button
          type="submit"
          className="bg-black text-white w-full py-2 rounded"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;