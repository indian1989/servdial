import React from "react";
import StaticPageLayout from "../../layouts/StaticPageLayout";
import Section from "../../components/common/Section";
import { FileText, AlertCircle } from "lucide-react";

const Terms = () => {
  return (
    <StaticPageLayout
      title="Terms & Conditions"
      subtitle="Please read these terms carefully before using our platform."
      cta={{
        title: "Have questions about these terms?",
        subtitle: "Contact our support team for clarification or concerns.",
        actions: [
          { label: "Email Support", link: "mailto:support.servdial@gmail.com", primary: true },
          { label: "Browse Services", link: "/", primary: false },
        ],
      }}
    >

      {/* ACCEPTANCE OF TERMS */}
      <Section title="Acceptance of Terms">
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm mt-4 flex items-start gap-4">
          <AlertCircle className="text-gray-700 mt-1" />
          <p className="text-gray-700 text-sm">
            By using <strong>ServDial</strong>, you agree to comply with our terms and conditions.
            Please review them carefully before using our platform.
          </p>
        </div>
      </Section>

      {/* USER RESPONSIBILITIES */}
      <Section title="User Responsibilities">
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm mt-4 text-gray-700 text-sm">
          <ul className="space-y-2">
            <li>Provide accurate and up-to-date information.</li>
            <li>Use the platform responsibly and ethically.</li>
            <li>Comply with applicable laws while interacting with service providers.</li>
          </ul>
        </div>
      </Section>

      {/* SERVICE USAGE */}
      <Section title="Service Usage">
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm mt-4 flex items-start gap-4">
          <FileText className="text-gray-700 mt-1" />
          <p className="text-gray-700 text-sm">
            ServDial provides a platform connecting users with local service providers.
            We are not directly responsible for any services offered or performed by these providers.
          </p>
        </div>
      </Section>

      {/* CHANGES TO TERMS */}
      <Section title="Changes to Terms">
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm mt-4 text-gray-700 text-sm">
          <ul className="space-y-2">
            <li>We may update these terms periodically to reflect changes in our platform or policies.</li>
            <li>Continued use of the platform after updates constitutes acceptance of the new terms.</li>
            <li>Users are encouraged to review the terms regularly.</li>
          </ul>
        </div>
      </Section>

    </StaticPageLayout>
  );
};

export default Terms;