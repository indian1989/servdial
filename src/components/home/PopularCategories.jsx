// src/components/home/PopularCategories.jsx
import electricianIcon from "../../assets/icons/electrician.png";

const categories = [
  { name: "Electrician", image: electricianIcon },
  { name: "Plumber", image: "https://cdn-icons-png.flaticon.com/512/2966/2966489.png" },
  { name: "Painter", image: "https://cdn-icons-png.flaticon.com/512/1995/1995527.png" },
  { name: "AC Repair", image: "https://cdn-icons-png.flaticon.com/512/1532/1532556.png" },
  { name: "Car Repair", image: "https://cdn-icons-png.flaticon.com/512/743/743007.png" },
  { name: "Bike Repair", image: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png" },
  { name: "Restaurant", image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" },
  { name: "Event Management", image: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png" },
  { name: "Wedding Planner", image: "https://cdn-icons-png.flaticon.com/512/2936/2936886.png" },
  { name: "School", image: "https://cdn-icons-png.flaticon.com/512/3135/3135755.png" },
  { name: "Coaching", image: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png" },
  { name: "Gym", image: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png" },
  { name: "Hospital", image: "https://cdn-icons-png.flaticon.com/512/2967/2967350.png" },
  { name: "Salon", image: "https://cdn-icons-png.flaticon.com/512/2965/2965567.png" },
  { name: "Interior Designer", image: "https://cdn-icons-png.flaticon.com/512/1046/1046786.png" },
  { name: "Real Estate", image: "https://cdn-icons-png.flaticon.com/512/1483/1483336.png" },
  { name: "Packers Movers", image: "https://cdn-icons-png.flaticon.com/512/1046/1046858.png" },
  { name: "Courier Service", image: "https://cdn-icons-png.flaticon.com/512/2920/2920050.png" },
  { name: "Digital Marketing", image: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png" },
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