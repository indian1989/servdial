import { Plus, Trash2, IndianRupee } from "lucide-react";

const emptyRow = {
  name: "",
  price: "",
};

const PricingManager = ({
  value = [],
  onChange
}) => {


console.log(
  "🔥 PricingManager VALUE:",
  value
);


console.log(
  "🔥 PricingManager onChange:",
  onChange
);

  const pricing = Array.isArray(value)
    ? value
    : [];

  const updateRow = (index, field, fieldValue) => {

    const updated = [...pricing];

    updated[index] = {
      ...updated[index],
      [field]: fieldValue,
    };

    onChange(updated);

  };

  const addRow = () => {

    onChange([
      ...pricing,
      { ...emptyRow },
    ]);

  };

  const removeRow = (index) => {

    const updated = pricing.filter(
      (_, i) => i !== index
    );

    onChange(updated);

  };

  return (

    <div className="bg-white rounded-2xl border shadow-sm p-6">

      <div className="flex items-center justify-between mb-5">

        <div>

          <h2 className="text-xl font-bold">
            💰 Service Pricing
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Add services with their starting price.
          </p>

        </div>

        <button
          type="button"
          onClick={addRow}
          className="
            flex
            items-center
            gap-2
            bg-indigo-600
            hover:bg-indigo-700
            text-white
            px-4
            py-2
            rounded-xl
          "
        >
          <Plus size={18} />

          Add Pricing

        </button>

      </div>

      {

        pricing.length === 0 && (

          <div
            className="
              text-center
              py-10
              border-2
              border-dashed
              rounded-xl
              text-gray-400
            "
          >

            No pricing added

          </div>

        )

      }

      <div className="space-y-4">

        {

          pricing.map((item, index) => (

            <div
              key={index}
              className="
                border
                rounded-xl
                p-4
                grid
                md:grid-cols-12
                gap-3
                items-end
              "
            >

              <div className="md:col-span-7">

                <label className="text-sm font-medium mb-1 block">
                  Service Name
                </label>

                <input
                  type="text"
                  value={item.name}
                  placeholder="Electrical Repair"
                  onChange={(e) =>
                    updateRow(
                      index,
                      "name",
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border
                    rounded-lg
                    p-3
                  "
                />

              </div>

              <div className="md:col-span-4">

                <label className="text-sm font-medium mb-1 block">
                  Starting Price
                </label>

                <div className="relative">

                  <IndianRupee
                    size={18}
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
                    value={item.price}
                    placeholder="499"
                    onChange={(e) =>
                      updateRow(
                        index,
                        "price",
                        Number(e.target.value)
                      )
                    }
                    className="
                      w-full
                      border
                      rounded-lg
                      p-3
                      pl-9
                    "
                  />

                </div>

              </div>

              <div className="md:col-span-1">

                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="
                    w-full
                    h-12
                    flex
                    items-center
                    justify-center
                    rounded-lg
                    bg-red-50
                    text-red-600
                    hover:bg-red-100
                  "
                >

                  <Trash2 size={18} />

                </button>

              </div>

            </div>

          ))

        }

      </div>

    </div>

  );

};

export default PricingManager;