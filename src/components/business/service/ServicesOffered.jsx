import CreatableSelect from "react-select/creatable";

const ServicesOffered = ({
  value = [],
  suggestions = [],
  onChange,
}) => {

  const services = Array.isArray(value)
    ? value
    : [];

  const options = suggestions.map((service) => ({
    value: service,
    label: service,
  }));

  const selectedValues = services
    .filter((service) => service?.name)
    .map((service) => ({
      value: service.name,
      label: service.name,
    }));

  const handleServicesChange = (selected) => {

    const existingServices = services;

    const updatedServices = (selected || []).map(
      (option) => {

        const existingService =
          existingServices.find(
            (service) =>
              service.name === option.value
          );

        return {
          name: option.value,
          description:
            existingService?.description || "",
        };
      }
    );

    onChange?.(updatedServices);
  };

  const handleDescriptionChange = (
    index,
    description
  ) => {

    const updatedServices = [
      ...services,
    ];

    updatedServices[index] = {
      ...updatedServices[index],
      description,
    };

    onChange?.(updatedServices);
  };

  return (
    <div className="mt-6">

      <h3 className="font-semibold mb-3">
        Services Offered
      </h3>

      <CreatableSelect
        isMulti
        options={options}
        value={selectedValues}
        onChange={handleServicesChange}
        placeholder="Select or type services"
      />

      {/* ================= SERVICE DESCRIPTIONS ================= */}

      {services.map(
        (service, index) => (

          <div
            key={`${service.name}-${index}`}
            className="
              mt-3
              border
              rounded-xl
              p-3
              bg-gray-50
            "
          >

            <label
              className="
                text-sm
                font-medium
              "
            >
              {service.name} Description
            </label>

            <textarea
              value={
                service.description || ""
              }
              onChange={(e) =>
                handleDescriptionChange(
                  index,
                  e.target.value
                )
              }
              placeholder={`Describe ${service.name} service...`}
              rows={2}
              className="
                border
                rounded-lg
                p-2
                w-full
                mt-2
              "
            />

          </div>

        )
      )}

    </div>
  );
};

export default ServicesOffered;