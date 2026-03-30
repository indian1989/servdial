export const normalizeCity = (city) => {
  if (!city) return null;

  return city
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " "); // remove extra spaces
};