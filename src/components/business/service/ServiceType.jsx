import CreatableSelect from "react-select/creatable";

const serviceTypeOptions = [
  {
    value: "home",
    label: "Home Service",
  },
  {
    value: "shop",
    label: "Shop / In-store",
  },
  {
    value: "online",
    label: "Online Service",
  },
  {
    value: "onsite",
    label: "On-site Visit",
  },
  {
    value: "mobile-sale",
    label: "Mobile Sales & Accessories",
  },
  {
    value: "sale-service",
    label: "Sale & Service",
  },
  {
    value: "pickup",
    label: "Pickup Available",
  },
  {
    value: "delivery",
    label: "Delivery Available",
  },
  {
    value: "appointment",
    label: "Appointment Available",
  },
  {
    value: "booking",
    label: "Booking Available",
  },
  {
    value: "consultation",
    label: "Consultation Available",
  },
];

const ServiceType = ({
  value = [],
  onChange,
}) => {

  /*
   * Existing values ko options ke saath merge kar rahe hain.
   * Isse agar database me custom service type already saved hai
   * to wo bhi select me properly show hoga.
   */
  const customOptions = value
    .filter(
      (item) =>
        item &&
        !serviceTypeOptions.some(
          (option) => option.value === item
        )
    )
    .map((item) => ({
      value: item,
      label: item,
    }));

  const allOptions = [
    ...serviceTypeOptions,
    ...customOptions,
  ];

  const selectedValues = value.map((item) => {

    const existingOption = allOptions.find(
      (option) => option.value === item
    );

    return (
      existingOption || {
        value: item,
        label: item,
      }
    );

  });

  const handleChange = (selected) => {

    onChange?.(
      (selected || []).map(
        (option) => option.value
      )
    );

  };

  return (
    <div className="mt-6">

      <h3 className="font-semibold mb-3">
        Service Type
      </h3>

      <CreatableSelect
        isMulti
        options={allOptions}
        value={selectedValues}
        onChange={handleChange}
        placeholder="Search or type service type..."
        isClearable
        formatCreateLabel={(inputValue) =>
          `Add "${inputValue}"`
        }
        noOptionsMessage={({ inputValue }) =>
          inputValue
            ? `Press Enter to add "${inputValue}"`
            : "No service type found"
        }
      />

      <p className="text-xs text-gray-500 mt-2">
        Search an existing service type or type your own and press Enter.
      </p>

    </div>
  );
};

export default ServiceType;