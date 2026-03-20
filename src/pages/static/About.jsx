import StaticPageLayout from "../../layouts/StaticPageLayout";
import Section from "../../components/common/Section";

const About = () => {
  return (
    <StaticPageLayout
      title="About ServDial"
      subtitle="ServDial is a modern platform designed to help people discover reliable local service providers quickly and easily."
      cta={{
        title: "Grow your business with ServDial",
        subtitle: "Join thousands of service providers and reach more customers.",
        actions: [
          { label: "List Your Business", link: "/register", primary: true },
          { label: "Browse Services", link: "/", primary: false },
        ],
      }}
    >

      {/* INTRO */}
      <Section title="Your Trusted Local Service Directory">
        <p>
          Finding reliable service providers can be time-consuming and frustrating.
          ServDial simplifies this process by connecting you with trusted professionals
          in your city — quickly, easily, and confidently.
        </p>
      </Section>

      {/* STATS (TRUST BUILDER) */}
      <Section title="Our Growing Network">
        <div className="grid md:grid-cols-3 gap-6 mt-6 text-center">

          <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
            <h3 className="text-2xl font-bold">10,000+</h3>
            <p className="text-gray-600 text-sm mt-1">Businesses Listed</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
            <h3 className="text-2xl font-bold">50,000+</h3>
            <p className="text-gray-600 text-sm mt-1">Monthly Users</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
            <h3 className="text-2xl font-bold">100+</h3>
            <p className="text-gray-600 text-sm mt-1">Cities Covered</p>
          </div>

        </div>
      </Section>

      {/* MISSION */}
      <Section title="Our Mission">
        <p>
          Our mission is to make local service discovery simple, fast,
          and trustworthy for everyone.
        </p>

        <ul>
          <li>Help customers find verified service providers</li>
          <li>Enable businesses to grow digitally</li>
          <li>Build trust within local communities</li>
        </ul>
      </Section>

      {/* OFFERINGS */}
      <Section title="What ServDial Offers">
        <div className="grid md:grid-cols-2 gap-6 mt-6">

          <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold mb-2">For Customers</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Search services near you</li>
              <li>Browse by category and city</li>
              <li>View detailed business profiles</li>
              <li>Directly contact service providers</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold mb-2">For Businesses</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Create online business listings</li>
              <li>Reach targeted local customers</li>
              <li>Showcase services and expertise</li>
              <li>Manage leads and grow revenue</li>
            </ul>
          </div>

        </div>
      </Section>

      {/* WHY CHOOSE */}
      <Section title="Why Choose ServDial?">
        <div className="grid md:grid-cols-2 gap-6 mt-6">

          <ul className="space-y-2">
            <li>✔ Easy and fast service search</li>
            <li>✔ City-based smart listings</li>
            <li>✔ Verified and trusted businesses</li>
            <li>✔ User-friendly experience</li>
          </ul>

          <ul className="space-y-2">
            <li>✔ Direct communication with providers</li>
            <li>✔ Wide range of service categories</li>
            <li>✔ Constantly growing network</li>
            <li>✔ Reliable local discovery platform</li>
          </ul>

        </div>
      </Section>

      {/* VISION */}
      <Section title="Our Vision">
        <p>
          Our vision is to become one of the most trusted local service
          discovery platforms, helping millions of users find services
          effortlessly while empowering businesses to grow in the digital world.
        </p>
      </Section>

    </StaticPageLayout>
  );
};

export default About;