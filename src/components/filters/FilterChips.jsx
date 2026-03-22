const FilterChips = ({ filters, updateFilter }) => {
  const chips = [];

  if (filters.rating) chips.push({ key: "rating", label: `${filters.rating}★+` });
  if (filters.price) chips.push({ key: "price", label: filters.price });
  if (filters.openNow) chips.push({ key: "openNow", label: "Open Now" });

  if (!chips.length) return null;

  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      {chips.map((chip) => (
        <div
          key={chip.key}
          className="px-3 py-1 bg-blue-100 text-sm rounded-full cursor-pointer"
          onClick={() => updateFilter(chip.key, chip.key === "openNow" ? false : "")}
        >
          {chip.label} ✕
        </div>
      ))}
    </div>
  );
};

export default FilterChips;