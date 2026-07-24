import { useMemo, useState, useEffect } from "react";
import { bookingConfig } from "../../config/bookingConfig";

const bookingTitles = {
  table_booking: "🍽 Book Table",
  party_booking: "🎉 Party Booking",
  room_booking: "🏨 Book Room",
  appointment_booking: "🩺 Book Appointment",
  salon_booking: "💇 Salon Booking",
  spa_booking: "🧖 Spa Booking",
  gym_booking: "🏋 Gym Membership",
  test_drive_booking: "🚗 Test Drive",
  repair_booking: "🔧 Repair Booking",
  consultation_booking: "👨‍⚕ Consultation",
  car_rental_booking: "🚘 Car Rental",
  tour_booking: "🧳 Tour Booking",
  service_booking: "⚡ Service Booking",
};

const BookingModal = ({
  business,
  open,
  onClose,
  onSubmit,
  bookingType = "service_booking",
}) => {

    const config =
  bookingConfig[bookingType] ||
  bookingConfig.service_booking;

  const [form, setForm] = useState({
    name: "",
    phone: "",

    date: "",
    time: "",

    checkIn: "",
    checkOut: "",

    guests: 1,

    service: "",

    eventType: "",
    eventDate: "",

    vehicle: "",

    destination: "",

    duration: "",

    message: "",
  });

  useEffect(() => {
    if (!open) return;

    setForm({
      name: "",
      phone: "",
      date: "",
      time: "",
      checkIn: "",
      checkOut: "",
      guests: 1,
      service: "",
      eventType: "",
      eventDate: "",
      vehicle: "",
      destination: "",
      duration: "",
      message: "",
    });

  }, [open, bookingType]);

  if (!open) return null;

  const title =
config.title;

  const isRestaurant =
    bookingType === "table_booking";

  const isParty =
    bookingType === "party_booking";

  const isHotel =
    bookingType === "room_booking";

  const isDoctor =
    bookingType === "appointment_booking";

  const isSalon =
    bookingType === "salon_booking";

  const isSpa =
    bookingType === "spa_booking";

  const isGym =
    bookingType === "gym_booking";

  const isTestDrive =
    bookingType === "test_drive_booking";

  const isRepair =
    bookingType === "repair_booking";

  const isConsultation =
    bookingType === "consultation_booking";

  const isRental =
    bookingType === "car_rental_booking";

  const isTour =
    bookingType === "tour_booking";

  const handleChange = (e) => {

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };

  const submitBooking = (e) => {

    e.preventDefault();

    onSubmit?.({
      businessId: business._id,
      type: bookingType,
      ...form,
    });

    onClose?.();

  };

  return (

<div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">

<div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">

<div className="flex justify-between items-center border-b p-5">

<h2 className="text-xl font-bold">
{title}
</h2>

<button
onClick={onClose}
className="text-2xl text-gray-500 hover:text-red-500"
>
×
</button>

</div>

<form
onSubmit={submitBooking}
className="p-5 space-y-4"
>

<input
name="name"
value={form.name}
onChange={handleChange}
placeholder="Your Name"
required
className="w-full border rounded-lg p-3"
/>

<input
name="phone"
value={form.phone}
onChange={handleChange}
placeholder="Mobile Number"
required
className="w-full border rounded-lg p-3"
/>

      {/* ================= Restaurant ================= */}

      {isRestaurant && (
        <>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="number"
            min="1"
            name="guests"
            value={form.guests}
            onChange={handleChange}
            placeholder="Number of Guests"
            className="w-full border rounded-lg p-3"
          />
        </>
      )}

      {/* ================= Party Booking ================= */}

      {isParty && (
        <>
          <input
            type="date"
            name="eventDate"
            value={form.eventDate}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            name="eventType"
            value={form.eventType}
            onChange={handleChange}
            placeholder="Birthday / Anniversary / Corporate"
            className="w-full border rounded-lg p-3"
          />

          <input
            type="number"
            name="guests"
            value={form.guests}
            onChange={handleChange}
            placeholder="Guests"
            className="w-full border rounded-lg p-3"
          />
        </>
      )}

      {/* ================= Hotel ================= */}

      {isHotel && (
        <>
          <input
            type="date"
            name="checkIn"
            value={form.checkIn}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="date"
            name="checkOut"
            value={form.checkOut}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="number"
            min="1"
            name="guests"
            value={form.guests}
            onChange={handleChange}
            placeholder="Guests"
            className="w-full border rounded-lg p-3"
          />
        </>
      )}

      {/* ================= Doctor ================= */}

      {isDoctor && (
        <>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />
        </>
      )}

      {/* ================= Salon / Spa ================= */}

      {(isSalon || isSpa) && (
        <>
          <input
            name="service"
            value={form.service}
            onChange={handleChange}
            placeholder="Select Service"
            className="w-full border rounded-lg p-3"
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </>
      )}

      {/* ================= Gym ================= */}

      {isGym && (
        <>
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option value="">Membership Plan</option>
            <option>1 Month</option>
            <option>3 Months</option>
            <option>6 Months</option>
            <option>12 Months</option>
          </select>
        </>
      )}

      {/* ================= Test Drive ================= */}

      {isTestDrive && (
        <>
          <input
            name="vehicle"
            value={form.vehicle}
            onChange={handleChange}
            placeholder="Vehicle Model"
            className="w-full border rounded-lg p-3"
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </>
      )}

      {/* ================= Repair ================= */}

      {isRepair && (
        <>
          <input
            name="service"
            value={form.service}
            onChange={handleChange}
            placeholder="Repair Required"
            className="w-full border rounded-lg p-3"
          />
        </>
      )}

      {/* ================= Consultation ================= */}

      {isConsultation && (
        <>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </>
      )}

      {/* ================= Car Rental ================= */}

      {isRental && (
        <>
          <input
            name="vehicle"
            value={form.vehicle}
            onChange={handleChange}
            placeholder="Preferred Car"
            className="w-full border rounded-lg p-3"
          />

          <input
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="Rental Duration"
            className="w-full border rounded-lg p-3"
          />
        </>
      )}

      {/* ================= Tour ================= */}

      {isTour && (
        <>
          <input
            name="destination"
            value={form.destination}
            onChange={handleChange}
            placeholder="Destination"
            className="w-full border rounded-lg p-3"
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="number"
            name="guests"
            value={form.guests}
            onChange={handleChange}
            placeholder="Travellers"
            className="w-full border rounded-lg p-3"
          />
        </>
      )}

      {/* ================= Generic Service ================= */}

      {!isRestaurant &&
        !isParty &&
        !isHotel &&
        !isDoctor &&
        !isSalon &&
        !isSpa &&
        !isGym &&
        !isTestDrive &&
        !isRepair &&
        !isConsultation &&
        !isRental &&
        !isTour && (
          <input
            name="service"
            value={form.service}
            onChange={handleChange}
            placeholder="Required Service"
            className="w-full border rounded-lg p-3"
          />
        )}

      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Additional Message"
        rows={4}
        className="w-full border rounded-lg p-3"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold transition"
      >
        Confirm Booking
      </button>

    </form>

  </div>

</div>

);

};

export default BookingModal;