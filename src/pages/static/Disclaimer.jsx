import StaticPageLayout from "../../layouts/StaticPageLayout";
import Section from "../../components/common/Section";
import { Mail, AlertCircle } from "lucide-react";

const Disclaimer = () => {
  return (
    <StaticPageLayout
      title="Disclaimer"
      subtitle="Important information regarding the use of the ServDial platform"
      cta={{
        title: "Questions about this disclaimer?",
        subtitle: "Contact our support team for clarification or concerns.",
        actions: [
          { label: "Email Support", link: "mailto:support.servdial@gmail.com", primary: true },
          { label: "Browse Services", link: "/", primary: false },
        ],
      }}
    >
      {/* HIGHLIGHT CARD */}
      <Section>
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm flex items-start gap-4">
          <AlertCircle className="text-gray-700 mt-1" />
          <p className="text-gray-700">
            The content on <strong>ServDial</strong> is for general informational purposes only.
            By using our platform, you agree to this disclaimer and acknowledge that
            ServDial is not liable for actions taken based on information found here.
          </p>
        </div>
      </Section>

      {/* SERVICE LISTINGS */}
      <Section title="Service Listings">
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm mt-4">
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>ServDial connects users with local service providers but does not provide the services directly.</li>
            <li>We do not guarantee the quality, reliability, or authenticity of any business or service provider.</li>
          </ul>
        </div>
      </Section>

      {/* NO WARRANTY */}
      <Section title="No Warranty">
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm mt-4">
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>All information is provided “as is” without warranties.</li>
            <li>No guarantee of accuracy or completeness.</li>
            <li>Use of services listed is at your own risk.</li>
          </ul>
        </div>
      </Section>

      {/* EXTERNAL LINKS */}
      <Section title="External Links">
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm mt-4 text-gray-700 text-sm">
          ServDial may include links to third-party websites. We do not control these sites and are not responsible for their content, privacy policies, or practices.
        </div>
      </Section>

      {/* LIABILITY */}
      <Section title="Limitation of Liability">
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm mt-4">
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>ServDial is not liable for direct, indirect, incidental, or consequential damages.</li>
            <li>Any interaction with listed service providers is at your own risk.</li>
          </ul>
        </div>
      </Section>

      {/* CONTACT */}
      <Section title="Contact for Questions">
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm mt-4 flex items-start gap-4">
          <Mail className="text-gray-700 mt-1" />
          <p className="text-gray-700">
            For questions regarding this disclaimer, reach out to us at:
            <br />
            <strong>Email:</strong> support.servdial@gmail.com
          </p>
        </div>
      </Section>

    </StaticPageLayout>
  );
};

export default Disclaimer;