// frontend/src/components/business/BusinessFeatures.jsx

import React, { useMemo } from "react";

// =========================================================
// INFORMATIONAL FEATURE LABELS
// =========================================================

const FEATURE_GROUPS = [
  {
    key: "accessibility",
    title: "Accessibility",
    icon: "♿",
    options: {
      wheelchair_accessible_car_park:
        "Wheelchair-accessible car park",

      wheelchair_accessible_entrance:
        "Wheelchair-accessible entrance",

      wheelchair_accessible_restroom:
        "Wheelchair-accessible restroom",

      accessible_seating:
        "Accessible seating",
    },
  },

  {
    key: "serviceOptions",
    title: "Service Options",
    icon: "🛎️",
    options: {
      on_site_services: "On-site services",
      online_services: "Online services",
      delivery: "Delivery",
      pickup: "Pickup",
      appointment_required: "Appointment required",
    },
  },

  {
    key: "amenities",
    title: "Amenities",
    icon: "✨",
    options: {
      restroom: "Restroom",
      wi_fi: "Wi-Fi",
      air_conditioning: "Air conditioning",
      seating_area: "Seating area",
      waiting_area: "Waiting area",
      drinking_water: "Drinking water",
    },
  },

  {
    key: "payments",
    title: "Payment Methods",
    icon: "💳",
    options: {
      debit_cards: "Debit cards",
      credit_cards: "Credit cards",
      nfc_mobile_payments: "NFC mobile payments",
      upi: "UPI",
      cash: "Cash",
      online_payment: "Online payment",
    },
  },

  {
    key: "parking",
    title: "Parking",
    icon: "🅿️",
    options: {
      free_parking_lot: "Free parking lot",
      paid_parking_lot: "Paid parking lot",
      free_street_parking: "Free street parking",
      paid_street_parking: "Paid street parking",
      valet_parking: "Valet parking",
      two_wheeler_parking: "Two-wheeler parking",
    },
  },

  {
    key: "customerExperience",
    title: "Customer Experience",
    icon: "😊",
    options: {
      family_friendly: "Family-friendly",
      kids_friendly: "Kids-friendly",
      senior_friendly: "Senior-friendly",
      quiet_environment: "Quiet environment",
      waiting_area: "Waiting area",
    },
  },

  {
    key: "bookingOptions",
    title: "Booking & Appointments",
    icon: "📅",
    options: {
      appointment_available: "Appointment available",
      walk_ins_accepted: "Walk-ins accepted",
      advance_booking: "Advance booking",
      same_day_appointments: "Same-day appointments",
    },
  },

  {
    key: "deliveryPickup",
    title: "Delivery & Pickup",
    icon: "📦",
    options: {
      home_delivery: "Home delivery",
      store_pickup: "Store pickup",
      takeaway: "Takeaway",
      curbside_pickup: "Curbside pickup",
    },
  },

  {
    key: "facilities",
    title: "Business Facilities",
    icon: "🏢",
    options: {
      reception: "Reception",
      customer_lounge: "Customer lounge",
      conference_room: "Conference room",
      changing_room: "Changing room",
      locker_facility: "Locker facility",
    },
  },

  {
    key: "safety",
    title: "Safety & Convenience",
    icon: "🛡️",
    options: {
      cctv_surveillance: "CCTV surveillance",
      security_staff: "Security staff",
      fire_safety_equipment: "Fire safety equipment",
      emergency_assistance: "Emergency assistance",
    },
  },
];

// =========================================================
// NORMALIZE BUSINESS FEATURES
// =========================================================

const normalizeBusinessFeatures = (value = {}) => {
  const normalized = {};

  FEATURE_GROUPS.forEach((group) => {
    const values = Array.isArray(value?.[group.key])
      ? value[group.key]
      : [];

    normalized[group.key] = [
      ...new Set(
        values
          .map((item) =>
            String(item)
              .trim()
              .toLowerCase()
          )
          .filter(Boolean)
      ),
    ];
  });

  return normalized;
};

// =========================================================
// COMPONENT
// =========================================================

const BusinessFeatures = ({ business }) => {
  const businessFeatures = useMemo(() => {
    return normalizeBusinessFeatures(
      business?.businessFeatures || {}
    );
  }, [business]);

  // =======================================================
  // BUILD ONLY SELECTED / VALID GROUPS
  // =======================================================

  const visibleGroups = useMemo(() => {
    return FEATURE_GROUPS.map((group) => {
      const selectedValues =
        businessFeatures[group.key] || [];

      const options = selectedValues
        .map((value) => ({
          value,
          label: group.options[value],
        }))
        .filter((option) => option.label);

      return {
        ...group,
        options,
      };
    }).filter((group) => group.options.length > 0);
  }, [businessFeatures]);

  // =======================================================
  // NOTHING SELECTED
  // =======================================================

  if (!visibleGroups.length) {
    return null;
  }

  return (
    <section
  id="service_information"
  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
>
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-900">
          Business Information & Features
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Facilities, services, amenities and convenience
          options available at this business.
        </p>
      </div>

      {/* ===================================================
          FEATURE GROUPS
      =================================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {visibleGroups.map((group) => (
          <div
            key={group.key}
            className="rounded-xl border border-gray-200 bg-gray-50 p-4"
          >
            {/* GROUP TITLE */}

            <div className="mb-3 flex items-center gap-2">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-base shadow-sm"
                aria-hidden="true"
              >
                {group.icon}
              </span>

              <h3 className="text-sm font-semibold text-gray-900">
                {group.title}
              </h3>
            </div>

            {/* FEATURE CHIPS */}

            <div className="flex flex-wrap gap-2">
              {group.options.map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm"
                >
                  <span
                    className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"
                    aria-hidden="true"
                  />

                  {option.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BusinessFeatures;