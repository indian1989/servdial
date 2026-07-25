// src/components/business/ServicesManager.jsx

import { Plus, Trash2, Wrench } from "lucide-react";

const emptyService = {
  name: "",
  description: "",
};

const ServicesManager = ({
  value = [],
  onChange,
}) => {

  const services = Array.isArray(value)
    ? value
    : [];

  const update = (index, field, fieldValue) => {

    const updated = [...services];

    updated[index] = {
      ...updated[index],
      [field]: fieldValue,
    };

    onChange(updated);
  };

  const addService = () => {

    onChange([
      ...services,
      { ...emptyService },
    ]);

  };

  const removeService = (index) => {

    onChange(
      services.filter((_, i) => i !== index)
    );

  };

  return (

    <div className="bg-white border rounded-2xl p-6 space-y-5">

      <div className="flex items-center gap-2">

        <Wrench className="text-indigo-600" />

        <h2 className="text-xl font-bold">
          Services
        </h2>

      </div>

      {services.map((service, index) => (

        <div
          key={index}
          className="border rounded-xl p-4 space-y-3"
        >

          <div className="grid md:grid-cols-2 gap-3">

            <input
              type="text"
              placeholder="Service Name"
              value={service.name}
              onChange={(e) =>
                update(
                  index,
                  "name",
                  e.target.value
                )
              }
              className="border rounded-lg p-3"
            />

            <input
              type="text"
              placeholder="Description"
              value={service.description}
              onChange={(e) =>
                update(
                  index,
                  "description",
                  e.target.value
                )
              }
              className="border rounded-lg p-3"
            />

          </div>

          <button
            type="button"
            onClick={() => removeService(index)}
            className="
              flex
              items-center
              gap-2
              text-red-600
              text-sm
            "
          >
            <Trash2 size={16} />
            Remove
          </button>

        </div>

      ))}

      <button
        type="button"
        onClick={addService}
        className="
          flex
          items-center
          gap-2
          bg-indigo-600
          hover:bg-indigo-700
          text-white
          px-5
          py-3
          rounded-xl
        "
      >
        <Plus size={18} />
        Add Service
      </button>

      {services.length === 0 && (

        <div className="text-sm text-gray-500">
          No services added.
        </div>

      )}

    </div>

  );

};

export default ServicesManager;