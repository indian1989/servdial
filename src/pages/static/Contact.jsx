import StaticPageLayout from "../../layouts/StaticPageLayout";
import Section from "../../components/common/Section";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

const Contact = () => {

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: connect API
    console.log(form);

    alert("Message sent successfully!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <StaticPageLayout
      title="Contact ServDial"
      subtitle="We’re here to help you. Reach out for support, business queries, or partnerships."
      cta={{
        title: "Need quick help?",
        subtitle: "Our support team typically responds within 24 hours.",
        actions: [
          { label: "Email Support", link: "mailto:support.servdial@gmail.com", primary: true },
          { label: "Browse Services", link: "/", primary: false },
        ],
      }}
    >

      {/* CONTACT CARDS */}
      <Section title="Get in Touch">
        <div className="grid md:grid-cols-3 gap-6 mt-6">

          <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-center">
            <Mail className="mx-auto mb-3" />
            <h3 className="font-semibold">Email</h3>
            <p className="text-sm text-gray-600">
              support.servdial@gmail.com
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-center">
            <Phone className="mx-auto mb-3" />
            <h3 className="font-semibold">Phone</h3>
            <p className="text-sm text-gray-600">
              +91 6200152506
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-center">
            <MapPin className="mx-auto mb-3" />
            <h3 className="font-semibold">Location</h3>
            <p className="text-sm text-gray-600">
              India
            </p>
          </div>

        </div>
      </Section>

      {/* CONTACT FORM */}
      <Section title="Send Us a Message">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mt-6 space-y-4"
        >

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
            rows="5"
            className="w-full border p-3 rounded-lg"
          />

          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            Send Message
          </button>

        </form>
      </Section>

      {/* SUPPORT HOURS */}
      <Section title="Support Hours">
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm mt-4">
          <ul className="space-y-1 text-sm text-gray-700">
            <li>Monday – Saturday: 9:00 AM – 7:00 PM</li>
            <li>Sunday: Closed</li>
          </ul>
        </div>
      </Section>

      {/* BUSINESS SECTION */}
      <Section title="Business & Partnerships">
        <p>
          Want to partner with ServDial or promote your services?
          We offer advertising and growth solutions for local businesses.
        </p>
      </Section>

    </StaticPageLayout>
  );
};

export default Contact;