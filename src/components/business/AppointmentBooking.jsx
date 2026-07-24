import { Stethoscope } from "lucide-react";


const AppointmentBooking = ({
  onBooking
}) => {


  return (

    <section
      id="appointment-booking"
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

        <Stethoscope
          size={24}
          className="text-blue-600"
        />


        <h2 className="text-xl font-bold">
          Appointment Booking
        </h2>


      </div>



      <p className="
      text-gray-600
      mt-3
      ">
        Book doctor consultation appointment.
      </p>



      <button

        onClick={() => onBooking?.("appointment_booking")}

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

        Book Appointment

      </button>


    </section>

  );

};


export default AppointmentBooking;