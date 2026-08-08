
import { useState } from "react";
import API from "../api/axios";

const DEFAULT_LEAD_DATA = {
  name: "",
  countryCode: "+91",
  phone: "",
  email: "",
  message: "",
  service: "",
  budget: "",
  bookingDate: "",
  bookingTime: "",
  guests: "",
};

const useLeadBooking = ({
  businessId,
  showToastMsg,
}) => {
  const [showLeadPopup, setShowLeadPopup] =
    useState(false);

  const [showBookingPopup, setShowBookingPopup] =
    useState(false);

  const [bookingType, setBookingType] =
    useState("");

  const [loadingLead, setLoadingLead] =
    useState(false);

  const [leadData, setLeadData] =
    useState(DEFAULT_LEAD_DATA);

  // ================================
  // GET CURRENT USER
  // ================================

  const getCurrentUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("servdial_user")
      );
    } catch {
      return null;
    }
  };

  // ================================
  // RESET LEAD FORM
  // ================================

  const resetLeadData = () => {
    setLeadData({
      ...DEFAULT_LEAD_DATA,
    });
  };

  // ================================
  // OPEN PRIMARY MODAL
  // ================================

  const openPrimaryModal = (
    type = "enquiry"
  ) => {
    setBookingType(type);

    switch (type) {
      case "table_booking":
      case "party_booking":
      case "room_booking":
      case "service_booking":
      case "appointment":
        setShowBookingPopup(true);
        break;

      default:
        setShowLeadPopup(true);
    }
  };

  // ================================
  // SUBMIT GENERAL LEAD
  // ================================

  const handleLeadSubmit = async () => {
    try {
      setLoadingLead(true);

      if (!businessId) {
        throw new Error(
          "Business information is missing"
        );
      }

      const user = getCurrentUser();

      const payload = {
        businessId,

        userId: user?._id || null,

        name: leadData.name?.trim() || "",

        countryCode:
          leadData.countryCode || "+91",

        phone:
          leadData.phone?.replace(/\D/g, "") || "",

        email:
          leadData.email?.trim() || "",

        message:
          leadData.message?.trim() || "",

        service:
          leadData.service?.trim() || "",

        budget:
          leadData.budget !== ""
            ? Number(leadData.budget)
            : null,

        bookingDate:
          leadData.bookingDate || "",

        bookingTime:
          leadData.bookingTime || "",

        guests:
          leadData.guests !== ""
            ? Number(leadData.guests)
            : null,

        bookingType: "enquiry",

        source: "form",
      };

      await API.post(
        "/leads",
        payload
      );

      showToastMsg(
        "Request sent successfully!"
      );

      // Close only after successful API response
      setShowLeadPopup(false);

      resetLeadData();

    } catch (error) {
      console.error(
        "LEAD ERROR:",
        error?.response?.data || error
      );

      showToastMsg(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send request"
      );
    } finally {
      setLoadingLead(false);
    }
  };

  // ================================
  // SUBMIT BOOKING
  // ================================

  const handleBookingSubmit = async (
    bookingData = {}
  ) => {
    try {
      setLoadingLead(true);

      if (!businessId) {
        throw new Error(
          "Business information is missing"
        );
      }

      const user = getCurrentUser();

      const phone =
        bookingData?.phone
          ?.replace(/\D/g, "") || "";

      const payload = {
        businessId,

        userId: user?._id || null,

        ...bookingData,

        name:
          bookingData?.name?.trim() || "",

        countryCode:
          bookingData?.countryCode ||
          "+91",

        phone,

        email:
          bookingData?.email?.trim() || "",

        message:
          bookingData?.message?.trim() || "",

        bookingType:
          bookingData?.bookingType ||
          bookingType ||
          "enquiry",

        source:
          bookingData?.source ||
          "form",

        service:
          bookingData?.service?.trim() || "",

        budget:
          bookingData?.budget !== undefined &&
          bookingData?.budget !== ""
            ? Number(bookingData.budget)
            : null,

        guests:
          bookingData?.guests !== undefined &&
          bookingData?.guests !== ""
            ? Number(bookingData.guests)
            : null,
      };

      await API.post(
        "/leads",
        payload
      );

      showToastMsg(
        "Booking request sent successfully!"
      );

      setShowBookingPopup(false);

      resetLeadData();

    } catch (error) {
      console.error(
        "BOOKING ERROR:",
        error?.response?.data || error
      );

      showToastMsg(
        error?.response?.data?.message ||
          error?.message ||
          "Booking failed"
      );
    } finally {
      setLoadingLead(false);
    }
  };

  // ================================
  // RETURN
  // ================================

  return {
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
    handleBookingSubmit,
  };
};

export default useLeadBooking;