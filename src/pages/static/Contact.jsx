import StaticPageLayout from "../../layouts/StaticPageLayout";
import Section from "../../components/common/Section";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Building2
} from "lucide-react";

import { useState } from "react";


const Contact = () => {


  const [form,setForm] = useState({
    name:"",
    email:"",
    message:"",
  });



  const handleChange = (e)=>{

    setForm({
      ...form,
      [e.target.name]:e.target.value
    });

  };



  const handleSubmit=(e)=>{

    e.preventDefault();

    console.log(
      "CONTACT FORM:",
      form
    );


    alert(
      "Thank you! We will contact you shortly."
    );


    setForm({
      name:"",
      email:"",
      message:"",
    });

  };



return (

<StaticPageLayout

title="Contact ServDial"

subtitle="Have questions, need support, or want to grow your business with ServDial? Our team is here to help."

cta={{

title:"Need assistance?",

subtitle:
"Contact our support team for business listings, partnerships, and customer queries.",

actions:[

{
label:"Email Support",
link:"mailto:support.servdial@gmail.com",
primary:true
},

{
label:"List Your Business",
link:"/register",
primary:false
}

]

}}

>



{/* CONTACT OPTIONS */}


<Section title="Get In Touch">


<div className="grid md:grid-cols-4 gap-6 mt-6">


<div className="bg-gray-50 p-6 rounded-xl shadow-sm text-center">

<Mail className="mx-auto mb-3"/>

<h3 className="font-semibold">
Email Support
</h3>

<p className="text-sm text-gray-600 mt-2">
support.servdial@gmail.com
</p>

</div>



<div className="bg-gray-50 p-6 rounded-xl shadow-sm text-center">

<Phone className="mx-auto mb-3"/>

<h3 className="font-semibold">
Phone Support
</h3>

<p className="text-sm text-gray-600 mt-2">
+91 6200152506
</p>

</div>



<div className="bg-gray-50 p-6 rounded-xl shadow-sm text-center">

<MessageCircle className="mx-auto mb-3"/>

<h3 className="font-semibold">
WhatsApp Support
</h3>

<p className="text-sm text-gray-600 mt-2">
Quick business assistance
</p>

</div>



<div className="bg-gray-50 p-6 rounded-xl shadow-sm text-center">

<MapPin className="mx-auto mb-3"/>

<h3 className="font-semibold">
Location
</h3>

<p className="text-sm text-gray-600 mt-2">
India
</p>

</div>



</div>


</Section>





{/* FORM */}


<Section title="Send Us a Message">


<form

onSubmit={handleSubmit}

className="max-w-2xl mt-6 space-y-4"

>


<input

type="text"

name="name"

value={form.name}

onChange={handleChange}

placeholder="Your Name"

required

className="
w-full
border
rounded-xl
p-3
"

/>



<input

type="email"

name="email"

value={form.email}

onChange={handleChange}

placeholder="Your Email"

required

className="
w-full
border
rounded-xl
p-3
"

/>




<textarea

name="message"

value={form.message}

onChange={handleChange}

placeholder="How can we help you?"

rows="5"

required

className="
w-full
border
rounded-xl
p-3
"

/>




<button

type="submit"

className="
bg-indigo-600
hover:bg-indigo-700
text-white
px-6
py-3
rounded-xl
font-medium
"

>

Send Message

</button>



</form>


</Section>






{/* SUPPORT HOURS */}


<Section title="Support Hours">


<div className="
grid
md:grid-cols-2
gap-6
mt-6
">


<div className="
bg-gray-50
rounded-xl
p-6
flex
gap-4
">


<Clock/>

<div>

<h3 className="font-semibold">
Customer Support
</h3>

<p className="text-sm text-gray-600 mt-2">

Monday - Saturday  
<br/>

9:00 AM - 7:00 PM

</p>

</div>


</div>




<div className="
bg-gray-50
rounded-xl
p-6
flex
gap-4
">


<Building2/>


<div>

<h3 className="font-semibold">
Business Support
</h3>


<p className="text-sm text-gray-600 mt-2">

Listings, advertising and partnerships

</p>


</div>


</div>



</div>


</Section>






{/* BUSINESS PARTNERSHIP */}


<Section title="Business & Partnership">


<p>

Are you a business owner looking to increase your online visibility?

ServDial helps local businesses showcase their services, connect with
customers, and grow digitally.

</p>


<p className="mt-4">

For advertising, premium listings, and partnership opportunities,
contact our team.

</p>


</Section>






{/* FAQ */}


<Section title="Frequently Asked Questions">


<div className="space-y-4">


<div>

<h3 className="font-semibold">
How can I add my business on ServDial?
</h3>

<p className="text-sm text-gray-600">

You can create an account and submit your business listing through our
registration page.

</p>

</div>



<div>

<h3 className="font-semibold">
How can customers contact businesses?
</h3>

<p className="text-sm text-gray-600">

Customers can directly call or contact listed businesses through their
ServDial profiles.

</p>

</div>


<div>

<h3 className="font-semibold">
Do you support business promotion?
</h3>

<p className="text-sm text-gray-600">

Yes, businesses can promote their services through featured listings and
advertising solutions.

</p>

</div>


</div>


</Section>



</StaticPageLayout>

);

};


export default Contact;