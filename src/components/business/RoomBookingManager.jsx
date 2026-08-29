// frontend/src/components/business/RoomBookingManager.jsx

import { useMemo } from "react";
import {
  BedDouble,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const DEFAULT_VALUE = {
  enabled: false,
  roomTypes: [],
  checkInTime: "",
  checkOutTime: "",
  advanceBookingDays: "",
  contactNumber: "",
  notes: "",
};

const RoomBookingManager = ({
  value = DEFAULT_VALUE,
  onChange,
}) => {
  /*
  =========================================================
  NORMALIZE VALUE
  =========================================================
  */

  const booking = useMemo(() => {
    /*
    Backward compatibility:
    Agar purana data direct array ke form mein aa gaya ho,
    to usko roomTypes ke andar preserve karenge.
    */

    if (Array.isArray(value)) {
      return {
        ...DEFAULT_VALUE,
        enabled: value.length > 0,
        roomTypes: value,
      };
    }

    return {
      ...DEFAULT_VALUE,
      ...(value || {}),
      roomTypes: Array.isArray(value?.roomTypes)
        ? value.roomTypes
        : [],
    };
  }, [value]);

  const rooms = booking.roomTypes;


  /*
  =========================================================
  UPDATE BOOKING
  =========================================================
  */

  const updateBooking = (updates) => {
    onChange?.({
      ...booking,
      ...updates,
    });
  };


  /*
  =========================================================
  ENABLE / DISABLE
  =========================================================
  */

  const toggleBooking = () => {
    const nextEnabled = !booking.enabled;

    updateBooking({
      enabled: nextEnabled,
    });
  };


  /*
  =========================================================
  ADD ROOM
  =========================================================
  */

  const addRoom = () => {
    const newRoom = {
      roomName: "",
      price: "",
      capacity: "",
      totalRooms: "",
      amenities: "",
    };

    updateBooking({
      enabled: true,
      roomTypes: [
        ...rooms,
        newRoom,
      ],
    });
  };


  /*
  =========================================================
  UPDATE ROOM
  =========================================================
  */

  const updateRoom = (
    index,
    field,
    fieldValue
  ) => {
    const updatedRooms = [...rooms];

    updatedRooms[index] = {
      ...updatedRooms[index],
      [field]: fieldValue,
    };

    updateBooking({
      roomTypes: updatedRooms,
    });
  };


  /*
  =========================================================
  REMOVE ROOM
  =========================================================
  */

  const removeRoom = (index) => {
    const updatedRooms =
      rooms.filter(
        (_, i) => i !== index
      );

    updateBooking({
      roomTypes: updatedRooms,
    });
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

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              w-11
              h-11
              rounded-xl
              bg-blue-50
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <BedDouble
              size={23}
              className="text-blue-600"
            />
          </div>

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
              Manage hotel rooms, pricing and
              booking information
            </p>

          </div>

        </div>


        {/* =================================================
            ENABLE / DISABLE BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={toggleBooking}
          aria-pressed={booking.enabled}
          className={`
            inline-flex
            items-center
            justify-center
            gap-2
            px-4
            py-2.5
            rounded-xl
            border
            font-semibold
            transition-all
            cursor-pointer
            select-none
            ${
              booking.enabled
                ? `
                  bg-green-50
                  border-green-200
                  text-green-700
                  hover:bg-green-100
                `
                : `
                  bg-gray-50
                  border-gray-200
                  text-gray-600
                  hover:bg-gray-100
                `
            }
          `}
        >

          {booking.enabled ? (
            <ToggleRight
              size={22}
              className="text-green-600"
            />
          ) : (
            <ToggleLeft
              size={22}
              className="text-gray-500"
            />
          )}

          {booking.enabled
            ? "Room Booking Enabled"
            : "Enable Room Booking"}

        </button>

      </div>


      {/* =================================================
          DISABLED STATE
      ================================================= */}

      {!booking.enabled && (
        <div
          className="
            rounded-xl
            border
            border-dashed
            bg-gray-50
            p-5
            text-center
          "
        >

          <BedDouble
            size={28}
            className="
              mx-auto
              mb-2
              text-gray-400
            "
          />

          <p
            className="
              font-medium
              text-gray-600
            "
          >
            Room booking is currently disabled
          </p>

          <p
            className="
              text-sm
              text-gray-400
              mt-1
            "
          >
            Enable Room Booking to add rooms and
            manage hotel booking details.
          </p>

        </div>
      )}


      {/* =================================================
          ENABLED CONTENT
      ================================================= */}

      {booking.enabled && (
        <>

          {/* =================================================
              BOOKING SETTINGS
          ================================================= */}

          <div
            className="
              grid
              md:grid-cols-3
              gap-4
              p-4
              rounded-xl
              bg-gray-50
              border
            "
          >

            <div>

              <label
                className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                "
              >
                Check-in Time
              </label>

              <input
                type="time"
                value={
                  booking.checkInTime || ""
                }
                onChange={(e) =>
                  updateBooking({
                    checkInTime:
                      e.target.value,
                  })
                }
                className="
                  border
                  rounded-xl
                  p-3
                  w-full
                  bg-white
                "
              />

            </div>


            <div>

              <label
                className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                "
              >
                Check-out Time
              </label>

              <input
                type="time"
                value={
                  booking.checkOutTime || ""
                }
                onChange={(e) =>
                  updateBooking({
                    checkOutTime:
                      e.target.value,
                  })
                }
                className="
                  border
                  rounded-xl
                  p-3
                  w-full
                  bg-white
                "
              />

            </div>


            <div>

              <label
                className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                "
              >
                Advance Booking Days
              </label>

              <input
                type="number"
                min="0"
                value={
                  booking.advanceBookingDays || ""
                }
                onChange={(e) =>
                  updateBooking({
                    advanceBookingDays:
                      e.target.value,
                  })
                }
                placeholder="e.g. 30"
                className="
                  border
                  rounded-xl
                  p-3
                  w-full
                  bg-white
                "
              />

            </div>

          </div>


          {/* =================================================
              CONTACT
          ================================================= */}

          <div>

            <label
              className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
              "
            >
              Booking Contact Number
            </label>

            <input
              type="text"
              value={
                booking.contactNumber || ""
              }
              onChange={(e) =>
                updateBooking({
                  contactNumber:
                    e.target.value,
                })
              }
              placeholder="Enter booking contact number"
              className="
                border
                rounded-xl
                p-3
                w-full
              "
            />

          </div>


          {/* =================================================
              NOTES
          ================================================= */}

          <div>

            <label
              className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
              "
            >
              Booking Notes
            </label>

            <textarea
              value={
                booking.notes || ""
              }
              onChange={(e) =>
                updateBooking({
                  notes: e.target.value,
                })
              }
              rows={3}
              placeholder="Additional room booking information"
              className="
                border
                rounded-xl
                p-3
                w-full
              "
            />

          </div>


          {/* =================================================
              ROOMS HEADER
          ================================================= */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >

            <div>

              <h3
                className="
                  font-semibold
                  text-base
                "
              >
                Hotel Rooms
              </h3>

              <p
                className="
                  text-sm
                  text-gray-500
                "
              >
                Add room types, pricing and
                capacity.
              </p>

            </div>


            <button
              type="button"
              onClick={addRoom}
              className="
                inline-flex
                items-center
                gap-2
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-4
                py-2
                rounded-xl
                font-medium
                transition
              "
            >

              <Plus size={18} />

              Add Room

            </button>

          </div>


          {/* =================================================
              NO ROOMS
          ================================================= */}

          {rooms.length === 0 && (
            <div
              className="
                text-center
                text-gray-400
                py-8
                border
                border-dashed
                rounded-xl
              "
            >

              <BedDouble
                size={30}
                className="
                  mx-auto
                  mb-2
                  text-gray-300
                "
              />

              <p>
                No rooms added yet
              </p>

              <p
                className="
                  text-xs
                  mt-1
                "
              >
                Click "Add Room" to create a
                room type.
              </p>

            </div>
          )}


          {/* =================================================
              ROOM LIST
          ================================================= */}

          {rooms.map(
            (room, index) => (
              <div
                key={index}
                className="
                  border
                  rounded-xl
                  p-4
                  space-y-4
                  bg-white
                "
              >

                {/* ROOM HEADER */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <h3
                    className="
                      font-semibold
                    "
                  >
                    Room #{index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      removeRoom(index)
                    }
                    className="
                      inline-flex
                      items-center
                      justify-center
                      w-9
                      h-9
                      rounded-lg
                      text-red-500
                      hover:bg-red-50
                      transition
                    "
                    title="Remove room"
                  >

                    <Trash2 size={18} />

                  </button>

                </div>


                {/* ROOM NAME */}

                <input
                  value={
                    room.roomName || ""
                  }
                  onChange={(e) =>
                    updateRoom(
                      index,
                      "roomName",
                      e.target.value
                    )
                  }
                  placeholder="Room Name (e.g. Deluxe Room)"
                  className="
                    border
                    rounded-xl
                    p-3
                    w-full
                  "
                />


                {/* ROOM DATA */}

                <div
                  className="
                    grid
                    md:grid-cols-3
                    gap-3
                  "
                >

                  <div>

                    <label
                      className="
                        block
                        text-xs
                        font-medium
                        text-gray-600
                        mb-1
                      "
                    >
                      Price / Night
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={
                        room.price || ""
                      }
                      onChange={(e) =>
                        updateRoom(
                          index,
                          "price",
                          e.target.value
                        )
                      }
                      placeholder="₹ Price"
                      className="
                        border
                        rounded-xl
                        p-3
                        w-full
                      "
                    />

                  </div>


                  <div>

                    <label
                      className="
                        block
                        text-xs
                        font-medium
                        text-gray-600
                        mb-1
                      "
                    >
                      Guest Capacity
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={
                        room.capacity || ""
                      }
                      onChange={(e) =>
                        updateRoom(
                          index,
                          "capacity",
                          e.target.value
                        )
                      }
                      placeholder="Guests"
                      className="
                        border
                        rounded-xl
                        p-3
                        w-full
                      "
                    />

                  </div>


                  <div>

                    <label
                      className="
                        block
                        text-xs
                        font-medium
                        text-gray-600
                        mb-1
                      "
                    >
                      Total Rooms
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={
                        room.totalRooms || ""
                      }
                      onChange={(e) =>
                        updateRoom(
                          index,
                          "totalRooms",
                          e.target.value
                        )
                      }
                      placeholder="Number of rooms"
                      className="
                        border
                        rounded-xl
                        p-3
                        w-full
                      "
                    />

                  </div>

                </div>


                {/* AMENITIES */}

                <div>

                  <label
                    className="
                      block
                      text-xs
                      font-medium
                      text-gray-600
                      mb-1
                    "
                  >
                    Amenities
                  </label>

                  <input
                    value={
                      room.amenities || ""
                    }
                    onChange={(e) =>
                      updateRoom(
                        index,
                        "amenities",
                        e.target.value
                      )
                    }
                    placeholder="AC, TV, WiFi, Breakfast..."
                    className="
                      border
                      rounded-xl
                      p-3
                      w-full
                    "
                  />

                </div>

              </div>
            )
          )}

        </>
      )}

    </section>
  );
};

export default RoomBookingManager;