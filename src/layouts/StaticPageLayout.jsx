import React from "react";

const StaticPageLayout = ({ title, subtitle, children }) => {
  return (
    <div>

      {/* Hero Section */}
      <div style={{
        background: "#f6f8fb",
        padding: "60px 20px",
        textAlign: "center",
        borderBottom: "1px solid #eee"
      }}>
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>{title}</h1>
        {subtitle && (
          <p style={{ color: "#666", fontSize: "18px" }}>{subtitle}</p>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          padding: "50px 20px",
          lineHeight: "1.8",
          fontSize: "17px"
        }}
      >
        {children}
      </div>

    </div>
  );
};

export default StaticPageLayout;