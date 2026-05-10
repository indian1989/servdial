export const BUSINESS_NAME_MAX = 120;
export const DESCRIPTION_MAX = 1500;
export const TAGS_MAX = 15;

export const defaultBusinessHours = {
  monday: { open: "", close: "", closed: false, open24h: false },
  tuesday: { open: "", close: "", closed: false, open24h: false },
  wednesday: { open: "", close: "", closed: false, open24h: false },
  thursday: { open: "", close: "", closed: false, open24h: false },
  friday: { open: "", close: "", closed: false, open24h: false },
  saturday: { open: "", close: "", closed: false, open24h: false },
  sunday: { open: "", close: "", closed: false, open24h: false },
};

export const defaultBusinessForm = {
  name: "",
  categoryId: "",
  cityId: "",

  district: "",
  state: "",

  address: "",
  pincode: "",

  phone: "",
  whatsapp: "",

  website: "",

  description: "",

  location: null,

  images: [],
  logo: "",

  tags: [],

  businessHours: defaultBusinessHours,

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

  if (!form.address?.trim()) {
    errors.address = "Address required";
  }

  if (!form.pincode || form.pincode.length !== 6) {
    errors.pincode = "Valid 6 digit pincode required";
  }

  if (!form.phone || form.phone.length !== 10) {
    errors.phone = "Valid 10 digit phone required";
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