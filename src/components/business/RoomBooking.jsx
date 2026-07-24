import { BedDouble } from "lucide-react";


const RoomBooking = ({
  onBooking
}) => {


  return (

    <section
      id="room-booking"
      className="
      bg-white
      rounded-2xl
      shadow
      p-6
      "
    >


      <div className="
      flex
      items-center
      gap-2
      ">


        <BedDouble
          size={24}
          className="text-blue-600"
        />


        <h2 className="text-xl font-bold">
          Room Booking
        </h2>


      </div>



      <p className="
      text-gray-600
      mt-3
      ">
        Check availability and reserve rooms.
      </p>



      <button

        onClick={() => onBooking?.("room_booking")}

        className="
        mt-5
        bg-blue-600
        text-white
        px-6
        py-3
        rounded-xl
        hover:bg-blue-700
        "

      >

        Book Room

      </button>



    </section>

  );

};


export default RoomBooking;