import {
    useState,
    useMemo,
    useEffect,
    useCallback,
    useRef
} from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

import TrackBusinessView from "../components/analytics/TrackBusinessView";
import BusinessTabs from "../components/business/BusinessTabs";
import BusinessHero from "../components/business/BusinessHero";
import SmartActionBar from "../components/business/SmartActionBar";
import QuickInfoBar from "../components/business/QuickInfoBar";
import BusinessHours from "../components/business/BusinessHours";
import BusinessFAQ from "../components/business/BusinessFAQ";
import BookingModal from "../components/business/BookingModal";
import LeadModal from "../components/business/LeadModal";
import PhotoGallery from "../components/business/PhotoGallery";
import LocationMap from "../components/business/LocationMap";
import OffersSection from "../components/business/OffersSection";
import BusinessInsight from "../components/business/BusinessInsight";
import ClaimBusinessBanner from "../components/business/ClaimBusinessBanner";
import BusinessDynamicSections from "../components/business/BusinessDynamicSections";
import BusinessDescription from "../components/business/BusinessDescription";
import BusinessAISummary from "../components/business/BusinessAISummary";
import BusinessReviewsSection from "../components/business/BusinessReviewsSection";
import BusinessSEO from "../components/business/BusinessSEO";
import SimilarBusinessesSection from "../components/business/SimilarBusinessesSection";
import ShareMenu from "../components/business/ShareMenu";
import MenuItemsSection from "../components/business/MenuItemsSection";

const BusinessDetails = ({ business, reviews = [], similar = [], refresh }) => {

  const navigate = useNavigate();
  let user = null;

try {
  user = JSON.parse(localStorage.getItem("servdial_user"));
} catch {
  localStorage.removeItem("servdial_user");
}

  // ================= STATE =================
  const [activeImg, setActiveImg] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [showLeadPopup, setShowLeadPopup] = useState(false);
const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [showToast, setShowToast] = useState("");
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [loadingLead, setLoadingLead] = useState(false);
  const [categoryCount, setCategoryCount] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [bookingType, setBookingType] = useState("");

  const [leadData, setLeadData] = useState({
    name: "",
    phone: "",
    message: ""
  });

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingReview, setPendingReview] = useState(null);

  const analyticsRef = useRef({});
  

  // ================= SAFE DATA =================
  const images = useMemo(() => {
    return business?.images?.length ? business.images : ["/no-image.png"];
  }, [business]);


  const lat = business?.location?.coordinates?.[1];
  const lng = business?.location?.coordinates?.[0];

  const whatsappNumber =
    (business?.whatsapp || business?.phone || "").replace(/\D/g, "");

    const [currentUrl, setCurrentUrl] = useState("");

useEffect(() => {
  if (typeof window !== "undefined") {
    setCurrentUrl(window.location.href);
  }
}, []);

  // ================ Sticky Lead ========
const [showStickyLead, setShowStickyLead] = useState(false);

  // ================= ANALYTICS =================
  const trackEvent = useCallback((type) => {
  if (!business?._id) return;

  const key = `${business._id}-${type}`;

  // prevent spam within 10 sec
  if (
    analyticsRef.current[key] &&
    Date.now() - analyticsRef.current[key] < 10000
  ) {
    return;
  }

  analyticsRef.current[key] = Date.now();

  API.post(`/businesses/analytics/${business._id}`, {
    type,
  }).catch(() => {});
}, [business]);

  // ================= CATEGORY COUNT =================
useEffect(() => {
  if (!business?.categoryId?._id || !business?.cityId?._id) return;

  API.get("/businesses/count/all", {
    params: {
      categoryId: business.categoryId._id,
      cityId: business.cityId._id,
    },
  })
    .then((res) => {
      setCategoryCount(res.data?.data?.count || 0);
    })
    .catch((err) => {
      console.error("❌ Count API error:", err);
    });

}, [
  business?.categoryId?._id,
  business?.cityId?._id,
]);

