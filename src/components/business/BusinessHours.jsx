import {
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

import BusinessSection from "./BusinessSection";
import BusinessSectionHeader from "./BusinessSectionHeader";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const formatDay = (day) =>
  day.charAt(0).toUpperCase() + day.slice(1);

const formatTime = (time) => {
  if (!time) return "";

  const [hour, minute] = time.split(":");

  const h = Number(hour);

  const suffix = h >= 12 ? "PM" : "AM";

  return `${h % 12 || 12}:${minute} ${suffix}`;
};

const BusinessHours = ({ hours }) => {
  const hasHours = days.some((day) => {
  const item = hours?.[day];

  return (
    item?.closed ||
    item?.is24h ||
    (item?.open && item?.close)
  );
});

if (!hasHours) return null;

  const now = new Date();

  const currentDay =
    days[now.getDay() === 0 ? 6 : now.getDay() - 1];

  const today = hours[currentDay];

  // =========================
  // Open Status
  // =========================

  const openNow = (() => {
    if (!today || today.closed) return false;

    if (today.is24h) return true;

    const current =
      now.getHours() * 60 +
      now.getMinutes();

    const open = today.open?.split(":");
    const close = today.close?.split(":");

    if (!open || !close) return false;

    const openMin =
      Number(open[0]) * 60 +
      Number(open[1]);

    const closeMin =
      Number(close[0]) * 60 +
      Number(close[1]);

    return (
      current >= openMin &&
      current <= closeMin
    );
  })();

  return (
    <BusinessSection id="hours">

      <BusinessSectionHeader
        icon={Clock}
        title="Business Hours"
        action={
          openNow ? (
            <div
              className="
                flex
                items-center
                gap-1
                bg-green-50
                text-green-700
                px-3
                py-1
                rounded-full
                text-sm
                font-semibold
              "
            >
              <CheckCircle size={16} />

              Open Now
            </div>
          ) : (
            <div
              className="
                flex
                items-center
                gap-1
                bg-red-50
                text-red-700
                px-3
                py-1
                rounded-full
                text-sm
                font-semibold
              "
            >
              <XCircle size={16} />

              Closed Now
            </div>
          )
        }
      />

      <div className="space-y-2">

        {days.map((day, index) => {
          const item = hours[day];

          return (
            <div
              key={day}
              className={`
                flex
                justify-between
                items-center
                text-sm
                px-2
                py-2
                rounded-lg
                transition
                hover:bg-gray-50
                ${
                  index !== days.length - 1
                    ? "border-b"
                    : ""
                }
              `}
            >
              <span
                className="
                  font-medium
                  capitalize
                  text-gray-800
                "
              >
                {formatDay(day)}
              </span>

              <span
                className={
                  item?.closed
                    ? "text-red-500 font-medium"
                    : "text-gray-600"
                }
              >
                {item?.closed
                  ? "Closed"
                  : item?.is24h
                  ? "24 Hours"
                  : `${formatTime(
                      item?.open
                    )} - ${formatTime(
                      item?.close
                    )}`}
              </span>
            </div>
          );
        })}

      </div>

    </BusinessSection>
  );
};

export default BusinessHours;