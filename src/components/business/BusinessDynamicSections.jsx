import CategoryFeatureSection from "./CategoryFeatureSection";
import CatalogSection from "./CatalogSection";
import ServicePricing from "./ServicePricing";
import AppointmentBooking from "./AppointmentBooking";
import RoomBooking from "./RoomBooking";

const uiRegistry = {

  service: [
    ServicePricing,
  ],

  appointment: [
    AppointmentBooking,
  ],

  hotel: [
    RoomBooking,
  ],

  restaurant: [],

  shopping: [],

};

const BusinessDynamicSections = ({
  business,
  onBooking,
}) => {

  const uiType =
    business?.categoryId?.uiType ||
    business?.category?.uiType ||
    "service";

  const Components =
    uiRegistry[uiType] || [];

  return (
    <>
      <CategoryFeatureSection business={business} />

      <CatalogSection
        title={business.catalogTitle}
        items={business.catalog}
      />

      {Components.map((Component, index) => (
        <Component
          key={index}
          business={business}
          pricing={business.pricing}
          onSubmit={onBooking}
        />
      ))}
    </>
  );
};

export default BusinessDynamicSections;