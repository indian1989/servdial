import { useState } from "react";
import API from "../../api/axios";

const EnquiryForm = ({ businessId }) => {

const [form,setForm] = useState({
name:"",
phone:"",
message:""
});

const [loading,setLoading] = useState(false);

const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const handleSubmit = async (e)=>{

e.preventDefault();

setLoading(true);

try{

await API.post("/leads",{
business:businessId,
...form
});

alert("Enquiry sent successfully!");

setForm({
name:"",
phone:"",
message:""
});

}catch(err){

alert("Error sending enquiry");

}

setLoading(false);

};

return(

<form
onSubmit={handleSubmit}
className="border p-4 rounded mt-6"
>

<h3 className="font-semibold mb-3">
Send Enquiry
</h3>

<input
name="name"
value={form.name}
onChange={handleChange}
placeholder="Your Name"
className="w-full border p-2 mb-2"
/>

<input
name="phone"
value={form.phone}
onChange={handleChange}
placeholder="Phone Number"
className="w-full border p-2 mb-2"
/>

<textarea
name="message"
value={form.message}
onChange={handleChange}
placeholder="Your requirement"
className="w-full border p-2 mb-3"
/>

<button
disabled={loading}
className="bg-blue-600 text-white px-4 py-2 rounded"
>

{loading ? "Sending..." : "Send Enquiry"}

</button>

</form>

);

};

export default EnquiryForm;