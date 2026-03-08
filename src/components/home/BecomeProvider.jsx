import { Store, Users, TrendingUp, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BecomeProvider = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Store,
      title: "List Your Business",
      description:
        "Create your business profile and showcase your services to thousands of local customers."
    },
    {
      icon: Users,
      title: "Get More Customers",
      description:
        "Reach people searching for services in your city and grow your customer base."
    },
    {
      icon: TrendingUp,
      title: "Boost Your Visibility",
      description:
        "Upgrade to premium listing and appear at the top of search results."
    },
    {
      icon: MapPin,
      title: "Local Discovery",
      description:
        "Customers nearby can easily find your business using GPS-based search."
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 mt-20">

      {/* MAIN CTA CARD */}
      <div className="bg-blue-600 text-white rounded-2xl p-10 relative overflow-hidden">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">
            Grow Your Business with ServDial
          </h2>

          <p className="mt-2 text-blue-100">
            Join thousands of businesses already connecting with local customers.
          </p>
        </div>

        {/* BENEFITS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <div
                key={index}
                className="bg-white text-gray-800 rounded-xl p-5 hover:shadow-lg transition"
              >

                {/* ICON */}
                <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg mb-3">
                  <Icon className="text-blue-600" size={20} />
                </div>

                {/* TITLE */}
                <h3 className="font-semibold mb-1">
                  {benefit.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-500">
                  {benefit.description}
                </p>

              </div>
            );
          })}

        </div>

        {/* CTA BUTTON */}
        <div className="text-center">

          <button
            onClick={() => navigate("/register?role=provider")}
            className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Register Your Business
          </button>

        </div>

      </div>

    </section>
  );
};

export default BecomeProvider;