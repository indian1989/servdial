// frontend/src/pages/user/UserSavedBusinesses.jsx

import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaMapMarkerAlt,
  FaPhone,
  FaBuilding,
  FaTrash,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import API from "../../api/axios";
import Loader from "../../components/common/Loader";

const UserSavedBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =====================================================
     FETCH SAVED BUSINESSES
  ===================================================== */

  const fetchSavedBusinesses = async () => {
    setLoading(true);

    try {
      const res = await API.get("/user/saved-businesses");

      setBusinesses(res?.data?.data || []);
    } catch (error) {
      console.error(
        "Failed to fetch saved businesses:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to load saved businesses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedBusinesses();
  }, []);

  /* =====================================================
     REMOVE SAVED BUSINESS
  ===================================================== */

  const handleRemove = async (businessId) => {
    const confirmed = window.confirm(
      "Remove this business from your saved businesses?"
    );

    if (!confirmed) return;

    try {
      await API.post("/user/remove-saved-business", {
        businessId,
      });

      setBusinesses((prev) =>
        prev.filter(
          (business) => business._id !== businessId
        )
      );
    } catch (error) {
      console.error(
        "Failed to remove saved business:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to remove business"
      );
    }
  };

  /* =====================================================
     BUSINESS LINK
  ===================================================== */

  const getBusinessUrl = (business) => {
    if (
      business?.citySlug &&
      business?.categoryId?.slug &&
      business?.slug
    ) {
      return `/${business.citySlug}/${business.categoryId.slug}/${business.slug}`;
    }

    return `/business/${business?.slug || business?._id}`;
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="p-4 md:p-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-500">
            <FaHeart className="text-xl" />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Saved Businesses
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Businesses you have saved for quick access
            </p>
          </div>

        </div>

      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && <Loader />}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!loading && businesses.length === 0 && (
        <div className="bg-white border rounded-2xl shadow-sm p-10 text-center">

          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center text-red-500 mx-auto mb-4">
            <FaHeart className="text-2xl" />
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Saved Businesses
          </h2>

          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            You have not saved any businesses yet.
            Browse businesses and save your favourites
            for quick access later.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl text-sm font-medium transition"
          >
            <FaBuilding />
            Discover Businesses
          </Link>

        </div>
      )}

      {/* =================================================
          SAVED BUSINESS LIST
      ================================================= */}

      {!loading && businesses.length > 0 && (

        <div className="grid gap-5">

          {businesses.map((business) => {

            const categoryName =
              business?.categoryId?.name ||
              "Business";

            const cityName =
              business?.cityId?.name ||
              business?.cityName ||
              "";

            const phone =
              business?.mobile ||
              business?.phone ||
              business?.landline ||
              "";

            const image =
              business?.logo ||
              business?.images?.[0] ||
              null;

            return (
              <div
                key={business._id}
                className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition p-4 md:p-5"
              >

                <div className="flex flex-col md:flex-row gap-5">

                  {/* =================================================
                      IMAGE
                  ================================================= */}

                  <div className="w-full md:w-56 flex-shrink-0">

                    {image ? (
                      <img
                        src={image}
                        alt={business?.name || "Business"}
                        className="w-full h-40 md:h-36 object-cover rounded-xl border"
                      />
                    ) : (
                      <div className="w-full h-40 md:h-36 rounded-xl border bg-gray-50 flex items-center justify-center text-gray-400">
                        <FaBuilding className="text-4xl" />
                      </div>
                    )}

                  </div>

                  {/* =================================================
                      CONTENT
                  ================================================= */}

                  <div className="flex-1 min-w-0">

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                      <div>

                        <h2 className="text-xl font-bold text-gray-900">
                          {business?.name}
                        </h2>

                        <p className="text-sm text-orange-600 font-medium mt-1">
                          {categoryName}
                        </p>

                        {/* LOCATION */}

                        {cityName && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                            <FaMapMarkerAlt className="text-gray-400 flex-shrink-0" />

                            <span>
                              {cityName}
                            </span>
                          </div>
                        )}

                        {/* PHONE */}

                        {phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                            <FaPhone className="text-gray-400 flex-shrink-0" />

                            <span>
                              {phone}
                            </span>
                          </div>
                        )}

                      </div>

                      {/* REMOVE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(business._id)
                        }
                        className="inline-flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 px-4 py-2 rounded-xl text-sm font-medium transition"
                      >
                        <FaTrash />
                        Remove
                      </button>

                    </div>

                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="flex flex-wrap gap-3 mt-5">

                      <Link
                        to={getBusinessUrl(business)}
                        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition"
                      >
                        <FaExternalLinkAlt />
                        View Business
                      </Link>

                      {phone && (
                        <a
                          href={`tel:${phone}`}
                          className="inline-flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-100 px-4 py-2.5 rounded-xl text-sm font-medium transition"
                        >
                          <FaPhone />
                          Call
                        </a>
                      )}

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
};

export default UserSavedBusinesses;