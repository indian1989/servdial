// src/components/business/BusinessSubmitter.jsx

import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

import { normalizeBusinessPayload } from "./BusinessMapper";

/**
 * ======================================================
 * BUSINESS SUBMITTER
 * Shared by Admin & Provider
 * ======================================================
 */

const BusinessSubmitter = ({
  mode = "admin",
  children,
}) => {
  const navigate = useNavigate();

  const submitBusiness = async (formData) => {
    try {

      /* ===========================================
         BUILD FINAL PAYLOAD
      =========================================== */

      const payload = normalizeBusinessPayload(
        formData,
        mode
      );

      console.log(
        "🚀 FINAL BUSINESS PAYLOAD",
        payload
      );

      console.log(
        "🕒 BUSINESS HOURS",
        payload.businessHours
      );

      console.log(
        "🍽 RESTAURANT BOOKING",
        payload.restaurantBooking
      );

      console.log(
        "🎉 PARTY BOOKING",
        payload.partyBooking
      );

      /* ===========================================
         ENDPOINT
      =========================================== */

      const endpoint =
        mode === "admin"
          ? "/admin/businesses"
          : "/provider/businesses";

      /* ===========================================
         SAVE
      =========================================== */

      const res = await API.post(
        endpoint,
        payload
      );

      const created =
        res?.data?.data ||
        res?.data?.business ||
        null;

      /* ===========================================
         REDIRECT
      =========================================== */

      if (
        created?.slug &&
        created?.citySlug &&
        created?.categorySlug
      ) {
        navigate(
          `/${created.citySlug}/${created.categorySlug}/${created.slug}`
        );
      } else {
        navigate(
          mode === "admin"
            ? "/admin/businesses"
            : "/provider/businesses"
        );
      }

      return res.data;

    } catch (err) {

      console.error(
        "❌ Business submission failed",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Business submission failed";

      throw new Error(message);
    }
  };

  return children(submitBusiness);
};

export default BusinessSubmitter;