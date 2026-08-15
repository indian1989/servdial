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
import AppointmentBookingManager from "./AppointmentBookingManager";


/*
|--------------------------------------------------------------------------
| CATEGORY FEATURE REGISTRY
|--------------------------------------------------------------------------
|
| Category.features examples:
|
| [
|   "pricing",
|   "services",
|   "catalog",
|   "food_menu",
|   "appointment_booking",
|   "table_booking",
|   "room_booking",
|   "party_booking",
|   "faq",
|   "offers",
|   "business_hours",
|   "lead_form"
| ]
|
|--------------------------------------------------------------------------
*/

const featureRegistry = {

  // ================= BUSINESS DATA =================

  pricing: PricingManager,

  services: ServicesManager,

  catalog: CatalogManager,


  // ================= RESTAURANT / MENU =================

  food_menu: MenuManager,


  // ================= ENGAGEMENT =================

  faq: FAQManager,

  offers: OffersManager,

  business_hours: BusinessHoursManager,


  // ================= BOOKING =================

  appointment_booking: AppointmentBookingManager,

  table_booking: RestaurantBookingManager,

  room_booking: RoomBookingManager,

  party_booking: PartyBookingManager,

};


/*
|--------------------------------------------------------------------------
| BUSINESS FEATURE FIELDS
|--------------------------------------------------------------------------
*/

const BusinessFeatureFields = ({

  // ================= CATEGORY FEATURES =================

  features = [],


  // ================= PRICING =================

  pricing = [],

  setPricing,


  // ================= SERVICES =================

  services = [],

  setServices,


  // ================= CATALOG =================

  catalog = [],

  setCatalog,


  // ================= MENU =================

  menu = [],

  setMenu,


  // ================= FAQ =================

  faq = [],

  setFaq,


  // ================= OFFERS =================

  offers = [],

  setOffers,


  // ================= BUSINESS HOURS =================

  hours = {},

  setHours,


  // ================= APPOINTMENT BOOKING =================

  appointmentBooking = null,

  setAppointmentBooking,


  // ================= TABLE BOOKING =================

  restaurantBooking = null,

  setRestaurantBooking,


  // ================= ROOM BOOKING =================

  roomBooking = null,

  setRoomBooking,


  // ================= PARTY BOOKING =================

  partyBooking = null,

  setPartyBooking,

}) => {


  /*
  |--------------------------------------------------------------------------
  | NO FEATURES
  |--------------------------------------------------------------------------
  */

  if (
    !Array.isArray(features) ||
    features.length === 0
  ) {
    return null;
  }


  /*
  |--------------------------------------------------------------------------
  | RENDER CATEGORY FEATURES
  |--------------------------------------------------------------------------
  */

  return (

    <div className="space-y-6">

      {features.map((feature) => {

        /*
        |--------------------------------------------------------------------------
        | GET FEATURE COMPONENT
        |--------------------------------------------------------------------------
        */

        const Component =
          featureRegistry[feature];


        /*
        |--------------------------------------------------------------------------
        | UNKNOWN FEATURE
        |--------------------------------------------------------------------------
        */

        if (!Component) {

          console.warn(
            "⚠️ Unknown business feature:",
            feature
          );

          return null;
        }


        /*
        |--------------------------------------------------------------------------
        | PRICING
        |--------------------------------------------------------------------------
        */

        if (feature === "pricing") {

          return (
            <Component
              key={feature}
              value={pricing}
              onChange={setPricing}
            />
          );

        }


        /*
        |--------------------------------------------------------------------------
        | SERVICES
        |--------------------------------------------------------------------------
        */

        if (feature === "services") {

          return (
            <Component
              key={feature}
              value={services}
              onChange={setServices}
            />
          );

        }


        /*
        |--------------------------------------------------------------------------
        | CATALOG
        |--------------------------------------------------------------------------
        */

        if (feature === "catalog") {

          return (
            <Component
              key={feature}
              value={catalog}
              onChange={setCatalog}
            />
          );

        }


        /*
        |--------------------------------------------------------------------------
        | FOOD MENU
        |--------------------------------------------------------------------------
        */

        if (feature === "food_menu") {

          return (
            <Component
              key={feature}
              value={menu}
              onChange={setMenu}
            />
          );

        }


        /*
        |--------------------------------------------------------------------------
        | FAQ
        |--------------------------------------------------------------------------
        */

        if (feature === "faq") {

          return (
            <Component
              key={feature}
              value={faq}
              onChange={setFaq}
            />
          );

        }


        /*
        |--------------------------------------------------------------------------
        | OFFERS
        |--------------------------------------------------------------------------
        |
        | Offers are category-feature based.
        |
        | Example:
        |
        | Category.features:
        |
        | [
        |   "services",
        |   "offers"
        | ]
        |
        | Then OffersManager will automatically appear.
        |
        | Business data:
        |
        | offers: [
        |   {
        |     title,
        |     description,
        |     image,
        |     expiryDate,
        |     discountPercent,
        |     validTill,
        |     isActive
        |   }
        | ]
        |
        |--------------------------------------------------------------------------
        */

        if (feature === "offers") {

          return (
            <Component
              key={feature}
              value={offers}
              onChange={setOffers}
            />
          );

        }


        /*
        |--------------------------------------------------------------------------
        | BUSINESS HOURS
        |--------------------------------------------------------------------------
        */

        if (feature === "business_hours") {

          return (
            <Component
              key={feature}
              value={hours}
              onChange={setHours}
            />
          );

        }


        /*
        |--------------------------------------------------------------------------
        | APPOINTMENT BOOKING
        |--------------------------------------------------------------------------
        */

        if (feature === "appointment_booking") {

          return (
            <Component
              key={feature}
              value={appointmentBooking}
              onChange={setAppointmentBooking}
            />
          );

        }


        /*
        |--------------------------------------------------------------------------
        | TABLE BOOKING
        |--------------------------------------------------------------------------
        */

        if (feature === "table_booking") {

          return (
            <Component
              key={feature}
              value={restaurantBooking}
              onChange={setRestaurantBooking}
            />
          );

        }


        /*
        |--------------------------------------------------------------------------
        | ROOM BOOKING
        |--------------------------------------------------------------------------
        */

        if (feature === "room_booking") {

          return (
            <Component
              key={feature}
              value={roomBooking}
              onChange={setRoomBooking}
            />
          );

        }


        /*
        |--------------------------------------------------------------------------
        | PARTY BOOKING
        |--------------------------------------------------------------------------
        */

        if (feature === "party_booking") {

          return (
            <Component
              key={feature}
              value={partyBooking}
              onChange={setPartyBooking}
            />
          );

        }


        /*
        |--------------------------------------------------------------------------
        | DEFAULT
        |--------------------------------------------------------------------------
        */

        return null;

      })}

    </div>

  );

};


export default BusinessFeatureFields;