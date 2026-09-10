// frontend/src/pages/provider/EditBusiness.jsx

import { useEffect, useState } from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  getProviderBusinessById,
} from "../../api/providerAPI";

import BusinessForm from "../../components/business/BusinessForm";
import BusinessSubmitter from "../../components/business/BusinessSubmitter";

import Loader from "../../components/common/Loader";

/**
 * ======================================================
 * PROVIDER EDIT BUSINESS
 *
 * Thin wrapper around:
 *
 * BusinessForm
 *      +
 * BusinessSubmitter
 *
 * RESPONSIBILITY:
 * - Load existing business
 * - Pass business data to common BusinessForm
 * - Submit update through BusinessSubmitter
 *
 * Form logic remains inside BusinessForm.
 * API submission remains inside BusinessSubmitter.
 * ======================================================
 */

const EditBusiness = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [business, setBusiness] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /* =====================================================
     FETCH BUSINESS
  ===================================================== */

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);

        const res =
          await getProviderBusinessById(id);

        const data =
          res?.data?.business ||
          res?.data?.data ||
          null;

        if (!data) {
          throw new Error(
            "Business not found"
          );
        }

        console.log(
          "🔥 PROVIDER EDIT BUSINESS",
          data
        );

        setBusiness(data);

      } catch (err) {

        console.error(
          "❌ Failed to load business",
          err
        );

        alert(
          err?.response?.data?.message ||
          "Failed to load business"
        );

        navigate(
          "/provider/businesses"
        );

      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBusiness();
    }
  }, [id, navigate]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return <Loader />;
  }

  /* =====================================================
     BUSINESS NOT FOUND
  ===================================================== */

  if (!business) {
    return (
      <div className="max-w-7xl mx-auto p-6">

        <div className="bg-white border rounded-xl p-6 text-center">

          <h2 className="text-lg font-semibold text-gray-900">
            Business not found
          </h2>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/provider/businesses"
              )
            }
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
          >
            Back to Businesses
          </button>

        </div>

      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">

      <BusinessSubmitter
        mode="provider"
        action="update"
        businessId={id}
        redirect={false}
        onSuccess={() => {

          alert(
            "Business updated successfully"
          );

          navigate(
            "/provider/businesses"
          );

        }}
      >
        {(submitBusiness) => (

          <BusinessForm
            initialData={business}
            mode="provider"
            onSubmit={submitBusiness}
          />

        )}
      </BusinessSubmitter>

    </div>
  );
};

export default EditBusiness;