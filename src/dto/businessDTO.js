// src/dto/businessDTO.js

import { normalizeBusinessHours } from "../utils/normalizeBusinessHours";

/* =========================================================
   LIST DTO
   Used for tables / cards / search results
========================================================= */

export const toBusinessListDTO = (b = {}) => {
  return {
    _id: b._id,

    slug: b.slug || b._id,

    name: b.name || "Unnamed",

    // ================= LOCATION =================

    location:
      b.location?.coordinates?.length === 2
        ? {
            type: "Point",
            coordinates: [
              Number(b.location.coordinates[0]),
              Number(b.location.coordinates[1]),
            ],
          }
        : null,

    // ================= BUSINESS HOURS =================

    businessHours: b.businessHours || null,

    // ================= IMAGE =================

    image:
      (Array.isArray(b.images) && b.images.length > 0
        ? b.images[0]
        : null) ||
      b.logo ||
      "https://via.placeholder.com/400x250",

    logo: b.logo || null,

    images: Array.isArray(b.images)
      ? b.images
      : [],

    // ================= PLAN =================

    plan: b.plan || "free",

    isTrustedPartner:
      b.isTrustedPartner || false,

    isPremiumPartner:
      b.isPremiumPartner || false,

    // ================= CATEGORY =================

    categoryName: (
      b.categoryId?.name ||
      b.categoryName ||
      b.category ||
      "General"
    )
      .toString()
      .trim()
      .replace(/\b\w/g, (l) => l.toUpperCase()),

    categorySlug:
      b.categoryId?.slug ||
      b.categorySlug ||
      "",

    // ================= CITY =================

    cityName: (
      b.cityName ||
      b.cityId?.name ||
      "Unknown"
    )
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase()),

    citySlug: (
      b.citySlug ||
      b.cityId?.slug ||
      ""
    )
      .toString()
      .trim()
      .toLowerCase(),

    // ================= DISTRICT =================

    district: (
      b.district || ""
    )
      .toString()
      .trim()
      .replace(/\b\w/g, (l) => l.toUpperCase()),

    // ================= STATE =================

    state: (
      b.state ||
      b.stateName ||
      b.citySlug?.split("-")?.pop() ||
      ""
    )
      .toString()
      .trim()
      .replace(/\b\w/g, (l) => l.toUpperCase()),

    // ================= COUNTRY =================

    country:
      b.country ||
      "India",

    countryCode:
      b.countryCode ||
      "IN",

    // ================= RATING =================

    rating:
      b.averageRating ||
      b.rating ||
      0,

    reviewCount:
      b.totalReviews ||
      b.reviewCount ||
      0,

    // ================= FLAGS =================

    isFeatured:
      b.isFeatured || false,

    isVerified:
      b.isVerified || false,

    // ================= CONTACT =================

    phone:
      b.phone ||
      b.contactNumber ||
      null,

    phoneCountryCode:
      b.phoneCountryCode ||
      "IN",

    whatsapp:
      b.whatsapp ||
      null,

    whatsappCountryCode:
      b.whatsappCountryCode ||
      b.phoneCountryCode ||
      "IN",

    alternatePhone:
      b.alternatePhone ||
      null,

    alternatePhoneCountryCode:
      b.alternatePhoneCountryCode ||
      b.phoneCountryCode ||
      "IN",

    landline:
      b.landline ||
      null,

    landlineCountryCode:
      b.landlineCountryCode ||
      b.phoneCountryCode ||
      "IN",

    website:
      b.website ||
      null,

    // ================= STATS =================

    views:
      b.views ||
      0,

    phoneClicks:
      b.phoneClicks ||
      0,

    whatsappClicks:
      b.whatsappClicks ||
      0,

    // ================= DISTANCE =================

    distance:
      b.distance || null,
  };
};


/* =========================================================
   EDIT DTO
   Full safe data for Add/Edit Business Form
========================================================= */

