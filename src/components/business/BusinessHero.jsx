import {
  Phone,
  MessageCircle,
  Navigation,
  ShieldCheck,
  Share2,
  Bookmark,
  BookmarkCheck,
  MapPin,
} from "lucide-react";
import {
  formatCityLocation,
  formatLocationDisplay,
} from "../../utils/addressHelper";

const titleCase = (str = "") =>
  str
    .toString()
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const BusinessHero = ({
  business,
  images = [],
  activeImg = 0,
  setActiveImg,
  setShowGallery,

  handleCall,
  handleCallNumber,
  handleWhatsApp,

  handleDirections,
  setShowShareMenu,
  distance,
  handleSave,
  isSaved,

  mobileNumber,
  landlineNumber,
  alternateMobileNumber,
  hasMobile,
  hasWhatsApp,
  hasLandline,
  hasAlternateMobile,
  hasCall,
  showCallChooser,
  closeCallChooser,
}) => {

  // =========================================================
  // HERO IMAGE
  // =========================================================

  const heroImage =
    images?.[activeImg] ||
    business?.logo ||
    "/servdial-logo.png";

  // =========================================================
  // BUSINESS DATA
  // =========================================================

  const businessName =
    business?.name || "Business";

  const categoryName =
    business?.categoryId?.name ||
    business?.categoryName ||
    "Business";
    
    const areaName =
  business?.address?.area || "";

  const cityName =
    business?.cityName ||
    business?.cityId?.name ||
    "";

  const stateName =
    business?.state ||
    "";

  const countryName =
    business?.country ||
    "India";

    // =========================================================
  // BREADCRUMB DATA
  // =========================================================

  const breadcrumbStateName =
    business?.cityId?.state ||
    business?.state ||
    "";

  const breadcrumbStateSlug =
    business?.cityId?.stateSlug ||
    "";

    const breadcrumbCityName =
  business?.cityId?.name
    ? formatLocationDisplay(
        business.cityId.name,
        business.cityId.district
      )
    : business?.cityName || "";

  const breadcrumbCitySlug =
    business?.cityId?.slug ||
    business?.citySlug ||
    "";

  const parentCategoryName =
    business?.parentCategoryId?.name ||
    "";

  const parentCategorySlug =
    business?.parentCategoryId?.slug ||
    "";

  const subcategoryName =
    business?.categoryId?.name ||
    categoryName ||
    "";

  const subcategorySlug =
    business?.categoryId?.slug ||
    business?.categorySlug ||
    "";

  const businessSlug =
    business?.slug ||
    "";

  // =========================================================
  // VERIFICATION
  // =========================================================

  const isTrusted =
  business?.isVerified &&
  business?.plan === "trusted";

const isPremium =
  business?.isVerified &&
  business?.plan === "premium";

const verificationType =
  isPremium
    ? "premium"
    : isTrusted
    ? "trusted"
    : null;

  // =========================================================
  // VERIFICATION BADGE
  // =========================================================

  const VerificationBadge = () => {
  if (!verificationType) return null;

  const isPremium =
    verificationType === "premium";

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center

        w-6
        h-6
        sm:w-7
        sm:h-7

        rounded-full

        flex-shrink-0

        shadow-md

        ${
          isPremium
            ? "bg-yellow-400 text-yellow-900"
            : "bg-purple-600 text-white"
        }
      `}
      title={
        isPremium
          ? "Premium Partner"
          : "Trusted Business"
      }
    >
      <ShieldCheck
        size={18}
        strokeWidth={2.5}
      />
    </span>
  );
};

  // =========================================================
  // HERO LOCATION
  // =========================================================

  const heroLocation = formatCityLocation(
  areaName,
  cityName,
  stateName,
  countryName
);

  // =========================================================
  // SEO H1
  // =========================================================

  const heroH1 =
    business?.seo?.h1 ||
    `${businessName} - ${titleCase(
      categoryName
    )} in ${titleCase(cityName)}`;

  // Prevent unused warning while keeping SEO variable available
  void heroH1;


  // =========================================================
  // RATING
  // =========================================================

  const rating =
    business?.averageRating || "New";

  const totalReviews =
    business?.totalReviews || 0;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <section className="relative w-full">

      {/* =====================================================
          HERO IMAGE
      ===================================================== */}

      <div
        className="
          relative
          h-[430px]
          sm:h-[430px]
          md:h-[430px]
          overflow-hidden
        "
      >

            {/* =================================================
            BREADCRUMB
        ================================================= */}

        <nav
          aria-label="Breadcrumb"
          className="
            absolute
            top-4
            left-4
            right-4

            sm:left-6
            sm:right-6

            md:left-8
            md:right-8

            z-30

            overflow-x-auto
            scrollbar-hide
          "
        >
          <ol
            className="
              flex
              items-center
              gap-2

              whitespace-nowrap

              text-xs
              sm:text-sm

              text-white
            "
          >

            {/* HOME */}

            <li>
              <a
                href="/"
                className="
                  hover:text-blue-200
                  transition
                "
              >
                Home
              </a>
            </li>

            <li className="text-white/60">
              &gt;
            </li>

            {/* STATE */}

            {breadcrumbStateName && (
              <>
                <li>
                  {breadcrumbStateSlug ? (
                    <a
                      href={`/${breadcrumbStateSlug}`}
                      className="
                        hover:text-blue-200
                        transition
                      "
                    >
                      {breadcrumbStateName}
                    </a>
                  ) : (
                    <span>
                      {breadcrumbStateName}
                    </span>
                  )}
                </li>

                <li className="text-white/60">
                  &gt;
                </li>
              </>
            )}

            {/* CITY */}

            {breadcrumbCityName && (
              <>
                <li>
                  {breadcrumbCitySlug &&
                  breadcrumbStateSlug ? (
                    <a
                      href={`/${breadcrumbStateSlug}/${breadcrumbCitySlug}`}
                      className="
                        hover:text-blue-200
                        transition
                      "
                    >
                      {breadcrumbCityName}
                    </a>
                  ) : (
                    <span>
                      {breadcrumbCityName}
                    </span>
                  )}
                </li>

                <li className="text-white/60">
                  &gt;
                </li>
              </>
            )}

            {/* PARENT CATEGORY */}

            {parentCategoryName && (
              <>
                <li>
                  {breadcrumbStateSlug &&
                  breadcrumbCitySlug &&
                  parentCategorySlug ? (
                    <a
                      href={`/${breadcrumbStateSlug}/${breadcrumbCitySlug}/${parentCategorySlug}`}
                      className="
                        hover:text-blue-200
                        transition
                      "
                    >
                      {titleCase(parentCategoryName)}
                    </a>
                  ) : (
                    <span>
                      {titleCase(parentCategoryName)}
                    </span>
                  )}
                </li>

                <li className="text-white/60">
                  &gt;
                </li>
              </>
            )}

            {/* SUBCATEGORY */}

            {subcategoryName && (
              <>
                <li>
                  {breadcrumbStateSlug &&
                  breadcrumbCitySlug &&
                  subcategorySlug ? (
                    <a
                      href={`/${breadcrumbStateSlug}/${breadcrumbCitySlug}/${subcategorySlug}`}
                      className="
                        hover:text-blue-200
                        transition
                      "
                    >
                      {titleCase(subcategoryName)}
                    </a>
                  ) : (
                    <span>
                      {titleCase(subcategoryName)}
                    </span>
                  )}
                </li>

                <li className="text-white/60">
                  &gt;
                </li>
              </>
            )}

            {/* BUSINESS */}

            <li
              className="
                font-medium
                text-white
                truncate
                max-w-[180px]
                sm:max-w-[300px]
              "
            >
              {businessName}
            </li>

          </ol>
        </nav>

        {/* =================================================
            HERO IMAGE
        ================================================= */}

        <img
          src={heroImage}
          alt={`${businessName} ${categoryName} in ${cityName}`}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
            cursor-pointer
          "
          onClick={() =>
            setShowGallery?.(true)
          }
        />

        {/* =================================================
            DARK GRADIENT
        ================================================= */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/95
            via-black/45
            to-black/10
          "
        />

        {/* =================================================
            PHOTO THUMBNAILS
        ================================================= */}

        {images?.length > 1 && (
          <div
            className="
              absolute
              top-4
              right-4

              flex
              gap-2

              z-20

              overflow-x-auto
              max-w-[75%]
              scrollbar-hide
            "
          >
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Photo ${index + 1}`}
                onClick={() => {
                  setActiveImg(index);
                  setShowGallery?.(true);
                }}
                className={`
                  w-16
                  h-16
                  rounded-lg
                  object-cover
                  border-2
                  cursor-pointer
                  transition-all

                  ${
                    activeImg === index
                      ? "border-white scale-105 shadow-lg"
                      : "border-white/50 hover:border-white"
                  }
                `}
              />
            ))}
          </div>
        )}

        {/* =================================================
            BUSINESS INFO

            Logo + Name + Category + Location
            stays ABOVE
        ================================================= */}

        <div
          className="
            absolute
            left-0
            right-0
            top-[110px]
            z-10

            px-4
            sm:px-6
            md:px-8
          "
        >

          {/* LOGO + BUSINESS DETAILS */}

          <div className="flex items-center gap-3">

            {/* LOGO */}

            {business?.logo && (
              <img
                src={business.logo}
                alt={`${businessName} logo`}
                className="
                  w-16
                  h-16

                  sm:w-20
                  sm:h-20

                  md:w-24
                  md:h-24

                  rounded-2xl
                  object-cover

                  bg-white
                  border-2
                  border-white

                  shadow-xl

                  flex-shrink-0
                "
              />
            )}

            {/* NAME / CATEGORY / LOCATION */}

            <div className="min-w-0">

              {/* BUSINESS NAME + VERIFIED TICK */}

