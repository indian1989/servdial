// src/components/business/OffersManager.jsx

import { useState, useEffect } from "react";
import { Gift, Plus, Trash2 } from "lucide-react";

const emptyOffer = {
  title: "",
  description: "",
  image: "",
  expiryDate: "",
};

const OffersManager = ({
  value = [],
  onChange,
}) => {

  const [offers, setOffers] = useState([]);

  useEffect(() => {
    if (Array.isArray(value)) {
      setOffers(value);
    }
  }, [value]);

  const update = (list) => {
    setOffers(list);
    onChange?.(list);
  };

  const addOffer = () => {
    update([
      ...offers,
      { ...emptyOffer },
    ]);
  };

  const removeOffer = (index) => {
    update(
      offers.filter((_, i) => i !== index)
    );
  };

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

  return (

    <section className="bg-white rounded-2xl border shadow-sm p-6">

      <div className="flex items-center justify-between mb-5">

        <div className="flex items-center gap-2">

          <Gift
            size={22}
            className="text-pink-600"
          />

          <h2 className="text-xl font-bold">
            Offers & Deals
          </h2>

        </div>

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
          "
        >
          <Plus size={18} />
          Add Offer
        </button>

      </div>

      {

        offers.length === 0 && (

          <div className="text-gray-500 text-sm">

            No offers added.

          </div>

        )

      }

      {

        offers.map((offer, index) => (

          <div
            key={index}
            className="
              border
              rounded-xl
              p-4
              mb-4
              space-y-4
            "
          >

            <div className="flex justify-between items-center">

              <h3 className="font-semibold">

                Offer #{index + 1}

              </h3>

              <button
                type="button"
                onClick={() => removeOffer(index)}
                className="text-red-600"
              >
                <Trash2 size={18} />
              </button>

            </div>

            <input
              type="text"
              placeholder="Offer Title"
              value={offer.title}
              onChange={(e) =>
                handleChange(
                  index,
                  "title",
                  e.target.value
                )
              }
              className="border rounded-lg p-3 w-full"
            />

            <textarea
              rows={3}
              placeholder="Offer Description"
              value={offer.description}
              onChange={(e) =>
                handleChange(
                  index,
                  "description",
                  e.target.value
                )
              }
              className="border rounded-lg p-3 w-full"
            />

            <input
              type="url"
              placeholder="Offer Image URL"
              value={offer.image}
              onChange={(e) =>
                handleChange(
                  index,
                  "image",
                  e.target.value
                )
              }
              className="border rounded-lg p-3 w-full"
            />

            <div>

              <label className="block text-sm mb-1 font-medium">

                Expiry Date

              </label>

              <input
                type="date"
                value={offer.expiryDate?.substring(0,10) || ""}
                onChange={(e)=>
                  handleChange(
                    index,
                    "expiryDate",
                    e.target.value
                  )
                }
                className="border rounded-lg p-3 w-full"
              />

            </div>

          </div>

        ))

      }

    </section>

  );

};

export default OffersManager;