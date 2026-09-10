// src/components/business/BusinessSubmitter.jsx

import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

import { normalizeBusinessPayload } from "./BusinessMapper";

/**
 * ======================================================
 * BUSINESS SUBMITTER
 * Shared by Admin & Provider
 *
 * RESPONSIBILITY:
 * - Normalize final business payload
 * - Create business
 * - Update business
 * - Admin duplicate contact confirmation
 * - Redirect after successful save
 *
 * mode:
 *   admin
 *   provider
 *
 * action:
 *   create
 *   update
 * ======================================================
 */

const BusinessSubmitter = ({
  mode = "admin",
  action = "create",
  businessId = null,
  children,
}) => {
  const navigate = useNavigate();

  const submitBusiness = async (formData) => {
    try {
      /* ===========================================
         VALIDATE ACTION
      =========================================== */

      if (
        action !== "create" &&
        action !== "update"
      ) {
        throw new Error(
          `Invalid business submission action: ${action}`
        );
      }

      if (
        action === "update" &&
        !businessId
      ) {
        throw new Error(
          "Business ID is required for updating a business."
        );
      }

      /* ===========================================
         BUILD FINAL PAYLOAD
      =========================================== */

      const payload =
        normalizeBusinessPayload(
          formData,
          mode,
          action
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

      const baseEndpoint =
        mode === "admin"
          ? "/admin/businesses"
          : "/provider/businesses";

      const endpoint =
        action === "update"
          ? `${baseEndpoint}/${businessId}`
          : baseEndpoint;

      /* ===========================================
         SAVE
      =========================================== */

      let res;

      try {
        if (action === "update") {
          res = await API.put(
            endpoint,
            payload
          );
        } else {
          res = await API.post(
            endpoint,
            payload
          );
        }
      } catch (submitErr) {

        /* =========================================
           ADMIN DUPLICATE CONTACT WARNING
           CREATE + UPDATE
        ========================================= */

        const duplicateData =
          submitErr?.response?.data;

        const requiresConfirmation =
          submitErr?.response?.status === 409 &&
          duplicateData?.requiresConfirmation === true;

        if (
          mode === "admin" &&
          requiresConfirmation
        ) {

          const duplicateBusinesses =
            duplicateData?.duplicates || [];

          let warningMessage =
            duplicateData?.message ||
            "This phone or landline number is already registered with another business.";

          /* ---------------------------------------
             ADD DUPLICATE BUSINESS DETAILS
          --------------------------------------- */

          if (
            duplicateBusinesses.length > 0
          ) {

            const details =
              duplicateBusinesses
                .map((business, index) => {

                  const name =
                    business?.name ||
                    "Existing Business";

                  const city =
                    business?.cityName ||
                    "";

                  const phone =
                    business?.phone ||
                    business?.alternatePhone ||
                    business?.landline ||
                    "";

                  return (
                    `${index + 1}. ${name}` +
                    `${city ? ` (${city})` : ""}` +
                    `${phone ? ` - ${phone}` : ""}`
                  );
                })
                .join("\n");

            warningMessage +=
              `\n\nExisting business(es):\n${details}`;
          }

          warningMessage +=
            "\n\nDo you want to continue and save this business anyway?";

          /* ---------------------------------------
             CONFIRM
          --------------------------------------- */

          const confirmed =
            window.confirm(
              warningMessage
            );

          /* ---------------------------------------
             CANCEL
          --------------------------------------- */

          if (!confirmed) {
            throw new Error(
              "Business submission cancelled because the phone or landline number is already registered."
            );
          }

          /* ---------------------------------------
             CONFIRMED PAYLOAD
          --------------------------------------- */

          const confirmedPayload = {
            ...payload,
            confirmDuplicateContact: true,
          };

          console.log(
            "⚠️ ADMIN DUPLICATE CONTACT CONFIRMED",
            confirmedPayload
          );

          /* ---------------------------------------
             RETRY SAME ACTION
          --------------------------------------- */

          if (action === "update") {
            res = await API.put(
              endpoint,
              confirmedPayload
            );
          } else {
            res = await API.post(
              endpoint,
              confirmedPayload
            );
          }

        } else {

          /* ---------------------------------------
             NORMAL ERROR
          --------------------------------------- */

          throw submitErr;
        }
      }

      /* ===========================================
         RESPONSE BUSINESS
      =========================================== */

      const savedBusiness =
        res?.data?.data ||
        res?.data?.business ||
        null;

      /* ===========================================
         REDIRECT
      =========================================== */

      if (
        savedBusiness?.slug &&
        savedBusiness?.citySlug &&
        savedBusiness?.categorySlug
      ) {

        navigate(
          `/${savedBusiness.citySlug}/${savedBusiness.categorySlug}/${savedBusiness.slug}`
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