<div
  className="
    flex
    items-center
    gap-2
    min-w-0
    max-w-full
  "
>

  <h1
    className="
      text-xl
      sm:text-3xl
      md:text-5xl

      font-bold
      text-white
      leading-tight

      whitespace-normal
      break-words

      min-w-0
    "
  >
    {businessName}
  </h1>

  <VerificationBadge />

</div>
              {/* CATEGORY + LOCATION */}

<div
  className="
    flex
    items-center
    gap-2

    text-sm
    sm:text-base

    text-white
    mt-1

    whitespace-nowrap
    overflow-hidden
  "
>

  {/* CATEGORY */}

  <span className="truncate">
    {titleCase(categoryName)}
  </span>

  {/* SEPARATOR */}

  <span className="text-white/70">
    •
  </span>

  {/* LOCATION */}

  <div
    className="
      flex
      items-center
      gap-1
      min-w-0
    "
  >
    <MapPin
      size={15}
      className="flex-shrink-0"
    />

    <span className="truncate">
      {heroLocation}
    </span>

  </div>

</div>
</div>
</div>
</div>
        {/* =================================================
            BOTTOM CONTENT

            ONLY:
            Rating
            Buttons
            Distance
        ================================================= */}

        <div
          className="
            absolute
            left-0
            right-0
            bottom-0

            z-10

            px-4
            pb-4

            sm:px-6
            sm:pb-5

            md:px-8
            md:pb-7
          "
        >

          {/* =================================================
              RATING
          ================================================= */}

          <div
            className="
              flex
              items-center
              gap-2

              text-sm
              sm:text-base

              mb-3
            "
          >
            <span
              className="
                text-yellow-300
                text-lg
              "
            >
              ⭐
            </span>

            <span
              className="
                font-semibold
                text-white
              "
            >
              {rating}
            </span>

            <span className="text-white/90">
              ({totalReviews} Reviews)
            </span>
          </div>

          {/* =================================================
              ACTION BUTTONS

              MOBILE:
              [ Call ] [ WhatsApp ]

              [ Direction ] [ Save ] [ Share ]

              DESKTOP:
              [ Call ] [ WhatsApp ] [ Direction ] [ Save ] [ Share ]
          ================================================= */}

          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-5

              gap-2
              sm:gap-3
            "
          >

            {/* =================================================
                MOBILE GROUP 1

                On mobile:
                Call + WhatsApp = one row

                On desktop:
                md:contents makes both buttons participate
                directly in the 5-column parent grid.
            ================================================= */}

            <div
              className="
                grid
                grid-cols-2
                gap-2
                sm:gap-3

                md:contents
              "
            >

              {/* CALL */}

       {hasCall && (
  <button
    type="button"
    onClick={handleCall}
    aria-label="Call business"
    className="
      bg-blue-600
      hover:bg-blue-700
      active:scale-[0.98]

      text-white

      px-3
      py-2.5

      sm:py-3

      rounded-xl

      flex
      justify-center
      items-center

      gap-2

      text-sm
      sm:text-base
      md:text-sm

      font-medium

      transition
    "
  >
    <Phone size={18} />

    <span>
      Call
    </span>
  </button>
)}

              {/* WHATSAPP */}

        {hasWhatsApp && (
  <button
    type="button"
    onClick={handleWhatsApp}
    aria-label="WhatsApp business"
    className="
      bg-green-600
      hover:bg-green-700
      active:scale-[0.98]

      text-white

      px-3
      py-2.5

      sm:py-3

      rounded-xl

      flex
      justify-center
      items-center

      gap-2

      text-sm
      sm:text-base
      md:text-sm

      font-medium

      transition
    "
  >
    <MessageCircle size={18} />

    <span>
      WhatsApp
    </span>
  </button>
)}
  </div>

            {/* =================================================
                MOBILE GROUP 2

                On mobile:
                Direction + Save + Share = one row

                On desktop:
                md:contents makes all 3 participate directly
                in the 5-column parent grid.
            ================================================= */}

            <div
              className="
                grid
                grid-cols-3

                gap-2
                sm:gap-3

                md:contents
              "
            >

              {/* DIRECTION */}

              <button
                type="button"
                onClick={handleDirections}
                aria-label="Get directions"
                className="
                  bg-black/65
                  hover:bg-black/75

                  backdrop-blur-md

                  text-white

                  px-2
                  py-2.5

                  sm:py-3

                  rounded-xl

                  flex
                  justify-center
                  items-center

                  gap-1.5

                  text-xs
                  sm:text-sm
                  md:text-sm

                  font-medium

                  transition
                "
              >
                <Navigation size={17} />

                <span>
                  Direction
                </span>
              </button>

              {/* SAVE */}

              <button
                type="button"
                onClick={handleSave}
                aria-label="Save business"
                className="
                  bg-black/65
                  hover:bg-black/75

                  backdrop-blur-md

                  text-white

                  px-2
                  py-2.5

                  sm:py-3

                  rounded-xl

                  flex
                  justify-center
                  items-center

                  gap-1.5

                  text-xs
                  sm:text-sm
                  md:text-sm

                  font-medium

                  transition
                "
              >

                {isSaved ? (
                  <BookmarkCheck
                    size={17}
                    className="text-yellow-400"
                  />
                ) : (
                  <Bookmark size={17} />
                )}

                <span>
                  Save
                </span>

              </button>

              {/* SHARE */}

              <button
                type="button"
                onClick={() =>
                  setShowShareMenu?.(true)
                }
                aria-label="Share business"
                className="
                  bg-black/65
                  hover:bg-black/75

                  backdrop-blur-md

                  text-white

                  px-2
                  py-2.5

                  sm:py-3

                  rounded-xl

                  flex
                  justify-center
                  items-center

                  gap-1.5

                  text-xs
                  sm:text-sm
                  md:text-sm

                  font-medium

                  transition
                "
              >
                <Share2 size={17} />

                <span>
                  Share
                </span>
              </button>

            </div>

          </div>

          {/* =================================================
    DISTANCE
================================================= */}

