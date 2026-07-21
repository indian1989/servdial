import { useState } from "react";
import { Stethoscope } from "lucide-react";

const AppointmentBooking = ({ business, onSubmit }) => {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    department: "",
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
      type: "appointment_booking",
      ...form,
    });
  };

  return (
    <section
      id="appointment-booking"
      className="bg-white rounded-2xl shadow p-5"
    >

      <div className="flex items-center gap-2 mb-5">
        <Stethoscope
          size={22}
          className="text-blue-600"
        />

        <h2 className="text-xl font-bold">
          Book Appointment
        </h2>
      </div>

      <form
        onSubmit={submit}
        className="space-y-4"
      >

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Patient Name"
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Mobile Number"
          className="w-full border rounded-lg p-3"
          required
        />

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

        </div>

        <input
          name="department"
          value={form.department}
          onChange={handleChange}
          placeholder="Department / Doctor Name (Optional)"
          className="w-full border rounded-lg p-3"
        />

        <textarea
          rows="4"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Describe your problem"
          className="w-full border rounded-lg p-3"
        />

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
        >
          Book Appointment
        </button>

      </form>

    </section>
  );
};

export default AppointmentBooking;