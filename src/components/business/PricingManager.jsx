import {
  Plus,
  Trash2,
  IndianRupee,
  Tag,
  Sparkles,
  X,
} from "lucide-react";

const UNIT_OPTIONS = [
  { value: "per_visit", label: "Per Visit" },
  { value: "per_hour", label: "Per Hour" },
  { value: "per_day", label: "Per Day" },
  { value: "per_month", label: "Per Month" },
  { value: "per_job", label: "Per Job" },
  { value: "per_service", label: "Per Service" },
  { value: "per_piece", label: "Per Piece" },
  { value: "per_item", label: "Per Item" },
  { value: "per_set", label: "Per Set" },
  { value: "per_sq_ft", label: "Per Sq. Ft." },
  { value: "per_sq_meter", label: "Per Sq. Meter" },
  { value: "per_km", label: "Per Km" },
  { value: "per_person", label: "Per Person" },
];

const createEmptyRow = () => ({
  name: "",
  description: "",
  pricingUnit: "per_service",
  customPricingUnit: "",
  originalPrice: "",
  price: "",
  priceOnRequest: false,
});

const PricingManager = ({
  value = [],
  onChange,
}) => {
  const pricing = Array.isArray(value) ? value : [];

  // =========================================================
  // UPDATE
  // =========================================================

  const updateRow = (index, field, fieldValue) => {
    const updated = [...pricing];

    updated[index] = {
      ...updated[index],
      [field]: fieldValue,
    };

    onChange?.(updated);
  };

  // =========================================================
  // ADD
  // =========================================================

  const addRow = () => {
    onChange?.([
      ...pricing,
      createEmptyRow(),
    ]);
  };

  // =========================================================
  // REMOVE
  // =========================================================

  const removeRow = (index) => {
    onChange?.(
      pricing.filter((_, i) => i !== index)
    );
  };

  // =========================================================
  // DISCOUNT
  // =========================================================

  const getDiscount = (originalPrice, price) => {
    const original = Number(originalPrice);
    const current = Number(price);

    if (
      !original ||
      !current ||
      original <= current
    ) {
      return 0;
    }

    return Math.round(
      ((original - current) / original) * 100
    );
  };

  // =========================================================
  // DISPLAY UNIT
  // =========================================================

  const getUnit = (item) => {
    if (item?.unit === "Custom") {
      return item?.customUnit || "";
    }

    return item?.unit || "Per Service";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="px-5 py-5 sm:px-6 border-b bg-gradient-to-r from-gray-50 to-white">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>

            <div className="flex items-center gap-3">

              <div className="
                w-10
                h-10
                rounded-xl
                bg-indigo-50
                text-indigo-600
                flex
                items-center
                justify-center
              ">
                <IndianRupee size={20} />
              </div>

              <div>

                <h2 className="
                  text-lg
                  sm:text-xl
                  font-bold
                  text-gray-900
                ">
                  Service Pricing
                </h2>

                <p className="
                  text-xs
                  sm:text-sm
                  text-gray-500
                  mt-0.5
                ">
                  Add clear pricing for your services
                </p>

              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={addRow}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              bg-indigo-600
              hover:bg-indigo-700
              text-white
              px-4
              py-2.5
              rounded-xl
              text-sm
              font-semibold
              transition
              shadow-sm
            "
          >
            <Plus size={17} />
            Add Pricing
          </button>

        </div>

      </div>


      {/* =====================================================
          EMPTY
      ===================================================== */}

      {pricing.length === 0 && (

        <div className="p-6">

          <div className="
            border-2
            border-dashed
            border-gray-200
            rounded-2xl
            py-12
            px-5
            text-center
            bg-gray-50/50
          ">

            <div className="
              w-12
              h-12
              rounded-xl
              bg-white
              border
              flex
              items-center
              justify-center
              mx-auto
              mb-3
            ">
              <IndianRupee
                size={21}
                className="text-gray-400"
              />
            </div>

            <h3 className="
              text-sm
              font-semibold
              text-gray-700
            ">
              No pricing added yet
            </h3>

            <p className="
              text-xs
              text-gray-500
              mt-1
            ">
              Add your first service pricing to help customers understand your rates.
            </p>

            <button
              type="button"
              onClick={addRow}
              className="
                mt-4
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-lg
                bg-white
                border
                border-indigo-200
                text-indigo-600
                text-sm
                font-semibold
                hover:bg-indigo-50
              "
            >
              <Plus size={16} />
              Add First Pricing
            </button>

          </div>

        </div>

      )}


      {/* =====================================================
          PRICING LIST
      ===================================================== */}

      {pricing.length > 0 && (

        <div className="p-4 sm:p-6 space-y-5">

          {pricing.map((item, index) => {

            const originalPrice =
              Number(item?.originalPrice) || 0;

            const offerPrice =
              Number(item?.price) || 0;

            const discount =
              getDiscount(
                originalPrice,
                offerPrice
              );

            const priceOnRequest =
              item?.priceOnRequest === true;

            const unit =
              getUnit(item);

            return (

              <div
                key={item?._id || index}
                className="
                  relative
                  border
                  border-gray-200
                  rounded-2xl
                  bg-white
                  overflow-hidden
                "
              >

                {/* =================================================
                    ROW HEADER
                ================================================= */}

                <div className="
                  flex
                  items-center
                  justify-between
                  px-4
                  py-3
                  bg-gray-50
                  border-b
                  border-gray-200
                ">

                  <div className="
                    flex
                    items-center
                    gap-2
                  ">

                    <span className="
                      w-7
                      h-7
                      rounded-lg
                      bg-indigo-100
                      text-indigo-700
                      flex
                      items-center
                      justify-center
                      text-xs
                      font-bold
                    ">
                      {index + 1}
                    </span>

                    <span className="
                      text-sm
                      font-semibold
                      text-gray-700
                    ">
                      Service Pricing
                    </span>

                  </div>

                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    title="Remove pricing"
                    className="
                      w-8
                      h-8
                      rounded-lg
                      flex
                      items-center
                      justify-center
                      text-gray-400
                      hover:text-red-600
                      hover:bg-red-50
                      transition
                    "
                  >
                    <Trash2 size={17} />
                  </button>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <div className="p-4">

                  <div className="
                    grid
                    grid-cols-1
                    lg:grid-cols-12
                    gap-4
                  ">

                    {/* SERVICE */}

                    <div className="lg:col-span-4">

                      <label className="
                        block
                        text-xs
                        font-semibold
                        text-gray-600
                        mb-1.5
                      ">
                        Service Name
                      </label>

                      <input
                        type="text"
                        value={item?.name || ""}
                        placeholder="e.g. Electrical Repair"
                        onChange={(e) =>
                          updateRow(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        className="
                          w-full
                          h-11
                          border
                          border-gray-300
                          rounded-xl
                          px-3
                          text-sm
                          outline-none
                          focus:border-indigo-500
                          focus:ring-2
                          focus:ring-indigo-100
                        "
                      />

                    </div>


                    {/* UNIT */}

                    <div className="lg:col-span-3">

                      <label className="
                        block
                        text-xs
                        font-semibold
                        text-gray-600
                        mb-1.5
                      ">
                        Pricing Unit
                      </label>

                      <select
                        value={item?.pricingUnit || "per_service"}
                        
                        onChange={(e) =>
                        updateRow(
                          index,
                          "pricingUnit",
                          e.target.value
                        )
                      }
                        className="
                          w-full
                          h-11
                          border
                          border-gray-300
                          rounded-xl
                          px-3
                          text-sm
                          bg-white
                          outline-none
                          focus:border-indigo-500
                          focus:ring-2
                          focus:ring-indigo-100
                        "
                      >

                        {UNIT_OPTIONS.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}

                        <option value="Custom">
                          Custom
                        </option>

                      </select>

                    </div>


                    {/* CUSTOM UNIT */}

                    {item?.pricingUnit === "custom" && (

                      <div className="lg:col-span-3">

                        <label className="
                          block
                          text-xs
                          font-semibold
                          text-gray-600
                          mb-1.5
                        ">
                          Custom Unit
                        </label>

                        <input
                          type="text"
                          value={item?.customPricingUnit || ""}
                          placeholder="e.g. Per Visit"
                          onChange={(e) =>
                          updateRow(
                            index,
                            "customPricingUnit",
                            e.target.value
                          )
                        }
                          className="
                            w-full
                            h-11
                            border
                            border-gray-300
                            rounded-xl
                            px-3
                            text-sm
                            outline-none
                            focus:border-indigo-500
                            focus:ring-2
                            focus:ring-indigo-100
                          "
                        />

                      </div>

                    )}


                    {/* REGULAR PRICE */}

                    <div className="lg:col-span-3">

                      <label className="
                        block
                        text-xs
                        font-semibold
                        text-gray-600
                        mb-1.5
                      ">
                        Regular Price
                      </label>

                      <div className="relative">

                        <IndianRupee
                          size={16}
                          className="
                            absolute
                            left-3
                            top-3.5
                            text-gray-400
                          "
                        />

                        <input
                          type="number"
                          min="0"
                          value={
                            item?.originalPrice ?? ""
                          }
                          placeholder="500"
                          disabled={priceOnRequest}
                          onChange={(e) =>
                            updateRow(
                              index,
                              "originalPrice",
                              e.target.value
                            )
                          }
                          className="
                            w-full
                            h-11
                            border
                            border-gray-300
                            rounded-xl
                            pl-9
                            pr-3
                            text-sm
                            outline-none
                            focus:border-indigo-500
                            focus:ring-2
                            focus:ring-indigo-100
                            disabled:bg-gray-100
                            disabled:text-gray-400
                          "
                        />

                      </div>

                    </div>


                    {/* OFFER PRICE */}

                    <div className="lg:col-span-3">

                      <label className="
                        block
                        text-xs
                        font-semibold
                        text-gray-600
                        mb-1.5
                      ">
                        Offer / Starting Price
                      </label>

                      <div className="relative">

                        <IndianRupee
                          size={16}
                          className="
                            absolute
                            left-3
                            top-3.5
                            text-gray-400
                          "
                        />

                        <input
                          type="number"
                          min="0"
                          value={
                            item?.price ?? ""
                          }
                          placeholder="300"
                          disabled={priceOnRequest}
                          onChange={(e) =>
                            updateRow(
                              index,
                              "price",
                              e.target.value
                            )
                          }
                          className="
                            w-full
                            h-11
                            border
                            border-gray-300
                            rounded-xl
                            pl-9
                            pr-3
                            text-sm
                            outline-none
                            focus:border-indigo-500
                            focus:ring-2
                            focus:ring-indigo-100
                            disabled:bg-gray-100
                            disabled:text-gray-400
                          "
                        />

                      </div>

                    </div>


                    {/* PRICE REQUEST */}

                    <div className="
                      lg:col-span-3
                      flex
                      items-end
                    ">

                      <label className="
                        w-full
                        h-11
                        px-3
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        flex
                        items-center
                        gap-2
                        cursor-pointer
                      ">

                        <input
                          type="checkbox"
                          checked={
                            priceOnRequest
                          }
                          onChange={(e) =>
                            updateRow(
                              index,
                              "priceOnRequest",
                              e.target.checked
                            )
                          }
                          className="
                            w-4
                            h-4
                            accent-indigo-600
                          "
                        />

                        <span className="
                          text-sm
                          font-medium
                          text-gray-700
                        ">
                          Price on Request
                        </span>

                      </label>

                    </div>

                  </div>


                  {/* =================================================
                      DESCRIPTION
                  ================================================= */}

                  <div className="mt-4">

                    <label className="
                      block
                      text-xs
                      font-semibold
                      text-gray-600
                      mb-1.5
                    ">
                      Service Description
                      <span className="
                        font-normal
                        text-gray-400
                        ml-1
                      ">
                        (Optional)
                      </span>
                    </label>

                    <textarea
                      rows={2}
                      value={
                        item?.description || ""
                      }
                      placeholder="Briefly describe what is included in this service..."
                      onChange={(e) =>
                        updateRow(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        border
                        border-gray-300
                        rounded-xl
                        px-3
                        py-2.5
                        text-sm
                        resize-none
                        outline-none
                        focus:border-indigo-500
                        focus:ring-2
                        focus:ring-indigo-100
                      "
                    />

                  </div>


                  {/* =================================================
                      PREVIEW
                  ================================================= */}

                  <div className="
                    mt-4
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-3
                    px-4
                    py-3
                    rounded-xl
                    bg-gray-50
                    border
                    border-gray-100
                  ">

                    <div className="min-w-0">

                      <div className="
                        flex
                        items-center
                        gap-2
                        flex-wrap
                      ">

                        <span className="
                          text-sm
                          font-semibold
                          text-gray-800
                        ">
                          {item?.name ||
                            "Service"}
                        </span>

                        {unit && !priceOnRequest && (

                          <span className="
                            text-xs
                            px-2
                            py-1
                            rounded-full
                            bg-white
                            border
                            text-gray-500
                          ">
                            {unit}
                          </span>

                        )}

                      </div>

                    </div>


                    <div className="
                      flex
                      items-center
                      gap-3
                      shrink-0
                    ">

                      {priceOnRequest ? (

                        <span className="
                          text-sm
                          font-bold
                          text-indigo-600
                        ">
                          Price on Request
                        </span>

                      ) : (

                        <>

                          {originalPrice > 0 &&
                            originalPrice >
                              offerPrice && (

                            <span className="
                              text-xs
                              text-gray-400
                              line-through
                            ">
                              ₹
                              {originalPrice.toLocaleString(
                                "en-IN"
                              )}
                            </span>

                          )}

                          {offerPrice > 0 && (

                            <span className="
                              text-base
                              font-bold
                              text-green-600
                            ">
                              ₹
                              {offerPrice.toLocaleString(
                                "en-IN"
                              )}
                            </span>

                          )}

                        </>

                      )}

                      {discount > 0 && (

                        <span className="
                          inline-flex
                          items-center
                          gap-1
                          px-2
                          py-1
                          rounded-full
                          bg-green-50
                          text-green-700
                          text-[11px]
                          font-bold
                        ">
                          <Tag size={11} />
                          {discount}% OFF
                        </span>

                      )}

                    </div>

                  </div>


                  {/* SAVING */}

                  {discount > 0 && (

                    <div className="
                      mt-3
                      flex
                      items-center
                      gap-1.5
                      text-xs
                      text-green-600
                      font-medium
                    ">

                      <Sparkles size={13} />

                      Customer saves ₹
                      {(
                        originalPrice -
                        offerPrice
                      ).toLocaleString("en-IN")}

                    </div>

                  )}

                </div>

              </div>

            );

          })}

        </div>

      )}

    </div>
  );
};

export default PricingManager;