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

//Old string data
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


// ================= NORMALIZE CITY (for comparison/search only) =================
export const normalizeCity = (city) => {
  if (!city) return "";

  return city
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " "); // remove extra spaces
};


// ================= FORMAT LOCATION FOR DISPLAY =================
// Display purpose only.
// Keeps proper capitalization without changing stored/search values.

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
            x.toLowerCase() === item.toLowerCase()
        ) === index
    )
    .join(", ");
};