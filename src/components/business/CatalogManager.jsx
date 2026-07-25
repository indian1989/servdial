// src/components/business/CatalogManager.jsx
import { Plus, Trash2, Package } from "lucide-react";

const emptyItem = {
  name: "",
  description: "",
  price: "",
  image: "",
};

const CatalogManager = ({
  value = [],
  onChange,
}) => {

  const catalog = Array.isArray(value)
    ? value
    : [];

  const updateItem = (index, field, fieldValue) => {

    const updated = [...catalog];

    updated[index] = {
      ...updated[index],
      [field]: fieldValue,
    };

    onChange(updated);

  };

  const addItem = () => {

    onChange([
      ...catalog,
      { ...emptyItem },
    ]);

  };

  const removeItem = (index) => {

    onChange(
      catalog.filter((_, i) => i !== index)
    );

  };

  return (

    <div className="bg-white border rounded-2xl p-6">

      <div className="flex items-center justify-between mb-5">

        <div>

          <div className="flex items-center gap-2">

            <Package className="text-indigo-600" />

            <h2 className="text-xl font-bold">
              Product Catalog
            </h2>

          </div>

          <p className="text-sm text-gray-500 mt-1">
            Add products or catalog items.
          </p>

        </div>

        <button
          type="button"
          onClick={addItem}
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

          Add Item

        </button>

      </div>

      {

        catalog.length === 0 && (

          <div
            className="
              border-2
              border-dashed
              rounded-xl
              py-10
              text-center
              text-gray-400
            "
          >

            No catalog items added

          </div>

        )

      }

      <div className="space-y-5">

        {

          catalog.map((item, index) => (

            <div
              key={index}
              className="
                border
                rounded-xl
                p-5
                space-y-4
              "
            >

              <input
                type="text"
                placeholder="Product Name"
                value={item.name}
                onChange={(e)=>
                  updateItem(
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

              <textarea
                rows={3}
                placeholder="Description"
                value={item.description}
                onChange={(e)=>
                  updateItem(
                    index,
                    "description",
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

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  type="number"
                  min="0"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e)=>
                    updateItem(
                      index,
                      "price",
                      Number(e.target.value)
                    )
                  }
                  className="
                    border
                    rounded-lg
                    p-3
                  "
                />

                <input
                  type="text"
                  placeholder="Image URL"
                  value={item.image}
                  onChange={(e)=>
                    updateItem(
                      index,
                      "image",
                      e.target.value
                    )
                  }
                  className="
                    border
                    rounded-lg
                    p-3
                  "
                />

              </div>

              <button
                type="button"
                onClick={() =>
                  removeItem(index)
                }
                className="
                  flex
                  items-center
                  gap-2
                  text-red-600
                  hover:text-red-700
                "
              >

                <Trash2 size={18} />

                Remove Item

              </button>

            </div>

          ))

        }

      </div>

    </div>

  );

};

export default CatalogManager;