import { useEffect, useState } from "react";
import { Utensils, Plus, Trash2, Image as ImageIcon } from "lucide-react";

const DEFAULT_ITEM = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  isAvailable: true,
};

const MenuManager = ({ value = [], onChange }) => {
  const [enabled, setEnabled] = useState(value.length > 0);
  const [expanded, setExpanded] = useState(value.length > 0);
  const [item, setItem] = useState(DEFAULT_ITEM);

  useEffect(() => {
    if (value.length > 0) {
      setEnabled(true);
    }
  }, [value]);

  const updateItem = (field, val) => {
    setItem((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const addItem = () => {
    if (!item.name || !item.price) return;

    onChange([
      ...value,
      {
        ...item,
        price: Number(item.price),
      },
    ]);

    setItem(DEFAULT_ITEM);
  };

  const removeItem = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm">

      {/* Header */}

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition text-left"
      >

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
            <Utensils className="w-6 h-6 text-orange-600" />
          </div>

          <div>

            <h3 className="font-semibold text-lg text-gray-900">
              Food Menu
            </h3>

            <p className="text-sm text-gray-500">
              {value.length} item{value.length !== 1 ? "s" : ""} added
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <span
            className={`text-sm font-medium ${
              enabled ? "text-green-600" : "text-gray-400"
            }`}
          >
            {enabled ? "Enabled" : "Disabled"}
          </span>

          <div className="w-8 h-8 rounded-lg border flex items-center justify-center text-gray-500">
            {expanded ? "−" : "+"}
          </div>

        </div>

      </button>

      {/* Toggle */}

      <div className="px-5 pb-5">

        <label className="flex items-center gap-3 text-sm font-medium text-gray-700">

          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => {
              setEnabled(e.target.checked);
              if (e.target.checked) setExpanded(true);
            }}
            className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />

          Enable Food Menu

        </label>

      </div>

      {/* Content */}

      {enabled && expanded && (
        <div className="border-t px-5 py-5 space-y-5">

          {/* Form */}

          <div className="grid md:grid-cols-2 gap-4">

            <input
              value={item.name}
              onChange={(e) => updateItem("name", e.target.value)}
              placeholder="Food Name *"
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />

            <input
              value={item.category}
              onChange={(e) => updateItem("category", e.target.value)}
              placeholder="Category (Pizza, Starter...)"
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />

          </div>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="number"
              value={item.price}
              onChange={(e) => updateItem("price", e.target.value)}
              placeholder="Price *"
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />

            <input
              value={item.image}
              onChange={(e) => updateItem("image", e.target.value)}
              placeholder="Image URL"
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />

          </div>

          <textarea
            value={item.description}
            onChange={(e) => updateItem("description", e.target.value)}
            placeholder="Short description"
            rows={3}
            className="border border-gray-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
          />

          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-5 py-3 font-medium transition"
          >
            <Plus className="w-4 h-4" />
            Add Menu Item
          </button>

          {/* List */}

          <div className="space-y-4 pt-2">

            {value.length === 0 ? (

              <div className="border border-dashed border-gray-300 rounded-2xl p-8 text-center text-gray-400">

                <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />

                <p className="font-medium">No menu items added</p>

                <p className="text-sm mt-1">
                  Add your first food item to display on the business page.
                </p>

              </div>

            ) : (

              value.map((menu, index) => (

                <div
                  key={index}
                  className="border border-gray-200 rounded-2xl p-4 flex gap-4 items-start hover:shadow-sm transition"
                >

                  {menu.image ? (

                    <img
                      src={menu.image}
                      alt={menu.name}
                      className="w-24 h-24 rounded-xl object-cover border border-gray-200"
                    />

                  ) : (

                    <div className="w-24 h-24 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                      <Utensils className="w-8 h-8 text-gray-400" />
                    </div>

                  )}

                  <div className="flex-1 min-w-0">

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <h4 className="font-semibold text-gray-900 truncate">
                          {menu.name}
                        </h4>

                        {menu.category && (
                          <span className="inline-flex items-center rounded-full bg-orange-50 text-orange-700 text-xs font-medium px-2 py-1 mt-2">
                            {menu.category}
                          </span>
                        )}

                      </div>

                      <div className="text-right shrink-0">

                        <div className="text-lg font-bold text-orange-600">
                          ₹{menu.price}
                        </div>

                      </div>

                    </div>

                    {menu.description && (
                      <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                        {menu.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-4">

                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          menu.isAvailable
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {menu.isAvailable ? "Available" : "Unavailable"}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg px-3 py-2 text-sm font-medium transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default MenuManager;