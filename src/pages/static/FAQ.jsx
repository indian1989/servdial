import React, { useState } from "react";
import StaticPageLayout from "../../layouts/StaticPageLayout";
import Section from "../../components/common/Section";
import { HelpCircle } from "lucide-react";

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gray-50 p-4 rounded-xl shadow-sm mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between w-full items-center text-gray-700 font-medium"
      >
        <span>{question}</span>
        <span className="text-gray-500">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="mt-2 text-gray-600 text-sm">{answer}</p>}
    </div>
  );
};

const FAQ = () => {
  const userFAQs = [
    {
      question: "How do I find a service provider near me?",
      answer: "Use the search bar or browse by category and city to find local businesses quickly.",
    },
    {
      question: "Can I contact a service provider directly?",
      answer: "Yes, each business profile contains contact details such as phone number and email.",
    },
    {
      question: "Are the service providers verified?",
      answer: "We strive to list trusted local providers, but users should verify credentials before hiring.",
    },
    {
      question: "Do I need an account to use ServDial?",
      answer: "No, browsing services is free. Creating an account is only required for posting reviews or managing your profile.",
    },
  ];

  const providerFAQs = [
    {
      question: "How do I list my business on ServDial?",
      answer: "Click 'List Your Business' in the top menu, fill out the registration form, and submit for approval.",
    },
    {
      question: "Is there a fee to list my business?",
      answer: "Basic listings are free. Premium listings and advertising options are available for enhanced visibility.",
    },
    {
      question: "How can I update my business information?",
      answer: "Once approved, you can manage your listing and update details from your dashboard.",
    },
    {
      question: "Can I promote special offers or discounts?",
      answer: "Yes, you can add promotions in your business dashboard or opt for featured listing packages.",
    },
  ];

  return (
    <StaticPageLayout
      title="Frequently Asked Questions (FAQ)"
      subtitle="Find answers to common questions from users and service providers."
      cta={{
        title: "Still have questions?",
        subtitle: "Contact our support team for additional help.",
        actions: [
          { label: "Email Support", link: "mailto:support.servdial@gmail.com", primary: true },
          { label: "Browse Services", link: "/", primary: false },
        ],
      }}
    >

      {/* Users FAQ */}
      <Section title="User FAQs">
        <p className="text-gray-700 text-sm mb-4">
          Answers to the most common questions from users of ServDial.
        </p>
        {userFAQs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </Section>

      {/* Providers FAQ */}
      <Section title="Service Provider FAQs">
        <p className="text-gray-700 text-sm mb-4">
          Answers to frequently asked questions by service providers listing on ServDial.
        </p>
        {providerFAQs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </Section>

    </StaticPageLayout>
  );
};

export default FAQ;