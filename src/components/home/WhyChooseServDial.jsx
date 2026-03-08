import {
  ShieldCheck,
  MapPin,
  PhoneCall,
  Star,
  Clock,
  BadgeCheck,
} from "lucide-react";

const WhyChooseServDial = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: "Verified Businesses",
      description:
        "All listed businesses go through a verification process to ensure reliability and trust."
    },
    {
      icon: MapPin,
      title: "Location Based Results",
      description:
        "Find services near you using GPS based city detection and location filters."
    },
    {
      icon: PhoneCall,
      title: "Instant Call & WhatsApp",
      description:
        "Contact businesses instantly via direct phone call or WhatsApp chat."
    },
    {
      icon: Star,
      title: "Real Customer Reviews",
      description:
        "Make better decisions using authentic customer ratings and reviews."
    },
    {
      icon: Clock,
      title: "Fast Search Experience",
      description:
        "Lightning fast search results help you discover services in seconds."
    },
    {
      icon: BadgeCheck,
      title: "Premium Verified Listings",
      description:
        "Top businesses can get featured placements to increase visibility and trust."
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 mt-20">

      {/* TITLE */}
      <div className="text-center mb-12">

        <h2 className="text-2xl md:text-3xl font-bold">
          Why Choose ServDial
        </h2>

        <p className="text-gray-500 mt-2 text-sm md:text-base">
          ServDial helps you discover trusted local businesses quickly and easily.
        </p>

      </div>

      {/* FEATURES GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div
              key={index}
              className="border rounded-xl p-6 hover:shadow-lg transition-all bg-white group"
            >

              {/* ICON */}
              <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg mb-4 group-hover:bg-blue-100 transition">

                <Icon className="text-blue-600" size={24} />

              </div>

              {/* TITLE */}
              <h3 className="font-semibold text-lg mb-2">
                {feature.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>

            </div>
          );
        })}

      </div>
    </section>
  );
};

export default WhyChooseServDial;