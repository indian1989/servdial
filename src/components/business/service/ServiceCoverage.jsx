import Select from "react-select";
import CreatableSelect from "react-select/creatable";

/* ================= INDIA STATES & UTs ================= */

const indiaStateOptions = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
].map((state) => ({
  value: state,
  label: state,
}));

/* ================= COUNTRY OPTIONS ================= */

const countryOptions = [
  "India",
  "Nepal",
  "Bangladesh",
  "Bhutan",
  "Sri Lanka",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Oman",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Singapore",
  "Malaysia",
].map((country) => ({
  value: country,
  label: country,
}));

const ServiceCoverage = ({
  value,
  cities = [],
  country = "India",
  countryCode = "IN",
  onChange,
}) => {
  const serviceCoverage = value || {
    type: "city",
    mode: "selected",
    cities: [],
    states: [],
    countries: [],
  };

  const updateCoverage = (updates) => {
    onChange?.({
      ...serviceCoverage,
      ...updates,
    });
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="font-semibold text-lg">
        Service Coverage
      </h3>

      {/* ================= COVERAGE TYPE ================= */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { value: "city", label: "Cities" },
          { value: "state", label: "States" },
          { value: "country", label: "Countries" },
          { value: "global", label: "Worldwide" },
        ].map((option) => (
          <label
            key={option.value}
            className="border rounded-xl p-3 flex items-center gap-2 cursor-pointer hover:border-indigo-500"
          >
            <input
              type="radio"
              name="coverageType"
              checked={serviceCoverage.type === option.value}
              onChange={() =>
                updateCoverage({
                  type: option.value,
                })
              }
            />

            <span className="text-sm font-medium">
              {option.label}
            </span>
          </label>
        ))}
      </div>

      {/* ================= MODE ================= */}

      {serviceCoverage.type !== "global" && (
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="coverageMode"
              checked={serviceCoverage.mode === "selected"}
              onChange={() =>
                updateCoverage({
                  mode: "selected",
                })
              }
            />
            Selected
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="coverageMode"
              checked={serviceCoverage.mode === "all"}
              onChange={() =>
                updateCoverage({
                  mode: "all",
                })
              }
            />
            All
          </label>
        </div>
      )}

      {/* ================= CITIES ================= */}

      {serviceCoverage.type === "city" && (
        <Select
          isMulti
          options={cities}
          value={(serviceCoverage.cities || []).map((city) => ({
            value: city.cityId,
            label: `${city.name} (${city.state})`,
            district: city.district,
            state: city.state,
            country: city.country,
            countryCode: city.countryCode,
          }))}
          onChange={(selectedCities) =>
            updateCoverage({
              cities: (selectedCities || []).map((city) => ({
                cityId: city.value,
                name: city.label.split(" (")[0],
                district: city.district,
                state: city.state,
                country: city.country || country,
                countryCode: city.countryCode || countryCode,
              })),
            })
          }
          placeholder="Select cities"
        />
      )}

      {/* ================= STATES ================= */}

      {serviceCoverage.type === "state" && (
        <CreatableSelect
          isMulti
          options={indiaStateOptions}
          value={(serviceCoverage.states || []).map((state) => ({
            value: state.name,
            label: state.name,
          }))}
          onChange={(selectedStates) =>
            updateCoverage({
              states: (selectedStates || []).map((state) => ({
                name: state.value,
                country,
                countryCode,
              })),
            })
          }
          placeholder="Select or type states"
        />
      )}

      {/* ================= COUNTRIES ================= */}

      {serviceCoverage.type === "country" && (
        <CreatableSelect
          isMulti
          options={countryOptions}
          value={(serviceCoverage.countries || []).map((countryItem) => ({
            value: countryItem.name,
            label: countryItem.name,
          }))}
          onChange={(selectedCountries) =>
            updateCoverage({
              countries: (selectedCountries || []).map((countryItem) => ({
                name: countryItem.value,
                code: countryItem.value
                  .slice(0, 2)
                  .toUpperCase(),
              })),
            })
          }
          placeholder="Select or type countries"
        />
      )}

      {/* ================= GLOBAL ================= */}

      {serviceCoverage.type === "global" && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          This business provides services worldwide.
        </div>
      )}
    </div>
  );
};

export default ServiceCoverage;