export const toBusinessEditDTO = (b = {}) => {
  return {
    _id: b._id,

    // ================= BASIC =================

    name:
      b.name || "",

    description:
      b.description || "",

    // ================= RELATIONS =================

    categoryId:
      b.categoryId?._id?.toString?.() ||
      b.categoryId?.toString?.() ||
      "",

    cityId:
      b.cityId?._id?.toString?.() ||
      b.cityId?.toString?.() ||
      "",

    // ================= LOCATION =================

    address:
      b.address || "",

    pincode:
      b.pincode || "",

    district:
      b.district || "",

    state:
      b.state || "",

    country:
      b.country || "India",

    countryCode:
      b.countryCode || "IN",

    location:
      b.location || null,

    // ================= CONTACT =================

    phone:
      b.phone || "",

    phoneCountryCode:
      b.phoneCountryCode || "IN",

    whatsapp:
      b.whatsapp || "",

    whatsappCountryCode:
      b.whatsappCountryCode ||
      b.phoneCountryCode ||
      "IN",

    alternatePhone:
      b.alternatePhone || "",

    alternatePhoneCountryCode:
      b.alternatePhoneCountryCode ||
      b.phoneCountryCode ||
      "IN",

    landline:
      b.landline || "",

    landlineCountryCode:
      b.landlineCountryCode ||
      b.phoneCountryCode ||
      "IN",

    website:
      b.website || "",

    // ================= MEDIA =================

    images:
      Array.isArray(b.images)
        ? b.images
        : [],

    logo:
      b.logo || "",

    // =====================================================
    // BUSINESS FEATURES
    // =====================================================

    businessHours:
      b.businessHours || {},

    pricing:
      Array.isArray(b.pricing)
        ? b.pricing
        : [],

    services:
      Array.isArray(b.services)
        ? b.services.map((service) => ({
            name: service.name || "",
            description:
              service.description || "",
          }))
        : [],

    serviceTypes:
      Array.isArray(b.serviceTypes)
        ? b.serviceTypes
        : [],

    serviceCoverage:
      b.serviceCoverage || {
        type: "",
        mode: "selected",
        cities: [],
        states: [],
        countries: [],
      },

    catalog:
      Array.isArray(b.catalog)
        ? b.catalog
        : [],

    menu:
      Array.isArray(b.menu)
        ? b.menu
        : [],

    faq:
      Array.isArray(b.faq)
        ? b.faq
        : [],

    offers:
      Array.isArray(b.offers)
        ? b.offers
        : [],

    tags:
      Array.isArray(b.tags)
        ? b.tags
        : [],

    keywords:
      Array.isArray(b.keywords)
        ? b.keywords
        : [],

    // ================= CATEGORY FEATURES =================

    categoryFeatures:
      Array.isArray(b.categoryFeatures)
        ? b.categoryFeatures
        : Array.isArray(b.categoryId?.features)
        ? b.categoryId.features
        : [],

    // ================= BOOKINGS =================

    appointmentBooking:
      b.appointmentBooking || {
        enabled: false,
        consultationModes: [],
        slotDuration: 30,
        advanceBookingDays: 7,
        sameDayBooking: true,
        bufferBetweenAppointments: 0,
        contactNumber: "",
        notes: "",
      },

    restaurantBooking:
      b.restaurantBooking || {
        enabled: false,
        totalTables: "",
        seatingCapacity: "",
        advanceBookingDays: "",
      },

    roomBooking:
      b.roomBooking || {},

    partyBooking:
      b.partyBooking || {
        enabled: false,
        bookingTypes: [],
        minimumGuests: "",
        maximumGuests: "",
        advanceAmount: "",
        bookingNotice: "24h",
        availableTimeSlots: [],
        contactNumber: "",
        whatsappBooking: false,
        notes: "",
      },

    // ================= RESTAURANT =================

    foodType:
      b.foodType || "",

    // ================= PROMOTION =================

    boost:
      Boolean(b.boost),

    // ================= ADMIN =================

    isFeatured:
      b.isFeatured || false,

    isVerified:
      b.isVerified || false,

    status:
      b.status || "approved",

    // ================= SLUG =================

    slug:
      b.slug || "",
  };
};


