import { useEffect, useRef, useState } from "react";
import {
  IndianRupee,
  Tag,
  Sparkles,
  Clock3,
} from "lucide-react";

const UNIT_LABELS = {
  per_visit: "Visit",
  per_service: "Service",
  per_job: "Job",
  per_hour: "Hour",
  per_day: "Day",
  per_month: "Month",
  per_piece: "Piece",
  per_item: "Item",
  per_set: "Set",
  per_unit: "Unit",
  per_sq_ft: "Sq. Ft.",
  per_sq_meter: "Sq. Meter",
  per_kg: "Kg",
  per_km: "Km",
  per_person: "Person",
  per_room: "Room",
  per_session: "Session",
  per_consultation: "Consultation",
  per_appointment: "Appointment",
  per_project: "Project",
};

const ServicePricing = ({ pricing = [] }) => {
  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  if (!Array.isArray(pricing) || pricing.length === 0) {
    return null;
  }

  // =========================================================
  // DISCOUNT
  // =========================================================

  const getDiscount = (originalPrice, price) => {
    const original = Number(originalPrice);
    const current = Number(price);

    if (
      !Number.isFinite(original) ||
      !Number.isFinite(current) ||
      original <= 0 ||
      current <= 0 ||
      original <= current
    ) {
      return null;
    }

    return Math.round(
      ((original - current) / original) * 100
    );
  };

  // =========================================================
  // PRICE FORMAT
  // =========================================================

  const formatPrice = (value) => {
    return Number(value).toLocaleString("en-IN");
  };

  // =========================================================
  // UNIT DISPLAY
  // =========================================================

  const getUnitLabel = (item) => {
    if (item?.pricingUnit === "custom") {
      return item?.customPricingUnit?.trim() || null;
    }

    return UNIT_LABELS[item?.pricingUnit] || null;
  };

    // =========================================================
  // PRICING CAROUSEL
  // =========================================================

  const scrollPricing = (direction = 1) => {
    const slider = sliderRef.current;

    if (!slider) return;

    const firstCard = slider.children?.[0];

    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;

    const styles = window.getComputedStyle(slider);
    const gap = parseFloat(styles.columnGap || styles.gap || "0");

    const step = cardWidth + gap;

    const maxScroll =
      slider.scrollWidth - slider.clientWidth;

    if (maxScroll <= 0) return;

    if (direction > 0) {
      if (slider.scrollLeft >= maxScroll - 5) {
        slider.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        slider.scrollBy({
          left: step,
          behavior: "smooth",
        });
      }
    } else {
      if (slider.scrollLeft <= 5) {
        slider.scrollTo({
          left: maxScroll,
          behavior: "smooth",
        });
      } else {
        slider.scrollBy({
          left: -step,
          behavior: "smooth",
        });
      }
    }
  };

  // =========================================================
  // AUTO SLIDE
  // =========================================================

  useEffect(() => {
    if (pricing.length <= 1 || isPaused) {
      return;
    }

    const interval = setInterval(() => {
      scrollPricing(1);
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [pricing.length, isPaused]);

  return (
    <section
      id="pricing"
      className="
        bg-white
        rounded-2xl
        border border-gray-200
        shadow-sm
        overflow-hidden
      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          px-5
          py-4
          sm:px-6
          sm:py-5
          border-b
          border-gray-200
        "
      >
        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-green-50
                border border-green-100
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <IndianRupee
                size={20}
                className="text-green-600"
              />
            </div>

            <div>

              <h2
                className="
                  text-xl
                  sm:text-2xl
                  font-bold
                  text-gray-900
                "
              >
                Service Pricing
              </h2>

              <p className="text-sm text-gray-500 mt-0.5">
                Service rates and starting prices
              </p>

            </div>

          </div>

          <div
            className="
              hidden
              sm:flex
              items-center
              gap-2
              px-3
              py-2
              rounded-lg
              bg-gray-50
              border border-gray-100
              text-sm
              text-gray-600
            "
          >
            <span className="font-semibold text-gray-900">
              {pricing.length}
            </span>

            <span>
              {pricing.length === 1
                ? "Service"
                : "Services"}
            </span>
          </div>

        </div>
      </div>

        {/* =====================================================
          RESPONSIVE PRICING CAROUSEL

          Desktop : 3 cards
          Tablet  : 2 cards
          Mobile  : 1 card
          Auto    : 4 seconds
      ===================================================== */}

      <div
        className="relative p-3 sm:p-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >

        {/* ===================================================
            PREVIOUS BUTTON
        =================================================== */}

        {pricing.length > 1 && (
          <button
            type="button"
            onClick={() => scrollPricing(-1)}
            aria-label="Previous pricing"
            className="
              absolute
              left-1
              sm:left-2
              top-1/2
              -translate-y-1/2
              z-20
              w-9
              h-9
              sm:w-10
              sm:h-10
              rounded-full
              bg-white
              border
              border-gray-200
              shadow-md
              flex
              items-center
              justify-center
              text-xl
              text-gray-700
              hover:bg-gray-50
              hover:shadow-lg
              transition
            "
          >
            ‹
          </button>
        )}

        {/* ===================================================
            NEXT BUTTON
        =================================================== */}

        {pricing.length > 1 && (
          <button
            type="button"
            onClick={() => scrollPricing(1)}
            aria-label="Next pricing"
            className="
              absolute
              right-1
              sm:right-2
              top-1/2
              -translate-y-1/2
              z-20
              w-9
              h-9
              sm:w-10
              sm:h-10
              rounded-full
              bg-white
              border
              border-gray-200
              shadow-md
              flex
              items-center
              justify-center
              text-xl
              text-gray-700
              hover:bg-gray-50
              hover:shadow-lg
              transition
            "
          >
            ›
          </button>
        )}

        {/* ===================================================
            SLIDER
        =================================================== */}

        <div
          ref={sliderRef}
          className="
            flex
            gap-3
            overflow-x-auto
            scroll-smooth
            snap-x
            snap-mandatory
            px-1
            pb-2
          "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >

          {pricing.map((item, index) => {

            const price = Number(item?.price);

            const originalPrice = Number(
              item?.originalPrice ||
              item?.regularPrice ||
              item?.oldPrice ||
              0
            );

            const discount = getDiscount(
              originalPrice,
              price
            );

            const hasDiscount = Boolean(discount);

            const priceOnRequest =
              item?.priceOnRequest === true ||
              item?.price === null ||
              item?.price === undefined ||
              item?.price === "" ||
              !Number.isFinite(price);

            const unit = getUnitLabel(item);

            return (
              <div
                key={item?._id || index}
                className="
                  shrink-0
                  snap-start
                  basis-full
                  md:basis-[calc(50%_-_6px)]
                  xl:basis-[calc(33.333333%_-_8px)]
                "
              >

                {/* =================================================
                    EXISTING PRICING CARD
                ================================================= */}

                <div
                  className="
                    h-full
                    rounded-xl
                    border border-gray-200
                    bg-white
                    overflow-hidden
                    hover:border-gray-300
                    hover:shadow-sm
                    transition
                  "
                >

                  {/* SERVICE */}

                  <div className="p-4">

                    <div className="flex items-start gap-3">

                      <div
                        className="
                          w-8
                          h-8
                          rounded-lg
                          bg-blue-50
                          text-blue-600
                          flex
                          items-center
                          justify-center
                          shrink-0
                          text-xs
                          font-bold
                        "
                      >
                        {index + 1}
                      </div>

                      <div className="min-w-0">

                        <h3
                          className="
                            text-sm
                            font-semibold
                            text-gray-900
                            leading-5
                          "
                        >
                          {item?.name || "Service"}
                        </h3>

                        {item?.description ? (
                          <p
                            className="
                              mt-1
                              text-xs
                              text-gray-500
                              leading-5
                              line-clamp-2
                            "
                          >
                            {item.description}
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-gray-400">
                            Service details available on request
                          </p>
                        )}

                      </div>

                    </div>

                  </div>

                  {/* PRICING */}

                  <div className="border-t border-gray-100">

                    <div className="grid grid-cols-2 divide-x divide-gray-100">

                      {/* ORIGINAL PRICE */}

                      <div className="p-3">

                        <div
                          className="
                            text-[10px]
                            uppercase
                            tracking-wide
                            font-semibold
                            text-gray-400
                            mb-1
                          "
                        >
                          Original Price
                        </div>

                        {originalPrice > 0 ? (

                          <div>

                            <div
                              className={`
                                text-sm
                                font-semibold
                                whitespace-nowrap
                                ${
                                  hasDiscount
                                    ? "text-gray-400 line-through"
                                    : "text-gray-800"
                                }
                              `}
                            >
                              ₹{formatPrice(originalPrice)}
                            </div>

                            {hasDiscount && (
                              <span
                                className="
                                  inline-flex
                                  items-center
                                  gap-1
                                  mt-1
                                  px-1.5
                                  py-0.5
                                  rounded-md
                                  bg-red-50
                                  text-red-600
                                  text-[9px]
                                  font-bold
                                "
                              >
                                <Tag size={9} />
                                {discount}% OFF
                              </span>
                            )}

                          </div>

                        ) : (
                          <span className="text-sm text-gray-400">
                            —
                          </span>
                        )}

                      </div>

                      {/* STARTING PRICE */}

                      <div className="p-3 text-right">

                        <div
                          className="
                            text-[10px]
                            uppercase
                            tracking-wide
                            font-semibold
                            text-gray-400
                            mb-1
                          "
                        >
                          Starting Price
                        </div>

                        {priceOnRequest ? (

                          <span
                            className="
                              inline-flex
                              items-center
                              gap-1
                              px-2
                              py-1
                              rounded-md
                              bg-blue-50
                              border border-blue-100
                              text-blue-700
                              text-[10px]
                              font-semibold
                            "
                          >
                            <Clock3 size={11} />
                            Price on Request
                          </span>

                        ) : (

                          <>

                            <div
                              className="
                                flex
                                items-baseline
                                justify-end
                                gap-0.5
                              "
                            >

                              <IndianRupee
                                size={14}
                                className="text-green-600"
                              />

                              <span
                                className="
                                  text-lg
                                  font-bold
                                  text-green-600
                                "
                              >
                                {formatPrice(price)}
                              </span>

                              {unit && (
                                <span
                                  className="
                                    ml-1
                                    text-[10px]
                                    font-semibold
                                    text-gray-500
                                    whitespace-nowrap
                                  "
                                >
                                  / {unit}
                                </span>
                              )}

                            </div>

                            {hasDiscount && (
                              <span
                                className="
                                  flex
                                  items-center
                                  justify-end
                                  gap-1
                                  mt-0.5
                                  text-[10px]
                                  text-green-600
                                  font-medium
                                "
                              >
                                <Sparkles size={10} />

                                Save ₹
                                {formatPrice(
                                  originalPrice - price
                                )}
                              </span>
                            )}

                          </>

                        )}

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* =====================================================
          MOBILE HINT
          Removed because mobile no longer needs horizontal scroll
      ===================================================== */}

      {/* =====================================================
          FOOTNOTE
      ===================================================== */}

      <div
        className="
          px-5
          py-3
          sm:px-6
          bg-gray-50
          border-t
          border-gray-200
        "
      >

        <p
          className="
            text-xs
            text-gray-500
            leading-5
          "
        >

          <span className="font-semibold text-gray-600">
            Note:
          </span>{" "}

          Final charges may vary depending on work scope,
          materials, site inspection, location and specific
          service requirements.

        </p>

      </div>

    </section>
  );
};

export default ServicePricing;