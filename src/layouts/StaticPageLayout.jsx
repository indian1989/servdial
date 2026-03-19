import React from "react";

const StaticPageLayout = ({ title, subtitle, children }) => {
  return (
    <div style={{ background: "#ffffff" }}>

      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg,#f6f8fb,#eef2f7)",
          padding: "70px 20px",
          textAlign: "center",
          borderBottom: "1px solid #eee"
        }}
      >
        <h1
          style={{
            fontSize: "38px",
            marginBottom: "10px",
            fontWeight: "700",
            color: "#222"
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              color: "#666",
              fontSize: "18px",
              maxWidth: "700px",
              margin: "0 auto"
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Content Section */}
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          padding: "60px 20px",
          lineHeight: "1.8",
          fontSize: "17px",
          color: "#333"
        }}
      >
        {children}
      </div>

    </div>
  );
};

export default StaticPageLayout;