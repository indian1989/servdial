import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import API from "../api/axios";
import { useRef } from "react";

import TrackBusinessView from "../components/analytics/TrackBusinessView";
import ReviewsList from "../components/reviews/ReviewsList";
import RatingBreakdown from "../components/reviews/RatingBreakdown";
import ReviewForm from "../components/reviews/ReviewForm";
import BusinessCard from "../components/business/BusinessCard";
import BusinessTabs from "../components/business/BusinessTabs";
import BusinessHero from "../components/business/BusinessHero";
import SmartActionBar from "../components/business/SmartActionBar";
import QuickInfoBar from "../components/business/QuickInfoBar";
import CategoryFeatureSection from "../components/business/CategoryFeatureSection";
import BusinessHours from "../components/business/BusinessHours";
import BusinessFAQ from "../components/business/BusinessFAQ";
import BookingModal from "../components/business/BookingModal";
import PhotoGallery from "../components/business/PhotoGallery";
import LocationMap from "../components/business/LocationMap";
import LeadModal from "../components/business/LeadModal";

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
  const [showPopup, setShowPopup] = useState(false);
  const [showToast, setShowToast] = useState("");
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [loadingLead, setLoadingLead] = useState(false);
  const [categoryCount, setCategoryCount] = useState(null);

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

const schema = useMemo(() => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": currentUrl,
  name: business?.name,
  image: business?.images?.[0] || business?.logo || "",
  telephone: business?.phone || "",

  address: {
    "@type": "PostalAddress",
    streetAddress: business?.address || "",
    addressLocality: business?.cityId?.name || "",
    addressRegion: business?.state || "",
    postalCode: business?.pincode || "",
    addressCountry: "IN"
  },

  description: business?.description || "",
  sameAs: business?.website ? [business.website] : undefined,
  priceRange: "₹₹",
  areaServed: business?.city || "",

  geo:
    lat && lng
      ? {
          "@type": "GeoCoordinates",
          latitude: lat,
          longitude: lng
        }
      : undefined,

  url: currentUrl,

  aggregateRating:
    business?.averageRating
      ? {
          "@type": "AggregateRating",
          ratingValue: business.averageRating,
          reviewCount: business.totalReviews || 0
        }
      : undefined,

  openingHoursSpecification:
  business?.openingHours || undefined

}), [business, lat, lng, currentUrl]);

  // ================= SERVICES =================
  const services = useMemo(() => {
    if (business?.tags?.length) return business.tags;
    if (business?.keywords?.length) return business.keywords;
    return [business?.categoryId?.name || business?.category || "General"];
  }, [business]);

  // ================ Sticky Lead ========
const [showStickyLead, setShowStickyLead] = useState(false);

  // ================= AI SUMMARY =================
  const aiSummary = useMemo(() => {
    if (!reviews.length) return "No reviews yet.";

    let score = 0;

    reviews.forEach((r) => {
      const text = (r.comment || "").toLowerCase();
      if (text.match(/good|great|excellent|fast|best/)) score += 2;
      if (text.match(/bad|slow|worst|delay|poor/)) score -= 2;
    });

    if (score > 5) return "Customers highly praise service quality and speed.";
    if (score < -5) return "Some customers reported delays or issues.";
    return "Mixed feedback from customers.";
  }, [reviews]);

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
}, [business]);

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

    setTimeout(() => {
    }, 1500);

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
    API.post("/reviews", { businessId: business._id, ...data }).then(refresh);
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

  const handleLeadSubmit = async () => {
    try {
      setLoadingLead(true);
      await API.post("/leads", {
        businessId: business._id,
        ...leadData
      });
      showToastMsg("Request sent!");
      setShowPopup(false);
    } catch {
      showToastMsg("Failed!");
    } finally {
      setLoadingLead(false);
    }
  };

  
  if (!business?._id) {
  return <div className="p-6 text-center">Loading...</div>;
}

  return (
  <>
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>

      <link rel="canonical" href={currentUrl} />
    </Helmet>

    <div className="bg-gray-50 min-h-screen pb-32">

      <TrackBusinessView businessId={business._id} />

{/* BUSINESS HERO */}
      <BusinessHero
  business={business}
  images={images}
  activeImg={activeImg}
  setActiveImg={setActiveImg}
  setShowGallery={setShowGallery}
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


{/* CLAIM BANNER */}
{!business.isClaimed && user && (
  <div className="bg-yellow-100 border border-yellow-300 p-3 rounded-xl text-sm flex justify-between items-center">
    <span>
      Own this business? Claim it now and manage your profile.
    </span>

    <button
      onClick={() => navigate(`/claim-business/${business._id}`)}
      className="bg-black text-white px-3 py-1 rounded"
    >
      Claim
    </button>
  </div>
)}

        {/*DESCRIPTION*/}
        <div id="about" className="bg-white p-4 rounded-xl shadow">

<h2 className="font-semibold mb-2">
About
</h2>

<p className="text-gray-600 text-sm">
{
business.description ||
`${business.name} is a ${
business.categoryId?.name || "local service provider"
} in ${business.city || "your city"}.`
}
</p>

</div>

        {/* AI SUMMARY */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">AI Summary</h2>
          <p className="text-sm text-gray-600">{aiSummary}</p>
        </div>

      <div id="services">

<CategoryFeatureSection
 business={business}
/>

</div>

        {/* LOCATION MAP */}
        <LocationMap
  business={business}
/>

  <div id="hours">
<BusinessHours
 hours={business.openingHours}
/>

</div>

<div id="faq">

<BusinessFAQ
 faq={business.faq}
/>

</div>

        {/* REVIEWS */}
        <div
id="reviews"
className="grid md:grid-cols-3 gap-6"
>
          <RatingBreakdown reviews={reviews} />
          <div className="md:col-span-2">
            <ReviewsList reviews={reviews} refresh={refresh} />
            <ReviewForm onSubmitAttempt={handleReviewSubmit} />
          </div>
        </div>

        {/* SIMILAR */}
        {similar.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Similar Businesses</h2>

            {categoryCount && (
              <p className="text-sm text-gray-500 mb-2">
                {categoryCount}+ businesses in {business.categoryId?.name || business.category || "General"} near {business.city}
              </p>
            )}

            <div className="flex gap-4 overflow-x-auto">
              {similar.map((b) => (
                <div key={b._id} className="min-w-[220px]">
                  <BusinessCard business={b} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

{/* SMART ACTION BAR */}
  <SmartActionBar
 business={business}
 handleCall={handleCall}
 handleWhatsApp={handleWhatsApp}
 handleDirections={handleDirections}
 setShowPopup={setShowPopup}
 setShowShareMenu={setShowShareMenu}
/>

{/* BOOKING MODAL */}
<BookingModal
 open={showPopup}
 onClose={()=>setShowPopup(false)}
 business={business}
 leadData={leadData}
 setLeadData={setLeadData}
 handleSubmit={handleLeadSubmit}
 loading={loadingLead}
/>

<LeadModal
  open={showPopup}
  onClose={() => setShowPopup(false)}
  business={business}
  leadData={leadData}
  setLeadData={setLeadData}
  handleSubmit={handleLeadSubmit}
  loading={loadingLead}
/>

   {/* STICKY LEAD */}
   {showStickyLead && (
  <div className="fixed bottom-24 right-4 bg-black text-white px-4 py-2 rounded-full shadow-lg z-50 animate-bounce cursor-pointer"
       onClick={() => setShowPopup(true)}>
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