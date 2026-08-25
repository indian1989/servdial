// frontend/src/utils/addressHelper.js


// =========================================================
// NORMALIZE ADDRESS
// =========================================================

export const normalizeAddress = (address) => {

  if (!address) {
    return {
      street: "",
      area: "",
      landmark: "",
    };
  }


  // Old string data
  if (typeof address === "string") {

    return {
      street: address.trim(),
      area: "",
      landmark: "",
    };

  }


  // New object data
  return {

    street:
      address.street?.toString().trim() || "",

    area:
      address.area?.toString().trim() || "",

    landmark:
      address.landmark?.toString().trim() || "",

  };

};


// =========================================================
// FORMAT BUSINESS ADDRESS
// =========================================================

export const formatBusinessAddress = (
  address = {}
) => {

  const normalized =
    normalizeAddress(address);


  return [

    normalized.street,
    normalized.area,
    normalized.landmark,

  ]
    .filter(Boolean)
    .join(", ");

};


// =========================================================
// CLEAN VALUE
// =========================================================

const cleanValue = (value) => {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }


  return String(value)
    .trim()
    .replace(/\s+/g, " ");

};


// =========================================================
// CASE-INSENSITIVE DUPLICATE CHECK
// =========================================================

const containsValue = (
  list,
  value
) => {

  const normalized =
    cleanValue(value).toLowerCase();


  if (!normalized) {
    return false;
  }


  return list.some(
    (item) =>
      item.toLowerCase() ===
      normalized
  );

};


// =========================================================
// NORMALIZE LOCATION
// =========================================================
//
// Generic location formatter.
//
// Duplicate values are removed
// case-insensitively.
//
// Example:
//
// Saket, Delhi, Delhi, India
// → Saket, Delhi, India
//
// =========================================================

export const normalizeLocation = (...parts) => {

  const values = parts
    .flat(Infinity)
    .map(cleanValue)
    .filter(Boolean);


  const unique = [];


  for (const value of values) {

    if (!containsValue(unique, value)) {

      unique.push(value);

    }

  }


  return unique.join(", ");

};


// =========================================================
// NORMALIZE CITY
// =========================================================
//
// Comparison / search purpose only.
// Does NOT change database value.
//
// =========================================================

export const normalizeCity = (city) => {

  if (!city) {
    return "";
  }


  return city
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

};


// =========================================================
// TITLE CASE
// =========================================================

const titleCase = (value = "") => {

  return cleanValue(value)
    .toLowerCase()
    .replace(
      /\b\w/g,
      (char) => char.toUpperCase()
    );

};


// =========================================================
// FORMAT BUSINESS LOCATION
// =========================================================
//
// DISPLAY:
//
// Area • City • State • Country
//
// Case-insensitive duplicate removal.
//
// Examples:
//
// Saket + Delhi + Delhi + India
// → Saket • Delhi • India
//
// Gandhi Chowk + Hajipur + Bihar + India + India
// → Gandhi Chowk • Hajipur • Bihar • India
//
// Tagore Garden + New Delhi + Delhi + India
// → Tagore Garden • New Delhi • Delhi • India
//
// =========================================================

export const formatBusinessLocation = (
  area = "",
  city = "",
  state = "",
  country = "India"
) => {

  const values = [

    area,
    city,
    state,
    country,

  ]
    .flat(Infinity)
    .map(titleCase)
    .filter(Boolean);


  const unique = [];


  for (const value of values) {

    if (!containsValue(unique, value)) {

      unique.push(value);

    }

  }


  return unique.join(" • ");

};


// =========================================================
// FORMAT CITY LOCATION
// =========================================================
//
// Backward-compatible helper.
//
// IMPORTANT:
// Existing components such as BusinessCard,
// BusinessHero etc. can continue importing:
//
// formatCityLocation
//
// =========================================================

export const formatCityLocation = (
  area = "",
  city = "",
  state = "",
  country = "India"
) => {

  return formatBusinessLocation(
    area,
    city,
    state,
    country
  );

};


// =========================================================
// FORMAT FULL BUSINESS POSTAL ADDRESS
// =========================================================
//
// Order:
//
// Address
// City
// District
// State
// Country
// Pincode
//
// Duplicate removal:
// CASE-INSENSITIVE
//
// City / District / State / Country:
// TITLE CASE
//
// Example:
//
// Address  = 57/41, Punjabi Bagh West,
//            Opposite Punjabi Bagh Club
// City     = delhi
// District = New Delhi
// State    = Delhi
// Country  = India
// Pincode  = 110026
//
// Result:
//
// 57/41, Punjabi Bagh West,
// Opposite Punjabi Bagh Club,
// Delhi,
// New Delhi,
// India,
// 110026
//
// =========================================================

export const formatFullBusinessAddress = ({
  address = "",
  city = "",
  district = "",
  state = "",
  country = "India",
  pincode = "",
} = {}) => {

  // -------------------------------------------------------
  // ADDRESS
  // -------------------------------------------------------

  const addressParts = cleanValue(address)
    .split(",")
    .map(cleanValue)
    .filter(Boolean);


  const result = [];


  // -------------------------------------------------------
  // ADD ADDRESS PARTS
  //
  // Address ka original capitalization preserve rahega.
  //
  // -------------------------------------------------------

  for (const part of addressParts) {

    if (!containsValue(result, part)) {

      result.push(part);

    }

  }


  // -------------------------------------------------------
  // LOCATION FIELDS
  //
  // City / District / State / Country ko
  // Title Case mein convert karenge.
  //
  // Isliye:
  //
  // delhi → Delhi
  // bihar → Bihar
  // india → India
  //
  // -------------------------------------------------------

  const locationFields = [

    titleCase(city),

    titleCase(district),

    titleCase(state),

    titleCase(country),

  ];


  // -------------------------------------------------------
  // ADD LOCATION FIELDS
  //
  // Duplicate comparison case-insensitive hai.
  //
  // Delhi + Delhi
  // → Delhi
  //
  // Delhi + New Delhi
  // → Delhi + New Delhi
  //
  // -------------------------------------------------------

  for (const value of locationFields) {

    if (
      value &&
      !containsValue(result, value)
    ) {

      result.push(value);

    }

  }


  // -------------------------------------------------------
  // PINCODE
  // -------------------------------------------------------

  const cleanPincode =
    cleanValue(pincode);


  if (
    cleanPincode &&
    !containsValue(result, cleanPincode)
  ) {

    result.push(cleanPincode);

  }


  return result.join(", ");

};

// =========================================================
// GENERIC LOCATION DISPLAY
// =========================================================
//
// Comma-separated display.
//
// Automatically Title Cases values.
//
// =========================================================

export const formatLocationDisplay = (
  ...parts
) => {

  const values = parts
    .flat(Infinity)
    .map(titleCase)
    .filter(Boolean);


  const unique = [];


  for (const value of values) {

    if (!containsValue(unique, value)) {

      unique.push(value);

    }

  }


  return unique.join(", ");

};