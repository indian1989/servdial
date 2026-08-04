import StaticPageLayout from "../../layouts/StaticPageLayout";
import Section from "../../components/common/Section";

const Advertise = () => {
  return (
    <StaticPageLayout
      title="Advertise Your Business on ServDial"
      subtitle="Reach customers who are actively searching for local services in their city."
      cta={{
        title: "Grow your business with ServDial",
        subtitle:
          "Get more visibility, attract local customers, and build your digital presence.",
        actions: [
          {
            label: "List Your Business",
            link: "/register",
            primary: true,
          },
          {
            label: "Contact Us",
            link: "/contact",
            primary: false,
          },
        ],
      }}
    >

      {/* INTRO */}

      <Section title="Connect Your Business With Local Customers">

        <p>
          ServDial helps businesses get discovered by customers searching for
          reliable services nearby. Whether you are an electrician, restaurant,
          salon, repair professional, hotel, or any local service provider,
          ServDial helps you showcase your business where customers are already
          looking.
        </p>

      </Section>


      {/* BENEFITS */}

      <Section title="Why Advertise on ServDial?">

        <div className="grid md:grid-cols-2 gap-6 mt-6">

          {[
            {
              title:"Reach High-Intent Customers",
              text:"Connect with users actively searching for services in your city."
            },
            {
              title:"Increase Online Visibility",
              text:"Make your business easier to find through category and city-based listings."
            },
            {
              title:"Generate More Leads",
              text:"Receive direct inquiries from customers interested in your services."
            },
            {
              title:"Build Customer Trust",
              text:"Showcase your services, reviews, images, and business information."
            }

          ].map((item)=>(
            <div
            key={item.title}
            className="
            bg-gray-50
            rounded-xl
            p-6
            shadow-sm
            "
            >

              <h3 className="font-semibold text-lg mb-2">
                {item.title}
              </h3>

              <p className="text-gray-600 text-sm">
                {item.text}
              </p>

            </div>
          ))}

        </div>

      </Section>



      {/* AD OPTIONS */}

      <Section title="Advertising & Promotion Options">

        <div className="grid md:grid-cols-3 gap-6 mt-6">


          <div className="bg-gray-50 rounded-xl p-6">

            <h3 className="font-semibold mb-3">
              Featured Listings
            </h3>

            <ul className="text-sm text-gray-600 space-y-2">

              <li>✔ Higher visibility in search results</li>
              <li>✔ Featured business badge</li>
              <li>✔ More customer attention</li>

            </ul>

          </div>



          <div className="bg-gray-50 rounded-xl p-6">

            <h3 className="font-semibold mb-3">
              Local Targeting
            </h3>

            <ul className="text-sm text-gray-600 space-y-2">

              <li>✔ City-based promotion</li>
              <li>✔ Category-focused audience</li>
              <li>✔ Reach relevant customers</li>

            </ul>

          </div>




          <div className="bg-gray-50 rounded-xl p-6">

            <h3 className="font-semibold mb-3">
              Business Promotion
            </h3>

            <ul className="text-sm text-gray-600 space-y-2">

              <li>✔ Showcase your services</li>
              <li>✔ Add business images</li>
              <li>✔ Highlight your expertise</li>

            </ul>

          </div>


        </div>

      </Section>



      {/* WHO CAN ADVERTISE */}

      <Section title="Who Can Advertise on ServDial?">

        <p>
          ServDial is designed for businesses across multiple categories,
          including electricians, plumbers, restaurants, hotels, salons,
          cleaning services, AC repair professionals, appliance repair shops,
          healthcare providers, and many more local businesses.
        </p>

      </Section>



      {/* HOW IT WORKS */}

      <Section title="How It Works">

        <div className="grid md:grid-cols-3 gap-6 mt-6">


          <div className="bg-gray-50 p-6 rounded-xl text-center">

            <h3 className="font-bold text-lg">
              1. Create Listing
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              Add your business details, services, location, and contact information.
            </p>

          </div>



          <div className="bg-gray-50 p-6 rounded-xl text-center">

            <h3 className="font-bold text-lg">
              2. Get Visibility
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              Your business appears when customers search relevant services.
            </p>

          </div>



          <div className="bg-gray-50 p-6 rounded-xl text-center">

            <h3 className="font-bold text-lg">
              3. Receive Customers
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              Customers can directly contact your business.
            </p>

          </div>


        </div>

      </Section>



      {/* CTA */}

      <Section title="Start Growing Your Business Today">

        <p>
          Join ServDial and create your online business presence. Reach more
          customers, increase visibility, and grow your local business digitally.
        </p>


        <p className="mt-4">

          <strong>Email:</strong>{" "}
          business.servdial@gmail.com

        </p>


      </Section>


    </StaticPageLayout>
  );
};


export default Advertise;