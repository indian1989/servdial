import {
  Utensils,
  Hotel,
  Stethoscope,
  GraduationCap,
  Wrench,
  Home,
  Car,
  ShoppingBag,
  Dumbbell,
  Scissors,
  Laptop,
  Camera,
  HeartHandshake,
  Dog,
  Truck,
  Building2,
  Paintbrush,
  Phone,
  Plane,
  Baby,
  Music,
  Flower,
  ShieldCheck,
  MapPin
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const CategoriesGrid = ({ city }) => {
  const navigate = useNavigate();

  const categories = [
    { name: "Restaurants", icon: Utensils },
    { name: "Hotels", icon: Hotel },
    { name: "Hospitals", icon: Stethoscope },
    { name: "Schools", icon: GraduationCap },
    { name: "Plumbers", icon: Wrench },
    { name: "Real Estate", icon: Home },
    { name: "Car Repair", icon: Car },
    { name: "Shopping", icon: ShoppingBag },
    { name: "Gyms", icon: Dumbbell },
    { name: "Beauty Salons", icon: Scissors },
    { name: "IT Services", icon: Laptop },
    { name: "Photography", icon: Camera },
    { name: "NGO Services", icon: HeartHandshake },
    { name: "Pet Shops", icon: Dog },
    { name: "Transport", icon: Truck },
    { name: "Construction", icon: Building2 },
    { name: "Painters", icon: Paintbrush },
    { name: "Mobile Repair", icon: Phone },
    { name: "Travel Agents", icon: Plane },
    { name: "Baby Care", icon: Baby },
    { name: "Music Classes", icon: Music },
    { name: "Florists", icon: Flower },
    { name: "Security Services", icon: ShieldCheck },
    { name: "Local Services", icon: MapPin }
  ];

  const handleCategoryClick = (category) => {
    navigate(`/search?q=${category}&city=${city}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 mt-12">

      {/* TITLE */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">
          Explore Popular Services
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Find trusted local businesses near you
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">

        {categories.map((cat, index) => {
          const Icon = cat.icon;

          return (
            <div
              key={index}
              onClick={() => handleCategoryClick(cat.name)}
              className="flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all group"
            >

              {/* ICON */}
              <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition">
                <Icon size={26} className="text-blue-600" />
              </div>

              {/* NAME */}
              <span className="text-xs text-center mt-2 font-medium">
                {cat.name}
              </span>

            </div>
          );
        })}

      </div>
    </section>
  );
};

export default CategoriesGrid;