import {
    useMemo,
} from "react";
import { useNavigate } from "react-router-dom";

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
import useBusinessDistance from "../hooks/useBusinessDistance";
import BusinessAddressCard from "../components/business/BusinessAddressCard";
import BusinessServiceInfo from "../components/business/BusinessServiceInfo";
import useBusinessAnalytics from "../hooks/useBusinessAnalytics";
import useToastMessage from "../hooks/useToastMessage";
import useBusinessDirections from "../hooks/useBusinessDirections";
import useSaveBusiness from "../hooks/useSaveBusiness";
import useLeadBooking from "../hooks/useLeadBooking";
import useBusinessReview from "../hooks/useBusinessReview";
import useCategoryBusinessCount from "../hooks/useCategoryBusinessCount";
import useStickyLead from "../hooks/useStickyLead";
import useBusinessActions from "../hooks/useBusinessActions";
import useBusinessShare from "../hooks/useBusinessShare";
import LoginPromptModal from "../components/common/LoginPromptModal";
import useGallery from "../hooks/useGallery";


const BusinessDetails = ({ business, reviews = [], similar = [], refresh }) => {

  const navigate = useNavigate();

  const {
    trackEvent
    }=useBusinessAnalytics(
    business?._id
    );
  let user = null;

try {
  user = JSON.parse(localStorage.getItem("servdial_user"));
} catch {
  localStorage.removeItem("servdial_user");
}

  
  // ================= HOOKS =================
  const distance = useBusinessDistance(business);
  const { showToast, showToastMsg } = useToastMessage();
  const {
  handleDirections,
    } = useBusinessDirections(
      business,
      trackEvent,
      showToastMsg
    );

    const {

      handleCall,
      handleWhatsApp,
      }=useBusinessActions({
      business,
      trackEvent,
      showToastMsg
      });

    const {
    isSaved,
    setIsSaved,
    handleSave
    }=useSaveBusiness({
    businessId:business?._id,
    navigate,
    showToastMsg
    });

    const {

    showLeadPopup,
    setShowLeadPopup,

    showBookingPopup,
    setShowBookingPopup,

    bookingType,
    setBookingType,

    leadData,
    setLeadData,

    loadingLead,

    openPrimaryModal,

    handleLeadSubmit,

    handleBookingSubmit

    }=useLeadBooking({

    businessId:business?._id,

    showToastMsg

    });

    const {

    showLoginPrompt,

    setShowLoginPrompt,

    handleReviewSubmit,

    handleLoginRedirect

    }=useBusinessReview({

    businessId:business?._id,

    user,

    navigate,

    refresh

    });


    const categoryCount =
    useCategoryBusinessCount(business);
  
    const showStickyLead =
    useStickyLead(500);


    const {

      showShareMenu,

      setShowShareMenu,

      currentUrl

      }=useBusinessShare(
      business
      );

      const {
        activeImg,
        setActiveImg,
        showGallery,
        setShowGallery,
        closeGallery,
      } = useGallery();

    // ================= SAFE DATA =================
  const images = useMemo(() => {
    return business?.images?.length ? business.images : ["/no-image.png"];
  }, [business]);


  // ================= ACTIONS =================

const uiType =
  business?.categoryId?.uiType ||
  business?.category?.uiType ||
  "service";

  
 if (!business?._id) {
 return (
  <div className="min-h-screen flex items-center justify-center">
    Loading...
  </div>
 );
}
<BusinessSEO />

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
distance={distance}
handleSave={handleSave}
isSaved={isSaved}
/>

{/* PHOTO GALLERY */}
<PhotoGallery
  open={showGallery}
  images={images}
  activeImg={activeImg}
  setActiveImg={setActiveImg}
  onClose={closeGallery}
/>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      <QuickInfoBar
 business={business}
/>

<BusinessAddressCard
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

<BusinessServiceInfo
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
    hours={business.businessHours}
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

{/* LOCATION MAP */}
        <LocationMap
  business={business}
/>

        {/* SIMILAR */}
        <SimilarBusinessesSection
    business={business}
    similar={similar}
    categoryCount={categoryCount}
/>

    <ShareMenu
    open={showShareMenu}
    business={business}
    onClose={()=>setShowShareMenu(false)}
    />

{/* LOGIN REQUIRED POPUP */}
          
 <LoginPromptModal
 open={showLoginPrompt}
 onClose={() => setShowLoginPrompt(false)}
 onLogin={handleLoginRedirect}
 />
  </div>

{/* SMART ACTION BAR */}
  <SmartActionBar
  business={business}
  setShowLeadPopup={setShowLeadPopup}
  setShowBookingPopup={setShowBookingPopup}
  setBookingType={setBookingType}
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