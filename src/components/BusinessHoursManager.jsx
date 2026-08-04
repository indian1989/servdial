import React from "react";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const labels = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const defaultDay = {
  open: "",
  close: "",
  closed: false,
  is24h: false,
};

const BusinessHoursManager = ({ value = {}, onChange }) => {
  const updateDay = (day, updates) => {
    onChange({
      ...value,
      [day]: {
        ...(value[day] || defaultDay),
        ...updates,
      },
    });
  };

  const handleTimeChange = (day, field, val) => {
    updateDay(day, { [field]: val });
  };

  const toggleClosed = (day) => {
    const current = value[day] || defaultDay;

    updateDay(day, {
      closed: !current.closed,
      is24h: false,
      open: "",
      close: "",
    });
  };

  const toggle24h = (day) => {
    const current = value[day] || defaultDay;

    updateDay(day, {
      is24h: !current.is24h,
      closed: false,
      open: !current.is24h ? "00:00" : "",
      close: !current.is24h ? "23:59" : "",
    });
  };

  // Copy one day to all other days
  const applyToAll = (sourceDay) => {
    const source = value[sourceDay] || defaultDay;

    const updated = { ...value };

    days.forEach((d) => {
      updated[d] = { ...source };
    });

    onChange(updated);
  };

  // Weekdays
  const applyToWeekdays = (sourceDay) => {
    const source = value[sourceDay] || defaultDay;

    const updated = { ...value };

    ["monday", "tuesday", "wednesday", "thursday", "friday"].forEach(
      (d) => {
        updated[d] = { ...source };
      }
    );

    onChange(updated);
  };

  // Weekends
  const applyToWeekends = (sourceDay) => {
    const source = value[sourceDay] || defaultDay;

    const updated = { ...value };

    ["saturday", "sunday"].forEach((d) => {
      updated[d] = { ...source };
    });

    onChange(updated);
  };

  // Set all 24h
  const setAll24h = () => {
    const updated = {};

    days.forEach((d) => {
      updated[d] = {
        open: "00:00",
        close: "23:59",
        closed: false,
        is24h: true,
      };
    });

    onChange(updated);
  };

  // Set all closed
  const setAllClosed = () => {
    const updated = {};

    days.forEach((d) => {
      updated[d] = {
        open: "",
        close: "",
        closed: true,
        is24h: false,
      };
    });

    onChange(updated);
  };

  return (
    <div className="border rounded-2xl bg-white shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          Business Hours
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Set opening and closing times for each day.
        </p>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            type="button"
            onClick={setAll24h}
            className="text-sm px-3 py-2 rounded-lg border hover:bg-gray-50"
          >
            Set all 24 Hours
          </button>

          <button
            type="button"
            onClick={setAllClosed}
            className="text-sm px-3 py-2 rounded-lg border hover:bg-gray-50"
          >
            Set all Closed
          </button>
        </div>
      </div>

      <div className="divide-y">
        {days.map((day) => {
          const current = value[day] || defaultDay;

          return (
            <div
              key={day}
              className="p-4 flex flex-col lg:flex-row lg:items-center gap-4"
            >
              {/* Day */}
              <div className="w-28 font-medium text-gray-900">
                {labels[day]}
              </div>

              {/* Time inputs */}
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="time"
                  value={current.open || ""}
                  disabled={current.closed || current.is24h}
                  onChange={(e) =>
                    handleTimeChange(day, "open", e.target.value)
                  }
                  className="border rounded-lg px-3 py-2 text-sm disabled:bg-gray-100"
                />

                <span className="text-gray-500">to</span>

                <input
                  type="time"
                  value={current.close || ""}
                  disabled={current.closed || current.is24h}
                  onChange={(e) =>
                    handleTimeChange(day, "close", e.target.value)
                  }
                  className="border rounded-lg px-3 py-2 text-sm disabled:bg-gray-100"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={current.closed || false}
                    onChange={() => toggleClosed(day)}
                  />
                  Closed
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={current.is24h || false}
                    onChange={() => toggle24h(day)}
                  />
                  24 Hours
                </label>
              </div>

              {/* Copy actions */}
              <div className="flex items-center gap-2 flex-wrap lg:ml-auto">
                <button
                  type="button"
                  onClick={() => applyToAll(day)}
                  className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
                >
                  All
                </button>

                <button
                  type="button"
                  onClick={() => applyToWeekdays(day)}
                  className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
                >
                  Mon–Fri
                </button>

                <button
                  type="button"
                  onClick={() => applyToWeekends(day)}
                  className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
                >
                  Sat–Sun
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessHoursManager;