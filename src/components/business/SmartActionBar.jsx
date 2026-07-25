import {
  Calendar,
  Utensils,
  Bed,
  Wrench,
  Stethoscope,
  DollarSign
} from "lucide-react";


const SmartActionBar = ({
  business,
  setShowLeadPopup,
  setShowBookingPopup,
}) => {

  const category =
    (
      business?.categoryId?.name ||
      business?.category ||
      ""
    ).toLowerCase();

    const uiType =
  business?.categoryId?.uiType ||
  business?.category?.uiType ||
  "service";

  let actions = [];


  // 🍽 Restaurant
if (category.includes("restaurant")) {

    actions = [
      {
        title:"Book Table",
        type:"table_booking",
        icon:<Utensils/>
      },
      {
        title:"Menu",
        type:"food_menu",
        icon:<Calendar/>
      },
      {
        title:"Party Booking",
        type:"party_booking",
        icon:<Calendar/>
      }
    ];

}


  // 🏨 Hotel
  else if (category.includes("hotel")) {

    actions = [
 {
   title:"Book Room",
   type:"room_booking",
   icon:<Bed/>
 },
 {
   title:"Check Availability",
   type:"room_booking",
   icon:<Calendar/>
 }
];
  }

  // 🩺 Doctor
  else if (
    category.includes("doctor") ||
    category.includes("clinic")
  ) {

   actions = [
  {
    title:"Book Appointment",
    type:"appointment_booking",
    icon:<Stethoscope/>
  }
];

  }


  // ⚡ Service
  else if (
    category.includes("electrician") ||
    category.includes("plumber") ||
    category.includes("repair") ||
    category.includes("service")
  ) {

    actions = [
 {
   title:"Book Service",
   type:"lead",
   icon:<Wrench/>
 },
 {
   title:"View Price",
   type:"pricing",
   icon:<DollarSign/>
 }
];

  }

  const openPrimaryAction = (action) => {

  switch(action){

    case "pricing":

      document
      .getElementById("pricing")
      ?.scrollIntoView({
        behavior:"smooth"
      });

      break;

      case "food_menu":

 document
 .getElementById("food_menu")
 ?.scrollIntoView({
    behavior:"smooth"
 });

 break;


    case "table_booking":
    case "room_booking":
    case "appointment_booking":
    case "party_booking":

      setShowBookingPopup?.(true);

      break;


    case "lead":

    default:

      setShowLeadPopup?.(true);

  }

};

  // अगर कोई action नहीं है तो component hide
  if (!actions.length) {
    return null;
  }


  return (

    <div
      className="
      bg-white
      shadow
      rounded-xl
      p-4
      flex
      gap-3
      overflow-x-auto
      "
    >

      {
        actions.map((a, i) => (

          <button
            key={i}
            onClick={() =>
 openPrimaryAction(a.type)
}
            className="
            min-w-[140px]
            border
            rounded-xl
            p-3
            flex
            flex-col
            items-center
            gap-2
            hover:bg-blue-50
            "
          >

            {a.icon}

            <span className="text-sm">
              {a.title}
            </span>

          </button>

        ))
      }

    </div>

  );

};


export default SmartActionBar;