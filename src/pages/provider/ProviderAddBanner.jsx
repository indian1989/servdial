import React from "react";

import {
  FaBullhorn,
  FaCheckCircle,
} from "react-icons/fa";

import BannerForm from "../../components/banner/BannerForm";

const ProviderAddBanner = () => {
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">

        <div className="flex items-center gap-3 mb-3">

          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
            <FaBullhorn className="text-xl" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Promote Your Business
            </h1>

            <p className="text-sm text-gray-500">
              Reach more customers with banner advertisements
            </p>
          </div>

        </div>

        {/* INFO */}
        <div className="grid md:grid-cols-2 gap-3 mt-5">

          <div className="flex items-start gap-2 text-sm text-gray-600">
            <FaCheckCircle className="text-green-500 mt-1" />

            <span>
              Banners become visible after
              successful payment.
            </span>
          </div>

          <div className="flex items-start gap-2 text-sm text-gray-600">
            <FaCheckCircle className="text-green-500 mt-1" />

            <span>
              All banner ads are reviewed by
              admin before publishing.
            </span>
          </div>

          <div className="flex items-start gap-2 text-sm text-gray-600">
            <FaCheckCircle className="text-green-500 mt-1" />

            <span>
              You can target specific cities
              and categories.
            </span>
          </div>

          <div className="flex items-start gap-2 text-sm text-gray-600">
            <FaCheckCircle className="text-green-500 mt-1" />

            <span>
              High visibility placements help
              boost leads and customer reach.
            </span>
          </div>

        </div>

      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">

        <BannerForm mode="provider" />

      </div>

    </div>
  );
};

export default ProviderAddBanner;