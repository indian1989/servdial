import { useNavigate } from "react-router-dom";

import restaurants from "../../assets/icons/restaurants.png";
import hotels from "../../assets/icons/hotels.png";
import hospitals from "../../assets/icons/hospitals.png";
import schools from "../../assets/icons/schools.png";
import plumbers from "../../assets/icons/plumbers.png";
import realestate from "../../assets/icons/realestate.png";
import carrepair from "../../assets/icons/carrepair.png";
import shopping from "../../assets/icons/shopping.png";
import gyms from "../../assets/icons/gyms.png";
import salons from "../../assets/icons/salons.png";
import itservices from "../../assets/icons/itservices.png";
import photography from "../../assets/icons/photography.png";
import ngos from "../../assets/icons/ngos.png";
import pets from "../../assets/icons/pets.png";
import transport from "../../assets/icons/transport.png";
import construction from "../../assets/icons/construction.png";
import painters from "../../assets/icons/painters.png";
import mobilerepair from "../../assets/icons/mobilerepair.png";
import travel from "../../assets/icons/travel.png";
import babycare from "../../assets/icons/babycare.png";
import music from "../../assets/icons/music.png";
import florists from "../../assets/icons/florists.png";
import security from "../../assets/icons/security.png";
import localservices from "../../assets/icons/localservices.png";

const CategoriesGrid = ({ city }) => {
  const navigate = useNavigate();

  const categories = [
    { name: "Restaurants", icon: restaurants },
    { name: "Hotels", icon: hotels },
    { name: "Hospitals", icon: hospitals },
    { name: "Schools", icon: schools },
    { name: "Plumbers", icon: plumbers },
    { name: "Real Estate", icon: realestate },
    { name: "Car Repair", icon: carrepair },
    { name: "Shopping", icon: shopping },
    { name: "Gyms", icon: gyms },
    { name: "Beauty Salons", icon: salons },
    { name: "IT Services", icon: itservices },
    { name: "Photography", icon: photography },
    { name: "NGO Services", icon: ngos },
    { name: "Pet Shops", icon: pets },
    { name: "Transport", icon: transport },
    { name: "Construction", icon: construction },
    { name: "Painters", icon: painters },
    { name: "Mobile Repair", icon: mobilerepair },
    { name: "Travel Agents", icon: travel },
    { name: "Baby Care", icon: babycare },
    { name: "Music Classes", icon: music },
    { name: "Florists", icon: florists },
    { name: "Security Services", icon: security },
    { name: "Local Services", icon: localservices }
  ];

  const handleCategoryClick = (category) => {
    navigate(`/search?q=${category}&city=${city}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 mt-12">
      
      {/* TITLE */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Explore Popular Services</h2>
        <p className="text-gray-500 text-sm mt-1">
          Find trusted local businesses near you
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">

        {categories.map((cat, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(cat.name)}
            className="flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all group"
          >

            {/* IMAGE ICON */}
            <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition">
              <img
                src={cat.icon || "/default-icon.png"}
                alt={cat.name}
                className="w-10 h-10 object-contain"
              />
            </div>

            {/* NAME */}
            <span className="text-xs text-center mt-2 font-medium">
              {cat.name}
            </span>

          </div>
        ))}

      </div>
    </section>
  );
};

export default CategoriesGrid;