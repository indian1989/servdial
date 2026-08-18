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
          py-5
          sm:px-6
          sm:py-6
          border-b
          border-gray-200
        "
      >

        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div
              className="
                w-11
                h-11
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
                size={21}
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
          PRICE TABLE
      ===================================================== */}

      <div className="overflow-x-auto">

        <table className="w-full min-w-[760px] border-collapse">

          <thead>

            <tr className="bg-gray-50 border-b border-gray-200">

              <th
                className="
                  px-5 py-3.5
                  text-left
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-gray-500
                  w-[27%]
                "
              >
                Service
              </th>

              <th
                className="
                  px-5 py-3.5
                  text-left
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-gray-500
                  w-[35%]
                "
              >
                Description
              </th>

              <th
                className="
                  px-5 py-3.5
                  text-right
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-gray-500
                  w-[16%]
                "
              >
                Regular Price
              </th>

              <th
                className="
                  px-5 py-3.5
                  text-right
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-gray-500
                  w-[22%]
                "
              >
                Offer Price
              </th>

            </tr>

          </thead>


          <tbody>

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

                <tr
                  key={item?._id || index}
                  className="
                    border-b
                    border-gray-100
                    last:border-b-0
                    hover:bg-gray-50/70
                    transition
                  "
                >

                  {/* SERVICE */}

                  <td className="px-5 py-5 align-top">

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

                      <div>

                        <div
                          className="
                            font-semibold
                            text-gray-900
                            text-sm
                            sm:text-base
                          "
                        >
                          {item?.name || "Service"}
                        </div>

                      </div>

                    </div>

                  </td>


                  {/* DESCRIPTION */}

                  <td className="px-5 py-5 align-top">

                    {item?.description ? (

                      <p
                        className="
                          text-sm
                          text-gray-500
                          leading-6
                          max-w-md
                        "
                      >
                        {item.description}
                      </p>

                    ) : (

                      <span className="text-sm text-gray-400">
                        Service details available on request
                      </span>

                    )}

                  </td>


                  {/* REGULAR PRICE */}

                  <td className="px-5 py-5 align-top text-right">

                    {hasDiscount ? (

                      <div className="flex flex-col items-end">

                        <span
                          className="
                            text-sm
                            text-gray-400
                            line-through
                            whitespace-nowrap
                          "
                        >
                          ₹{formatPrice(originalPrice)}
                        </span>

                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1
                            mt-1.5
                            px-2
                            py-1
                            rounded-md
                            bg-red-50
                            text-red-600
                            text-[11px]
                            font-bold
                          "
                        >
                          <Tag size={11} />

                          {discount}% OFF
                        </span>

                      </div>

                    ) : (

                      <span className="text-sm text-gray-400">
                        —
                      </span>

                    )}

                  </td>


                  {/* STARTING PRICE */}

                  <td className="px-5 py-5 align-top text-right">

                    {priceOnRequest ? (

                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          px-3
                          py-2
                          rounded-lg
                          bg-blue-50
                          border border-blue-100
                          text-blue-700
                          text-sm
                          font-semibold
                          whitespace-nowrap
                        "
                      >
                        <Clock3 size={14} />

                        Price on Request
                      </span>

                    ) : (

                      <div className="flex flex-col items-end">

                        <span
                          className="
                            text-[10px]
                            uppercase
                            tracking-wider
                            text-gray-400
                            font-semibold
                          "
                        >
                          Starting from
                        </span>

                        <div
                          className="
                            flex
                            items-baseline
                            gap-0.5
                            mt-0.5
                            text-green-600
                          "
                        >

                          <IndianRupee size={16} />

                          <span
                            className="
                              text-xl
                              font-bold
                            "
                          >
                            {formatPrice(price)}
                          </span>

                          {unit && (
                            <span
                              className="
                                ml-1
                                text-xs
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
                              gap-1
                              mt-1
                              text-xs
                              text-green-600
                              font-medium
                            "
                          >

                            <Sparkles size={12} />

                            Save ₹
                            {formatPrice(
                              originalPrice - price
                            )}

                          </span>

                        )}

                      </div>

                    )}

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>


      {/* MOBILE HINT */}

      <div
        className="
          sm:hidden
          px-5
          py-2.5
          bg-gray-50
          border-t border-gray-100
          text-[11px]
          text-gray-400
          text-center
        "
      >
        Swipe horizontally to view the complete price chart
      </div>


      {/* =====================================================
          FOOTNOTE
      ===================================================== */}

      <div
        className="
          px-5
          py-4
          sm:px-6
          bg-gray-50
          border-t border-gray-200
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