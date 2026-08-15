import { useEffect, useState } from "react";

const defaultValue = {
  enabled: false,
  consultationModes: [],
  slotDuration: 30,
  advanceBookingDays: 7,
  sameDayBooking: true,
  bufferBetweenAppointments: 0,
  contactNumber: "",
  notes: "",
};

const modes = [
  "In Clinic / Office",
  "Home Visit",
  "Phone Call",
  "Video Call",
];

const AppointmentBookingManager = ({
  value,
  onChange,
}) => {
  const [state, setState] = useState({
    ...defaultValue,
    ...(value || {}),
  });

  useEffect(() => {
    onChange?.(state);
  }, [state, onChange]);

  const toggleMode = (mode) => {
    setState((prev) => ({
      ...prev,
      consultationModes: prev.consultationModes.includes(mode)
        ? prev.consultationModes.filter((m) => m !== mode)
        : [...prev.consultationModes, mode],
    }));
  };

  return (
    <div className="bg-white border rounded-2xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Appointment Booking
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Enable appointment scheduling for this business.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={state.enabled}
            onChange={(e) =>
              setState((prev) => ({
                ...prev,
                enabled: e.target.checked,
              }))
            }
          />
          <span className="text-sm font-medium">
            Enable
          </span>
        </label>
      </div>

      {!state.enabled ? (
        <p className="text-sm text-gray-500">
          Turn on appointment booking to configure consultation modes,
          slot duration, booking rules, and contact details.
        </p>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Consultation Modes
            </label>

            <div className="grid grid-cols-2 gap-3">
              {modes.map((mode) => {
                const active = state.consultationModes.includes(mode);

                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => toggleMode(mode)}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition ${
                      active
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 hover:border-gray-400 text-gray-700"
                    }`}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slot Duration (minutes)
              </label>
              <input
                type="number"
                min="5"
                value={state.slotDuration}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    slotDuration: Number(e.target.value),
                  }))
                }
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Advance Booking Days
              </label>
              <input
                type="number"
                min="0"
                value={state.advanceBookingDays}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    advanceBookingDays: Number(e.target.value),
                  }))
                }
                className="w-full border rounded-xl p-3"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buffer Between Appointments (minutes)
              </label>
              <input
                type="number"
                min="0"
                value={state.bufferBetweenAppointments}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    bufferBetweenAppointments: Number(e.target.value),
                  }))
                }
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div className="flex items-center gap-3 pt-8">
              <input
                id="sameDayBooking"
                type="checkbox"
                checked={state.sameDayBooking}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    sameDayBooking: e.target.checked,
                  }))
                }
              />
              <label
                htmlFor="sameDayBooking"
                className="text-sm font-medium text-gray-700"
              >
                Allow same day booking
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Booking Contact Number
            </label>
            <input
              value={state.contactNumber}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  contactNumber: e.target.value,
                }))
              }
              placeholder="Enter booking contact number"
              className="w-full border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              rows={4}
              value={state.notes}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              placeholder="Mention appointment instructions, timings, or policies"
              className="w-full border rounded-xl p-3 resize-none"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AppointmentBookingManager;