import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useRef } from "react";

import TrackBusinessView from "../components/analytics/TrackBusinessView";
import ReviewsList from "../components/reviews/ReviewsList";
import RatingBreakdown from "../components/reviews/RatingBreakdown";
import ReviewForm from "../components/reviews/ReviewForm";
import BusinessCard from "../components/business/BusinessCard";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import L from "leaflet";
import {
  Star,
  MapPin,
  Share2,
  Navigation,
  Phone,
  MessageCircle,
  Copy,
  Facebook,
  Twitter,
  Mail,
  MessageSquare
} from "lucide-react";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const BusinessDetails = ({ business, reviews = [], similar = [], refresh }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("servdial_user"));

  // ================= STATE =================
  const [activeImg, setActiveImg] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showToast, setShowToast] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);
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

  const shareRef = useRef(null);

  // ================ Live Viewers ==============
  const [liveViewers, setLiveViewers] = useState(0);

  // ================= SAFE DATA =================
  const images = useMemo(() => {
    return business?.images?.length ? business.images : ["/no-image.png"];
  }, [business]);

  const isFallbackImage = images[activeImg] === "/no-image.png";

  const lat = business?.location?.coordinates?.[1];
  const lng = business?.location?.coordinates?.[0];

  const whatsappNumber =
    (business?.whatsapp || business?.phone || "").replace(/\D/g, "");

  // ================= SERVICES =================
  const services = useMemo(() => {
    if (business?.tags?.length) return business.tags;
    if (business?.keywords?.length) return business.keywords;
    return [business?.categoryId?.name || business?.category || "General"];
  }, [business]);

  // ================= INSIGHTS =================
  const insights = useMemo(() => {
    return [
      business?.averageRating > 4 && "Highly rated",
      business?.views > 50 && "Trending in area",
      business?.isVerified && "Verified listing"
    ].filter(Boolean);
  }, [business]);

  // ================= TRUST =================
  const customersServed = useMemo(() => {
    if (!business?.views) return null;
    return Math.floor(business.views * 0.6);
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

  API.post(`/business/analytics/${business._id}`, {
    type
  }).catch(() => {});
}, [business]);

  // ================= CATEGORY COUNT =================
  useEffect(() => {
    if (!business?.category && !business?.categoryId) return;

    API.get(`/business/count?category=${business.categoryId || business.category}&city=${business.city}`)
      .then(res => setCategoryCount(res.data.count))
      .catch(() => {});
  }, [business]);

  // ============ Share Popup Use Effect ==========
  useEffect(() => {
  const handleClickOutside = (e) => {
    if (shareRef.current && !shareRef.current.contains(e.target)) {
      setShowShareMenu(false);
    }
  };

  if (showShareMenu) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showShareMenu]);

