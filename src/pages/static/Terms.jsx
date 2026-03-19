import React from "react";
import StaticPageLayout from "../../layouts/StaticPageLayout";

const Terms = () => {
  return (
    <StaticPageLayout
      title="Terms and Conditions"
      subtitle="Rules and guidelines for using ServDial"
    >

      <p>
        By accessing or using <strong>ServDial</strong>, you agree to follow
        these Terms and Conditions.
      </p>

      <h2>Use of the Platform</h2>
      <p>
        ServDial helps users discover local service providers. We do not
        directly provide services listed on the platform.
      </p>

      <h2>User Responsibilities</h2>
      <ul>
        <li>Provide accurate information</li>
        <li>Use the platform for lawful purposes</li>
        <li>Respect other users and businesses</li>
      </ul>

      <h2>Business Listings</h2>
      <p>
        Businesses may submit listings on ServDial. We reserve the right to
        approve, modify, or remove listings.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        ServDial is not responsible for the performance or reliability of
        services offered by listed businesses.
      </p>

      <h2>Contact</h2>
      <p>
        For questions regarding these terms:
      </p>

      <p>
        <strong>Email:</strong> support.servdial@gmail.com
      </p>

    </StaticPageLayout>
  );
};

export default Terms;