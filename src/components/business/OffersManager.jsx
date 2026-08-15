import { useEffect, useState } from "react";
import { Gift, Plus, Trash2, Percent, Calendar } from "lucide-react";

const emptyOffer = {
  title: "",
  description: "",
  discountPercent: "",
  validTill: "",
  isActive: true,
};

const OffersManager = ({
  value = [],
  onChange,
}) => {

  const offers = Array.isArray(value)
    ? value
    : [];

  const [enabled, setEnabled] = useState(
    offers.length > 0
  );

  const [expanded, setExpanded] = useState(
    offers.length > 0
  );

  /* ================= SYNC ================= */

  useEffect(() => {

    setEnabled(offers.length > 0);

  }, [offers.length]);


  /* ================= UPDATE ================= */

  const update = (list) => {

    onChange?.(list);

  };


  /* ================= ADD ================= */

  const addOffer = () => {

    setEnabled(true);
    setExpanded(true);

    update([
      ...offers,
      {
        ...emptyOffer,
      },
    ]);

  };


  /* ================= REMOVE ================= */

  const removeOffer = (index) => {

    const list = offers.filter(
      (_, i) => i !== index
    );

    update(list);

  };


  /* ================= CHANGE ================= */

  const handleChange = (
    index,
    field,
    fieldValue
  ) => {

    const list = [...offers];

    list[index] = {
      ...list[index],
      [field]: fieldValue,
    };

    update(list);

  };


  /* ================= TOGGLE ACTIVE ================= */

  const toggleOfferActive = (index) => {

    const list = [...offers];

    list[index] = {
      ...list[index],
      isActive:
        list[index].isActive === false
          ? true
          : false,
    };

    update(list);

  };


  return (
    <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm">

      {/* ================= HEADER ================= */}

      <button
        type="button"
        onClick={() =>
          setExpanded(!expanded)
        }
        className="
          w-full
          flex
          items-center
          justify-between
          p-5
          hover:bg-gray-50
          transition
          text-left
        "
      >

        <div className="flex items-center gap-4">

          <div className="
            w-12
            h-12
            rounded-xl
            bg-pink-100
            flex
            items-center
            justify-center
          ">
            <Gift
              size={24}
              className="text-pink-600"
            />
          </div>

          <div>

            <h3 className="
              font-semibold
              text-lg
              text-gray-900
            ">
              Offers & Deals
            </h3>

            <p className="text-sm text-gray-500">
              {offers.length} offer
              {offers.length !== 1 ? "s" : ""}
              {" "}added
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <span
            className={`text-sm font-medium ${
              enabled
                ? "text-green-600"
                : "text-gray-400"
            }`}
          >
            {enabled
              ? "Enabled"
              : "Disabled"}
          </span>

          <div className="
            w-8
            h-8
            rounded-lg
            border
            flex
            items-center
            justify-center
            text-gray-500
          ">
            {expanded ? "−" : "+"}
          </div>

        </div>

      </button>


      {/* ================= ENABLE ================= */}

      <div className="px-5 pb-5">

        <label className="
          flex
          items-center
          gap-3
          text-sm
          font-medium
          text-gray-700
        ">

          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => {

              const checked =
                e.target.checked;

              setEnabled(checked);

              if (checked) {

                setExpanded(true);

              } else {

                setExpanded(false);

                update([]);

              }

            }}
            className="
              w-4
              h-4
              rounded
              border-gray-300
              text-pink-600
              focus:ring-pink-500
            "
          />

          Enable Offers & Deals

        </label>

      </div>


      {/* ================= CONTENT ================= */}

      {enabled && expanded && (

        <div className="
          border-t
          px-5
          py-5
          space-y-5
        ">

          {/* ================= TOOLBAR ================= */}

          <div className="
            flex
            justify-between
            items-center
          ">

            <h4 className="
              font-semibold
              text-gray-900
            ">
              Manage Offers
            </h4>

            <button
              type="button"
              onClick={addOffer}
              className="
                flex
                items-center
                gap-2
                bg-pink-600
                text-white
                px-4
                py-2
                rounded-lg
                hover:bg-pink-700
                transition
              "
            >
              <Plus size={18} />
              Add Offer
            </button>

          </div>


          {/* ================= EMPTY ================= */}

          {offers.length === 0 && (

            <div className="
              border
              border-dashed
              rounded-xl
              p-6
              text-center
              text-gray-500
              text-sm
            ">
              No offers added yet.
            </div>

          )}


          {/* ================= OFFERS ================= */}

          {offers.map((offer, index) => (

            <div
              key={index}
              className="
                border
                rounded-xl
                p-4
                bg-gray-50
                space-y-4
              "
            >

              {/* HEADER */}

              <div className="
                flex
                justify-between
                items-center
              ">

                <h5 className="
                  font-semibold
                  text-gray-900
                ">
                  Offer #{index + 1}
                </h5>

                <button
                  type="button"
                  onClick={() =>
                    removeOffer(index)
                  }
                  className="
                    text-red-600
                    hover:text-red-700
                    transition
                  "
                >
                  <Trash2 size={18} />
                </button>

              </div>


              {/* TITLE */}

              <input
                type="text"
                placeholder="Offer Title"
                value={offer.title || ""}
                onChange={(e) =>
                  handleChange(
                    index,
                    "title",
                    e.target.value
                  )
                }
                className="
                  border
                  rounded-lg
                  p-3
                  w-full
                  focus:outline-none
                  focus:ring-2
                  focus:ring-pink-500
                "
              />


              {/* DESCRIPTION */}

              <textarea
                rows={3}
                placeholder="Offer Description"
                value={offer.description || ""}
                onChange={(e) =>
                  handleChange(
                    index,
                    "description",
                    e.target.value
                  )
                }
                className="
                  border
                  rounded-lg
                  p-3
                  w-full
                  focus:outline-none
                  focus:ring-2
                  focus:ring-pink-500
                "
              />


              {/* DISCOUNT */}

              <div>

                <label className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  mb-1
                  font-medium
                  text-gray-700
                ">
                  <Percent size={16} />
                  Discount Percentage
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 20"
                  value={
                    offer.discountPercent ?? ""
                  }
                  onChange={(e) =>
                    handleChange(
                      index,
                      "discountPercent",
                      e.target.value
                    )
                  }
                  className="
                    border
                    rounded-lg
                    p-3
                    w-full
                    focus:outline-none
                    focus:ring-2
                    focus:ring-pink-500
                  "
                />

              </div>


              {/* VALID TILL */}

              <div>

                <label className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  mb-1
                  font-medium
                  text-gray-700
                ">
                  <Calendar size={16} />
                  Valid Till
                </label>

                <input
                  type="date"
                  value={
                    offer.validTill
                      ? String(
                          offer.validTill
                        ).substring(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    handleChange(
                      index,
                      "validTill",
                      e.target.value
                    )
                  }
                  className="
                    border
                    rounded-lg
                    p-3
                    w-full
                    focus:outline-none
                    focus:ring-2
                    focus:ring-pink-500
                  "
                />

              </div>


              {/* ACTIVE */}

              <label className="
                flex
                items-center
                gap-3
                text-sm
                font-medium
                text-gray-700
              ">

                <input
                  type="checkbox"
                  checked={
                    offer.isActive !== false
                  }
                  onChange={() =>
                    toggleOfferActive(index)
                  }
                  className="
                    w-4
                    h-4
                    rounded
                    border-gray-300
                    text-pink-600
                    focus:ring-pink-500
                  "
                />

                Active Offer

              </label>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default OffersManager;