// frontend/src/pages/BannerPricing.jsx

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  FaBullhorn,
  FaCheckCircle,
  FaArrowRight,
  FaTag,
} from "react-icons/fa";

/* =====================================================
   BANNER PRICES
===================================================== */

const BANNER_PRICES = {
  homepage_top: 1999,
  homepage_middle: 1799,
  homepage_bottom: 1299,

  city_page_top: 1599,
  city_page_middle: 1299,
  city_page_bottom: 1099,

  category_page_top: 1599,
  category_page_middle: 1299,
  category_page_bottom: 1099,

  featured_business_top: 1799,
  featured_business_bottom: 1299,

  top_rated_business_top: 1799,
  top_rated_business_bottom: 1299,

  latest_business_top: 1799,
  latest_business_bottom: 1299,

  search_results_top: 1999,
  search_results_bottom: 1599,

  business_detail_middle: 1599,
  business_detail_bottom: 1299,
};

/* =====================================================
   DISCOUNTS
===================================================== */

const DISCOUNT_PERCENT = {
  1: 0,
  3: 5,
  6: 10,
  12: 15,
};

/* =====================================================
   PLACEMENT GROUPS
===================================================== */

const PLACEMENT_GROUPS = [
  {
    title: "Homepage",
    placements: [
      {
        value: "homepage_top",
        label: "Homepage Top",
      },
      {
        value: "homepage_middle",
        label: "Homepage Middle",
      },
      {
        value: "homepage_bottom",
        label: "Homepage Bottom",
      },
    ],
  },

  {
    title: "City Page",
    placements: [
      {
        value: "city_page_top",
        label: "City Page Top",
      },
      {
        value: "city_page_middle",
        label: "City Page Middle",
      },
      {
        value: "city_page_bottom",
        label: "City Page Bottom",
      },
    ],
  },

  {
    title: "Category Page",
    placements: [
      {
        value: "category_page_top",
        label: "Category Page Top",
      },
      {
        value: "category_page_middle",
        label: "Category Page Middle",
      },
      {
        value: "category_page_bottom",
        label: "Category Page Bottom",
      },
    ],
  },

  {
    title: "Business Sections",
    placements: [
      {
        value: "featured_business_top",
        label: "Featured Business Top",
      },
      {
        value: "featured_business_bottom",
        label: "Featured Business Bottom",
      },
      {
        value: "top_rated_business_top",
        label: "Top Rated Business Top",
      },
      {
        value: "top_rated_business_bottom",
        label: "Top Rated Business Bottom",
      },
      {
        value: "latest_business_top",
        label: "Latest Business Top",
      },
      {
        value: "latest_business_bottom",
        label: "Latest Business Bottom",
      },
    ],
  },

  {
    title: "Search Results",
    placements: [
      {
        value: "search_results_top",
        label: "Search Results Top",
      },
      {
        value: "search_results_bottom",
        label: "Search Results Bottom",
      },
    ],
  },

  {
    title: "Business Detail",
    placements: [
      {
        value: "business_detail_middle",
        label: "Business Detail Middle",
      },
      {
        value: "business_detail_bottom",
        label: "Business Detail Bottom",
      },
    ],
  },
];

/* =====================================================
   DURATION OPTIONS
===================================================== */

const DURATION_OPTIONS = [
  {
    value: 1,
    label: "1 Month",
  },
  {
    value: 3,
    label: "3 Months",
  },
  {
    value: 6,
    label: "6 Months",
  },
  {
    value: 12,
    label: "12 Months",
  },
];

/* =====================================================
   PRICING CALCULATOR
===================================================== */

const calculatePricing = (basePrice, duration) => {
  const discountPercent =
    DISCOUNT_PERCENT[duration] || 0;

  const originalAmount =
    basePrice * duration;

  const discountAmount =
    Math.round(
      originalAmount *
        (discountPercent / 100)
    );

  const payableAmount =
    originalAmount - discountAmount;

  return {
    originalAmount,
    discountAmount,
    discountPercent,
    payableAmount,
  };
};

/* =====================================================
   PLACEMENT CARD
===================================================== */

