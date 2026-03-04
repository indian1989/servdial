import React from "react";

const PaidFeatureNotice = ({ message = "This feature will be available soon" }) => (
  <div
    role="alert"
    className="p-4 bg-yellow-100 text-yellow-800 rounded font-semibold text-center mt-2"
  >
    {message}
  </div>
);

export default PaidFeatureNotice;