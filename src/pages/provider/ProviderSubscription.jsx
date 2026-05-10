function ProviderSubscription() {
  const plans = [
    {
      name: "Starter",
      price: "₹0",
      badge: "Free",
      features: [
        "Basic business listing",
        "Single category support",
        "Standard visibility",
        "Basic enquiry access",
      ],
      button: "Current Plan",
      active: true,
    },
    {
      name: "Growth",
      price: "₹499",
      badge: "Popular",
      features: [
        "Featured in category",
        "Priority search ranking",
        "Lead analytics dashboard",
        "WhatsApp enquiry boost",
        "Business insights",
      ],
      button: "Upgrade Now",
      active: false,
    },
    {
      name: "Professional",
      price: "₹999",
      badge: "Best Value",
      features: [
        "Homepage featured listing",
        "High visibility boost",
        "Advanced analytics",
        "Priority support",
        "Offer & promotion tools",
        "Multiple category exposure",
      ],
      button: "Upgrade Now",
      active: false,
    },
    {
      name: "Enterprise",
      price: "₹1999",
      badge: "Premium",
      features: [
        "Top homepage placement",
        "Maximum ranking priority",
        "Dedicated account support",
        "Unlimited promotions",
        "Premium verification badge",
        "Advanced lead tracking",
        "Competitor insights",
        "Early access features",
      ],
      button: "Contact Sales",
      active: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-3">
          Subscription Plans
        </h1>

        <p className="text-indigo-100 max-w-2xl">
          Upgrade your ServDial business profile to increase visibility,
          attract more leads, and grow faster.
        </p>

        <div className="flex flex-wrap gap-4 mt-6">
          <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
            🚀 Higher Rankings
          </div>

          <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
            📈 More Leads
          </div>

          <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
            ⭐ Premium Visibility
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`rounded-2xl border bg-white shadow-sm overflow-hidden transition hover:shadow-xl ${
              plan.active
                ? "border-green-500 ring-2 ring-green-200"
                : "border-gray-200"
            }`}
          >
            {/* Top */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {plan.name}
                </h2>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    plan.badge === "Popular"
                      ? "bg-orange-100 text-orange-700"
                      : plan.badge === "Best Value"
                      ? "bg-indigo-100 text-indigo-700"
                      : plan.badge === "Premium"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {plan.badge}
                </span>
              </div>

              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold">
                  {plan.price}
                </span>

                {plan.price !== "₹0" && (
                  <span className="text-gray-500 mb-1">
                    /month
                  </span>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="p-6">
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <span className="text-green-600 mt-0.5">✔</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl font-medium transition ${
                  plan.active
                    ? "bg-green-600 text-white cursor-default"
                    : plan.name === "Enterprise"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {plan.button}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Extra Section */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">
          Why Upgrade?
        </h3>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="border rounded-xl p-5">
            <div className="text-3xl mb-3">📍</div>
            <h4 className="font-semibold mb-2">
              Better Local Visibility
            </h4>
            <p className="text-sm text-gray-600">
              Rank higher in your city and category pages to get more discovery.
            </p>
          </div>

          <div className="border rounded-xl p-5">
            <div className="text-3xl mb-3">📞</div>
            <h4 className="font-semibold mb-2">
              More Customer Leads
            </h4>
            <p className="text-sm text-gray-600">
              Premium listings receive significantly higher enquiry rates.
            </p>
          </div>

          <div className="border rounded-xl p-5">
            <div className="text-3xl mb-3">⚡</div>
            <h4 className="font-semibold mb-2">
              Faster Growth
            </h4>
            <p className="text-sm text-gray-600">
              Gain trust with verified badges, featured placements, and branding tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderSubscription;