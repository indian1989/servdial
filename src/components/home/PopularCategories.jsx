// src/components/home/PopularCategories.jsx
import electricianIcon from "../../assets/icons/electrician.png";
import plumberIcon from "../../assets/icons/plumber.png";
import painterIcon from "../../assets/icons/painter.png";
import acRepairIcon from "../../assets/icons/ac-repair.png";
import carRepairIcon from "../../assets/icons/car-repair.png";
import bikeRepairIcon from "../../assets/icons/bike-repair.png";
import hotelIcon from "../../assets/icons/hotels.png";
import restaurantIcon from "../../assets/icons/restaurant.png";
import eventManagementIcon from "../../assets/icons/event-management.png";
import weddingPlannerIcon from "../../assets/icons/wedding-planner.png";
import schoolIcon from "../../assets/icons/school.png";
import coachingIcon from "../../assets/icons/coaching.png";
import gymIcon from "../../assets/icons/gym.png";
import hospitalIcon from "../../assets/icons/hospital.png";
import salonIcon from "../../assets/icons/salon.png";
import interiorDesignerIcon from "../../assets/icons/interior-designer.png";
import realEstateIcon from "../../assets/icons/real-estate.png";
import packersMoversIcon from "../../assets/icons/packers-movers.png";
import courierServiceIcon from "../../assets/icons/courier-service.png";
import digitalMarketingIcon from "../../assets/icons/digital-marketing.png";

const categories = [
  { name: "Electrician", image: electricianIcon },
  { name: "Plumber", image: plumberIcon },
  { name: "Painter", image: painterIcon },
  { name: "AC Repair", image: acRepairIcon },
  { name: "Car Repair", image: carRepairIcon },
  { name: "Bike Repair", image: bikeRepairIcon },
  { name: "Hotel", image: hotelIcon },
  { name: "Restaurant", image: restaurantIcon },
  { name: "Event Management", image: eventManagementIcon },
  { name: "Wedding Planner", image: weddingPlannerIcon },
  { name: "School", image: schoolIcon },
  { name: "Coaching", image: coachingIcon },
  { name: "Gym", image: gymIcon },
  { name: "Hospital", image: hospitalIcon },
  { name: "Salon", image: salonIcon },
  { name: "Interior Designer", image: interiorDesignerIcon },
  { name: "Real Estate", image: realEstateIcon },
  { name: "Packers Movers", image: packersMoversIcon },
  { name: "Courier Service", image: courierServiceIcon },
  { name: "Digital Marketing", image: digitalMarketingIcon },
];

const PopularCategories = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-10">
          Popular Categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer group"
              aria-label={`Category: ${category.name}`}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-12 h-12 md:w-14 md:h-14 object-contain"
                />
              </div>

              <p className="text-sm text-center mt-3 font-medium text-gray-700 group-hover:text-blue-600 transition">
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;