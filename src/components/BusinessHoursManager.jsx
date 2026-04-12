import React from "react";

const days = [
  "monday","tuesday","wednesday","thursday","friday","saturday","sunday"
];

const BusinessHoursManager = ({ value, onChange }) => {

  const handleChange = (day, field, val) => {
    onChange({
      ...value,
      [day]: {
        ...value[day],
        [field]: val
      }
    });
  };

  return (
    <div className="border p-4 rounded">
      <h2 className="font-semibold mb-3">Business Hours</h2>

      {days.map((day) => (
        <div key={day} className="flex items-center gap-2 mb-2">

          <div className="w-24 capitalize">{day}</div>

          <input
            type="time"
            value={value?.[day]?.open || ""}
            disabled={value?.[day]?.closed}
            onChange={(e) => handleChange(day, "open", e.target.value)}
            className="border p-1"
          />

          <span>-</span>

          <input
            type="time"
            value={value?.[day]?.close || ""}
            disabled={value?.[day]?.closed}
            onChange={(e) => handleChange(day, "close", e.target.value)}
            className="border p-1"
          />

          <label className="flex items-center gap-1 ml-2">
            <input
              type="checkbox"
              checked={value?.[day]?.closed || false}
              onChange={(e) => handleChange(day, "closed", e.target.checked)}
            />
            Closed
          </label>

        </div>
      ))}
    </div>
  );
};

export default BusinessHoursManager;