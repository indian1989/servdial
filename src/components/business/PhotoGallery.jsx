import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const PhotoGallery = ({
  open,
  images = [],
  activeImg = 0,
  setActiveImg,
  onClose,
}) => {
  // ==========================
  // Keyboard Controls
  // ==========================
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }

      if (images.length <= 1) return;

      if (e.key === "ArrowRight") {
        setActiveImg((prev) => (prev + 1) % images.length);
      }

      if (e.key === "ArrowLeft") {
        setActiveImg((prev) =>
          prev === 0 ? images.length - 1 : prev - 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, images.length, setActiveImg, onClose]);

  // ==========================
  // Prevent Background Scroll
  // ==========================
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open || images.length === 0) return null;

  const next = () =>
    setActiveImg((prev) => (prev + 1) % images.length);

  const prev = () =>
    setActiveImg((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center"
    >
      {/* Close */}

      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white hover:text-red-400 transition"
      >
        <X size={34} />
      </button>

      {/* Counter */}

      <div className="absolute top-5 left-5 text-white text-sm bg-black/40 px-3 py-1 rounded-full">
        {activeImg + 1} / {images.length}
      </div>

      {/* Previous */}

      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          className="absolute left-3 md:left-6 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full"
        >
          <ChevronLeft size={34} />
        </button>
      )}

      {/* Main Image */}

      <img
        src={images[activeImg]}
        alt={`Business ${activeImg + 1}`}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
      />

      {/* Next */}

      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="absolute right-3 md:right-6 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full"
        >
          <ChevronRight size={34} />
        </button>
      )}

      {/* Thumbnails */}

      {images.length > 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[95vw] px-2"
        >
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => setActiveImg(index)}
              className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg cursor-pointer border-2 transition ${
                activeImg === index
                  ? "border-blue-500 scale-105"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;