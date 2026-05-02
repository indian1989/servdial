import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { normalizeBusinessPayload } from "./BusinessMapper";

/**
 * SINGLE SOURCE OF SUBMISSION LOGIC
 * Used by BOTH Admin and Provider
 */

const BusinessSubmitter = ({
  mode = "admin", // "admin" | "provider"
  children,
}) => {
  const navigate = useNavigate();

  const submitBusiness = async (formData) => {
    try {
      const payload = normalizeBusinessPayload(formData, mode);

      // 🔥 ROLE-BASED ROUTING ONLY (NOT LOGIC)
      const endpoint =
        mode === "admin"
          ? "/admin/businesses"
          : "/provider/businesses";

      const res = await API.post(endpoint, payload);

      const created = res?.data?.data;

      // ✅ SAFE REDIRECT (NO LOGIC HERE)
      if (created?.slug && created?.citySlug && created?.categorySlug) {
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
      console.error("Business submission failed:", err);
      throw err;
    }
  };

  return children(submitBusiness);
};

export default BusinessSubmitter;