const PlacementCard = ({
  placement,
  navigate,
}) => {
  const { user } = useAuth();

  const role = user?.role;

  const basePrice =
    BANNER_PRICES[placement.value];

  const [duration, setDuration] =
    useState(1);

  const pricing = useMemo(
    () =>
      calculatePricing(
        basePrice,
        duration
      ),
    [basePrice, duration]
  );

  /* =====================================================
     ADD BANNER
  ===================================================== */

  const handleAddBanner = () => {
    const query =
      `placement=${encodeURIComponent(
        placement.value
      )}&duration=${duration}`;

    if (role === "provider") {
      navigate(
        `/provider/add-banner?${query}`
      );
      return;
    }

    if (role === "user") {
      navigate(
        `/user/add-banner?${query}`
      );
      return;
    }

    navigate(
      `/login?redirect=${encodeURIComponent(
        `/banner-pricing`
      )}`
    );
  };

  return (
    <div
      className="
        group
        relative
        bg-white
        border
        border-gray-200
        rounded-2xl
        overflow-hidden
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >

      {/* TOP ACCENT */}

      <div className="h-1.5 bg-blue-600" />

      <div className="p-6">

        {/* HEADER */}

        <div className="flex items-start justify-between gap-3">

          <div>

            <div className="flex items-center gap-2">

              <div className="
                w-10
                h-10
                rounded-xl
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
              ">
                <FaBullhorn />
              </div>

              <div>
                <h3 className="
                  text-lg
                  font-bold
                  text-gray-900
                ">
                  {placement.label}
                </h3>

                <p className="
                  text-xs
                  text-gray-500
                  mt-0.5
                ">
                  Banner advertising
                </p>
              </div>

            </div>

          </div>

          {pricing.discountPercent > 0 && (
            <span className="
              inline-flex
              items-center
              gap-1
              bg-green-100
              text-green-700
              text-xs
              font-bold
              px-2.5
              py-1
              rounded-full
              whitespace-nowrap
            ">
              <FaTag className="text-[10px]" />
              Save {pricing.discountPercent}%
            </span>
          )}

        </div>

        {/* PRICE */}

        <div className="mt-6">

          <div className="flex items-end gap-2">

            <span className="
              text-3xl
              font-extrabold
              text-gray-900
            ">
              ₹{basePrice.toLocaleString("en-IN")}
            </span>

            <span className="
              text-sm
              text-gray-500
              pb-1
            ">
              / month
            </span>

          </div>

          <p className="
            text-xs
            text-gray-500
            mt-1
          ">
            Starting price
          </p>

        </div>

        {/* DURATION */}

        <div className="mt-5">

          <label className="
            block
            text-sm
            font-semibold
            text-gray-700
            mb-2
          ">
            Select Duration
          </label>

          <div className="
            grid
            grid-cols-2
            gap-2
          ">

            {DURATION_OPTIONS.map(
              (option) => {

                const selected =
                  duration === option.value;

                const discount =
                  DISCOUNT_PERCENT[
                    option.value
                  ];

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setDuration(
                        option.value
                      )
                    }
                    className={`
                      relative
                      rounded-xl
                      border
                      px-3
                      py-2.5
                      text-sm
                      font-semibold
                      transition
                      ${
                        selected
                          ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                          : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-gray-50"
                      }
                    `}
                  >

                    {option.label}

                    {discount > 0 && (
                      <span className={`
                        block
                        text-[10px]
                        mt-0.5
                        ${
                          selected
                            ? "text-green-600"
                            : "text-green-600"
                        }
                      `}>
                        {discount}% discount
                      </span>
                    )}

                    {selected && (
                      <FaCheckCircle
                        className="
                          absolute
                          top-1.5
                          right-1.5
                          text-blue-600
                          text-xs
                        "
                      />
                    )}

                  </button>
                );
              }
            )}

          </div>

        </div>

        {/* PRICING SUMMARY */}

        <div className="
          mt-5
          rounded-xl
          bg-gray-50
          border
          border-gray-100
          p-4
        ">

          <div className="
            flex
            justify-between
            text-sm
            text-gray-600
          ">
            <span>
              {duration} month
              {duration > 1 ? "s" : ""}
            </span>

            <span>
              ₹
              {pricing.originalAmount.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>

          {pricing.discountPercent > 0 && (
            <div className="
              flex
              justify-between
              text-sm
              text-green-600
              mt-2
            ">
              <span>
                Discount (
                {pricing.discountPercent}%)
              </span>

              <span className="font-medium">
                - ₹
                {pricing.discountAmount.toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>
          )}

          <div className="
            border-t
            border-gray-200
            mt-3
            pt-3
          ">

            <div className="
              flex
              justify-between
              items-end
            ">

              <div>

                <p className="
                  text-xs
                  text-gray-500
                ">
                  Payable Amount
                </p>

                <p className="
                  text-2xl
                  font-extrabold
                  text-blue-600
                  mt-0.5
                ">
                  ₹
                  {pricing.payableAmount.toLocaleString(
                    "en-IN"
                  )}
                </p>

              </div>

              {pricing.discountAmount > 0 && (
                <div className="
                  text-right
                  text-xs
                  text-green-600
                  font-semibold
                ">
                  You save
                  <br />
                  ₹
                  {pricing.discountAmount.toLocaleString(
                    "en-IN"
                  )}
                </div>
              )}

            </div>

          </div>

        </div>

        {/* CTA */}

        <button
          type="button"
          onClick={handleAddBanner}
          className="
            w-full
            mt-5
            bg-blue-600
            hover:bg-blue-700
            text-white
            py-3.5
            rounded-xl
            font-bold
            flex
            items-center
            justify-center
            gap-2
            transition
            shadow-sm
            hover:shadow-md
          "
        >
          Add Banner
          <FaArrowRight className="text-sm" />
        </button>

        <p className="
          text-center
          text-[11px]
          text-gray-400
          mt-3
        ">
          Payment & admin approval required
        </p>

      </div>

    </div>
  );
};

