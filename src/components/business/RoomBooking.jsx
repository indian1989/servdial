import { useState } from "react";
import { BedDouble } from "lucide-react";

const RoomBooking = ({ business, onSubmit }) => {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    rooms: 1,
    message: "",
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const submit = (e) => {

    e.preventDefault();

    onSubmit?.({
      businessId: business?._id,
      type: "room_booking",
      ...form,
    });

  };

  return (

    <section
      id="room-booking"
      className="bg-white rounded-2xl shadow p-5"
    >

      <div className="flex items-center gap-2 mb-5">

        <BedDouble className="text-blue-600" />

        <h2 className="text-xl font-bold">

          Room Booking

        </h2>

      </div>

      <form
        onSubmit={submit}
        className="space-y-4"
      >

        <input
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          name="phone"
          placeholder="Mobile Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <div className="grid md:grid-cols-2 gap-4">

          <div>

            <label className="text-sm text-gray-500">

              Check In

            </label>

            <input
              type="date"
              name="checkIn"
              value={form.checkIn}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />

          </div>

          <div>

            <label className="text-sm text-gray-500">

              Check Out

            </label>

            <input
              type="date"
              name="checkOut"
              value={form.checkOut}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />

          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="number"
            min="1"
            name="rooms"
            value={form.rooms}
            onChange={handleChange}
            className="border rounded-lg p-3"
            placeholder="Rooms"
          />

          <input
            type="number"
            min="1"
            name="guests"
            value={form.guests}
            onChange={handleChange}
            className="border rounded-lg p-3"
            placeholder="Guests"
          />

        </div>

        <textarea
          name="message"
          rows="4"
          value={form.message}
          onChange={handleChange}
          placeholder="Special Request"
          className="w-full border rounded-lg p-3"
        />

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
        >

          Book Room

        </button>

      </form>

    </section>

  );

};

export default RoomBooking;