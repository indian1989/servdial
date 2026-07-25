// src/components/business/BusinessDynamicSections.jsx

import CatalogSection from "./CatalogSection";

import ServicePricing from "./ServicePricing";
import AppointmentBooking from "./AppointmentBooking";
import RoomBooking from "./RoomBooking";

import RestaurantBooking from "./RestaurantBooking";
import FoodMenuSection from "./FoodMenuSection";
import PartyBooking from "./PartyBooking";


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

  const features =
  Array.isArray(category.features)
    ? category.features
    : [];

console.log(
  "🔥 CATEGORY FEATURES:",
  category.name,
  features
);



  if(features.length === 0){
    return null;
  }



  return (

    <div
      className="
      space-y-8
      "
    >


      {
        features.map((feature)=>{


          const Component =
            featureRegistry[feature];


          /*
          unknown feature ignore
          */

          if(!Component){
            return null;
          }



          return (

            <div
              key={feature}
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