import {
  useState
} from "react";


const useBusinessActions = ({
  business,
  trackEvent,
  showToastMsg
}) => {

  const [
    phoneRevealed,
    setPhoneRevealed
  ] = useState(false);


  // =========================================================
  // CALL CHOOSER
  // =========================================================

  const [
    showCallChooser,
    setShowCallChooser
  ] = useState(false);


  // =========================================================
  // NUMBERS
  // =========================================================

  const mobileNumber =
    business?.phone?.toString().trim() || "";

  const landlineNumber =
    business?.landline?.toString().trim() || "";

  const whatsappNumber =
    business?.whatsapp?.toString().trim() || "";


  const hasMobile =
    Boolean(mobileNumber);

  const hasLandline =
    Boolean(landlineNumber);

  const hasCall =
    hasMobile || hasLandline;


  // =========================================================
  // PRIMARY CALL NUMBER
  //
  // Mobile has priority when both exist.
  // Actual selection is handled by chooser.
  // =========================================================

  const callNumber =
    hasMobile
      ? mobileNumber
      : landlineNumber;


  // =========================================================
  // CALL
  // =========================================================

  const handleCall = () => {

    trackEvent?.("call");


    // No number
    if (!hasCall) {

      showToastMsg?.(
        "Phone number is not available"
      );

      return;
    }


    // First click → reveal
    if (!phoneRevealed) {

      setPhoneRevealed(true);

      showToastMsg?.(
        "Number revealed 👇"
      );

      return;
    }


    // =======================================================
    // MOBILE + LANDLINE
    // =======================================================

    if (
      hasMobile &&
      hasLandline
    ) {

      setShowCallChooser(true);

      return;
    }


    // =======================================================
    // MOBILE ONLY / LANDLINE ONLY
    // =======================================================

    handleCallNumber(callNumber);

  };


  // =========================================================
  // ACTUAL CALL
  // =========================================================

  const handleCallNumber = (number) => {

    if (!number) {

      showToastMsg?.(
        "Phone number is not available"
      );

      return;
    }


    setShowCallChooser(false);


    showToastMsg?.(
      "Connecting..."
    );


    setTimeout(() => {

      window.location.href =
        `tel:${number}`;

    }, 300);

  };


  // =========================================================
  // CLOSE CALL CHOOSER
  // =========================================================

  const closeCallChooser = () => {

    setShowCallChooser(false);

  };


  // =========================================================
  // WHATSAPP
  //
  // NEVER fallback to phone or landline.
  // =========================================================

  const handleWhatsApp = () => {

    if (!whatsappNumber) {

      showToastMsg?.(
        "WhatsApp number is not available"
      );

      return;
    }


    trackEvent?.("whatsapp");


    const cleanWhatsApp =
      whatsappNumber
        .toString()
        .replace(/\D/g, "");


    if (!cleanWhatsApp) {

      showToastMsg?.(
        "WhatsApp number is not available"
      );

      return;
    }


    const finalWhatsApp =
      cleanWhatsApp.startsWith("91")
        ? cleanWhatsApp
        : `91${cleanWhatsApp}`;


    window.open(
      `https://wa.me/${finalWhatsApp}`,
      "_blank"
    );

  };


  return {

    handleCall,

    handleCallNumber,

    handleWhatsApp,

    phoneRevealed,

    callNumber,

    whatsappNumber,

    mobileNumber,

    landlineNumber,

    hasMobile,

    hasLandline,

    hasCall,

    showCallChooser,

    setShowCallChooser,

    closeCallChooser,

  };

};


export default useBusinessActions;