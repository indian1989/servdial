import { useState, useEffect, useRef } from "react";
import API from "../../api/axios";

const BannerAd = ({
  placement = "homepage_top",
  cityId,
  categoryId,
  businessId,
  initialBanners = [],
}) => {
  const [banners, setBanners] = useState(initialBanners);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Prevent the same banner request from being fired repeatedly
  const lastRequestKey = useRef(null);

  useEffect(() => {
    // Homepage banners should wait for cityId.
    // This prevents the initial city-less request followed by
    // another city-specific request.
    const isHomepagePlacement = [
      "homepage_top",
      "homepage_middle",
      "homepage_bottom",
    ].includes(placement);

    // SSR already supplied homepage top banners.
// Do not immediately fetch the same data again on the client.
if (
  placement === "homepage_top" &&
  initialBanners.length > 0
) {
  return;
}

    if (isHomepagePlacement && !cityId) {
      return;
    }

    const requestKey = [
      placement,
      cityId || "",
      categoryId || "",
      businessId || "",
    ].join("|");

    // Prevent duplicate request for the same exact parameters
    if (lastRequestKey.current === requestKey) {
      return;
    }

    lastRequestKey.current = requestKey;

    let cancelled = false;

    const fetchBanners = async () => {
      try {
        const params = { placement };

        if (cityId) {
          params.cityId = cityId;
        }

        if (categoryId) {
          params.categoryId = categoryId;
        }

        if (
          businessId &&
          [
            "business_detail_middle",
            "business_detail_bottom",
          ].includes(placement)
        ) {
          params.businessId = businessId;
        }

        const res = await API.get("/banners", { params });

        if (cancelled) return;

        setBanners(res?.data?.data || []);
        setCurrentIndex(0);
      } catch (err) {
        if (cancelled) return;

        console.error("Banner fetch error:", err);
        setBanners([]);
      }
    };

    fetchBanners();

    return () => {
      cancelled = true;
    };
  }, [
  placement,
  cityId,
  categoryId,
  businessId,
  initialBanners.length,
]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const handleBannerClick = async (banner) => {
    if (!banner?._id) return;

    try {
      await API.post(`/banners/${banner._id}/click`);
    } catch (error) {
      console.error("Banner click tracking failed:", error);
    }
  };

  if (banners.length === 0) {
    return null;
  }

  const current = banners[currentIndex];

  return (
    <div className="w-full bg-gray-100 py-6 flex justify-center">
      <div className="relative max-w-6xl w-full px-4">
       <a
          href={current.link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleBannerClick(current)}
          className="block w-full aspect-video overflow-hidden rounded-xl"
        >
          <img
            src={current.image}
            alt={current.title || "ServDial Banner"}
            className="w-full h-full object-cover rounded-xl shadow-lg"
            loading={placement === "homepage_top" ? "eager" : "lazy"}
            fetchPriority={placement === "homepage_top" ? "high" : "auto"}
          />
        </a>

        {banners.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === 0 ? banners.length - 1 : prev - 1
                )
              }
              className="absolute left-6 top-1/2 -translate-y-1/2
                         bg-black/50 text-white rounded-full
                         w-9 h-9 flex items-center justify-center"
              aria-label="Previous banner"
            >
              ◀
            </button>

            <button
              type="button"
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === banners.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-6 top-1/2 -translate-y-1/2
                         bg-black/50 text-white rounded-full
                         w-9 h-9 flex items-center justify-center"
              aria-label="Next banner"
            >
              ▶
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BannerAd;