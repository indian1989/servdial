// src/components/business/BusinessFeatureFields.jsx

import PricingManager from "./PricingManager";
import ServicesManager from "./ServicesManager";
import CatalogManager from "./CatalogManager";
import MenuManager from "./MenuManager";

import FAQManager from "./FAQManager";
import OffersManager from "./OffersManager";

import BusinessHoursManager from "../BusinessHoursManager";
import RestaurantBookingManager from "./RestaurantBookingManager";
import RoomBookingManager from "./RoomBookingManager";
import PartyBookingManager from "./PartyBookingManager";

/*
|--------------------------------------------------------------------------
| CATEGORY FEATURE REGISTRY
|--------------------------------------------------------------------------
|
| MongoDB Category.features:
|
| [
|   "pricing",
|   "services",
|   "catalog",
|   "food_menu",
|   "faq",
|   "offers",
|   "business_hours"
| ]
|
|--------------------------------------------------------------------------
*/


const featureRegistry = {

  pricing:
    PricingManager,

  services:
    ServicesManager,

  catalog:
    CatalogManager,

  food_menu:
    MenuManager,

  faq:
    FAQManager,

  offers:
    OffersManager,

  business_hours:
    BusinessHoursManager,

  table_booking:
    RestaurantBookingManager,

  room_booking:
    RoomBookingManager,

    party_booking: PartyBookingManager,
};



/*
|--------------------------------------------------------------------------
| FEATURE FIELD RENDERER
|--------------------------------------------------------------------------
*/


const BusinessFeatureFields = ({

  features = [],

  pricing,
  setPricing,

  services,
  setServices,

  catalog,
  setCatalog,

  menu,
  setMenu,

  faq,
  setFaq,

  offers,
  setOffers,

  hours,
  setHours,

   restaurantBooking,
  setRestaurantBooking,

    partyBooking,
  setPartyBooking,

}) => {

console.log(
  "🔥 BusinessFeatureFields FEATURES:",
  features
);

  if(
    !Array.isArray(features) ||
    features.length === 0
  ){

    return null;

  }



  return (

    <div
      className="
      space-y-6
      "
    >

{features.map((feature) => {


console.log(
  "🔥 FEATURE NAME:",
  feature
);


const Component =
  featureRegistry[feature];


console.log(
  "🔥 COMPONENT:",
  Component
);


if (!Component) return null;



          const commonProps = {

            key: feature,

          };



          switch(feature){


            case "pricing":

              return (

                <Component
                  {...commonProps}

                  value={
                    pricing
                  }

                  onChange={
                    setPricing
                  }

                />

              );



            case "services":

              return (

                <Component
                  {...commonProps}

                  value={
                    services
                  }

                  onChange={
                    setServices
                  }

                />

              );



            case "catalog":

              return (

                <Component
                  {...commonProps}

                  value={
                    catalog
                  }

                  onChange={
                    setCatalog
                  }

                />

              );



            case "food_menu":

              return (

                <Component
                  {...commonProps}

                  value={
                    menu
                  }

                  onChange={
                    setMenu
                  }

                />

              );

    case "party_booking":
  return (
    <Component
      {...commonProps}
      value={partyBooking}
      onChange={setPartyBooking}
    />
  );


            case "faq":

              return (

                <Component
                  {...commonProps}

                  value={
                    faq
                  }

                  onChange={
                    setFaq
                  }

                />

              );



            case "offers":

              return (

                <Component
                  {...commonProps}

                  value={
                    offers
                  }

                  onChange={
                    setOffers
                  }

                />

              );

              case "table_booking":

  return (

    <Component
      {...commonProps}

      value={restaurantBooking}

      onChange={setRestaurantBooking}

    />

  );


case "room_booking":

  return (

    <Component
      {...commonProps}

      value={null}

      onChange={() => {}}

    />

  );



            case "business_hours":

              return (

                <Component
                  {...commonProps}

                  value={
                    hours
                  }

                  onChange={
                    setHours
                  }

                />

              );



            default:

              return null;


          }


        })
      }


    </div>

  );

};


export default BusinessFeatureFields;