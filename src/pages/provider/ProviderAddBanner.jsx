import React from "react";
import BannerForm from "../../components/banner/BannerForm";

const ProviderAddBanner = () => {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        Promote Your Business
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        Your banner will go live after payment and admin approval.
      </p>

      <BannerForm mode="provider" />
    </div>
  );
};

export default ProviderAddBanner;