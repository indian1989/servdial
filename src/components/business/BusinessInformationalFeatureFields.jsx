// frontend/src/components/business/BusinessInformationalFeatureFields.jsx

import React, { useMemo } from "react";

// =========================================================
// INFORMATIONAL FEATURE GROUPS
// =========================================================

const INFORMATIONAL_FEATURE_GROUPS = [
  {
    key: "accessibility",
    label: "Accessibility",
    options: [
      {
        value: "wheelchair_accessible_car_park",
        label: "Wheelchair-accessible car park",
      },
      {
        value: "wheelchair_accessible_entrance",
        label: "Wheelchair-accessible entrance",
      },
      {
        value: "wheelchair_accessible_restroom",
        label: "Wheelchair-accessible restroom",
      },
      {
        value: "accessible_seating",
        label: "Accessible seating",
      },
    ],
  },

  {
    key: "serviceOptions",
    label: "Service Options",
    options: [
      {
        value: "on_site_services",
        label: "On-site services",
      },
      {
        value: "online_services",
        label: "Online services",
      },
      {
        value: "delivery",
        label: "Delivery",
      },
      {
        value: "pickup",
        label: "Pickup",
      },
      {
        value: "appointment_required",
        label: "Appointment required",
      },
    ],
  },

  {
    key: "amenities",
    label: "Amenities",
    options: [
      {
        value: "restroom",
        label: "Restroom",
      },
      {
        value: "wi_fi",
        label: "Wi-Fi",
      },
      {
        value: "air_conditioning",
        label: "Air conditioning",
      },
      {
        value: "seating_area",
        label: "Seating area",
      },
      {
        value: "waiting_area",
        label: "Waiting area",
      },
      {
        value: "drinking_water",
        label: "Drinking water",
      },
    ],
  },

  {
    key: "payments",
    label: "Payment Methods",
    options: [
      {
        value: "debit_cards",
        label: "Debit cards",
      },
      {
        value: "credit_cards",
        label: "Credit cards",
      },
      {
        value: "nfc_mobile_payments",
        label: "NFC mobile payments",
      },
      {
        value: "upi",
        label: "UPI",
      },
      {
        value: "cash",
        label: "Cash",
      },
      {
        value: "online_payment",
        label: "Online payment",
      },
    ],
  },

  {
    key: "parking",
    label: "Parking",
    options: [
      {
        value: "free_parking_lot",
        label: "Free parking lot",
      },
      {
        value: "paid_parking_lot",
        label: "Paid parking lot",
      },
      {
        value: "free_street_parking",
        label: "Free street parking",
      },
      {
        value: "paid_street_parking",
        label: "Paid street parking",
      },
      {
        value: "valet_parking",
        label: "Valet parking",
      },
      {
        value: "two_wheeler_parking",
        label: "Two-wheeler parking",
      },
    ],
  },

  {
    key: "customerExperience",
    label: "Customer Experience",
    options: [
      {
        value: "family_friendly",
        label: "Family-friendly",
      },
      {
        value: "kids_friendly",
        label: "Kids-friendly",
      },
      {
        value: "senior_friendly",
        label: "Senior-friendly",
      },
      {
        value: "quiet_environment",
        label: "Quiet environment",
      },
      {
        value: "waiting_area",
        label: "Waiting area",
      },
    ],
  },

  {
    key: "bookingOptions",
    label: "Booking & Appointments",
    options: [
      {
        value: "appointment_available",
        label: "Appointment available",
      },
      {
        value: "walk_ins_accepted",
        label: "Walk-ins accepted",
      },
      {
        value: "advance_booking",
        label: "Advance booking",
      },
      {
        value: "same_day_appointments",
        label: "Same-day appointments",
      },
    ],
  },

  {
    key: "deliveryPickup",
    label: "Delivery & Pickup",
    options: [
      {
        value: "home_delivery",
        label: "Home delivery",
      },
      {
        value: "store_pickup",
        label: "Store pickup",
      },
      {
        value: "takeaway",
        label: "Takeaway",
      },
      {
        value: "curbside_pickup",
        label: "Curbside pickup",
      },
    ],
  },

  {
    key: "facilities",
    label: "Business Facilities",
    options: [
      {
        value: "reception",
        label: "Reception",
      },
      {
        value: "customer_lounge",
        label: "Customer lounge",
      },
      {
        value: "conference_room",
        label: "Conference room",
      },
      {
        value: "changing_room",
        label: "Changing room",
      },
      {
        value: "locker_facility",
        label: "Locker facility",
      },
    ],
  },

  {
    key: "safety",
    label: "Safety & Convenience",
    options: [
      {
        value: "cctv_surveillance",
        label: "CCTV surveillance",
      },
      {
        value: "security_staff",
        label: "Security staff",
      },
      {
        value: "fire_safety_equipment",
        label: "Fire safety equipment",
      },
      {
        value: "emergency_assistance",
        label: "Emergency assistance",
      },
    ],
  },
];

// =========================================================
// NORMALIZE SELECTED FEATURES
// =========================================================

const normalizeBusinessFeatures = (value = {}) => {
  const normalized = {};

  INFORMATIONAL_FEATURE_GROUPS.forEach((group) => {
    const values = Array.isArray(value?.[group.key])
      ? value[group.key]
      : [];

    normalized[group.key] = [
      ...new Set(
        values
          .map((item) => String(item).trim().toLowerCase())
          .filter(Boolean)
      ),
    ];
  });

  return normalized;
};

// =========================================================
// COMPONENT
// =========================================================

const BusinessInformationalFeatureFields = ({
  value = {},
  onChange,
}) => {
  // -------------------------------------------------------
  // All informational feature options are available
  // for every business/category.
  // -------------------------------------------------------

  const visibleGroups = useMemo(() => {
    return INFORMATIONAL_FEATURE_GROUPS;
  }, []);

  const selectedFeatures =
    normalizeBusinessFeatures(value);

  // -------------------------------------------------------
  // Toggle option
  // -------------------------------------------------------

  const handleToggle = (groupKey, optionValue) => {
    const currentValues = Array.isArray(
      selectedFeatures[groupKey]
    )
      ? selectedFeatures[groupKey]
      : [];

    const exists =
      currentValues.includes(optionValue);

    const nextValues = exists
      ? currentValues.filter(
          (item) => item !== optionValue
        )
      : [...currentValues, optionValue];

    const nextFeatures = {
      ...selectedFeatures,
      [groupKey]: nextValues,
    };

    onChange?.(
      normalizeBusinessFeatures(nextFeatures)
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="mt-6 space-y-6">

      {/* =====================================================
          SECTION HEADER
      ===================================================== */}

      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Business Information & Features
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Select the facilities, services, amenities and
          convenience options available at this business.
        </p>

        {/* USER INSTRUCTION */}

        <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">
              Please select the applicable features.
            </span>{" "}
            Choose the features available at this business
            and leave any option blank if it is not applicable.
          </p>
        </div>
      </div>

      {/* =====================================================
          FEATURE GROUPS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {visibleGroups.map((group) => (
          <div
            key={group.key}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >

            {/* Group title */}

            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-800">
                {group.label}
              </h4>
            </div>

            {/* Options */}

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {group.options.map((option) => {
                const checked =
                  selectedFeatures[group.key]?.includes(
                    option.value
                  ) || false;

                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
                      checked
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        handleToggle(
                          group.key,
                          option.value
                        )
                      }
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />

                    <span
                      className={`text-sm ${
                        checked
                          ? "font-medium text-blue-800"
                          : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessInformationalFeatureFields;