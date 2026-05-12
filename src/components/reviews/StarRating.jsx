import { useState } from "react";

const StarRating = ({
  rating = 0,
  setRating = () => {},
  readOnly = false,
}) => {
  const [hover, setHover] = useState(null);

  // ======================================================
  // KEYBOARD SUPPORT
  // ======================================================
  const handleKeyDown = (e, star) => {
    if (readOnly) return;

    if (e.key === "Enter" || e.key === " ") {
      setRating(star);
    }
  };

  return (
    <div
      className="flex gap-1"
      role="radiogroup"
      aria-label="Star Rating"
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const active = (hover || rating) >= star;

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            className={`text-2xl transition ${
              active
                ? "text-yellow-500"
                : "text-gray-300"
            } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
            onClick={() =>
              !readOnly && setRating(star)
            }
            onMouseEnter={() =>
              !readOnly && setHover(star)
            }
            onMouseLeave={() =>
              !readOnly && setHover(null)
            }
            onKeyDown={(e) =>
              handleKeyDown(e, star)
            }
            aria-label={`${star} star`}
            aria-checked={rating === star}
            role="radio"
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;