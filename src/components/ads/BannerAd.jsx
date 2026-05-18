import { useState, useEffect } from "react";
import API from "../api/axios";

const BannerAd = ({
  placement = "homepage_top",
  cityId,
  categoryId
}) => {

  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ================= FETCH FROM BACKEND =================
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await API.get("/banners", {
          params: {
            placement,
            cityId,
            categoryId,
          }
        });

        setBanners(res?.data?.data || []);
        setCurrentIndex(0);

      } catch (err) {
        console.error("Banner fetch error:", err);
        setBanners([]);
      }
    };

    fetchBanners();
  }, [placement, cityId, categoryId]);

  // ================= AUTO SLIDE =================
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const current = banners[currentIndex];

  return (
    <div className="w-full bg-gray-100 py-6 flex justify-center">
      <div className="relative max-w-6xl w-full px-4">

        <a href={current.link || "#"} target="_blank" rel="noreferrer">
          <img
            src={current.image}
            alt={current.title}
            className="w-full rounded-xl shadow-lg"
          />
        </a>

        {/* Prev */}
        <button
          onClick={() =>
            setCurrentIndex(
              currentIndex === 0 ? banners.length - 1 : currentIndex - 1
            )
          }
          className="absolute top-1/2 left-6 -translate-y-1/2 bg-white px-3 py-2 rounded-full shadow"
        >
          ◀
        </button>

        {/* Next */}
        <button
          onClick={() =>
            setCurrentIndex(
              currentIndex === banners.length - 1 ? 0 : currentIndex + 1
            )
          }
          className="absolute top-1/2 right-6 -translate-y-1/2 bg-white px-3 py-2 rounded-full shadow"
        >
          ▶
        </button>

      </div>
    </div>
  );
};

export default BannerAd;