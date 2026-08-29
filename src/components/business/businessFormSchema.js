export const BUSINESS_NAME_MAX = 120;
export const DESCRIPTION_MAX = 1500;
export const TAGS_MAX = 15;

export const defaultBusinessHours = {
  monday: { open: "", close: "", closed: false, is24h: false },
  tuesday: { open: "", close: "", closed: false, is24h: false },
  wednesday: { open: "", close: "", closed: false, is24h: false },
  thursday: { open: "", close: "", closed: false, is24h: false },
  friday: { open: "", close: "", closed: false, is24h: false },
  saturday: { open: "", close: "", closed: false, is24h: false },
  sunday: { open: "", close: "", closed: false, is24h: false },
};

export const defaultBusinessForm = {
  name: "",
  categoryId: "",

  serviceTypes: [],
  services: [],

  serviceCoverage: {
    type: "city",
    mode: "selected",
    countries: [],
    states: [],
    cities: [],
  },

  // ================= ADDRESS =================

  address: {
    street: "",
    area: "",
    landmark: "",
  },

  cityId: "",
  district: "",
  state: "",

  country: "India",
  countryCode: "IN",

  pincode: "",

  // ================= CONTACT =================

  phoneCountryCode: "+91",
  phone: "",

  whatsappCountryCode: "+91",
  whatsapp: "",

  landlineCountryCode: "+91",
  landline: "",

  alternatePhoneCountryCode: "+91",
  alternatePhone: "",

  website: "",

  // ================= FEATURES =================

  pricing: [],
  catalog: [],
  menu: [],
  faq: [],
  offers: [],

  // ================= BOOKING =================

  restaurantBooking: {
    enabled: false,
    totalTables: "",
    seatingCapacity: "",
    advanceBookingDays: "",
  },

  roomBooking: null,
  partyBooking: null,

  // ================= DESCRIPTION =================

  description: "",

  // ================= LOCATION =================

  location: null,

  // ================= MEDIA =================

  images: [],
  logo: "",

  // ================= SEO / TAGS =================

  tags: [],

  // ================= HOURS =================

  businessHours: defaultBusinessHours,

  // ================= PROMOTION =================

  boost: false,

  isFeatured: false,
  isVerified: false,
};

export const validateBusinessForm = (form = {}) => {
  const errors = {};

  if (!form.name?.trim()) {
    errors.name = "Business name required";
  }

  if (!form.categoryId) {
    errors.categoryId = "Primary category required";
  }

  if (!form.cityId) {
    errors.cityId = "City required";
  }

  if (!form.address?.street?.trim()) {
    errors.address = "Street / Road is required";
  }

  if (!form.address?.area?.trim()) {
    errors.area = "Area / Locality is required";
  }

  const pincode = String(form.pincode || "").replace(/\D/g, "");

if (pincode.length !== 6) {
  errors.pincode = "Valid 6 digit pincode required";
}

    // ================= CONTACT VALIDATION =================

  const mobile =
    String(form.phone || "")
      .replace(/\D/g, "");

  const landline =
    String(form.landline || "")
      .replace(/\D/g, "");

  const hasValidMobile =
    mobile.length === 10;

  const hasValidLandline =
    landline.length >= 6 &&
    landline.length <= 12;

  // Mobile OR Landline is mandatory
  if (!hasValidMobile && !hasValidLandline) {
    errors.phone =
      "Mobile Number or Landline Number is required";
    errors.landline =
      "Mobile Number or Landline Number is required";
  }

  // If mobile is provided, it must be valid
  if (mobile && !hasValidMobile) {
    errors.phone =
      "Valid 10 digit mobile number required";
  }

  // If landline is provided, it must be valid
  if (landline && !hasValidLandline) {
    errors.landline =
      "Landline number must be between 6 and 12 digits";
  }

  if (
    form.website &&
    !/^https?:\/\/.+/i.test(form.website)
  ) {
    errors.website = "Website must start with http:// or https://";
  }

  if (
    form.description &&
    form.description.length > DESCRIPTION_MAX
  ) {
    errors.description = `Description max ${DESCRIPTION_MAX} characters`;
  }

  return errors;
};