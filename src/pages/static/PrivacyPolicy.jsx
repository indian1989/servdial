import React from "react";
import StaticPageLayout from "../../layouts/StaticPageLayout";

const PrivacyPolicy = () => {
  return (
    <StaticPageLayout
      title="Privacy Policy"
      subtitle="How ServDial collects, uses, and protects your information"
    >

      <p>
        At <strong>ServDial</strong>, we respect your privacy and are committed
        to protecting your personal information.
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li>Name and contact details</li>
        <li>Email address</li>
        <li>Business information submitted by service providers</li>
        <li>Usage data such as search queries and visited pages</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>Provide and improve our services</li>
        <li>Connect users with service providers</li>
        <li>Respond to inquiries and support requests</li>
        <li>Improve platform functionality</li>
      </ul>

      <h2>Information Sharing</h2>
      <p>
        ServDial does not sell or rent personal data. Business information
        submitted by providers may be displayed publicly as part of listings.
      </p>

      <h2>Cookies</h2>
      <p>
        We may use cookies to enhance user experience and analyze website usage.
      </p>

      <h2>Data Security</h2>
      <p>
        We implement appropriate security measures to protect your data.
      </p>

      <h2>Contact</h2>
      <p>
        For questions regarding this policy:
      </p>

      <p>
        <strong>Email:</strong> support.servdial@gmail.com
      </p>

    </StaticPageLayout>
  );
};

export default PrivacyPolicy;