/* =========================================================
   SAFE NORMALIZER
   Converts Form Data -> API Payload
========================================================= */

export const normalizeBusinessPayload = (
  data = {},
  mode = "admin"
) => {
  return {
    // =====================================================
    // BASIC
    // =====================================================

    name:
      data.name || "",

    description:
      data.description || "",

    // ================= RELATIONS =================

    categoryId:
      data.categoryId?.value ||
      data.categoryId ||
      "",

    cityId:
      data.cityId?.value ||
      data.cityId ||
      "",

    // ================= LOCATION / ADDRESS =================

    address:
      data.address || "",

    pincode:
      data.pincode || "",

    district:
      data.district || "",

    state:
      data.state || "",

    country:
      data.country || "India",

    countryCode:
      data.countryCode || "IN",

    // =====================================================
    // CONTACT
    // =====================================================

    phone:
      data.phone || "",

    phoneCountryCode:
      data.phoneCountryCode || "IN",

    whatsapp:
      data.whatsapp ||
      data.phone ||
      "",

    whatsappCountryCode:
      data.whatsappCountryCode ||
      data.phoneCountryCode ||
      "IN",

    alternatePhone:
      data.alternatePhone || "",

    alternatePhoneCountryCode:
      data.alternatePhoneCountryCode ||
      data.phoneCountryCode ||
      "IN",

    landline:
      data.landline || "",

    landlineCountryCode:
      data.landlineCountryCode ||
      data.phoneCountryCode ||
      "IN",

    website:
      data.website || "",

    // =====================================================
    // MEDIA
    // =====================================================

    logo:
      data.logo || "",

    images:
      Array.isArray(data.images)
        ? data.images
        : [],

    // =====================================================
    // LOCATION GEO
    // =====================================================

    location:
      data.location?.coordinates?.length === 2
        ? data.location
        : undefined,

    // =====================================================
    // BUSINESS HOURS
    // =====================================================

    businessHours:
      normalizeBusinessHours(
        data.businessHours || {}
      ),

    // =====================================================
    // APPOINTMENT BOOKING
    // =====================================================

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

    // =====================================================
    // RESTAURANT BOOKING
    // =====================================================

    restaurantBooking:
      data.restaurantBooking || {
        enabled: false,
        totalTables: "",
        seatingCapacity: "",
        advanceBookingDays: "",
      },

    // =====================================================
    // ROOM BOOKING
    // =====================================================

    roomBooking:
      data.roomBooking || {},

    // =====================================================
    // PARTY BOOKING
    // =====================================================

    partyBooking:
      data.partyBooking || {
        enabled: false,
        bookingTypes: [],
        minimumGuests: "",
        maximumGuests: "",
        advanceAmount: "",
        bookingNotice: "24h",
        availableTimeSlots: [],
        contactNumber: "",
        whatsappBooking: false,
        notes: "",
      },

    // =====================================================
    // BUSINESS FEATURES
    // =====================================================

    pricing:
      Array.isArray(data.pricing)
        ? data.pricing
        : [],

    services:
      Array.isArray(data.services)
        ? data.services
        : [],

    serviceTypes:
      Array.isArray(data.serviceTypes)
        ? data.serviceTypes
        : [],

    serviceCoverage:
      data.serviceCoverage || {
        type: "city",
        mode: "selected",
        cities: [],
        states: [],
        countries: [],
      },

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

    // =====================================================
    // SEO / SEARCH
    // =====================================================

    tags:
      Array.isArray(data.tags)
        ? data.tags
        : [],

    keywords:
      Array.isArray(data.keywords)
        ? data.keywords
        : [],

    // =====================================================
    // RESTAURANT
    // =====================================================

    foodType:
      data.foodType || "",

    // =====================================================
    // PROMOTION
    // =====================================================

    boost:
      Boolean(data.boost),

    // =====================================================
    // ADMIN
    // =====================================================

    ...(mode === "admin" && {
      isVerified:
        data.isVerified ?? true,

      status:
        data.status || "approved",

      isFeatured:
        data.isFeatured ?? false,
    }),
  };
};