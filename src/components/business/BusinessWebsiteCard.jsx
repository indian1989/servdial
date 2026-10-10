import { Globe } from "lucide-react";
import { trackBusinessFunnelEvent } from "../../services/visitorAnalyticsService";

const BusinessWebsiteCard = ({ business }) => {

  const website =
    typeof business?.website === "string"
      ? business.website.trim()
      : "";

  if (!website) {
    return null;
  }

  const websiteUrl = /^https?:\/\//i.test(website)
    ? website
    : `https://${website}`;

  const displayWebsite = website
    .replace(/^https?:\/\//i, "")
    .replace(/\/$/, "");

  return (
    <div
  id="website"
  className="
    bg-white
    rounded-2xl
    border
    p-5
    shadow-sm
  "
>
      <div className="flex items-start gap-3">

        <Globe
          className="text-blue-600 mt-1 flex-shrink-0"
          size={22}
        />

        <div className="min-w-0">

          <h2
            className="
              text-lg
              font-semibold
              text-gray-900
            "
          >
            Website
          </h2>

          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
                void trackBusinessFunnelEvent({
                    event: "website_click",
                    businessId: business?._id,
                    path: window.location.pathname + window.location.search,
                });
                }}
            className="
              inline-block
              mt-2
              text-blue-600
              hover:text-blue-800
              hover:underline
              break-all
            "
          >
            {displayWebsite}
          </a>

        </div>

      </div>
    </div>
  );
};

export default BusinessWebsiteCard;