/* =====================================================
   PAGE
===================================================== */

const BannerPricing = () => {
  const navigate = useNavigate();

  return (
    <div className="
      min-h-screen
      bg-gradient-to-b
      from-gray-50
      to-white
      py-10
      px-4
    ">

      <div className="max-w-7xl mx-auto">

        {/* HERO */}

        <div className="
          text-center
          max-w-3xl
          mx-auto
        ">

          <div className="
            inline-flex
            items-center
            gap-2
            bg-blue-50
            text-blue-700
            px-4
            py-2
            rounded-full
            text-sm
            font-semibold
          ">
            <FaBullhorn />
            ServDial Banner Advertising
          </div>

          <h1 className="
            mt-5
            text-3xl
            md:text-4xl
            font-extrabold
            text-gray-900
          ">
            Banner Advertising Plans
          </h1>

          <p className="
            mt-3
            text-gray-600
            leading-7
          ">
            Choose a high-visibility placement
            for your banner and select the
            duration that works best for your
            business.
          </p>

          {/* BENEFITS */}

          <div className="
            mt-5
            flex
            flex-wrap
            justify-center
            gap-x-5
            gap-y-2
            text-sm
            text-gray-600
          ">

            <span className="
              flex
              items-center
              gap-1.5
            ">
              <FaCheckCircle className="text-green-500" />
              Multiple placements
            </span>

            <span className="
              flex
              items-center
              gap-1.5
            ">
              <FaCheckCircle className="text-green-500" />
              Flexible duration
            </span>

            <span className="
              flex
              items-center
              gap-1.5
            ">
              <FaCheckCircle className="text-green-500" />
              Long-term discounts
            </span>

          </div>

        </div>

        {/* PRICING GROUPS */}

        <div className="
          mt-12
          space-y-12
        ">

          {PLACEMENT_GROUPS.map(
            (group) => (
              <section
                key={group.title}
              >

                <div className="
                  flex
                  items-center
                  gap-3
                  mb-5
                ">

                  <div className="
                    h-8
                    w-1
                    bg-blue-600
                    rounded-full
                  " />

                  <h2 className="
                    text-2xl
                    font-bold
                    text-gray-900
                  ">
                    {group.title}
                  </h2>

                </div>

                <div className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  lg:grid-cols-3
                  gap-6
                ">

                  {group.placements.map(
                    (placement) => (
                      <PlacementCard
                        key={
                          placement.value
                        }
                        placement={
                          placement
                        }
                        navigate={
                          navigate
                        }
                      />
                    )
                  )}

                </div>

              </section>
            )
          )}

        </div>

        {/* FOOTER NOTE */}

        <div className="
          mt-14
          max-w-3xl
          mx-auto
          text-center
          bg-white
          border
          border-gray-200
          rounded-2xl
          p-5
          shadow-sm
        ">

          <p className="
            text-sm
            text-gray-600
            leading-6
          ">
            Final banner pricing is calculated
            and verified by the ServDial server.
            Discounts are automatically applied
            according to the selected duration.
          </p>

          <p className="
            text-xs
            text-gray-400
            mt-2
          ">
            Banner visibility begins after successful
            payment and admin approval.
          </p>

        </div>

      </div>

    </div>
  );
};

export default BannerPricing;