import { useState } from "react";

const FiltersSidebar = ({ filters, updateFilter }) => {
  return (
    <div className="w-72 bg-white p-4 rounded-xl shadow">
      
      {/* OPEN NOW */}
      <div className="mb-4 flex items-center justify-between">
        <label className="text-sm font-medium">Open Now</label>
        <input
          type="checkbox"
          checked={filters.openNow}
          onChange={(e) => updateFilter("openNow", e.target.checked)}
        />
      </div>

      {/* DISTANCE */}
      <div className="mb-4">
        <label className="text-sm font-medium">Distance ({filters.distance / 1000} km)</label>
        <input
          type="range"
          min="1000"
          max="50000"
          step="1000"
          value={filters.distance}
          onChange={(e) => updateFilter("distance", Number(e.target.value))}
        />
      </div>

      {/* RATING */}
      <div className="mb-4">
        <label className="text-sm font-medium">Rating</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={filters.rating}
          onChange={(e) => updateFilter("rating", e.target.value)}
        >
          <option value="">All Ratings</option>
          <option value="4">4★ & above</option>
          <option value="3">3★ & above</option>
          <option value="2">2★ & above</option>
        </select>
      </div>

    </div>
  );
};

export default FiltersSidebar;