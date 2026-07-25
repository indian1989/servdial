// frontend/src/components/business/RestaurantBookingManager.jsx
import { useState } from "react";
import { Utensils, CheckCircle } from "lucide-react";


const RestaurantBookingManager = ({
  value = {},
  onChange,
}) => {


  const booking =
    value || {
      enabled:false,
      totalTables:"",
      seatingCapacity:"",
      advanceBookingDays:"",
    };



  const update = (field, val)=>{

    const updated = {
      ...booking,
      [field]:val,
    };


    onChange?.(updated);

  };



  return (

    <section
      className="
      bg-white
      border
      rounded-2xl
      p-5
      space-y-5
      "
    >


      {/* HEADER */}

      <div
        className="
        flex
        items-center
        gap-2
        "
      >

        <Utensils
          size={22}
          className="text-green-600"
        />


        <div>

          <h2
            className="
            text-lg
            font-bold
            "
          >
            Table Booking
          </h2>


          <p
            className="
            text-sm
            text-gray-500
            "
          >
            Configure restaurant reservation
          </p>

        </div>

      </div>





      {/* ENABLE */}

      <label
        className="
        flex
        items-center
        gap-3
        cursor-pointer
        "
      >

        <input

          type="checkbox"

          checked={
            booking.enabled || false
          }

          onChange={(e)=>
            update(
              "enabled",
              e.target.checked
            )
          }

        />


        <span
          className="
          flex
          items-center
          gap-2
          "
        >

          <CheckCircle
            size={18}
            className="text-green-600"
          />

          Enable Table Booking

        </span>


      </label>





      {
        booking.enabled && (

          <div
            className="
            grid
            md:grid-cols-3
            gap-4
            "
          >


            <input

              type="number"

              value={
                booking.totalTables || ""
              }

              onChange={(e)=>
                update(
                  "totalTables",
                  e.target.value
                )
              }

              placeholder="Total Tables"

              className="
              border
              rounded-xl
              p-3
              "
            />



            <input

              type="number"

              value={
                booking.seatingCapacity || ""
              }

              onChange={(e)=>
                update(
                  "seatingCapacity",
                  e.target.value
                )
              }

              placeholder="Seating Capacity"

              className="
              border
              rounded-xl
              p-3
              "
            />



            <input

              type="number"

              value={
                booking.advanceBookingDays || ""
              }

              onChange={(e)=>
                update(
                  "advanceBookingDays",
                  e.target.value
                )
              }

              placeholder="Advance Booking Days"

              className="
              border
              rounded-xl
              p-3
              "
            />


          </div>

        )
      }



    </section>

  );

};


export default RestaurantBookingManager;