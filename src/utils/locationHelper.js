export const normalizeLocation = (...parts) => {

  return parts
    .filter(Boolean)
    .map((item) =>
        typeof item === "string"
        ? item.trim()
        : String(item)
)
    .filter(
      (item, index, arr) =>
        arr.findIndex(
          x =>
            x.toLowerCase() === item.toLowerCase()
        ) === index
    )
    .join(", ");

};