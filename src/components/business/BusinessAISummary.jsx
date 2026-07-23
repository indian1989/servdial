import { useMemo } from "react";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Star,
} from "lucide-react";

import BusinessSection from "./BusinessSection";
import BusinessSectionHeader from "./BusinessSectionHeader";

const BusinessAISummary = ({ business, reviews = [] }) => {
  const summary = useMemo(() => {
    // Future:
    // if (business.aiSummary) return business.aiSummary;

    if (!business) return null;

    if (!reviews.length) {
      return {
        text: `${business.name} is a ${business.categoryId?.name || "business"} located in ${
          business.city || "your city"
        }. Customer reviews are not available yet.`,
        sentiment: "neutral",
      };
    }

    let positive = 0;
    let negative = 0;

    reviews.forEach((review) => {
      const text = (review.comment || "").toLowerCase();

      if (
        /(excellent|great|good|best|professional|quick|fast|recommended|awesome|friendly|quality)/.test(
          text
        )
      ) {
        positive++;
      }

      if (
        /(bad|poor|worst|delay|late|expensive|rude|issue|problem|slow)/.test(
          text
        )
      ) {
        negative++;
      }
    });

    let sentiment = "neutral";

    if (positive > negative) sentiment = "positive";
    if (negative > positive) sentiment = "negative";

    let text;

    switch (sentiment) {
      case "positive":
        text =
          `Customers generally appreciate ${business.name} for its service quality, professionalism, and overall experience. The business has received mostly positive feedback from customers.`;
        break;

      case "negative":
        text =
          `Some customers have reported concerns regarding service experience. It is recommended to review recent customer feedback before making a decision.`;
        break;

      default:
        text =
          `Customer feedback for ${business.name} is currently mixed. Reviewing individual ratings and comments may help you make a better decision.`;
    }

    return {
      text,
      sentiment,
    };
  }, [business, reviews]);

  if (!summary) return null;

  return (
    <BusinessSection
className="
bg-gradient-to-r
from-blue-50
to-indigo-50
border
border-blue-100
">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles
          size={22}
          className="text-blue-600"
        />

        <h2 className="text-xl font-bold">
          AI Summary
        </h2>
      </div>

      <p className="text-gray-700 leading-7">
        {summary.text}
      </p>

      <div className="flex flex-wrap gap-3 mt-5">

        <span className="flex items-center gap-1 text-sm bg-white px-3 py-1 rounded-full">

          <Star size={15} />

          {business.averageRating || "New"} Rating

        </span>

        <span className="flex items-center gap-1 text-sm bg-white px-3 py-1 rounded-full">

          <TrendingUp size={15} />

          {business.totalReviews || 0} Reviews

        </span>

        {summary.sentiment === "positive" && (
          <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
            Positive Sentiment
          </span>
        )}

        {summary.sentiment === "neutral" && (
          <span className="bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded-full">
            Mixed Feedback
          </span>
        )}

        {summary.sentiment === "negative" && (
          <span className="flex items-center gap-1 bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full">
            <AlertTriangle size={14} />
            Needs Attention
          </span>
        )}

      </div>

      <p className="text-xs text-gray-500 mt-4">
        AI-generated summary based on available business information and customer reviews. Please verify important details before making a decision.
      </p>
    </BusinessSection>
  );
};

export default BusinessAISummary;