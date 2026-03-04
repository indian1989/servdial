import { useState, useEffect } from "react";

const BannerAd = ({ position = "top" }) => {

  const banners = [
    {
      id: 1,
      title: "Premium Business Promotion",
      image: "https://via.placeholder.com/1200x250/1e40af/ffffff?text=Admin+Banner+1",
      link: "#",
      position: "top",
      createdByRole: "admin",
      status: "active"
    },
    {
      id: 2,
      title: "Grow Your Business with ServDial",
      image: "https://via.placeholder.com/1200x250/4338ca/ffffff?text=SuperAdmin+Banner+2",
      link: "#",
      position: "top",
      createdByRole: "superadmin",
      status: "active"
    },
    {
      id: 3,
      title: "Advertise with ServDial Today",
      image: "https://via.placeholder.com/1200x250/7c3aed/ffffff?text=Admin+Banner+3",
      link: "#",
      position: "top",
      createdByRole: "admin",
      status: "active"
    }
  ];

  // Filter only active admin/superadmin banners
  const filteredBanners = banners.filter(
    banner =>
      banner.position === position &&
      banner.status === "active" &&
      (banner.createdByRole === "admin" ||
        banner.createdByRole === "superadmin")
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === filteredBanners.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [filteredBanners.length]);

  if (filteredBanners.length === 0) return null;

  const goPrev = () => {
    setCurrentIndex(
      currentIndex === 0
        ? filteredBanners.length - 1
        : currentIndex - 1
    );
  };

  const goNext = () => {
    setCurrentIndex(
      currentIndex === filteredBanners.length - 1
        ? 0
        : currentIndex + 1
    );
  };

  return (
    <div className="w-full bg-gray-100 py-6 flex justify-center">
      <div className="relative max-w-6xl w-full px-4">

        {/* Banner Image */}
        <a
          href={filteredBanners[currentIndex].link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={filteredBanners[currentIndex].image}
            alt={filteredBanners[currentIndex].title}
            className="w-full rounded-xl shadow-lg transition duration-500"
          />
        </a>

        {/* Left Arrow */}
        <button
          onClick={goPrev}
          className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-white bg-opacity-80 px-3 py-2 rounded-full shadow hover:bg-opacity-100"
        >
          ◀
        </button>

        {/* Right Arrow */}
        <button
          onClick={goNext}
          className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-white bg-opacity-80 px-3 py-2 rounded-full shadow hover:bg-opacity-100"
        >
          ▶
        </button>

      </div>
    </div>
  );
};

export default BannerAd;