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
        title: "Book Table",
        icon: <Utensils />
      },
      {
        title: "Menu",
        icon: <Calendar />
      },
      {
        title: "Party Booking",
        icon: <Calendar />
      }
    ];

  }


  // 🏨 Hotel
  else if (category.includes("hotel")) {

    actions = [
      {
        title: "Book Room",
        icon: <Bed />
      },
      {
        title: "Check Availability",
        icon: <Calendar />
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
        title: "Book Appointment",
        icon: <Stethoscope />
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
        title: "Book Service",
        icon: <Wrench />
      },
      {
        title: "View Price",
        icon: <DollarSign />
      }
    ];

  }

  const openPrimaryAction = () => {

  if (
    ["restaurant", "hotel", "appointment"].includes(uiType)
  ) {

    setShowBookingPopup?.(true);

  } else {

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
            onClick={openPrimaryAction}
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