{typeof distance === "number" && (
  <div
    className="
      flex
      justify-end
      mt-2
    "
  >
    <span
      className={`
        ${
          distance <= 0.3
            ? "bg-green-600 text-white"
            : "bg-black/80 text-white"
        }

        text-xs
        px-3
        py-1.5
        rounded-full
        font-semibold
        shadow-md
        backdrop-blur-sm
      `}
    >
      📍{" "}
      {distance <= 0.3
        ? "Nearby"
        : `${distance.toFixed(1)} km away`}
    </span>
  </div>
)}

        </div>

      </div>

      {/* =========================================================
    CALL NUMBER CHOOSER
========================================================= */}

{showCallChooser && (
  <div
    className="
      fixed
      inset-0
      z-[100]
      flex
      items-end
      sm:items-center
      justify-center
      bg-black/60
      backdrop-blur-sm
      px-4
    "
    onClick={closeCallChooser}
  >

    <div
      className="
        w-full
        max-w-md
        bg-white
        rounded-2xl
        shadow-2xl
        p-5
        sm:p-6
        mb-0
        sm:mb-0
      "
      onClick={(e) => e.stopPropagation()}
    >

      {/* HEADER */}

      <div className="flex items-center gap-3 mb-5">

        <div
          className="
            w-11
            h-11
            rounded-full
            bg-blue-100
            text-blue-600
            flex
            items-center
            justify-center
            flex-shrink-0
          "
        >
          <Phone size={21} />
        </div>

        <div>

          <h3
            className="
              text-lg
              font-bold
              text-gray-900
            "
          >
            Choose number
          </h3>

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Select how you want to call
          </p>

        </div>

      </div>


      {/* MOBILE */}

      {hasMobile && (
        <button
          type="button"
          onClick={() =>
            handleCallNumber(mobileNumber)
          }
          className="
            w-full
            flex
            items-center
            justify-between
            gap-4

            px-4
            py-4

            mb-3

            rounded-xl

            border
            border-gray-200

            hover:border-blue-500
            hover:bg-blue-50

            transition
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              min-w-0
            "
          >

            <div
              className="
                w-10
                h-10
                rounded-full
                bg-blue-100
                text-blue-600
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              <Phone size={18} />
            </div>

            <div className="text-left min-w-0">

              <div
                className="
                  text-sm
                  font-semibold
                  text-gray-900
                "
              >
                Mobile
              </div>

              <div
                className="
                  text-sm
                  text-gray-500
                  truncate
                "
              >
                {mobileNumber}
              </div>

            </div>

          </div>

          <span
            className="
              text-blue-600
              text-sm
              font-semibold
              flex-shrink-0
            "
          >
            Call
          </span>

        </button>
      )}


      {/* LANDLINE */}

      {hasLandline && (
        <button
          type="button"
          onClick={() =>
            handleCallNumber(landlineNumber)
          }
          className="
            w-full
            flex
            items-center
            justify-between
            gap-4

            px-4
            py-4

            rounded-xl

            border
            border-gray-200

            hover:border-blue-500
            hover:bg-blue-50

            transition
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              min-w-0
            "
          >

            <div
              className="
                w-10
                h-10
                rounded-full
                bg-gray-100
                text-gray-700
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              <Phone size={18} />
            </div>

            <div className="text-left min-w-0">

              <div
                className="
                  text-sm
                  font-semibold
                  text-gray-900
                "
              >
                Landline
              </div>

              <div
                className="
                  text-sm
                  text-gray-500
                  truncate
                "
              >
                {landlineNumber}
              </div>

            </div>

          </div>

          <span
            className="
              text-blue-600
              text-sm
              font-semibold
              flex-shrink-0
            "
          >
            Call
          </span>

        </button>
      )}

            {/* ALTERNATE Mobile */}
      {hasAlternateMobile && (
        <button
          type="button"
          onClick={() =>
            handleCallNumber(alternateMobileNumber)
          }
          className="
            w-full
            flex
            items-center
            justify-between
            gap-4

            px-4
            py-4

            rounded-xl
            border
            border-gray-200

            hover:border-blue-500
            hover:bg-blue-50

            transition
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              min-w-0
            "
          >
            <div
              className="
                w-10
                h-10
                rounded-full
                bg-gray-100
                text-gray-700
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              <Phone size={18} />
            </div>

            <div className="text-left min-w-0">
              <div
                className="
                  text-sm
                  font-semibold
                  text-gray-900
                "
              >
                Alternate Mobile
              </div>

              <div
                className="
                  text-sm
                  text-gray-500
                  truncate
                "
              >
                {alternateMobileNumber}
              </div>
            </div>
          </div>

          <span
            className="
              text-blue-600
              text-sm
              font-semibold
              flex-shrink-0
            "
          >
            Call
          </span>
        </button>
      )}

      {/* CANCEL */}

      <button
        type="button"
        onClick={closeCallChooser}
        className="
          w-full
          mt-4
          py-3
          rounded-xl
          bg-gray-100
          hover:bg-gray-200
          text-gray-700
          font-medium
          transition
        "
      >
        Cancel
      </button>

    </div>

  </div>
)}

    </section>
  );
};

export default BusinessHero;