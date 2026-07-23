import {
  BadgeCheck,
  Star,
  Users,
  Eye,
  Clock,
  MapPin,
} from "lucide-react";

import BusinessSection from "./BusinessSection";
import BusinessSectionHeader from "./BusinessSectionHeader";

const BusinessInsight = ({ business }) => {
  const insights = [];

  if (business?.isVerified)
    insights.push({
      icon: BadgeCheck,
      text: "Verified Business",
      color: "text-green-600",
    });

  if (business?.averageRating >= 4)
    insights.push({
      icon: Star,
      text: `${business.averageRating} Rating`,
      color: "text-yellow-500",
    });

  if (business?.views > 100)
    insights.push({
      icon: Eye,
      text: `${business.views}+ Views`,
      color: "text-blue-600",
    });

  if (business?.totalReviews > 0)
    insights.push({
      icon: Users,
      text: `${business.totalReviews} Customer Reviews`,
      color: "text-purple-600",
    });

  if (business?.openingHours)
    insights.push({
      icon: Clock,
      text: "Opening Hours Available",
      color: "text-orange-600",
    });

  if (business?.city)
    insights.push({
      icon: MapPin,
      text: business.city,
      color: "text-red-500",
    });

  if (!insights.length) return null;

  return (
    <BusinessSection>

      <h2 className="text-xl font-bold mb-5">
        Business Insights
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {insights.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="border rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition"
            >
              <Icon
                className={item.color}
                size={22}
              />

              <span className="font-medium">
                {item.text}
              </span>
            </div>
          );
        })}

      </div>

    </BusinessSection>
  );
};

export default BusinessInsight;