// ============ Sticky Lead Use Effect ============
useEffect(() => {
  const handleScroll = () => {
    setShowStickyLead(window.scrollY > 500);
  };

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  // ================= TOAST =================
  useEffect(() => {
  if (!showToast) return;

  const timer = setTimeout(() => {
    setShowToast("");
  }, 2000);

  return () => clearTimeout(timer);
}, [showToast]);

const showToastMsg = useCallback((msg) => {
  setShowToast(msg);
}, []);

  // ================= ACTIONS =================
  const handleCall = () => {
  trackEvent("call");

  if (!phoneRevealed) {
    setPhoneRevealed(true);
    showToastMsg("Number revealed 👇");
    return;
  }

  if (business.phone) {
    showToastMsg("Connecting...");
    setTimeout(() => {
      window.location.href = `tel:${business.phone}`;
    }, 500);
  }
};

  const handleWhatsApp = () => {
    trackEvent("whatsapp");
    if (whatsappNumber) {
      window.open(`https://wa.me/91${whatsappNumber}`, "_blank");
    }
  };

  const openGoogleMaps = (lat, lng) => {
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    "_blank"
  );
};

const openLeafletDirections = (lat, lng) => {
  const url = `https://www.openstreetmap.org/directions?to=${lat},${lng}`;
  window.open(url, "_blank");
};

const handleDirections = () => {
  trackEvent("direction");

  if (!lat || !lng) {
    return showToastMsg("Location not available");
  }

  try {
    openGoogleMaps(lat, lng);
  } catch (err) {
    console.log("⚠️ Google Maps failed → switching to OSM");
    openLeafletDirections(lat, lng);
  }
};


  const handleReviewSubmit = (data) => {
    if (!user) {
      setPendingReview(data);
      setShowLoginPrompt(true);
      return;
    }
    API.post("/reviews", {
  businessId: business._id,
  ...data,
}).then(() => refresh?.());
  };

  const handleLoginRedirect = () => {
  setShowLoginPrompt(false);

  navigate("/login", {
    state: {
      from: window.location.pathname,
      pendingReview,
    },
  });
};

const uiType =
  business?.categoryId?.uiType ||
  business?.category?.uiType ||
  "service";

  console.log("uiType =", uiType);
console.log("category =", business?.categoryId);
console.log(
  "CATEGORY NAME:",
  business?.categoryId?.name
);

console.log(
  "CATEGORY UI TYPE:",
  business?.categoryId?.uiType
);

console.log(
  "CATEGORY FEATURES:",
  business?.categoryId?.features
);

console.log("business.pricing =", business.pricing);
console.log("business.services =", business.services);
console.log("business.menu =", business.menu);

  const openPrimaryModal=(type="lead")=>{

setBookingType(type);

switch(type){

case "table_booking":
  setBookingType("table_booking");
  setShowBookingPopup(true);
  break;

case "party_booking":
  setBookingType("party_booking");
  setShowBookingPopup(true);
  break;

case "room_booking":
  setBookingType("room_booking");
  setShowBookingPopup(true);
  break;

case "appointment_booking":
  setBookingType("appointment_booking");
  setShowBookingPopup(true);
  break;

default:

setShowLeadPopup(true);

}

};

  const handleLeadSubmit = async () => {
    try {
      setLoadingLead(true);
      await API.post("/leads", {
        businessId: business._id,
        ...leadData
      });
      showToastMsg("Request sent!");
      setShowLeadPopup(false);
    } catch {
      showToastMsg("Failed!");
    } finally {
      setLoadingLead(false);
    }
  };

  const handleBookingSubmit = async (bookingData) => {
  try {
    await API.post("/leads", bookingData);

    showToastMsg("Booking Request Sent!");
  } catch {
    showToastMsg("Booking Failed");
  }
};

  
  if (!business?._id) {
  return <div className="p-6 text-center">Loading...</div>;
}

  return (
  <>
    <BusinessSEO
    business={business}
    currentUrl={currentUrl}
/>

    <div className="bg-gray-50 min-h-screen pb-32">

      <TrackBusinessView businessId={business._id} />

{/* BUSINESS HERO */}
  <BusinessHero
  business={business}
  images={images}
  activeImg={activeImg}
  setActiveImg={setActiveImg}
  setShowGallery={setShowGallery}
  handleCall={handleCall}
  handleWhatsApp={handleWhatsApp}
  handleDirections={handleDirections}
  setShowShareMenu={setShowShareMenu}
/>

{/* PHOTO GALLERY */}
<PhotoGallery
  open={showGallery}
  images={images}
  activeImg={activeImg}
  setActiveImg={setActiveImg}
  onClose={() => setShowGallery(false)}
/>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      <QuickInfoBar
 business={business}
/>

<BusinessTabs
 business={business}
/>

{/* CLAIM BANNER */}
<ClaimBusinessBanner
   business={business}
   user={user}
/>

        {/*DESCRIPTION*/}
      <BusinessDescription
    business={business}
/>

{/* AI SUMMARY */}
        <BusinessAISummary
    business={business}
    reviews={reviews}
/>

        <BusinessInsight
  business={business}
/>

  <BusinessDynamicSections
    business={business}
    onBooking={openPrimaryModal}
/>

{
  business?.categoryId?.features?.includes("food_menu") && (
    <MenuItemsSection
      business={business}
    />
  )
}

<OffersSection
  business={business}
/>

<BusinessHours
    hours={business.openingHours}
/>

      {/* LOCATION MAP */}
        <LocationMap
  business={business}
/>

<BusinessFAQ
    faq={business.faq}
/>

{/* REVIEWS */}
        <BusinessReviewsSection
    business={business}
    reviews={reviews}
    refresh={refresh}
    onSubmitReview={handleReviewSubmit}
/>

        {/* SIMILAR */}
        <SimilarBusinessesSection
    business={business}
    similar={similar}
    categoryCount={categoryCount}
/>

<ShareMenu
    open={showShareMenu}
    onClose={() => setShowShareMenu(false)}
    business={business}
/>

{/* LOGIN REQUIRED POPUP */}
{showLoginPrompt && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] px-4">
    <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">

      <div className="text-4xl mb-3">🔐</div>

      <h2 className="text-xl font-bold mb-2">
        Login Required
      </h2>

      <p className="text-sm text-gray-600 mb-5">
        Please login to submit your review and help other customers.
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => setShowLoginPrompt(false)}
          className="flex-1 border border-gray-300 py-2 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={handleLoginRedirect}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
        >
          Login
        </button>
      </div>

    </div>
  </div>
)}          
 </div>

{/* SMART ACTION BAR */}
  <SmartActionBar
  business={business}
  setShowLeadPopup={setShowLeadPopup}
  setShowBookingPopup={setShowBookingPopup}
/>

{/* BOOKING MODAL */}
<BookingModal
  open={showBookingPopup}
  onClose={() => setShowBookingPopup(false)}
  business={business}
  bookingType={bookingType}
  onSubmit={handleBookingSubmit}
/>

{/* LEAD MODAL */}
<LeadModal
  open={showLeadPopup}
  onClose={() => setShowLeadPopup(false)}
  business={business}
  leadData={leadData}
  setLeadData={setLeadData}
  handleSubmit={handleLeadSubmit}
  loading={loadingLead}
/>


   {/* STICKY LEAD */}
  {showStickyLead && (
  <div
    className="fixed bottom-24 right-4 bg-black text-white px-4 py-2 rounded-full shadow-lg z-50 animate-bounce cursor-pointer"
    onClick={() => openPrimaryModal("lead")}
  >
    💬 Get Best Deal
  </div>
)}
      {/* TOAST */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded">
          {showToast}
        </div>
      )}

    </div>
    </>
);
};

export default BusinessDetails;