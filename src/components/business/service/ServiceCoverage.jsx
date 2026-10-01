import { useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import API from "../../../api/axios";

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
  areas: [],
  states: [],
  countries: [],
};

const [areaOptions, setAreaOptions] = useState([]);
const [nearbyAreas, setNearbyAreas] = useState([]);
const [areasLoading, setAreasLoading] = useState(false);

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

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { value: "city", label: "Cities" },
          { value: "area", label: "Areas" },
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

  {/* ================= AREAS ================= */}

{serviceCoverage.type === "area" && (
  <div className="space-y-3">

    {/* CITY FIRST */}

    <Select
      options={cities}
      value={
        serviceCoverage.areaCityId
          ? cities.find(
              (city) =>
                String(city.value) ===
                String(serviceCoverage.areaCityId)
            ) || null
          : null
      }
      onChange={(selectedCity) => {
        const cityId =
          selectedCity?.value || "";

        const cityName =
          selectedCity?.label
            ?.split(" (")[0] || "";

        updateCoverage({
  areaCityId: cityId,
  areaCityName: cityName,
  areas: [],
});

setAreaOptions([]);
setNearbyAreas([]);

        if (!cityId) {
          return;
        }

        setAreasLoading(true);

        API.get(`/cities/${cityId}/areas`)
          .then((response) => {
  const data =
    response?.data?.data || {};

  /*
  -------------------------------------
  ALL EXISTING AREAS
  -------------------------------------
  */

  const options =
    Array.isArray(data?.areas)
      ? data.areas.map((area) => ({
          value: area.name,
          label: area.name,
        }))
      : [];

  setAreaOptions(options);

  /*
  -------------------------------------
  NEARBY AREAS
  -------------------------------------

  These are DISPLAY-ONLY.

  They must NOT be added to
  serviceCoverage.areas.

  Only the user-selected areas
  are saved in the business.
  -------------------------------------
  */

  const nearby =
    Array.isArray(data?.nearbyAreas)
      ? data.nearbyAreas
          .filter(
            (area) =>
              area &&
              typeof area.name === "string" &&
              area.name.trim()
          )
          .slice(0, 10)
      : [];

  setNearbyAreas(nearby);
})
          .catch((error) => {
            console.error(
              "❌ AREA LOAD ERROR:",
              error
            );

            setAreaOptions([]);
          })
          .finally(() => {
            setAreasLoading(false);
          });
      }}
      placeholder="First select city"
    />

    {/* AREAS */}

    <CreatableSelect
      isMulti
      isDisabled={
        !serviceCoverage.areaCityId ||
        areasLoading
      }

      isLoading={areasLoading}

      /*
      -----------------------------------------
      ONLY EXISTING AREAS ARE OPTIONS
      Custom typing is allowed by CreatableSelect,
      but custom values are NOT saved below.
      -----------------------------------------
      */

      options={areaOptions}

      value={
        (serviceCoverage.areas || [])
          .map((area) => ({
            value: area.name,
            label: area.name,
          }))
      }

      onChange={(selectedAreas) => {
  updateCoverage({
    areas: (selectedAreas || []).map((area) => ({
      name: area.value,
      cityId: serviceCoverage.areaCityId || "",
      cityName: serviceCoverage.areaCityName || "",
    })),
  });
}}

      placeholder={
        serviceCoverage.areaCityId
          ? "Search or type your own area"
          : "Select city first"
      }

      noOptionsMessage={() =>
        serviceCoverage.areaCityId
          ? "No existing area found — you can type your area for the address"
          : "Select city first"
      }
    />

    {/* ================= NEARBY AREAS LABEL ================= */}

    {(serviceCoverage.areas || []).length > 0 && (
  <div className="text-sm text-gray-500">
    {serviceCoverage.areas.length}{" "}
    {serviceCoverage.areas.length === 1
      ? "area"
      : "areas"}

    {nearbyAreas.length > 0 && (
      <>
        {" "}
        <span className="font-medium">
          and Nearby areas
        </span>
      </>
    )}
  </div>
)}

  </div>
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