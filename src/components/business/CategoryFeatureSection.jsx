import {
  CalendarCheck,
  Utensils,
  BedDouble,
  Zap,
  Stethoscope,
  Wrench,
  Clock,
  IndianRupee,
  ShoppingBag
} from "lucide-react";

const CategoryFeatureSection = ({
    business,
    onBooking
}) => {

  const category =
    (
      business?.categoryId?.name ||
      business?.category ||
      ""
    )
    .toLowerCase();

  const isRestaurant =
    category.includes("restaurant") ||
    category.includes("cafe") ||
    category.includes("food");

  const isHotel =
    category.includes("hotel") ||
    category.includes("resort");

  const isElectrician =
    category.includes("electrician") ||
    category.includes("plumber") ||
    category.includes("repair");

  const isDoctor =
    category.includes("doctor") ||
    category.includes("clinic") ||
    category.includes("hospital");




  /*
    RESTAURANT FEATURE
  */

  if(isRestaurant){

    return (

      <section
      id="booking"
      className="
      bg-white
      rounded-2xl
      shadow
      p-5
      space-y-6
      "
      >


      <h2 className="
      text-xl
      font-bold
      flex
      items-center
      gap-2
      ">
        <Utensils size={22}/>
        Restaurant Booking
      </h2>



      <div className="
      grid
      md:grid-cols-3
      gap-4
      ">

      <FeatureCard
    icon={<CalendarCheck/>}
    title="Book Table"
    text="Reserve your table instantly"
    onClick={onBooking}
    />
 


      <FeatureCard
    icon={<ShoppingBag/>}
    title="Food Menu"
    text="View dishes and prices"
    onClick={onBooking}
/>


      <FeatureCard
    icon={<CalendarCheck/>}
    title="Party Booking"
    text="Birthday, events and functions"
    onClick={onBooking}
/>


      </div>


      </section>

    )

  }




  /*
    HOTEL FEATURE
  */


  if(isHotel){

    return (

      <section
      id="booking"
      className="
      bg-white
      rounded-2xl
      shadow
      p-5
      "
      >

      <h2 className="
      text-xl
      font-bold
      flex
      gap-2
      items-center
      ">
      <BedDouble size={22}/>
      Room Booking
      </h2>



      <div className="
      grid
      md:grid-cols-3
      gap-4
      mt-5
      ">


      <FeatureCard
      icon={<CalendarCheck/>}
      title="Check Availability"
      text="Select check-in and check-out"
      onClick={onBooking}
      />


      <FeatureCard
      icon={<BedDouble/>}
      title="Room Types"
      text="Deluxe, Premium Rooms"
      onClick={onBooking}
      />


      <FeatureCard
      icon={<IndianRupee/>}
      title="Price"
      text="Starting room rates"
      onClick={onBooking}
      />


      </div>


      </section>

    )

  }





  /*
    ELECTRICIAN / PLUMBER FEATURE
  */


  if(isElectrician){


    const services =
    business?.servicePrices || [

      {
        name:"Fan Repair",
        price:"₹200"
      },

      {
        name:"Switch Repair",
        price:"₹150"
      },

      {
        name:"Wiring Work",
        price:"₹500"
      },

      {
        name:"Installation",
        price:"₹1200"
      }

    ];



    return (

      <section
      id="pricing"
      className="
      bg-white
      rounded-xl
      shadow
      p-5
      "
      >


      <h2 className="
      text-xl
      font-bold
      flex
      items-center
      gap-2
      ">
      <Zap size={22}/>
      Service Price List
      </h2>



      <div className="mt-5 space-y-3">


      {
      services.map((item,index)=>(

      <div
      key={index}
      className="
      flex
      justify-between
      border-b
      pb-3
      "
      >

      <span>
      {item.name}
      </span>


      <span className="
      font-bold
      text-blue-600
      ">
      {item.price}
      </span>


      </div>

      ))
      }


      </div>


      </section>

    )

  }





  /*
     DOCTOR FEATURE
  */


  if(isDoctor){

    return (

      <section
      id="booking"
      className="
      bg-white
      rounded-xl
      shadow
      p-5
      "
      >

      <h2 className="
      text-xl
      font-bold
      flex
      items-center
      gap-2
      ">
      <Stethoscope size={22}/>
      Appointment Booking
      </h2>



      <div className="
      grid
      grid-cols-3
      gap-3
      mt-5
      ">


      {
      [
        "10:00 AM",
        "11:30 AM",
        "5:00 PM"
      ]
      .map((slot)=>(

        <button
        key={slot}
        onClick={onBooking}
        className="
        border
        rounded-xl
        p-3
        hover:bg-blue-50
        "
        >
        {slot}
        </button>

      ))
      }


      </div>


      </section>

    )

  }





  /*
    DEFAULT BUSINESS
  */


return (

<section
id="services"
className="
bg-white
rounded-xl
shadow
p-5
"
>


<h2 className="
text-xl
font-bold
mb-4
">
Services
</h2>


<div className="
grid
md:grid-cols-3
gap-4
">


{
(business?.services || [])
.map((service,index)=>(

<FeatureCard

key={index}

icon={<Wrench/>}

title={service.name || service}

text={service.description || "Professional service"}

 />

))

}


</div>


</section>

)


};






const FeatureCard = ({
    icon,
    title,
    text,
    onClick
}) => {


return (

<div
className="
border
rounded-xl
p-4
hover:shadow-md
transition
"
>


<div className="
text-blue-600
mb-3
">
{icon}
</div>


<h3 className="
font-semibold
">
{title}
</h3>


<p className="
text-sm
text-gray-500
mt-1
">
{text}
</p>

<button
onClick={onClick}
className="
mt-3
text-sm
text-blue-600
font-medium
"
>
Book Now
</button>


</div>

)

}



export default CategoryFeatureSection;