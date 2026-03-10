import React from "react";

const Loader = ({ size = "8", color = "blue" }) => {
  return (
    <div className="flex justify-center items-center my-4">
      <div
        className={`w-${size} h-${size} border-4 border-${color}-400 border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Loader;