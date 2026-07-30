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



    /* ================= OPTIONAL ================= */

    pricing:
      Array.isArray(data.pricing)
        ? data.pricing
        : [],

    services:
      Array.isArray(data.services)
        ? data.services
        : [],

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

      role: "admin",

      isVerified: true,

    }),

  };
};