const PartyBooking = ({
  onBooking
}) => {

  return (

    <section
      id="party-booking"
      className="
      bg-white
      rounded-2xl
      shadow
      p-6
      "
    >

      <h2 className="text-xl font-bold">
        🎉 Party Booking
      </h2>


      <p className="text-gray-600 mt-2">
        Birthday, events and functions
      </p>


      <button

        onClick={() => onBooking?.("party_booking")}

        className="
        mt-4
        bg-purple-600
        text-white
        px-5
        py-3
        rounded-xl
        hover:bg-purple-700
        "

      >
        Book Party
      </button>


    </section>

  );

};


export default PartyBooking;