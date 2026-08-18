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
  handleWhatsApp,
  handleDirections,
  setShowShareMenu,
  distance,
  handleSave,
  isSaved,
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

  const heroLocation = [
    titleCase(cityName),
    titleCase(stateName),
    titleCase(countryName),
  ]
    .filter(Boolean)
    .join(" • ");

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

              {/* WHATSAPP */}

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
                className="
                bg-green-600
                text-white
                text-xs
                px-3
                py-1.5
                rounded-full
                font-semibold
                shadow-md
              "
              >
                📍{" "}
                {distance < 0.3
                  ? "Nearby"
                  : `${distance.toFixed(1)} km away`}
              </span>
            </div>
          )}

        </div>

      </div>

    </section>
  );
};

export default BusinessHero;