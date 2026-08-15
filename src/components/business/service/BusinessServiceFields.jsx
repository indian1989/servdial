import ServiceCoverage from "./ServiceCoverage";
import ServiceType from "./ServiceType";
import ServicesOffered from "./ServicesOffered";

const BusinessServiceFields = ({
  serviceCoverage,
  serviceTypes,
  services,

  cities = [],
  country = "India",
  countryCode = "IN",

  suggestedServices = [],

  onServiceCoverageChange,
  onServiceTypesChange,
  onServicesChange,
}) => {
  return (
    <div className="space-y-6">

      {/* ================= SERVICE COVERAGE ================= */}

      <ServiceCoverage
        value={serviceCoverage}
        cities={cities}
        country={country}
        countryCode={countryCode}
        onChange={onServiceCoverageChange}
      />

      {/* ================= SERVICE TYPE ================= */}

      <ServiceType
        value={serviceTypes || []}
        onChange={onServiceTypesChange}
      />

      {/* ================= SERVICES OFFERED ================= */}

      <ServicesOffered
        value={services || []}
        suggestions={suggestedServices}
        onChange={onServicesChange}
      />

    </div>
  );
};

export default BusinessServiceFields;