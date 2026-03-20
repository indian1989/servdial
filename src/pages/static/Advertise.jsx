import StaticPageLayout from "../../layouts/StaticPageLayout";
import Section from "../../components/common/Section";

const Advertise = () => {
  return (
    <StaticPageLayout
      title="Advertise With Us"
      subtitle="Promote your business and reach more customers on ServDial."
      cta={{
        title: "Start growing your business today",
        subtitle: "Join ServDial and connect with customers actively searching for your services.",
        actions: [
          { label: "List Your Business", link: "/register", primary: true },
          { label: "Contact Us", link: "/contact", primary: false },
        ],
      }}
    >

      <Section>
        <p>
          Grow your business with <strong>ServDial</strong>. Our platform connects
          users with trusted local service providers every day. Advertising on
          ServDial helps your business reach customers who are actively searching
          for services in their city.
        </p>
      </Section>

      <Section title="Why Advertise on ServDial?">
        <ul>
          <li>Reach customers actively searching for services</li>
          <li>Increase your business visibility online</li>
          <li>Build trust with potential customers</li>
          <li>Generate more leads and inquiries</li>
        </ul>
      </Section>

      <Section title="Advertising Opportunities">
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
            <h3>Premium Visibility</h3>
            <ul>
              <li>Featured business listings</li>
              <li>Top placement in search results</li>
              <li>Homepage featured businesses</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
            <h3>Targeted Promotion</h3>
            <ul>
              <li>Category page promotions</li>
              <li>City-based targeting</li>
              <li>Reach relevant customers</li>
            </ul>
          </div>

        </div>
      </Section>

      <Section title="Who Can Advertise?">
        <p>
          Local businesses and service providers such as electricians, plumbers,
          AC repair technicians, salons, cleaning services, and appliance repair
          professionals can promote their services on ServDial.
        </p>
      </Section>

      <Section title="Get Started">
        <p>
          If you want to promote your business and reach more customers, contact us:
        </p>

        <p>
          <strong>Email:</strong> business.servdial@gmail.com
        </p>
      </Section>

    </StaticPageLayout>
  );
};

export default Advertise;