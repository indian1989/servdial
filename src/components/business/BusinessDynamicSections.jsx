import CatalogSection from "./CatalogSection";

import ServicePricing from "./ServicePricing";
import AppointmentBooking from "./AppointmentBooking";
import RoomBooking from "./RoomBooking";

import RestaurantBooking from "./RestaurantBooking";
import FoodMenuSection from "./FoodMenuSection";
import PartyBooking from "./PartyBooking";

const featureRegistry = {

  pricing: ServicePricing,

  appointment_booking: AppointmentBooking,

  room_booking: RoomBooking,

  table_booking: RestaurantBooking,

  food_menu: FoodMenuSection,

  party_booking: PartyBooking,

};

const BusinessDynamicSections = ({
  business,
  onBooking,
}) => {

  const features =
  business?.categoryId?.features || [];

console.log(
  "BUSINESS FEATURES:",
  features
);

console.log(
  "CATEGORY DATA:",
  business?.categoryId
);

  return (
    <>

      <CatalogSection
        title={business.catalogTitle}
        items={business.catalog}
      />

      {features.map((feature) => {

        const Component =
          featureRegistry[feature];

        if (!Component) return null;

        return (
          <Component
            key={feature}
            business={business}
            pricing={business.pricing}
            onBooking={onBooking}
          />
        );

      })}

    </>
  );

};

export default BusinessDynamicSections;