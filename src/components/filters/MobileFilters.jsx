import { useState } from "react";
import { Filter } from "lucide-react";
import FiltersSidebar from "./FiltersSidebar";

const MobileFilters = ({ filters, updateFilter }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
        onClick={() => setOpen(true)}
      >
        <Filter size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex justify-end">
          <div className="w-72 bg-white h-full p-4">
            <button
              className="mb-4 text-gray-500"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
            <FiltersSidebar filters={filters} updateFilter={updateFilter} />
          </div>
        </div>
      )}
    </>
  );
};

export default MobileFilters;