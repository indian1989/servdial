// src/components/business/BusinessMapper.jsx
import { normalizeAddress } from "../../utils/addressHelper";

export const normalizeBusinessPayload = (
  data = {},
  mode = "provider"
) => {
  return {

    /* ================= BASIC ================= */

    name: data.name || "",

    description: data.description || "",

    foodType: data.foodType || "",

    categoryId:
      data.categoryId?.value ||
      data.categoryId ||
      "",

    cityId:
      data.cityId?.value ||
      data.cityId ||
      "",

    address: (() => {
      const address = normalizeAddress(data.address);

      const cleaned = {
        street: address.street?.trim() || "",
        area: address.area?.trim() || "",
        landmark: address.landmark?.trim() || "",
        };

        const hasAny = Object.values(cleaned).some(Boolean);
        return hasAny ? cleaned : undefined;
        })(),

    pincode:
      data.pincode || "",

    district:
      data.district || "",

    state:
      data.state || "",

    phone:
      data.phone || "",

    whatsapp:
      data.whatsapp ||
      data.phone ||
      "",

    alternatePhone:
    data.alternatePhone || "",
    
    landline:
    data.landline || "",
    
    phoneCountryCode:
    data.phoneCountryCode || "+91",
    
    whatsappCountryCode:
    data.whatsappCountryCode || "+91",
    
    alternatePhoneCountryCode:
    data.alternatePhoneCountryCode || "+91",
    
    landlineCountryCode:
    data.landlineCountryCode || "+91",

    website:
      data.website || "",

    /* ================= MEDIA ================= */

    logo:
      data.logo || "",

    images:
      Array.isArray(data.images)
        ? data.images
        : [],



    /* ================= LOCATION ================= */

    location:
      data.location &&
      data.location.coordinates?.length === 2
        ? data.location
        : undefined,



    /* ================= BUSINESS HOURS ================= */

    businessHours:
      data.businessHours || {},



    /* ================= RESTAURANT ================= */

    restaurantBooking:
      data.restaurantBooking || {
        enabled: false,
        totalTables: "",
        seatingCapacity: "",
        advanceBookingDays: "",
      },



    /* ================= PARTY BOOKING ================= */

    partyBooking:
      data.partyBooking || {
        enabled: false,
        bookingTypes: [],
        minGuests: "",
        maxGuests: "",
        advanceAmount: "",
        bookingNotice: "24h",
        timeSlots: [],
        contactNumber: "",
        whatsappBooking: false,
        notes: "",
      },

    /* ================= ROOM BOOKING ================= */

roomBooking:
  data.roomBooking || {
    enabled: false,
    roomTypes: [],
    checkInTime: "",
    checkOutTime: "",
    advanceBookingDays: "",
    contactNumber: "",
    notes: "",
  },

  /* ================= APPOINTMENT BOOKING ================= */

appointmentBooking:
  data.appointmentBooking || {
    enabled: false,
    consultationModes: [],
    slotDuration: 30,
    advanceBookingDays: 7,
    sameDayBooking: true,
    bufferBetweenAppointments: 0,
    contactNumber: "",
    notes: "",
  },


    /* ================= OPTIONAL ================= */

pricing:
  Array.isArray(data.pricing)
    ? data.pricing
    : [],

/* ================= SERVICES ================= */

services:
  Array.isArray(data.services)
    ? data.services.map((service) => ({
        name: service?.name || "",
        description: service?.description || "",
      }))
    : [],

/* ================= SERVICE COVERAGE ================= */

serviceCoverage: (() => {
  const coverage = data.serviceCoverage || {};

  return {
    type: coverage.type || "city",

    mode:
      coverage.mode ||
      "selected",

    cities:
      Array.isArray(coverage.cities)
        ? coverage.cities.map((city) => ({
            cityId:
              city?.cityId ||
              city?.value ||
              "",
            name:
              city?.name ||
              "",
            district:
              city?.district ||
              "",
            state:
              city?.state ||
              "",
            country:
              city?.country ||
              "India",
            countryCode:
              city?.countryCode ||
              "IN",
          }))
        : [],

    states:
      Array.isArray(coverage.states)
        ? coverage.states.map((state) => ({
            name:
              state?.name ||
              state?.value ||
              "",
            country:
              state?.country ||
              "India",
            countryCode:
              state?.countryCode ||
              "IN",
          }))
        : [],

    countries:
      Array.isArray(coverage.countries)
        ? coverage.countries.map((country) => ({
            name:
              country?.name ||
              country?.value ||
              "",
            code:
              country?.code ||
              "",
          }))
        : [],
  };
})(),

/* ================= SERVICE TYPES ================= */

serviceTypes:
  Array.isArray(data.serviceTypes)
    ? data.serviceTypes.filter(Boolean)
    : [],


/* ================= COUNTRY ================= */

country:
  data.country || "India",

countryCode:
  data.countryCode || "IN",
  
    catalog:
      Array.isArray(data.catalog)
        ? data.catalog
        : [],

    menu:
      Array.isArray(data.menu)
        ? data.menu
        : [],

    faq:
      Array.isArray(data.faq)
        ? data.faq
        : [],

    offers:
      Array.isArray(data.offers)
        ? data.offers
        : [],

    tags:
      Array.isArray(data.tags)
        ? data.tags
        : (data.tags || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),



    /* ================= FLAGS ================= */

    boost:
      Boolean(data.boost),

    isFeatured:
      Boolean(data.isFeatured),

    isVerified:
      Boolean(data.isVerified),



    /* ================= ADMIN ONLY ================= */

    ...(mode === "admin" && {

      isVerified: true,

    }),

  };
};