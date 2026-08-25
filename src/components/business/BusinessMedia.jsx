import {
  Image as ImageIcon,
  Play,
  ChevronRight,
} from "lucide-react";

const BusinessMedia = ({
  business,
  images = [],
  setActiveImg,
  setShowGallery,
}) => {
  /*
  |----------------------------------------------------------------------
  | MEDIA
  |----------------------------------------------------------------------
  */

  const photos = Array.isArray(images)
    ? images.filter(Boolean)
    : [];

  const videos = Array.isArray(business?.videos)
    ? business.videos.filter(Boolean)
    : [];

  /*
  |----------------------------------------------------------------------
  | NO MEDIA
  |----------------------------------------------------------------------
  */

  if (!photos.length && !videos.length) {
    return null;
  }

  /*
  |----------------------------------------------------------------------
  | OPEN PHOTO
  |----------------------------------------------------------------------
  */

  const openPhoto = (index) => {
    setActiveImg?.(index);
    setShowGallery?.(true);
  };

  /*
  |----------------------------------------------------------------------
  | RENDER
  |----------------------------------------------------------------------
  */

  return (
    <section
      id="photos"
      className="
        bg-white
        rounded-2xl
        border
        border-gray-200
        shadow-sm
        overflow-hidden
      "
    >

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div
        className="
          px-5
          py-4
          sm:px-6
          sm:py-5
          border-b
          border-gray-200
        "
      >

        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-3">

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <ImageIcon size={20} />
            </div>

            <div>

              <h2
                className="
                  text-lg
                  sm:text-xl
                  font-bold
                  text-gray-900
                "
              >
                Business Media
              </h2>

              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Photos and videos
              </p>

            </div>

          </div>


          {/* MEDIA COUNT */}

          {(photos.length > 0 || videos.length > 0) && (
            <span
              className="
                hidden
                sm:inline-flex
                items-center
                gap-1.5
                px-3
                py-1.5
                rounded-full
                bg-gray-50
                border
                border-gray-200
                text-xs
                font-semibold
                text-gray-600
              "
            >
              {photos.length > 0 && (
                <>
                  {photos.length}{" "}
                  {photos.length === 1 ? "Photo" : "Photos"}
                </>
              )}

              {photos.length > 0 && videos.length > 0 && (
                <span>•</span>
              )}

              {videos.length > 0 && (
                <>
                  {videos.length}{" "}
                  {videos.length === 1 ? "Video" : "Videos"}
                </>
              )}
            </span>
          )}

        </div>

      </div>


      {/* ============================================================
          PHOTOS
      ============================================================ */}

      {photos.length > 0 && (

        <div className="p-4 sm:p-5">

          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              gap-2
              sm:gap-3
            "
          >

            {photos.map((image, index) => (

              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => openPhoto(index)}
                className="
                  group
                  relative
                  aspect-[4/3]
                  overflow-hidden
                  rounded-xl
                  bg-gray-100
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              >

                <img
                  src={image}
                  alt={`${business?.name || "Business"} photo ${
                    index + 1
                  }`}
                  loading={index < 4 ? "lazy" : "lazy"}
                  decoding="async"
                  className="
                    w-full
                    h-full
                    object-cover
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                />

                {/* HOVER OVERLAY */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-black/0
                    group-hover:bg-black/25
                    transition
                  "
                />

              </button>

            ))}

          </div>


          {/* VIEW ALL */}

          {photos.length > 4 && (

            <button
              type="button"
              onClick={() => setShowGallery?.(true)}
              className="
                mt-4
                w-full
                sm:w-auto
                inline-flex
                items-center
                justify-center
                gap-2
                px-4
                py-2.5
                rounded-xl
                bg-blue-50
                text-blue-700
                hover:bg-blue-100
                text-sm
                font-semibold
                transition
              "
            >
              View all photos

              <ChevronRight size={16} />

            </button>

          )}

        </div>

      )}


      {/* ============================================================
          VIDEOS
      ============================================================ */}

      {videos.length > 0 && (

        <div
          className="
            px-4
            pb-5
            sm:px-5
          "
        >

          <div
            className="
              pt-4
              border-t
              border-gray-100
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                mb-3
              "
            >

              <Play
                size={17}
                className="text-red-500"
              />

              <h3 className="font-semibold text-gray-900">
                Videos
              </h3>

            </div>


            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-3
              "
            >

              {videos.map((video, index) => (

                <video
                  key={`${video}-${index}`}
                  src={video}
                  controls
                  preload="metadata"
                  className="
                    w-full
                    aspect-video
                    rounded-xl
                    bg-black
                  "
                />

              ))}

            </div>

          </div>

        </div>

      )}

    </section>
  );
};

export default BusinessMedia;