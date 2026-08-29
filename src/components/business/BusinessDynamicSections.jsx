// src/components/business/BusinessDynamicSections.jsx

import CatalogSection from "./CatalogSection";

import ServicePricing from "./ServicePricing";
import AppointmentBooking from "./AppointmentBooking";
import RoomBooking from "./RoomBooking";

import RestaurantBooking from "./RestaurantBooking";
import FoodMenuSection from "./FoodMenuSection";
import PartyBooking from "./PartyBooking";
import OffersSection from "./OffersSection";

/*
|--------------------------------------------------------------------------
| CATEGORY FEATURE REGISTRY
|--------------------------------------------------------------------------
|
| Category.features database me jo string hogi
| uske according component load hoga
|
| Example:
|
| Category:
| {
|   name:"Electrician",
|   features:[
|      "pricing"
|   ]
| }
|
|--------------------------------------------------------------------------
*/


const featureRegistry = {

  catalog:
    CatalogSection,

  pricing:
    ServicePricing,

  appointment_booking:
    AppointmentBooking,

  room_booking:
    RoomBooking,

  table_booking:
    RestaurantBooking,

  food_menu:
    FoodMenuSection,

  party_booking:
    PartyBooking,

  offers:
    OffersSection,

};



const BusinessDynamicSections = ({
  business,
  onBooking,
}) => {


  /*
  |--------------------------------------------------------------------------
  | CATEGORY CHECK
  |--------------------------------------------------------------------------
  */

  const category =
    business?.categoryId;


  if(!category){
    console.log(featureRegistry);
    return null;
  }



  /*
  |--------------------------------------------------------------------------
  | FEATURES ONLY FROM CATEGORY
  |--------------------------------------------------------------------------
  */

  const categoryFeatures =
  Array.isArray(category.features)
    ? category.features
    : [];

const features = categoryFeatures.filter((feature) => {

  if (feature === "appointment_booking") {
    return business?.appointmentBooking?.enabled === true;
  }

  if (feature === "room_booking") {
    return business?.roomBooking?.enabled === true;
  }

  if (feature === "table_booking") {
    return business?.restaurantBooking?.enabled === true;
  }

  if (feature === "party_booking") {
    return business?.partyBooking?.enabled === true;
  }

  return true;
});

if (features.length === 0) {
  return null;
}

  return (

  <div
    className="
    space-y-8
    "
  >

    {
      features.map((feature) => {

        const Component =
          featureRegistry[feature];

        /*
         * Unknown feature ignore
         */
        if (!Component) {
          return null;
        }

        const isBookingFeature = [
          "appointment_booking",
          "room_booking",
          "table_booking",
          "party_booking",
        ].includes(feature);

        /*
         * Only the first enabled booking feature
         * gets the common #booking anchor.
         *
         * This prevents duplicate HTML IDs when
         * multiple booking features are enabled.
         */
        const firstBookingFeature =
          features.find((item) =>
            [
              "appointment_booking",
              "room_booking",
              "table_booking",
              "party_booking",
            ].includes(item)
          );

        const sectionId =
          isBookingFeature &&
          feature === firstBookingFeature
            ? "booking"
            : feature;

        return (

          <div
            key={feature}
            id={sectionId}
            className="
            bg-white
            rounded-2xl
            shadow-sm
            border
            p-5
            "
          >

            <Component
              business={business}

              pricing={
                business?.pricing || []
              }

              title={
                business?.catalogTitle
              }

              items={
                business?.catalog || []
              }

              onBooking={
                onBooking
              }
            />

          </div>

        );

      })
    }

  </div>

);

};


export default BusinessDynamicSections;