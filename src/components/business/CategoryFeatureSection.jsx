// src/components/business/CategoryFeatureSection.jsx

import {
  CalendarCheck,
  Utensils,
  BedDouble,
  Zap,
  Stethoscope,
  Wrench,
  IndianRupee,
  ShoppingBag,
  HelpCircle,
  Tag,
  Clock,
  BookOpen,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| CATEGORY FEATURE SECTION
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| Category name is NOT used to decide which feature should appear.
|
| Category.features is the single source of truth.
|
| Example:
|
| Category.features:
|
| [
|   "services",
|   "food_menu",
|   "table_booking",
|   "party_booking"
| ]
|
| Then only those features will be rendered.
|
| Location, city, area, pincode and geocode have NO role here.
|
|--------------------------------------------------------------------------
*/


/* =========================================================================
   FEATURE HELPERS
========================================================================= */

const getCategoryFeatures = (business) => {
  /*
   * Preferred source:
   * business.categoryId.features
   *
   * Fallback:
   * business.categoryFeatures
   *
   * This keeps the component compatible with both populated category
   * data and normalized business data.
   */

  const categoryFeatures =
    Array.isArray(business?.categoryId?.features)
      ? business.categoryId.features
      : Array.isArray(business?.categoryFeatures)
        ? business.categoryFeatures
        : [];

  /*
   * Normalize:
   * - lowercase
   * - trim
   * - remove empty values
   * - remove duplicates
   */

  return [
    ...new Set(
      categoryFeatures
        .map((feature) =>
          String(feature || "")
            .trim()
            .toLowerCase()
        )
        .filter(Boolean)
    ),
  ];
};


/* =========================================================================
   GENERIC FEATURE CARD
========================================================================= */

const FeatureCard = ({
  icon,
  title,
  text,
  actionLabel,
  onClick,
}) => {
  const hasAction = typeof onClick === "function";

  return (
    <div
      className="
        border
        rounded-xl
        p-4
        bg-white
        hover:shadow-md
        transition
      "
    >
      <div className="text-blue-600 mb-3">
        {icon}
      </div>

      <h3 className="font-semibold">
        {title}
      </h3>

      {text && (
        <p className="text-sm text-gray-500 mt-1">
          {text}
        </p>
      )}

      {hasAction && (
        <button
          type="button"
          onClick={onClick}
          className="
            mt-3
            text-sm
            text-blue-600
            font-medium
            hover:text-blue-700
          "
        >
          {actionLabel || "View"}
        </button>
      )}
    </div>
  );
};


/* =========================================================================
   SECTION WRAPPER
========================================================================= */

const FeatureSection = ({
  id,
  icon,
  title,
  children,
}) => {
  return (
    <section
      id={id}
      className="
        bg-white
        rounded-2xl
        shadow
        p-5
        space-y-5
      "
    >
      <h2
        className="
          text-xl
          font-bold
          flex
          items-center
          gap-2
        "
      >
        {icon}

        <span>
          {title}
        </span>
      </h2>

      {children}
    </section>
  );
};


/* =========================================================================
   SERVICES
========================================================================= */

const ServicesFeature = ({ business }) => {
  const services = Array.isArray(business?.services)
    ? business.services
    : [];

  if (services.length === 0) {
    return null;
  }

  return (
    <FeatureSection
      id="services"
      icon={<Wrench size={22} />}
      title="Services"
    >
      <div
        className="
          grid
          md:grid-cols-2
          lg:grid-cols-3
          gap-4
        "
      >
        {services.map((service, index) => {
          const name =
            typeof service === "string"
              ? service
              : service?.name;

          const description =
            typeof service === "object"
              ? service?.description
              : "";

          if (!name) {
            return null;
          }

          return (
            <FeatureCard
              key={`${name}-${index}`}
              icon={<Wrench size={20} />}
              title={name}
              text={
                description ||
                "Professional service"
              }
            />
          );
        })}
      </div>
    </FeatureSection>
  );
};


/* =========================================================================
   PRICING
========================================================================= */

const PricingFeature = ({ business }) => {
  const pricing = Array.isArray(business?.pricing)
    ? business.pricing
    : [];

  if (pricing.length === 0) {
    return null;
  }

  return (
    <FeatureSection
      id="pricing"
      icon={<IndianRupee size={22} />}
      title="Pricing"
    >
      <div className="space-y-3">
        {pricing.map((item, index) => {
          const name =
            item?.name ||
            item?.service ||
            item?.title ||
            "";

          const price =
            item?.price ??
            item?.amount ??
            "";

          if (!name) {
            return null;
          }

          return (
            <div
              key={`${name}-${index}`}
              className="
                flex
                items-center
                justify-between
                gap-4
                border-b
                pb-3
                last:border-b-0
              "
            >
              <span className="font-medium">
                {name}
              </span>

              {price !== "" && (
                <span className="font-bold text-blue-600">
                  {typeof price === "number"
                    ? `₹${price}`
                    : price}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </FeatureSection>
  );
};


/* =========================================================================
   CATALOG
========================================================================= */

const CatalogFeature = ({ business }) => {
  const catalog = Array.isArray(business?.catalog)
    ? business.catalog
    : [];

  if (catalog.length === 0) {
    return null;
  }

  return (
    <FeatureSection
      id="catalog"
      icon={<ShoppingBag size={22} />}
      title="Catalog"
    >
      <div
        className="
          grid
          md:grid-cols-2
          lg:grid-cols-3
          gap-4
        "
      >
        {catalog.map((item, index) => {
          const title =
            item?.name ||
            item?.title ||
            "";

          const description =
            item?.description ||
            "";

          if (!title) {
            return null;
          }

          return (
            <FeatureCard
              key={`${title}-${index}`}
              icon={<ShoppingBag size={20} />}
              title={title}
              text={description}
            />
          );
        })}
      </div>
    </FeatureSection>
  );
};


/* =========================================================================
   FOOD MENU
========================================================================= */

const FoodMenuFeature = ({ business }) => {
  const menu = Array.isArray(business?.menu)
    ? business.menu
    : [];

  if (menu.length === 0) {
    return null;
  }

  return (
    <FeatureSection
      id="food-menu"
      icon={<Utensils size={22} />}
      title="Food Menu"
    >
      <div
        className="
          grid
          md:grid-cols-2
          lg:grid-cols-3
          gap-4
        "
      >
        {menu.map((item, index) => {
          const name =
            item?.name ||
            item?.title ||
            "";

          const description =
            item?.description ||
            "";

          const price =
            item?.price ??
            item?.amount ??
            "";

          if (!name) {
            return null;
          }

          return (
            <FeatureCard
              key={`${name}-${index}`}
              icon={<Utensils size={20} />}
              title={name}
              text={
                [
                  description,
                  price !== ""
                    ? typeof price === "number"
                      ? `₹${price}`
                      : price
                    : "",
                ]
                  .filter(Boolean)
                  .join(" • ")
              }
            />
          );
        })}
      </div>
    </FeatureSection>
  );
};


/* =========================================================================
   TABLE BOOKING
========================================================================= */

const TableBookingFeature = ({
  business,
  onBooking,
}) => {
  const booking =
    business?.restaurantBooking || null;

  return (
    <FeatureSection
      id="booking"
      icon={<Utensils size={22} />}
      title="Table Booking"
    >
      <div
        className="
          grid
          md:grid-cols-3
          gap-4
        "
      >
        <FeatureCard
          icon={<CalendarCheck size={20} />}
          title="Book Table"
          text={
            booking?.advanceBookingDays
              ? `Advance booking up to ${booking.advanceBookingDays} days`
              : "Reserve a table"
          }
          actionLabel="Book Now"
          onClick={() =>
            onBooking?.("table_booking")
          }
        />

        {business?.menu?.length > 0 && (
          <FeatureCard
            icon={<Utensils size={20} />}
            title="Food Menu"
            text="View available food items"
            actionLabel="View Menu"
            onClick={() =>
              document
                .getElementById("food-menu")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          />
        )}

        {business?.partyBooking?.enabled && (
          <FeatureCard
            icon={<CalendarCheck size={20} />}
            title="Party Booking"
            text="Book the venue for your event"
            actionLabel="Book Now"
            onClick={() =>
              onBooking?.("party_booking")
            }
          />
        )}
      </div>
    </FeatureSection>
  );
};


/* =========================================================================
   ROOM BOOKING
========================================================================= */

const RoomBookingFeature = ({
  business,
  onBooking,
}) => {
  const roomBooking =
    business?.roomBooking || null;

  return (
    <FeatureSection
      id="room-booking"
      icon={<BedDouble size={22} />}
      title="Room Booking"
    >
      <div
        className="
          grid
          md:grid-cols-3
          gap-4
        "
      >
        <FeatureCard
          icon={<CalendarCheck size={20} />}
          title="Check Availability"
          text={
            roomBooking?.advanceBookingDays
              ? `Book up to ${roomBooking.advanceBookingDays} days in advance`
              : "Select check-in and check-out"
          }
          actionLabel="Check Availability"
          onClick={() =>
            onBooking?.("room_booking")
          }
        />

        <FeatureCard
          icon={<BedDouble size={20} />}
          title="Room Types"
          text={
            Array.isArray(roomBooking?.roomTypes) &&
            roomBooking.roomTypes.length > 0
              ? `${roomBooking.roomTypes.length} room types available`
              : "Available room options"
          }
          actionLabel="View Rooms"
          onClick={() =>
            onBooking?.("room_booking")
          }
        />

        <FeatureCard
          icon={<IndianRupee size={20} />}
          title="Room Rates"
          text="Check available room pricing"
          actionLabel="View Rates"
          onClick={() =>
            onBooking?.("room_booking")
          }
        />
      </div>
    </FeatureSection>
  );
};


/* =========================================================================
   PARTY BOOKING
========================================================================= */

const PartyBookingFeature = ({
  business,
  onBooking,
}) => {
  const partyBooking =
    business?.partyBooking || null;

  return (
    <FeatureSection
      id="party-booking"
      icon={<CalendarCheck size={22} />}
      title="Party Booking"
    >
      <div
        className="
          grid
          md:grid-cols-3
          gap-4
        "
      >
        <FeatureCard
          icon={<CalendarCheck size={20} />}
          title="Book Party"
          text={
            partyBooking?.capacity
              ? `Capacity: ${partyBooking.capacity}`
              : "Plan your party or event"
          }
          actionLabel="Book Now"
          onClick={() =>
            onBooking?.("party_booking")
          }
        />

        <FeatureCard
          icon={<Utensils size={20} />}
          title="Food & Catering"
          text="Ask about available food options"
          actionLabel="Enquire"
          onClick={() =>
            onBooking?.("party_booking")
          }
        />

        <FeatureCard
          icon={<CalendarCheck size={20} />}
          title="Event Availability"
          text="Check available dates"
          actionLabel="Check Availability"
          onClick={() =>
            onBooking?.("party_booking")
          }
        />
      </div>
    </FeatureSection>
  );
};


/* =========================================================================
   APPOINTMENT BOOKING
========================================================================= */

const AppointmentBookingFeature = ({
  business,
  onBooking,
}) => {
  const appointment =
    business?.appointmentBooking || null;

  return (
    <FeatureSection
      id="appointment-booking"
      icon={<Stethoscope size={22} />}
      title="Appointment Booking"
    >
      <div
        className="
          grid
          md:grid-cols-3
          gap-4
        "
      >
        <FeatureCard
          icon={<CalendarCheck size={20} />}
          title="Book Appointment"
          text={
            appointment?.slotDuration
              ? `${appointment.slotDuration} minute slots`
              : "Choose an available appointment"
          }
          actionLabel="Book Now"
          onClick={() =>
            onBooking?.("appointment_booking")
          }
        />

        {Array.isArray(
          appointment?.consultationModes
        ) &&
          appointment.consultationModes.length > 0 && (
            <FeatureCard
              icon={<Stethoscope size={20} />}
              title="Consultation Mode"
              text={appointment.consultationModes.join(
                ", "
              )}
            />
          )}

        <FeatureCard
          icon={<Clock size={20} />}
          title="Availability"
          text="Check available appointment slots"
          actionLabel="View Slots"
          onClick={() =>
            onBooking?.("appointment_booking")
          }
        />
      </div>
    </FeatureSection>
  );
};


/* =========================================================================
   FAQ
========================================================================= */

const FAQFeature = ({ business }) => {
  const faq = Array.isArray(business?.faq)
    ? business.faq
    : [];

  if (faq.length === 0) {
    return null;
  }

  return (
    <FeatureSection
      id="faq"
      icon={<HelpCircle size={22} />}
      title="Frequently Asked Questions"
    >
      <div className="space-y-4">
        {faq.map((item, index) => {
          const question =
            item?.question ||
            item?.title ||
            "";

          const answer =
            item?.answer ||
            item?.description ||
            "";

          if (!question) {
            return null;
          }

          return (
            <div
              key={`${question}-${index}`}
              className="
                border
                rounded-xl
                p-4
              "
            >
              <h3 className="font-semibold">
                {question}
              </h3>

              {answer && (
                <p className="text-sm text-gray-600 mt-2">
                  {answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </FeatureSection>
  );
};


/* =========================================================================
   OFFERS
========================================================================= */

const OffersFeature = ({ business }) => {
  const offers = Array.isArray(business?.offers)
    ? business.offers
    : [];

  const activeOffers = offers.filter(
    (offer) =>
      offer?.isActive !== false
  );

  if (activeOffers.length === 0) {
    return null;
  }

  return (
    <FeatureSection
      id="offers"
      icon={<Tag size={22} />}
      title="Offers"
    >
      <div
        className="
          grid
          md:grid-cols-2
          lg:grid-cols-3
          gap-4
        "
      >
        {activeOffers.map((offer, index) => {
          const title =
            offer?.title ||
            "";

          const description =
            offer?.description ||
            "";

          if (!title) {
            return null;
          }

          return (
            <FeatureCard
              key={`${title}-${index}`}
              icon={<Tag size={20} />}
              title={title}
              text={
                [
                  description,
                  offer?.discountPercent
                    ? `${offer.discountPercent}% off`
                    : "",
                ]
                  .filter(Boolean)
                  .join(" • ")
              }
            />
          );
        })}
      </div>
    </FeatureSection>
  );
};


/* =========================================================================
   BUSINESS HOURS
========================================================================= */

const BusinessHoursFeature = ({
  business,
}) => {
  const hours =
    business?.businessHours || null;

  if (
    !hours ||
    Object.keys(hours).length === 0
  ) {
    return null;
  }

  return (
    <FeatureSection
      id="business-hours"
      icon={<Clock size={22} />}
      title="Business Hours"
    >
      <div className="text-sm text-gray-600">
        Business hours are available for this
        business.
      </div>
    </FeatureSection>
  );
};


/* =========================================================================
   FEATURE RENDERER
========================================================================= */

const renderFeature = (
  feature,
  business,
  onBooking
) => {
  switch (feature) {
    case "services":
      return (
        <ServicesFeature
          key={feature}
          business={business}
        />
      );

    case "pricing":
      return (
        <PricingFeature
          key={feature}
          business={business}
        />
      );

    case "catalog":
      return (
        <CatalogFeature
          key={feature}
          business={business}
        />
      );

    case "food_menu":
      return (
        <FoodMenuFeature
          key={feature}
          business={business}
        />
      );

    case "table_booking":
      return (
        <TableBookingFeature
          key={feature}
          business={business}
          onBooking={onBooking}
        />
      );

    case "room_booking":
      return (
        <RoomBookingFeature
          key={feature}
          business={business}
          onBooking={onBooking}
        />
      );

    case "party_booking":
      return (
        <PartyBookingFeature
          key={feature}
          business={business}
          onBooking={onBooking}
        />
      );

    case "appointment_booking":
      return (
        <AppointmentBookingFeature
          key={feature}
          business={business}
          onBooking={onBooking}
        />
      );

    case "faq":
      return (
        <FAQFeature
          key={feature}
          business={business}
        />
      );

    case "offers":
      return (
        <OffersFeature
          key={feature}
          business={business}
        />
      );

    case "business_hours":
      return (
        <BusinessHoursFeature
          key={feature}
          business={business}
        />
      );

    /*
     * lead_form is intentionally not rendered here.
     *
     * LeadForm normally belongs to the page/action flow
     * and should not be duplicated inside this section.
     */

    case "lead_form":
      return null;

    default:
      console.warn(
        "⚠️ Unknown category feature:",
        feature
      );

      return null;
  }
};


/* =========================================================================
   MAIN COMPONENT
========================================================================= */

const CategoryFeatureSection = ({
  business,
  onBooking,
}) => {
  const features =
    getCategoryFeatures(business);

  /*
   * No category features:
   * render nothing.
   */

  if (features.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {features.map((feature) =>
        renderFeature(
          feature,
          business,
          onBooking
        )
      )}
    </div>
  );
};


export default CategoryFeatureSection;