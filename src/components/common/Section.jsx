import React from "react";

const Section = ({ title, children, className = "" }) => {
  return (
    <section className={className}>
      
      {title && (
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          {title}
        </h2>
      )}

      <div className="text-gray-600 leading-relaxed space-y-3">
        {children}
      </div>

    </section>
  );
};

export default Section;