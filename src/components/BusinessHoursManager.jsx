import React from "react";

const days = [
  "monday","tuesday","wednesday","thursday","friday","saturday","sunday"
];

const defaultDay = {
  open: "",
  close: "",
  closed: false,
  is24h: false,
};

const BusinessHoursManager = ({ value, onChange }) => {

  const handleChange = (day, field, val) => {
  const current = value?.[day] || defaultDay;

  onChange({
    ...value,
    [day]: {
      ...current,
      [field]: val,
    },
  });
};

const toggleClosed = (day) => {
  const current = value?.[day] || defaultDay;

  onChange({
    ...value,
    [day]: {
      ...current,
      closed: !current.closed,
      is24h: false,
      open: "",
      close: "",
    },
  });
};

const toggle24h = (day) => {
  const current = value?.[day] || defaultDay;

  onChange({
    ...value,
    [day]: {
      ...current,
      is24h: !current.is24h,
      closed: false,
      open: "00:00",
      close: "23:59",
    },
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
            disabled={value?.[day]?.closed || value?.[day]?.is24h}
            onChange={() => toggleClosed(day)}
            className="border p-1"
          />

          <span className="px-1 text-gray-500">to</span>

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

          <label className="flex items-center gap-1 ml-2">
          <input
            type="checkbox"
            checked={value?.[day]?.is24h || false}
            onChange={() => toggle24h(day)}
          />
          24h
        </label>

        </div>
      ))}
    </div>
  );
};

export default BusinessHoursManager;