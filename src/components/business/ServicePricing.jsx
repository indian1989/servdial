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
          DESKTOP TABLE
          Original desktop structure retained
      ===================================================== */}

      <div className="hidden md:block p-4">

        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
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
                w-8 h-8
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
    );
  })}
</div>

      </div>

      {/* =====================================================
          MOBILE CARDS
          Desktop table remains unchanged
      ===================================================== */}

      <div className="md:hidden p-3 space-y-3">

        {pricing.map((item, index) => {

          const price =
            Number(item?.price);

          const originalPrice =
            Number(
              item?.originalPrice ||
              item?.regularPrice ||
              item?.oldPrice ||
              0
            );

          const discount =
            getDiscount(
              originalPrice,
              price
            );

          const hasDiscount =
            Boolean(discount);

          const priceOnRequest =
            item?.priceOnRequest === true ||
            item?.price === null ||
            item?.price === undefined ||
            item?.price === "" ||
            !Number.isFinite(price);

          const unit =
            getUnitLabel(item);

          return (

            <div
              key={item?._id || index}
              className="
                rounded-xl
                border border-gray-200
                overflow-hidden
                bg-white
              "
            >

              {/* MOBILE SERVICE */}
              <div
                className="
                  px-3.5
                  py-3
                  bg-gray-50
                  border-b
                  border-gray-100
                "
              >

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

                  <div className="min-w-0 flex-1">

                    <div
                      className="
                        text-sm
                        font-semibold
                        text-gray-900
                      "
                    >
                      {item?.name || "Service"}
                    </div>

                    {item?.description ? (

                      <p
                        className="
                          text-xs
                          text-gray-500
                          leading-5
                          mt-0.5
                        "
                      >
                        {item.description}
                      </p>

                    ) : (

                      <p
                        className="
                          text-xs
                          text-gray-400
                          mt-0.5
                        "
                      >
                        Service details available on request
                      </p>

                    )}

                  </div>

                </div>

              </div>

              {/* MOBILE PRICES */}
              <div
                className="
                  grid
                  grid-cols-2
                  divide-x
                  divide-gray-100
                "
              >

                {/* ORIGINAL PRICE */}
                <div className="px-3.5 py-3">

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

                      <span
                        className={`
                          text-sm
                          whitespace-nowrap
                          ${
                            hasDiscount
                              ? "text-gray-400 line-through"
                              : "text-gray-800 font-semibold"
                          }
                        `}
                      >
                        ₹{formatPrice(originalPrice)}
                      </span>

                      {hasDiscount && (

                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1
                            ml-1.5
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
                <div className="px-3.5 py-3 text-right">

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
                        text-[11px]
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
                          text-green-600
                        "
                      >

                        <IndianRupee size={14} />

                        <span
                          className="
                            text-lg
                            font-bold
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

          );

        })}

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