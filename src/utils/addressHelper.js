// frontend/src/utils/addressHelper.js


// ================= NORMALIZE ADDRESS =================

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
    street: address.street?.trim() || "",
    area: address.area?.trim() || "",
    landmark: address.landmark?.trim() || "",
  };
};


// ================= FORMAT BUSINESS ADDRESS =================

export const formatBusinessAddress = (address = {}) => {
  const normalized = normalizeAddress(address);

  return [
    normalized.street,
    normalized.area,
    normalized.landmark,
  ]
    .filter(Boolean)
    .join(", ");
};


// ================= NORMALIZE LOCATION =================

export const normalizeLocation = (...parts) => {
  return parts
    .flat()
    .filter(Boolean)
    .map((item) =>
      typeof item === "string"
        ? item.trim()
        : String(item).trim()
    )
    .filter(
      (item, index, arr) =>
        arr.findIndex(
          (x) =>
            x.toLowerCase() === item.toLowerCase()
        ) === index
    )
    .join(", ");
};


// ================= NORMALIZE CITY =================
// Comparison/search purpose only.

export const normalizeCity = (city) => {
  if (!city) return "";

  return city
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};


// =========================================================
// 📍 FORMAT CITY LOCATION
//
// Rules:
//
// Patna + Patna + Bihar
// → Patna, Bihar
//
// Delhi + Delhi + Delhi
// → Delhi
//
// Hajipur + Vaishali + Bihar
// → Hajipur, Vaishali, Bihar
//
// Duplicate values are removed case-insensitively.
// Original capitalization is preserved.
// =========================================================

export const formatCityLocation = (
  area = "",
  city = "",
  state = ""
) => {
  const values = [
    area,
    city,
    state,
  ]
    .flat()
    .map((item) =>
      typeof item === "string"
        ? item.trim()
        : String(item || "").trim()
    )
    .filter(Boolean);

  const unique = [];

  for (const value of values) {
    const exists = unique.some(
      (item) =>
        item.toLowerCase() ===
        value.toLowerCase()
    );

    if (!exists) {
      unique.push(value);
    }
  }

  return unique.join(", ");
};


// ================= FORMAT LOCATION FOR DISPLAY =================
// Generic display formatter.
// Removes duplicate values while preserving capitalization.

export const formatLocationDisplay = (...parts) => {
  return parts
    .flat()
    .filter(Boolean)
    .map((item) =>
      String(item)
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
    )
    .filter(Boolean)
    .filter(
      (item, index, arr) =>
        arr.findIndex(
          (x) =>
            x.toLowerCase() ===
            item.toLowerCase()
        ) === index
    )
    .join(", ");
};