// ============ Sticky Lead Use Effect ============
useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 500) {
      setShowStickyLead(true);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

// ============ LIVE VIEWERS USE EFFECT ==============
useEffect(() => {
  // base viewers from traffic (views)
  let base = Math.floor((business?.views || 50) / 15);

  if (base < 3) base = 3;

  setLiveViewers(base + Math.floor(Math.random() * 5));

  const interval = setInterval(() => {
    setLiveViewers((prev) => {
      const change = Math.random() > 0.5 ? 1 : -1;
      let next = prev + change;

      if (next < 2) next = 2;
      if (next > 15) next = 15;

      return next;
    });
  }, 4000); // changes every 4 sec

  return () => clearInterval(interval);
}, [business]);

  // ================= TOAST =================
  const showToastMsg = useCallback((msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(""), 2000);
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

  const handleDirections = () => {
    trackEvent("direction");
    if (!lat || !lng) return showToastMsg("Location not available");

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  const handleShareOption = (type) => {
    trackEvent("share");
    const url = window.location.href;

    if (type === "copy") {
      navigator.clipboard.writeText(url);
      showToastMsg("Link copied!");
    }
    if (type === "whatsapp") window.open(`https://wa.me/?text=${url}`);
    if (type === "facebook") window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
    if (type === "twitter") window.open(`https://twitter.com/intent/tweet?url=${url}`);
    if (type === "gmail") {
  const subject = encodeURIComponent(`Check this business: ${business.name}`);
  const body = encodeURIComponent(`Hey,\n\nI found this on ServDial:\n${url}`);
  window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`);
}

    setShowShareMenu(false);
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
    navigate("/login", {
      state: { from: window.location.pathname, pendingReview }
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

  // ================= GALLERY =================
  const nextImg = () => setActiveImg((prev) => (prev + 1) % images.length);
  const prevImg = () =>
    setActiveImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  useEffect(() => {
    const handleKey = (e) => {
      if (!showGallery) return;
      if (e.key === "ArrowRight") nextImg();
      if (e.key === "ArrowLeft") prevImg();
      if (e.key === "Escape") setShowGallery(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showGallery]);

  if (!business?._id) {
  return <div className="p-6 text-center">Loading...</div>;
}

  return (
    <div className="bg-gray-50 min-h-screen pb-32">

      <TrackBusinessView businessId={business._id} />

      {/* HERO */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        {isFallbackImage ? (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl font-bold">
            {business.name}
          </div>
        ) : (
          <img
            src={images[activeImg]}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setShowGallery(true)}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="absolute bottom-4 left-4 text-white space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold">{business.name}</h1>
          <p className="text-sm">
            {business.categoryId?.name || business.category} • {business.city}
          </p>

          <div className="flex items-center gap-2 text-sm">
            <Star size={16} className="text-yellow-400" />
            {business.averageRating || "New"}
            <span className="text-gray-300">
              ({business.totalReviews || 0})
            </span>

            {/* TRUST CHIPS */}
<div className="flex flex-wrap gap-2 mt-2 text-xs">

  {business.isVerified && (
    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
      ✔ Verified
    </span>
  )}

  {customersServed && (
    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
      👥 {customersServed}+ customers served
    </span>
  )}

  {business.averageRating >= 4.5 && (
    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
      ⭐ Top Rated
    </span>
  )}

  <span className="bg-green-50 text-green-600 px-2 py-1 rounded-full">
  ⚡ Responds quickly
</span>

  <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded mt-1">
  Limited Time Offer
</span>

{/* 👀 LIVE VIEWERS */}
<div className="text-xs bg-black/60 px-2 py-1 rounded inline-block mt-1">
  👀 {liveViewers} people viewing right now
</div>

  {/* 🔥 URGENCY SIGNAL */}
<div className="bg-red-50 border border-red-200 text-red-600 text-sm p-1 rounded-xl">
  🔥 {Math.floor(Math.random() * 5) + 3} people contacted in last 24 hours
</div>

</div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* 🔥 BUSINESS STATS / TRUST */}
<div className="bg-white p-4 rounded-xl shadow grid grid-cols-2 md:grid-cols-4 text-center text-sm">

  <div>
    <p className="font-bold text-lg">{business.views || 0}</p>
    <p className="text-gray-500">Views</p>
  </div>

  <div>
    <p className="font-bold text-lg">{business.totalReviews || 0}</p>
    <p className="text-gray-500">Reviews</p>
  </div>

  <div>
    <p className="font-bold text-lg">
      {business.isVerified ? "Yes" : "No"}
    </p>
    <p className="text-gray-500">Verified</p>
  </div>

  <div>
    <p className="font-bold text-lg">
      {business.averageRating || "New"}
    </p>
    <p className="text-gray-500">Rating</p>
  </div>

</div>


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

        {/* AI SUMMARY */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">AI Summary</h2>
          <p className="text-sm text-gray-600">{aiSummary}</p>
        </div>

        {/* SERVICES */}
<div className="bg-white p-4 rounded-xl shadow">
  <h2 className="font-semibold mb-2">Services</h2>
  <div className="flex flex-wrap gap-2">
    {services.map((s, i) => (
      <span key={i} className="bg-blue-50 text-blue-600 px-3 py-1 text-xs rounded-full">
        {s}
      </span>
    ))}
  </div>
</div>

        {/* ADDRESS */}
        <div className="bg-white p-4 rounded-xl shadow flex gap-2 text-sm">
          <MapPin size={16}/>
          <div>
            {business.address}<br/>
            {business.city}, {business.state}
          </div>
        </div>

        {/* MAP */}
        {lat && lng && (
          <div className="h-72 rounded overflow-hidden">
            <MapContainer center={[lat, lng]} zoom={15} style={{ height: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[lat, lng]} icon={markerIcon}>
                <Popup>{business.name}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* REVIEWS */}
        <div className="grid md:grid-cols-3 gap-6">
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
                  <BusinessCard business={b} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PREMIUM CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex gap-2 z-50">

        <button onClick={() => {handleCall(); }} className="relative flex-1 bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-1">
          <Phone size={16}/>
{phoneRevealed
  ? business.phone
  : business.phone
    ? business.phone.slice(0, 5) + "XXXXX"
    : "Call"}

    <span className="absolute -top-2 right-2 bg-yellow-400 text-xs px-1 rounded">
  Recommended
</span>
        </button>

        <button onClick={() => {handleWhatsApp(); }} className="flex-1 bg-green-600 animate-pulse text-white py-2 rounded-lg flex items-center justify-center gap-1">
          <MessageCircle size={16}/> WhatsApp
        </button>

        {/* GET DEAL POPUP */}

<button
  onClick={() => setShowPopup(true)}
  className="flex-1 bg-black text-white py-2 rounded-lg flex items-center justify-center gap-1"
>
  💰 Get Deal
</button>

 <button onClick={() => { trackEvent("direction"); handleDirections(); }} className="flex-1 bg-gray-800 text-white py-2 rounded-lg flex items-center justify-center gap-1">
          <Navigation size={16}/> Directions
        </button>

        <button onClick={() => setShowShareMenu(!showShareMenu)} className="flex-1 bg-black text-white py-2 rounded-lg flex items-center justify-center gap-1">
          <Share2 size={16}/> Share
        </button>
      </div>

      {showPopup && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
      
      <h2 className="text-lg font-semibold">
        Get Best Deal from {business.name}
      </h2>

      <input
        type="text"
        placeholder="Your Name"
        value={leadData.name}
        onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Phone Number"
        value={leadData.phone}
        onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <textarea
        placeholder="Your requirement..."
        value={leadData.message}
        onChange={(e) => setLeadData({ ...leadData, message: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <div className="flex gap-2">
        <button
          onClick={handleLeadSubmit}
          disabled={loadingLead}
          className="flex-1 bg-blue-600 text-white py-2 rounded"
        >
          {loadingLead ? "Sending..." : "Send Request"}
        </button>

        <button
          onClick={() => setShowPopup(false)}
          className="flex-1 bg-gray-200 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      {/* SHARE MENU */}
      {showShareMenu && (
  <div
  ref={shareRef}
  className="fixed bottom-20 right-1 bg-white shadow-xl rounded-xl p-4 space-y-3 z-50 w-56"
>

    <button onClick={() => handleShareOption("copy")} className="flex items-center gap-2 w-full text-left hover:bg-gray-100 p-2 rounded">
      <Copy size={16}/> Copy Link
    </button>

    <button onClick={() => handleShareOption("whatsapp")} className="flex items-center gap-2 w-full text-left hover:bg-gray-100 p-2 rounded">
      <MessageCircle size={16}/> WhatsApp
    </button>

    <button onClick={() => handleShareOption("facebook")} className="flex items-center gap-2 w-full text-left hover:bg-gray-100 p-2 rounded">
      <Facebook size={16}/> Facebook
    </button>

    <button onClick={() => handleShareOption("twitter")} className="flex items-center gap-2 w-full text-left hover:bg-gray-100 p-2 rounded">
      <Twitter size={16}/> Twitter
    </button>

    <button onClick={() => handleShareOption("gmail")} className="flex items-center gap-2 w-full text-left hover:bg-gray-100 p-2 rounded">
      <Mail size={16}/> Gmail
    </button>

  </div>
)}

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
  );
};

export default BusinessDetails;