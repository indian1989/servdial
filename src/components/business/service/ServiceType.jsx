import Select from "react-select";

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

  const selectedValues =
    serviceTypeOptions.filter(
      (option) =>
        value.includes(option.value)
    );

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

      <Select
        isMulti
        options={serviceTypeOptions}
        value={selectedValues}
        onChange={handleChange}
        placeholder="Select service types"
      />

    </div>
  );
};

export default ServiceType;