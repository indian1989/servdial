import { useMemo, useState } from "react";
import CreatableSelect from "react-select/creatable";

import {
  normalizeServiceText,
  uniqueServices,
  mapServicesToSelectOptions,
  searchServices,
} from "../../../utils/business/serviceHelpers";


const ServicesOffered = ({
  value = [],
  suggestions = [],
  onChange,
}) => {

  const services = Array.isArray(value)
    ? value
    : [];

  const [inputValue, setInputValue] = useState("");


  /* =========================================================
     SERVICE OPTIONS

     Empty search:
     → Category-specific suggestions

     User types:
     → Search complete service library
  ========================================================= */

  const options = useMemo(() => {

    const query =
      normalizeServiceText(inputValue);


    /* -----------------------------------------
       NO SEARCH
       Show category suggestions
    ----------------------------------------- */

    if (!query) {

      return mapServicesToSelectOptions(
        suggestions
      );

    }


    /* -----------------------------------------
       SEARCH MASTER LIBRARY
    ----------------------------------------- */

    const libraryResults =
      searchServices(query);


    /* -----------------------------------------
       Remove already selected services
    ----------------------------------------- */

    const selectedNames =
      new Set(
        services.map((service) =>
          normalizeServiceText(
            service?.name
          ).toLowerCase()
        )
      );


    const filteredResults =
      libraryResults.filter((service) => {

        const name =
          typeof service === "string"
            ? service
            : service?.name;

        return !selectedNames.has(
          normalizeServiceText(name)
            .toLowerCase()
        );

      });


    return mapServicesToSelectOptions(
      filteredResults
    );

  }, [
    inputValue,
    suggestions,
    services,
  ]);


  /* =========================================================
     SELECTED OPTIONS
  ========================================================= */

  const selectedValues =
    uniqueServices(services)
      .map((service) => {

        const name =
          normalizeServiceText(
            service?.name
          );

        if (!name) {
          return null;
        }

        return {
          value: name,
          label: name,
        };

      })
      .filter(Boolean);


  /* =========================================================
     SERVICE CHANGE
  ========================================================= */

  const handleServicesChange = (selected) => {

  const selectedOptions =
    selected || [];


  const updatedServices =
    selectedOptions
      .map((option) => {

        const name =
          normalizeServiceText(
            option?.value
          );

        if (!name) {
          return null;
        }


        /* -----------------------------------------
           Preserve existing description
        ----------------------------------------- */

        const existingService =
          services.find(
            (service) =>
              normalizeServiceText(
                service?.name
              ).toLowerCase() ===
              name.toLowerCase()
          );


        return {
          name,

          description:
            existingService?.description || "",
        };

      })
      .filter(Boolean);


  /* -----------------------------------------
     Update selected services
  ----------------------------------------- */

  onChange?.(
    uniqueServices(
      updatedServices
    )
  );


  /* -----------------------------------------
     Clear search/input after selection
  ----------------------------------------- */

  setInputValue("");

};


  /* =========================================================
     DESCRIPTION CHANGE
  ========================================================= */

  const handleDescriptionChange = (
    index,
    description
  ) => {

    const updatedServices = [
      ...services,
    ];


    if (!updatedServices[index]) {
      return;
    }


    updatedServices[index] = {
      ...updatedServices[index],
      description,
    };


    onChange?.(
      updatedServices
    );

  };


  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  const handleInputChange = (
    newValue,
    actionMeta
  ) => {

    if (
      actionMeta.action ===
      "input-change"
    ) {

      setInputValue(
        newValue
      );

    }

    return newValue;

  };


  /* =========================================================
     CREATE LABEL
  ========================================================= */

  const formatCreateLabel = (
    inputValue
  ) => {

    const name =
      normalizeServiceText(
        inputValue
      );

    return `Add "${name}"`;

  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="mt-6">

      <h3 className="font-semibold mb-3">
        Services Offered
      </h3>


      <CreatableSelect

        isMulti

        options={options}

        value={selectedValues}

        onChange={handleServicesChange}

        onInputChange={
          handleInputChange
        }

        inputValue={inputValue}

        placeholder="Select or type services"

        formatCreateLabel={
          formatCreateLabel
        }

        isClearable

        isSearchable

        noOptionsMessage={() => {

          if (
            normalizeServiceText(
              inputValue
            )
          ) {

            return "No matching service found — type to add a custom service";

          }

          return "No services available";

        }}

      />


      {/* =====================================================
          SERVICE DESCRIPTIONS
      ===================================================== */}

      {services.map(
        (service, index) => {

          const serviceName =
            normalizeServiceText(
              service?.name
            );


          if (!serviceName) {
            return null;
          }


          return (
            <div
              key={`${serviceName}-${index}`}
              className="
                mt-3
                border
                rounded-xl
                p-3
                bg-gray-50
              "
            >

              <label
                className="
                  text-sm
                  font-medium
                  block
                "
              >
                {serviceName} Description
              </label>


              <textarea
                value={
                  service?.description || ""
                }
                onChange={(e) =>
                  handleDescriptionChange(
                    index,
                    e.target.value
                  )
                }
                placeholder={`Describe ${serviceName} service...`}
                rows={2}
                className="
                  border
                  rounded-lg
                  p-2
                  w-full
                  mt-2
                  resize-y
                "
              />

            </div>
          );

        }
      )}

    </div>
  );

};


export default ServicesOffered;