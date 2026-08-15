import { useEffect, useState } from "react";

const DEFAULT_DATA = {
  enabled: false,

  bookingTypes: [],

  minGuests: "",

  maxGuests: "",

  advanceAmount: "",

  advanceType: "fixed",

  bookingNotice: "24",

  contactNumber: "",

  whatsappBooking: true,

  notes: "",

  cancellationPolicy: "",

  paymentModes: [],

  availableSlots: [
    {
      label: "Morning",
      start: "09:00",
      end: "13:00",
    },
  ],
};

const BOOKING_TYPES = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Corporate",
  "Kitty Party",
  "Baby Shower",
  "Engagement",
  "Reception",
  "Farewell",
  "Get Together",
  "Other",
];

const PAYMENT_MODES = [
  "Cash",
  "UPI",
  "Card",
  "Net Banking",
];

const BOOKING_NOTICE_OPTIONS = [
  {
    label: "Same Day",
    value: "0",
  },
  {
    label: "12 Hours",
    value: "12",
  },
  {
    label: "24 Hours",
    value: "24",
  },
  {
    label: "48 Hours",
    value: "48",
  },
  {
    label: "72 Hours",
    value: "72",
  },
  {
    label: "1 Week",
    value: "168",
  },
];

const PartyBookingManager = ({
  value,
  onChange,
}) => {

  const [form, setForm] = useState({
    ...DEFAULT_DATA,
    ...(value || {}),
  });

  useEffect(() => {

    if (value) {

      setForm({
        ...DEFAULT_DATA,
        ...value,
      });

    }

  }, [value]);

  const updateField = (
    key,
    val
  ) => {

    const updated = {

      ...form,

      [key]: val,

    };

    setForm(updated);

    onChange?.(updated);

  };

  const toggleBookingType = (
    type
  ) => {

    let updatedTypes = [];

    if (
      form.bookingTypes.includes(type)
    ) {

      updatedTypes =
        form.bookingTypes.filter(
          (x) => x !== type
        );

    } else {

      updatedTypes = [
        ...form.bookingTypes,
        type,
      ];

    }

    updateField(
      "bookingTypes",
      updatedTypes
    );

  };

  const togglePaymentMode = (
    mode
  ) => {

    let updatedModes = [];

    if (
      form.paymentModes.includes(mode)
    ) {

      updatedModes =
        form.paymentModes.filter(
          (x) => x !== mode
        );

    } else {

      updatedModes = [
        ...form.paymentModes,
        mode,
      ];

    }

    updateField(
      "paymentModes",
      updatedModes
    );

  };

  const updateSlot = (
    index,
    key,
    value
  ) => {

    const slots = [
      ...form.availableSlots,
    ];

    slots[index][key] = value;

    updateField(
      "availableSlots",
      slots
    );

  };

  const addSlot = () => {

    updateField(
      "availableSlots",
      [
        ...form.availableSlots,
        {
          label: "",
          start: "",
          end: "",
        },
      ]
    );

  };

  const removeSlot = (
    index
  ) => {

    const slots =
      form.availableSlots.filter(
        (_, i) => i !== index
      );

    updateField(
      "availableSlots",
      slots
    );

  };

  const [expanded, setExpanded] = useState(form.enabled);
  useEffect(() => {
    if (form.enabled) {
      setExpanded(true);
    }
  }, [form.enabled]);

  return (
  <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm">

    {/* Header */}

    <button
      type="button"
      onClick={() => setExpanded(!expanded)}
      className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition text-left"
    >

      <div className="flex items-center gap-4">

        <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center text-2xl">
          🎉
        </div>

        <div>

          <h3 className="font-semibold text-lg text-gray-900">
            Party Booking
          </h3>

          <p className="text-sm text-gray-500">
            {form.bookingTypes.length > 0
              ? `${form.bookingTypes.length} booking types selected`
              : "Configure party booking options"}
          </p>

        </div>

      </div>

      <div className="flex items-center gap-3">

        <span
          className={`text-sm font-medium ${
            form.enabled ? "text-green-600" : "text-gray-400"
          }`}
        >
          {form.enabled ? "Enabled" : "Disabled"}
        </span>

        <div className="w-8 h-8 rounded-lg border flex items-center justify-center text-gray-500">
          {expanded ? "−" : "+"}
        </div>

      </div>

    </button>

    {/* Enable */}

    <div className="px-5 pb-5">

      <label className="flex items-center gap-3 text-sm font-medium text-gray-700">

        <input
          type="checkbox"
          checked={form.enabled}
          onChange={(e) => {
            updateField("enabled", e.target.checked);
            if (e.target.checked) setExpanded(true);
          }}
          className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
        />

        Enable Party Booking

      </label>

    </div>

    {/* Expandable Content */}

    {form.enabled && expanded && (
      <div className="border-t px-5 py-5 space-y-6">

  
            {/* ================= BOOKING TYPES ================= */}

      <div>

        <h3 className="font-semibold mb-3">

          Booking Types

        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">

          {BOOKING_TYPES.map((type) => (

            <label
              key={type}
              className="flex items-center gap-2 border rounded-lg p-2 cursor-pointer hover:bg-gray-50"
            >

              <input
                type="checkbox"
                checked={form.bookingTypes.includes(type)}
                onChange={() =>
                  toggleBookingType(type)
                }
              />

              <span className="text-sm">

                {type}

              </span>

            </label>

          ))}

        </div>

      </div>

      {/* ================= GUEST CAPACITY ================= */}

      <div>

        <h3 className="font-semibold mb-3">

          Guest Capacity

        </h3>

        <div className="grid md:grid-cols-2 gap-4">

          <div>

            <label className="block text-sm mb-1">

              Minimum Guests

            </label>

            <input
              type="number"
              min="1"
              value={form.minGuests}
              onChange={(e) =>
                updateField(
                  "minGuests",
                  e.target.value
                )
              }
              className="w-full border rounded-lg p-2"
            />

          </div>

          <div>

            <label className="block text-sm mb-1">

              Maximum Guests

            </label>

            <input
              type="number"
              min="1"
              value={form.maxGuests}
              onChange={(e) =>
                updateField(
                  "maxGuests",
                  e.target.value
                )
              }
              className="w-full border rounded-lg p-2"
            />

          </div>

        </div>

      </div>

      {/* ================= ADVANCE PAYMENT ================= */}

      <div>

        <h3 className="font-semibold mb-3">

          Advance Payment

        </h3>

        <div className="grid md:grid-cols-2 gap-4">

          <div>

            <label className="block text-sm mb-1">

              Advance Amount (₹)

            </label>

            <input
              type="number"
              min="0"
              value={form.advanceAmount}
              onChange={(e) =>
                updateField(
                  "advanceAmount",
                  e.target.value
                )
              }
              className="w-full border rounded-lg p-2"
            />

          </div>

          <div>

            <label className="block text-sm mb-1">

              Advance Type

            </label>

            <select
              value={form.advanceType}
              onChange={(e) =>
                updateField(
                  "advanceType",
                  e.target.value
                )
              }
              className="w-full border rounded-lg p-2"
            >

              <option value="fixed">

                Fixed Amount

              </option>

              <option value="percentage">

                Percentage

              </option>

            </select>

          </div>

        </div>

      </div>

      {/* ================= BOOKING NOTICE ================= */}

      <div>

        <h3 className="font-semibold mb-3">

          Booking Notice

        </h3>

        <select
          value={form.bookingNotice}
          onChange={(e) =>
            updateField(
              "bookingNotice",
              e.target.value
            )
          }
          className="w-full border rounded-lg p-2"
        >

          {BOOKING_NOTICE_OPTIONS.map((item) => (

            <option
              key={item.value}
              value={item.value}
            >

              {item.label}

            </option>

          ))}

        </select>

      </div>

      {/* ================= CONTACT ================= */}

      <div>

        <h3 className="font-semibold mb-3">

          Contact Information

        </h3>

        <div className="grid md:grid-cols-2 gap-4">

          <div>

            <label className="block text-sm mb-1">

              Contact Number

            </label>

            <input
              type="tel"
              value={form.contactNumber}
              onChange={(e) =>
                updateField(
                  "contactNumber",
                  e.target.value
                )
              }
              placeholder="9876543210"
              className="w-full border rounded-lg p-2"
            />

          </div>

          <div className="flex items-end">

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={form.whatsappBooking}
                onChange={(e) =>
                  updateField(
                    "whatsappBooking",
                    e.target.checked
                  )
                }
              />

              <span>

                Accept WhatsApp Booking

              </span>

            </label>

          </div>

        </div>

      </div>

            {/* ================= TIME SLOTS ================= */}

      <div>

        <div className="flex justify-between items-center mb-3">

          <h3 className="font-semibold">

            Available Time Slots

          </h3>

          <button
            type="button"
            onClick={addSlot}
            className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            + Add Slot
          </button>

        </div>

        <div className="space-y-4">

          {form.availableSlots.map((slot, index) => (

            <div
              key={index}
              className="border rounded-lg p-4 bg-gray-50"
            >

              <div className="grid md:grid-cols-4 gap-3">

                <div>

                  <label className="block text-sm mb-1">

                    Slot Name

                  </label>

                  <input
                    type="text"
                    value={slot.label}
                    placeholder="Morning"
                    onChange={(e) =>
                      updateSlot(
                        index,
                        "label",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-lg p-2"
                  />

                </div>

                <div>

                  <label className="block text-sm mb-1">

                    Start Time

                  </label>

                  <input
                    type="time"
                    value={slot.start}
                    onChange={(e) =>
                      updateSlot(
                        index,
                        "start",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-lg p-2"
                  />

                </div>

                <div>

                  <label className="block text-sm mb-1">

                    End Time

                  </label>

                  <input
                    type="time"
                    value={slot.end}
                    onChange={(e) =>
                      updateSlot(
                        index,
                        "end",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-lg p-2"
                  />

                </div>

                <div className="flex items-end">

                  <button
                    type="button"
                    onClick={() =>
                      removeSlot(index)
                    }
                    className="w-full bg-red-600 text-white rounded-lg p-2 hover:bg-red-700"
                  >
                    Remove
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* ================= NOTES ================= */}

      <div>

        <h3 className="font-semibold mb-3">

          Notes

        </h3>

        <textarea
          rows={4}
          value={form.notes}
          onChange={(e) =>
            updateField(
              "notes",
              e.target.value
            )
          }
          placeholder="Outside decoration allowed, DJ extra charges, Cake allowed..."
          className="w-full border rounded-lg p-3"
        />

      </div>

      {/* ================= CANCELLATION POLICY ================= */}

<div>

  <h3 className="font-semibold mb-3">
    Cancellation Policy
  </h3>

  <textarea
    rows={4}
    value={form.cancellationPolicy}
    onChange={(e) =>
      updateField(
        "cancellationPolicy",
        e.target.value
      )
    }
    placeholder="Advance non-refundable. Cancellation before 48 hours eligible for 50% refund."
    className="w-full border rounded-lg p-3"
  />

</div>

      {/* ================= PAYMENT MODES ================= */}
      <div>

        <h3 className="font-semibold mb-3">
          Accepted Payment Modes
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          {PAYMENT_MODES.map((mode) => (

            <label
              key={mode}
              className="flex items-center gap-2 border rounded-lg p-2 cursor-pointer hover:bg-gray-50"
            >

              <input
                type="checkbox"
                checked={form.paymentModes.includes(mode)}
                onChange={() => togglePaymentMode(mode)}
              />

              <span>{mode}</span>

            </label>

          ))}

        </div>

      </div>

              {/* ================= VENUE FACILITIES ================= */}

      <div>

        <h3 className="font-semibold mb-3">

          Venue & Facilities

        </h3>

        <div className="grid md:grid-cols-2 gap-4">

          {/* Venue Type */}

          <div>

            <label className="block text-sm mb-1">
              Venue Type
            </label>

            <select
              value={form.venueType || ""}
              onChange={(e) =>
                updateField("venueType", e.target.value)
              }
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select Venue</option>
              <option>Restaurant</option>
              <option>Banquet Hall</option>
              <option>Hotel</option>
              <option>Resort</option>
              <option>Farm House</option>
              <option>Roof Top</option>
              <option>Open Lawn</option>
              <option>Community Hall</option>
            </select>

          </div>

          {/* Veg / Non Veg */}

          <div>

            <label className="block text-sm mb-1">

              Food Type

            </label>

            <select
              value={form.foodType || ""}
              onChange={(e) =>
                updateField("foodType", e.target.value)
              }
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select</option>
              <option>Veg</option>
              <option>Non Veg</option>
              <option>Both</option>
            </select>

          </div>

        </div>

      </div>

      {/* ================= FACILITY OPTIONS ================= */}

      <div>

        <h3 className="font-semibold mb-3">

          Available Facilities

        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">

          {[
            "AC Hall",
            "Outdoor Seating",
            "Parking",
            "Decoration",
            "DJ",
            "Live Music",
            "Catering",
            "Photography",
            "Projector",
            "Stage",
            "Generator Backup",
            "Wheelchair Accessible",
            "Kids Play Area",
            "Power Backup",
            "Valet Parking",
            "Security",
          ].map((facility) => (

            <label
              key={facility}
              className="flex items-center gap-2 border rounded-lg p-2 cursor-pointer hover:bg-gray-50"
            >

              <input
                type="checkbox"
                checked={
                  (form.facilities || []).includes(facility)
                }
                onChange={() => {

                  let updated = [...(form.facilities || [])];

                  if (updated.includes(facility)) {

                    updated = updated.filter(
                      (x) => x !== facility
                    );

                  } else {

                    updated.push(facility);

                  }

                  updateField(
                    "facilities",
                    updated
                  );

                }}
              />

              <span className="text-sm">

                {facility}

              </span>

            </label>

          ))}

        </div>

      </div>

      {/* ================= EXTRA CHARGES ================= */}

      <div>

        <h3 className="font-semibold mb-3">

          Extra Charges

        </h3>

        <div className="grid md:grid-cols-3 gap-4">

          <div>

            <label className="block text-sm mb-1">

              Decoration Charge (₹)

            </label>

            <input
              type="number"
              value={form.decorationCharge || ""}
              onChange={(e) =>
                updateField(
                  "decorationCharge",
                  e.target.value
                )
              }
              className="w-full border rounded-lg p-2"
            />

          </div>

          <div>

            <label className="block text-sm mb-1">

              DJ Charge (₹)

            </label>

            <input
              type="number"
              value={form.djCharge || ""}
              onChange={(e) =>
                updateField(
                  "djCharge",
                  e.target.value
                )
              }
              className="w-full border rounded-lg p-2"
            />

          </div>

          <div>

            <label className="block text-sm mb-1">

              Catering Charge (₹)

            </label>

            <input
              type="number"
              value={form.cateringCharge || ""}
              onChange={(e) =>
                updateField(
                  "cateringCharge",
                  e.target.value
                )
              }
              className="w-full border rounded-lg p-2"
            />

          </div>

        </div>

      </div>

      {/* ================= EVENT DESCRIPTION ================= */}

      <div>

        <h3 className="font-semibold mb-3">

          Event Description

        </h3>

        <textarea
          rows={5}
          value={form.eventDescription || ""}
          onChange={(e) =>
            updateField(
              "eventDescription",
              e.target.value
            )
          }
          placeholder="Describe party booking facilities, venue highlights, decoration, catering, parking, etc."
          className="w-full border rounded-lg p-3"
        />

      </div>

      </div>

       )}

    </div>
        

  );

};

export default PartyBookingManager;