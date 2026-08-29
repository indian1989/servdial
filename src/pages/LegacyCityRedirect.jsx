// frontend/src/pages/LegacyCityRedirect.jsx

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

const LegacyCityRedirect = () => {
  const { citySlug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const resolveCityRedirect = async () => {
      try {
        const response = await API.get(`/cities/${citySlug}`);

        if (!mounted) return;

        const data = response.data;

        // =========================================
        // REDIRECT CITY
        // =========================================
        if (
          data?.redirect === true &&
          data?.to
        ) {
          navigate(`/${data.to}`, {
            replace: true,
          });

          return;
        }

        // =========================================
        // ACTIVE CITY
        // =========================================
        if (data?.success && data?.data?.slug) {
          navigate(`/${data.data.slug}`, {
            replace: true,
          });

          return;
        }

        // =========================================
        // NOT FOUND
        // =========================================
        navigate("/404", {
          replace: true,
        });

      } catch (error) {
        console.error(
          "Legacy city redirect error:",
          error
        );

        if (!mounted) return;

        navigate("/404", {
          replace: true,
        });
      }
    };

    resolveCityRedirect();

    return () => {
      mounted = false;
    };
  }, [citySlug, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

        <p className="text-gray-500">
          Redirecting...
        </p>
      </div>
    </div>
  );
};

export default LegacyCityRedirect;