// frontend/src/components/business/RoomBookingManager.jsx
import { useState } from "react";
import { BedDouble, Plus, Trash2 } from "lucide-react";


const RoomBookingManager = ({
  value = [],
  onChange,
}) => {


  const rooms = Array.isArray(value)
    ? value
    : [];



  const updateRooms = (updated) => {
    onChange?.(updated);
  };



  const addRoom = () => {

    updateRooms([
      ...rooms,

      {
        roomName:"",
        price:"",
        capacity:"",
        totalRooms:"",
        amenities:"",
      }

    ]);

  };



  const updateRoom = (
    index,
    field,
    fieldValue
  ) => {

    const updated =
      [...rooms];

    updated[index] = {
      ...updated[index],
      [field]: fieldValue,
    };


    updateRooms(updated);

  };



  const removeRoom = (index)=>{

    const updated =
      rooms.filter(
        (_,i)=>i!==index
      );

    updateRooms(updated);

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
        justify-between
        "
      >

        <div
          className="
          flex
          items-center
          gap-2
          "
        >

          <BedDouble
            size={22}
            className="text-blue-600"
          />

          <div>

            <h2
              className="
              font-bold
              text-lg
              "
            >
              Room Booking
            </h2>


            <p
              className="
              text-sm
              text-gray-500
              "
            >
              Add hotel rooms and pricing
            </p>

          </div>

        </div>



        <button

          type="button"

          onClick={addRoom}

          className="
          flex
          items-center
          gap-2
          bg-blue-600
          text-white
          px-4
          py-2
          rounded-xl
          "
        >

          <Plus size={18}/>

          Add Room

        </button>


      </div>





      {
        rooms.length === 0 && (

          <div
            className="
            text-center
            text-gray-400
            py-6
            "
          >

            No rooms added

          </div>

        )
      }





      {
        rooms.map(
          (room,index)=>(

          <div
            key={index}

            className="
            border
            rounded-xl
            p-4
            space-y-4
            "
          >


            <div
              className="
              flex
              justify-between
              "
            >

              <h3
                className="
                font-semibold
                "
              >
                Room #{index+1}
              </h3>


              <button

                type="button"

                onClick={()=>
                  removeRoom(index)
                }

                className="
                text-red-500
                "
              >

                <Trash2 size={18}/>

              </button>


            </div>





            <input

              value={
                room.roomName || ""
              }

              onChange={(e)=>
                updateRoom(
                  index,
                  "roomName",
                  e.target.value
                )
              }

              placeholder="Room Name"

              className="
              border
              rounded-xl
              p-3
              w-full
              "

            />





            <div
              className="
              grid
              md:grid-cols-3
              gap-3
              "
            >

              <input

                type="number"

                value={
                  room.price || ""
                }

                onChange={(e)=>
                  updateRoom(
                    index,
                    "price",
                    e.target.value
                  )
                }

                placeholder="Price / Night"

                className="
                border
                rounded-xl
                p-3
                "
              />



              <input

                type="number"

                value={
                  room.capacity || ""
                }

                onChange={(e)=>
                  updateRoom(
                    index,
                    "capacity",
                    e.target.value
                  )
                }

                placeholder="Guest Capacity"

                className="
                border
                rounded-xl
                p-3
                "
              />



              <input

                type="number"

                value={
                  room.totalRooms || ""
                }

                onChange={(e)=>
                  updateRoom(
                    index,
                    "totalRooms",
                    e.target.value
                  )
                }

                placeholder="Total Rooms"

                className="
                border
                rounded-xl
                p-3
                "
              />


            </div>





            <input

              value={
                room.amenities || ""
              }

              onChange={(e)=>
                updateRoom(
                  index,
                  "amenities",
                  e.target.value
                )
              }

              placeholder="Amenities (AC, TV, WiFi)"

              className="
              border
              rounded-xl
              p-3
              w-full
              "

            />



          </div>

          )
        )
      }



    </section>

  );

};


export default RoomBookingManager;