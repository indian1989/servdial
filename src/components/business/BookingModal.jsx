import { useState } from "react";

const BookingModal = ({
  business,
  open,
  onClose,
  onSubmit
}) => {


  const category =
    (
      business?.categoryId?.name ||
      business?.category ||
      ""
    )
    .toLowerCase();



  const [form, setForm] = useState({

    name: "",
    phone: "",

    date: "",
    time: "",

    guests: 1,

    service: "",

    message: ""

  });



  if (!open) return null;

console.log("Booking Modal Open");

  const handleChange = (e)=>{

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };



  const submitBooking = (e)=>{

    e.preventDefault();


    onSubmit?.({

      businessId: business._id,

      type:
        category.includes("restaurant")
          ? "table_booking"
          :
        category.includes("hotel")
          ? "room_booking"
          :
        "service_booking",


      ...form

    });


  };



  const isRestaurant =
    category.includes("restaurant");


  const isHotel =
    category.includes("hotel");


  const isDoctor =
    category.includes("doctor") ||
    category.includes("clinic");



return (

<div className="
fixed inset-0
bg-black/50
flex
items-center
justify-center
z-[100]
px-4
">


<div className="
bg-white
rounded-2xl
w-full
max-w-lg
p-6
shadow-xl
">


{/* HEADER */}

<div className="flex justify-between mb-5">


<h2 className="text-xl font-bold">

{
isRestaurant
?
"🍽 Book Table"
:
isHotel
?
"🏨 Book Room"
:
isDoctor
?
"🩺 Book Appointment"
:
"⚡ Book Service"
}

</h2>


<button

onClick={onClose}

className="text-gray-500"

>

✕


</button>


</div>




<form
onSubmit={submitBooking}
className="space-y-4"
>



<input

name="name"

value={form.name}

onChange={handleChange}

placeholder="Your Name"

className="w-full border rounded-lg p-3"

/>



<input

name="phone"

value={form.phone}

onChange={handleChange}

placeholder="Mobile Number"

className="w-full border rounded-lg p-3"

/>





{/* Restaurant */}

{isRestaurant && (

<div>

<label className="text-sm">

Number of Guests

</label>


<input

type="number"

name="guests"

min="1"

value={form.guests}

onChange={handleChange}

className="w-full border rounded-lg p-3"

/>


</div>

)}





{/* Hotel */}

{isHotel && (

<div className="space-y-3">


<input

type="date"

name="checkIn"

onChange={handleChange}

className="w-full border rounded-lg p-3"

/>



<input

type="date"

name="checkOut"

onChange={handleChange}

className="w-full border rounded-lg p-3"

/>



</div>

)}





{/* Common Date Time */}

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






{/* Service */}

{!isRestaurant &&
!isHotel &&
!isDoctor && (

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

rows="3"

className="w-full border rounded-lg p-3"

/>





<button

className="
w-full
bg-blue-600
text-white
py-3
rounded-xl
font-semibold
hover:bg-blue-700
"

>


Confirm Booking


</button>



</form>


</div>


</div>


);

};


export default BookingModal;