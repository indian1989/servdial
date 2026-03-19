import React from "react";
import StaticPageLayout from "../../layouts/StaticPageLayout";

const Contact = () => {
  return (
    <StaticPageLayout
      title="Contact Us"
      subtitle="We are here to help you with any questions or inquiries"
    >

      <p>
        Thank you for using <strong>ServDial</strong>. If you have any questions,
        feedback, or business inquiries, feel free to contact us.
      </p>

      <h2>Customer Support</h2>
      <p>
        If you need help using ServDial or have issues with a service listing,
        our support team is here to assist you.
      </p>

      <p>
        <strong>Email:</strong> support.servdial@gmail.com
      </p>

      <h2>Business Inquiries</h2>
      <p>
        If you are a business owner and want to list your services or partner
        with ServDial, please contact us.
      </p>

      <p>
        <strong>Email:</strong> business.servdial@gmail.com
      </p>

      <h2>General Questions</h2>
      <p>
        For general questions, feedback, or suggestions about the platform.
      </p>

      <p>
        <strong>Email:</strong> info.servdial@gmail.com
      </p>

    </StaticPageLayout>
  );
};

export default Contact;