import React from "react";

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        About ServDial
      </h1>

      <p className="text-lg text-gray-600 mb-8">
        ServDial is a modern platform designed to help people discover reliable
        local service providers quickly and easily.
      </p>

      <div className="space-y-10">

        <section>
          <h2 className="text-2xl font-semibold mb-3">Your Trusted Local Service Directory</h2>
          <p className="text-gray-600 leading-relaxed">
            Whether you are looking for AC repair, electricians, plumbers,
            home cleaning, salons, appliance repair, or other professional
            services, ServDial helps you find the right service provider
            near you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            Our mission is to make local service discovery simple, fast,
            and trustworthy.
          </p>

          <ul className="list-disc ml-6 text-gray-600 space-y-2">
            <li>Customers can easily find trusted service providers</li>
            <li>Local businesses can grow their online presence</li>
            <li>Communities connect with reliable professionals</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">What ServDial Offers</h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg mb-3">For Customers</h3>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Search services near you</li>
                <li>Browse by category and city</li>
                <li>View business profiles</li>
                <li>Connect with service providers</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg mb-3">For Businesses</h3>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Online business listings</li>
                <li>Reach more customers</li>
                <li>Showcase services</li>
                <li>Business management dashboard</li>
              </ul>
            </div>

          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Why Choose ServDial?</h2>
          <ul className="list-disc ml-6 text-gray-600 space-y-2">
            <li>Easy service search</li>
            <li>City-based listings</li>
            <li>Trusted local businesses</li>
            <li>User-friendly platform</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
          <p className="text-gray-600">
            Our vision is to become one of the most trusted local service
            discovery platforms helping millions of users find services
            and enabling businesses to grow digitally.
          </p>
        </section>

      </div>

    </div>
  );
};

export default About;