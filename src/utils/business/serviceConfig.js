// frontend/src/utils/business/serviceConfig.js

import {
  UNIQUE_SERVICE_LIBRARY,
} from "./serviceLibrary";

/* =========================================================
   CATEGORY-SPECIFIC SERVICE SUGGESTIONS
   ---------------------------------------------------------
   These are the most relevant services shown first
   for a particular category.
========================================================= */

export const SERVICE_SUGGESTIONS_BY_CATEGORY = {

  electrician: [
    "Electrical Installation",
    "Fan Repair",
    "Wiring Work",
    "MCB Installation",
    "Switch Board Repair",
    "Inverter Installation",
    "Meter Connection",
    "Light Fitting",
  ],

  plumber: [
    "Leak Repair",
    "Tap Installation",
    "Pipe Fitting",
    "Bathroom Repair",
    "Water Tank Connection",
    "Drainage Cleaning",
  ],

  salon: [
    "Hair Cut",
    "Facial",
    "Hair Spa",
    "Hair Coloring",
    "Beard Styling",
    "Bridal Makeup",
  ],

  restaurant: [
    "Dine In",
    "Takeaway",
    "Home Delivery",
    "Order Online",
    "Family Dining",
    "Party Orders",
    "Catering Service",
  ],

  gym: [
    "Weight Training",
    "Cardio Workout",
    "Personal Training",
    "Fat Loss Program",
    "Muscle Gain Program",
    "Functional Training",
  ],

  hotel: [
    "AC Rooms",
    "Family Rooms",
    "Room Service",
    "Parking",
    "24 Hour Reception",
    "Online Booking",
  ],

  dentalclinic: [
    "Tooth Cleaning",
    "Root Canal Treatment",
    "Dental Filling",
    "Braces Consultation",
    "Tooth Extraction",
    "Teeth Whitening",
  ],

  advocate: [
    "Legal Consultation",
    "Civil Case",
    "Criminal Case",
    "Property Dispute",
    "Documentation",
    "Court Representation",
  ],

  printingpress: [
    "Visiting Card Printing",
    "Wedding Card Printing",
    "Flex Printing",
    "Banner Printing",
    "Offset Printing",
    "Digital Printing",
  ],

  mobilephone: [
    "Mobile Sales",
    "Mobile Repair",
    "Screen Replacement",
    "Battery Replacement",
    "Accessories",
    "Software Update",
  ],

};


/* =========================================================
   DEFAULT / COMMON SERVICES
   ---------------------------------------------------------
   Only common services remain here.
   Large 400–800 service library stays in serviceLibrary.js.
========================================================= */

export const DEFAULT_SERVICE_SUGGESTIONS = [
  "Installation",
  "Repair",
  "Maintenance",
  "Consultation",
  "Inspection",
  "Replacement",
  "Service",
  "Cleaning",
  "Emergency Service",
  "On-Site Service",
];


/* =========================================================
   GET CATEGORY SERVICES
   ---------------------------------------------------------
   Category services + common library
   ---------------------------------------------------------
   Note:
   serviceLibrary.js can contain 400–800 services.
   We don't blindly show all of them in the dropdown.
========================================================= */

export const getCategoryServiceSuggestions = (
  categoryKey = ""
) => {

  const categoryServices =
    SERVICE_SUGGESTIONS_BY_CATEGORY[categoryKey] || [];

  return [
    ...new Set([
      ...categoryServices,
      ...DEFAULT_SERVICE_SUGGESTIONS,
    ]),
  ];
};


/* =========================================================
   FULL SERVICE LIBRARY
   ---------------------------------------------------------
   Used when searching/typing services.
========================================================= */

export const ALL_SERVICE_SUGGESTIONS = [
  ...new Set([
    ...Object.values(
      SERVICE_SUGGESTIONS_BY_CATEGORY
    ).flat(),

    ...DEFAULT_SERVICE_SUGGESTIONS,

    ...UNIQUE_SERVICE_LIBRARY,
  ]),
];

/* =========================================================
   FOOD TYPE OPTIONS
========================================================= */

export const FOOD_TYPE_OPTIONS = [
  {
    value: "veg",
    label: "Veg",
    color: "#16a34a",
  },

  {
    value: "non_veg",
    label: "Non Veg",
    color: "#dc2626",
  },

  {
    value: "both",
    label: "Veg & Non Veg",
    color: "#ea580c",
  },
];