// frontend/src/pages/BusinessPage.jsx

import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import API from "../api/axios";

import BusinessDetails from "./BusinessDetails";
import NotFound from "./NotFound";

// =========================================================
// 🏢 BUSINESS PAGE
// =========================================================

const BusinessPage = ({ resolvedParams }) => {

  const params = useParams();

const citySlug =
  resolvedParams?.citySlug || params.citySlug;

const categorySlug =
  resolvedParams?.categorySlug ||
  params.categorySlug;

const slug =
  resolvedParams?.slug || params.slug;

const navigate = useNavigate();


  // =======================================================
  // STATE
  // =======================================================

  const [business, setBusiness] =
    useState(null);

  const [reviews, setReviews] =
    useState([]);

  const [similar, setSimilar] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [notFound, setNotFound] =
    useState(false);


  // =======================================================
  // 🔗 FETCH SIMILAR BUSINESSES
  // =======================================================

  const fetchSimilar = async (businessId) => {

    if (!businessId) {
      return;
    }

    try {

      const res =
        await API.get(
          `/businesses/similar/${businessId}`
        );

      setSimilar(
        Array.isArray(
          res?.data?.data
        )
          ? res.data.data
          : []
      );

    } catch (error) {

      console.error(
        "❌ Similar businesses error:",
        error
      );

      setSimilar([]);

    }

  };


  // =======================================================
  // 🔎 FETCH BUSINESS
  // =======================================================

  const fetchBusiness = async () => {

    let isRedirecting = false;

    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    try {

      setLoading(true);
      setNotFound(false);


      // =================================================
      // API
      // =================================================

      const res =
  await API.get(
    `/businesses/${citySlug}/${categorySlug}/${slug}`
  );


     // =================================================
// RESPONSE
// =================================================

const data =
  res?.data || {};


// =================================================
// 🔄 OLD BUSINESS SLUG → CANONICAL URL
//
// IMPORTANT:
// Handle redirect BEFORE checking business data.
// This prevents "Business Not Found" flash.
// =================================================

const shouldRedirect =
  data?.redirect === true;


if (shouldRedirect) {

  const redirectBusiness =
    data?.data?.business ||
    null;


  const canonicalBusinessSlug =
    data?.canonicalSlug ||
    redirectBusiness?.slug ||
    "";


  const canonicalCitySlug =
    data?.canonicalCitySlug ||
    redirectBusiness?.citySlug ||
    redirectBusiness?.cityId?.slug ||
    "";


  const canonicalCategorySlug =
    data?.canonicalCategorySlug ||
    redirectBusiness?.categorySlug ||
    redirectBusiness?.categoryId?.slug ||
    "";


  if (
    canonicalCitySlug &&
    canonicalCategorySlug &&
    canonicalBusinessSlug &&
    (
      citySlug !== canonicalCitySlug ||
      categorySlug !== canonicalCategorySlug ||
      slug !== canonicalBusinessSlug
    )
  ) {

    isRedirecting = true;

    navigate(
      `/${canonicalCitySlug}/${canonicalCategorySlug}/${canonicalBusinessSlug}`,
      {
        replace: true,
      }
    );

    return;
  }

}


// =================================================
// CURRENT BUSINESS
// =================================================

const biz =
  data?.data?.business ||
  data?.data ||
  null;


if (!biz) {

  setNotFound(true);
  return;

}


      // =================================================
      // CANONICAL CITY SLUG
      // =================================================
      //
      // Prefer explicit stored slug.
      // Fallback to populated cityId.slug.
      //
      // =================================================

      const businessCitySlug =
        biz.citySlug ||
        biz.cityId?.slug ||
        "";


      // =================================================
      // CANONICAL CATEGORY SLUG
      // =================================================

      const businessCategorySlug =
        biz.categorySlug ||
        biz.categoryId?.slug ||
        "";


      // =================================================
      // BUSINESS SLUG
      // =================================================

      const businessSlug =
        biz.slug ||
        biz._id ||
        "";


      // =================================================
      // 🚨 CITY SLUG MISMATCH
      // =================================================
      //
      // Example:
      //
      // requested:
      // patna-patna-bihar
      //
      // business:
      // patna-bihar
      //
      // Do not show 404.
      //
      // Redirect to canonical URL.
      //
      // =================================================

      if (
        citySlug &&
        businessCitySlug &&
        citySlug !== businessCitySlug
      ) {

        console.warn(
          "⚠️ City slug mismatch.",
          {
            requested: citySlug,
            received: businessCitySlug,
          }
        );

        if (
          businessCategorySlug &&
          businessSlug
        ) {

          isRedirecting = true;

          navigate(
            `/${businessCitySlug}/${businessCategorySlug}/${businessSlug}`,
            {
              replace: true,
            }
          );

          return;

        }

      }


      // =================================================
      // 🚨 CATEGORY SLUG MISMATCH
      // =================================================
      //
      // Example:
      //
      // URL:
      // restaurant
      //
      // Database:
      // restaurants
      //
      // Redirect to actual canonical category slug.
      //
      // =================================================

      if (
        categorySlug &&
        businessCategorySlug &&
        categorySlug !==
          businessCategorySlug
      ) {

        console.warn(
          "⚠️ Category slug mismatch.",
          {
            requested: categorySlug,
            received: businessCategorySlug,
          }
        );


        if (
          businessCitySlug &&
          businessSlug
        ) {
          isRedirecting = true;

          navigate(
            `/${businessCitySlug}/${businessCategorySlug}/${businessSlug}`,
            {
              replace: true,
            }
          );

          return;

        }

      }


      // =================================================
      // ✅ BUSINESS FOUND
      // =================================================

      setBusiness(biz);


      // =================================================
      // ⭐ REVIEWS
      // =================================================

      const reviewsData =
        res?.data?.data?.reviews ||
        biz?.reviews ||
        [];

      setReviews(
        Array.isArray(reviewsData)
          ? reviewsData
          : []
      );


      // =================================================
      // 🔗 SIMILAR
      // =================================================

      if (biz?._id) {

        fetchSimilar(
          biz._id
        );

      }

    } catch (error) {

      console.error(
        "❌ Business fetch error:",
        error
      );


      if (
        error?.response?.status === 404
      ) {

        setNotFound(true);

      }

    } finally {

  if (!isRedirecting) {
    setLoading(false);
  }

}

  };


  // =======================================================
  // 🚀 LOAD
  // =======================================================

  useEffect(() => {

    fetchBusiness();

  }, [
    citySlug,
    categorySlug,
    slug,
  ]);


  // =======================================================
  // ⏳ LOADING
  // =======================================================

  if (loading) {

    return (
      <div className="py-16 text-center">

        <p className="text-sm text-gray-500">

          Loading business...

        </p>

      </div>
    );

  }


  // =======================================================
  // ❌ NOT FOUND
  // =======================================================

  if (notFound) {

    return <NotFound />;

  }


  // =======================================================
  // SAFETY
  // =======================================================

  if (!business) {

    return (
      <div className="py-16 text-center">

        <h2 className="text-lg font-semibold text-gray-800">

          Business not found

        </h2>

      </div>
    );

  }


  // =======================================================
  // 🖥️ RENDER
  // =======================================================

  return (
    <>

      {/* =================================================
          BUSINESS DETAILS
      ================================================= */}

      <BusinessDetails

        business={
          business
        }

        reviews={
          reviews
        }

        similar={
          similar
        }

        refresh={
          fetchBusiness
        }

      />

    </>
  );

};


export default BusinessPage;