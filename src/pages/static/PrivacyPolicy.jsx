import React from "react";
import StaticPageLayout from "../../layouts/StaticPageLayout";
import Section from "../../components/common/Section";
import { Mail, ShieldCheck } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <StaticPageLayout
      title="Privacy Policy"
      subtitle="Your privacy is important to us."
      cta={{
        title: "Questions about our privacy practices?",
        subtitle: "Reach out to our support team anytime.",
        actions: [
          { label: "Email Support", link: "mailto:support.servdial@gmail.com", primary: true },
          { label: "Browse Services", link: "/", primary: false },
        ],
      }}
    >

      {/* INFORMATION WE COLLECT */}
      <Section title="Information We Collect">
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm mt-4 flex items-start gap-4">
          <ShieldCheck className="text-gray-700 mt-1" />
          <p className="text-gray-700 text-sm">
            We collect basic information such as name, email, and usage data to
            improve our services and provide a better user experience.
          </p>
        </div>
      </Section>

      {/* HOW WE USE INFORMATION */}
      <Section title="How We Use Information">
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm mt-4 text-gray-700 text-sm">
          <ul className="space-y-2">
            <li>Provide and enhance our services</li>
            <li>Improve user experience and interface</li>
            <li>Communicate updates and important information</li>
          </ul>
        </div>
      </Section>

      {/* DATA PROTECTION */}
      <Section title="Data Protection">
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm mt-4 text-gray-700 text-sm">
          <p>
            We implement appropriate technical and organizational security measures
            to protect your personal information from unauthorized access or disclosure.
          </p>
        </div>
      </Section>

      {/* CONTACT */}
      <Section title="Contact Us">
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm mt-4 flex items-start gap-4">
          <Mail className="text-gray-700 mt-1" />
          <p className="text-gray-700 text-sm">
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            <strong>Email:</strong> support.servdial@gmail.com
          </p>
        </div>
      </Section>

    </StaticPageLayout>
  );
};

export default PrivacyPolicy;