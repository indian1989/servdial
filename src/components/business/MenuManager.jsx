import { useEffect, useState } from "react";
import { Utensils, Plus, Trash2, Pencil } from "lucide-react";

const MENU_CATEGORIES = [
  "Soups",
    "Starters",
    "Biryani Special",
    "Mutton Special",
    "Chicken Special",
    "Mushroom Special",
    "Paneer Special",
    "Rice & Pulao",
    "Tandoori & Grilled",
    "Indian Breads",
    "Main Course",
    "Thali & Combos",
    "Salads",
    "Snacks",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "Pasta",
    "Noodles",
    "Momos",
    "South Indian",
    "Chinese",   
    "Seafood",
    "Special Dishes",
    "Desserts",
    "Ice Cream",
    "Beverages",
    "Tea & Coffee",
    "Other",
  ];

const DEFAULT_ITEM = {
  name: "",
  description: "",
  price: "",
  category: "",
  isAvailable: true,
};

const MenuManager = ({ value = [], onChange }) => {
  const [enabled, setEnabled] = useState(value.length > 0);
  const [expanded, setExpanded] = useState(value.length > 0);
  const [item, setItem] = useState(DEFAULT_ITEM);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

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
    if (
      !item.name.trim() ||
      item.price === "" ||
      !Number.isFinite(Number(item.price)) ||
      Number(item.price) < 0 ||
      !item.category
    ) {
      return;
    }

    const updatedItem = {
      ...item,
      name: item.name.trim(),
      price: Number(item.price),
    };

    if (editingIndex !== null) {
      onChange(
        value.map((menuItem, index) =>
          index === editingIndex ? updatedItem : menuItem
        )
      );
    } else {
      onChange([...value, updatedItem]);
    }

    setItem(DEFAULT_ITEM);
    setEditingIndex(null);
    setEditModalOpen(false);
  };

  const editItem = (index) => {
  const selectedItem = value[index];

  setItem({
    ...DEFAULT_ITEM,
    ...selectedItem,
    price: String(selectedItem.price ?? ""),
  });

  setEditingIndex(index);
  setEditModalOpen(true);
};

const cancelEdit = () => {
  setItem(DEFAULT_ITEM);
  setEditingIndex(null);
  setEditModalOpen(false);
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

      <select
        value={item.category}
        onChange={(e) => updateItem("category", e.target.value)}
        className="w-full min-w-0 border border-gray-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
      >
        <option value="">Select Menu Category *</option>

        {MENU_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>


          </div>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="number"
              value={item.price}
              onChange={(e) => updateItem("price", e.target.value)}
              placeholder="Price *"
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
                      onClick={() => editItem(index)}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>

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

      
{editModalOpen && editingIndex !== null && (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
    onClick={cancelEdit}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-menu-title"
      className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-5 flex items-center justify-between">
        <h3
          id="edit-menu-title"
          className="text-xl font-semibold text-gray-900"
        >
          Edit Menu Item
        </h3>

        <button
          type="button"
          onClick={cancelEdit}
          aria-label="Close edit menu"
          className="rounded-lg px-3 py-1 text-2xl text-gray-500 hover:bg-gray-100"
        >
          &times;
        </button>
      </div>

      <div className="space-y-4">
        <input
          value={item.name}
          onChange={(e) => updateItem("name", e.target.value)}
          placeholder="Food Name *"
          className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
        />

        <select
          value={item.category}
          onChange={(e) => updateItem("category", e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Select Menu Category *</option>
          {MENU_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="0"
          step="any"
          value={item.price}
          onChange={(e) => updateItem("price", e.target.value)}
          placeholder="Price *"
          className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
        />

        <textarea
          value={item.description}
          onChange={(e) => updateItem("description", e.target.value)}
          placeholder="Short description"
          rows={4}
          className="w-full resize-none rounded-xl border border-gray-300 p-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={cancelEdit}
          className="rounded-xl border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 font-medium text-white transition hover:bg-orange-700"
        >
          <Pencil className="h-4 w-4" />
          Update Item
        </button>
      </div>
    </div>
  </div>
)}
</div>
  );
};

export default MenuManager;