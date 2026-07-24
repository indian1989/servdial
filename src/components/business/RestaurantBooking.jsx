const RestaurantBooking = ({
  onBooking,
}) => {


  return (

    <section
      className="
      bg-white
      rounded-2xl
      shadow
      p-6
      "
    >


      <h2 className="
      text-xl
      font-bold
      ">
        🍽 Reserve a Table
      </h2>


      <p className="
      mt-2
      text-gray-600
      ">
        Book your table instantly.
      </p>



      <button

        onClick={() => onBooking?.("table_booking")}

        className="
        mt-5
        bg-green-600
        text-white
        px-6
        py-3
        rounded-xl
        hover:bg-green-700
        transition
        "

      >
        Book Table
      </button>


    </section>

  );

};


export default RestaurantBooking;