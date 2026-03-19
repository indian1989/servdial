import React from "react";
import StaticPageLayout from "../../layouts/StaticPageLayout";

const Disclaimer = () => {
  return (
    <StaticPageLayout
      title="Disclaimer"
      subtitle="Important information about using the ServDial platform"
    >

      <p>
        The information on <strong>ServDial</strong> is provided for general
        informational purposes only.
      </p>

      <h2>Service Listings</h2>
      <p>
        ServDial is a directory platform connecting users with service
        providers. We do not provide the services listed on the platform.
      </p>

      <h2>External Links</h2>
      <p>
        Our platform may contain links to external websites. We are not
        responsible for their content or reliability.
      </p>

      <h2>No Professional Advice</h2>
      <p>
        Information on this website should not be considered professional
        advice. Users should verify service providers independently.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        ServDial is not responsible for any losses resulting from the use
        of information on the platform.
      </p>

      <h2>Contact</h2>
      <p>
        For questions regarding this disclaimer:
      </p>

      <p>
        <strong>Email:</strong> support.servdial@gmail.com
      </p>

    </StaticPageLayout>
  );
};

export default Disclaimer;