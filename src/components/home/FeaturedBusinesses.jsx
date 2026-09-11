import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BusinessCard from "../business/BusinessCard";

const FeaturedBusinesses = ({
  businesses = [],
  loading = false,
  city = null,
}) => {
  const navigate = useNavigate();

   // ================= RESPONSIVE VISIBLE COUNT =================
const [visibleCount, setVisibleCount] = useState(8);

// Current rotation position
const [rotationStep, setRotationStep] = useState(0);

useEffect(() => {
  const updateVisibleCount = () => {
    if (window.innerWidth < 640) {
      // Mobile → 3 cards
      setVisibleCount(3);
    } else if (window.innerWidth < 1024) {
      // Tablet → 4 cards
      setVisibleCount(4);
    } else {
      // Desktop → 8 cards
      setVisibleCount(8);
    }
  };

  updateVisibleCount();

  window.addEventListener("resize", updateVisibleCount);

  return () => {
    window.removeEventListener("resize", updateVisibleCount);
  };
}, []);

// ================= RESET ON NEW DATA / DEVICE =================
useEffect(() => {
  setRotationStep(0);
}, [businesses, visibleCount]);

// ================= ONE CARD POSITION ROTATION =================
useEffect(() => {
  if (businesses.length <= visibleCount) {
    return;
  }

  const interval = setInterval(() => {
    setRotationStep((prev) => {
      const maxStart =
        businesses.length - visibleCount;

      return prev >= maxStart ? 0 : prev + 1;
    });
  }, 6000);

  return () => clearInterval(interval);
}, [businesses.length, visibleCount]);

// ================= CURRENT VISIBLE BUSINESSES =================
const currentBusinesses = Array.from(
  { length: Math.min(visibleCount, businesses.length) },
  (_, index) =>
    businesses[
      (rotationStep + index) % businesses.length
    ]
);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-60 sm:h-64 md:h-72 bg-gray-200 animate-pulse rounded-xl shadow"
          />
        ))}
      </div>
    );
  }

  // ================= EMPTY =================
  if (!businesses.length) {
    return (
      <div className="text-center text-gray-500 py-10">
        No featured businesses available in{" "}
        <span className="font-semibold">
          {city?.name || "this area"}
        </span>
      </div>
    );
  }

  // ================= DATA =================
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
  {currentBusinesses.map((b) => (
        <BusinessCard
          key={b._id}
          business={b}
          onClick={() => navigate(`/business/${b.slug}`)} 
          // ✅ keep ONE route standard
          showCallButton
        />
      ))}
    </div>
  );
};

export default FeaturedBusinesses;