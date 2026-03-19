import React from "react";
import StaticPageLayout from "../../components/layout/StaticPageLayout";

const Contact = () => {
  return (
    <StaticPageLayout title="Contact Us">

      <p>
        Thank you for using <strong>ServDial</strong>. If you have questions,
        feedback, or business inquiries, please contact us using the details below.
      </p>

      <h2>Customer Support</h2>
      <p>
        If you need help using ServDial or have issues with a listing, our support team is here.
      </p>

      <p><strong>Email:</strong> support.servdial@gmail.com</p>

      <h2>Business Inquiries</h2>
      <p>
        If you are a business owner and want to list your services or partner with ServDial,
        contact us.
      </p>

      <p><strong>Email:</strong> business.servdial@gmail.com</p>

      <h2>General Questions</h2>
      <p>
        For general questions, suggestions, or feedback, reach out anytime.
      </p>

      <p><strong>Email:</strong> info.servdial@gmail.com</p>

    </StaticPageLayout>
  );
};

export default Contact;