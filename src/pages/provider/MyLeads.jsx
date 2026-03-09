import { useEffect, useState } from "react";
import API from "../../api/axios";

const MyLeads = () => {

const [leads,setLeads] = useState([]);
const [loading,setLoading] = useState(true);

const fetchLeads = async ()=>{

try{

const res = await API.get("/leads/provider");

setLeads(res.data || []);

}catch(err){

console.error(err);

}

setLoading(false);

};

useEffect(()=>{
fetchLeads();
},[]);

return(

<div className="max-w-6xl mx-auto p-6">

<h1 className="text-2xl font-bold mb-6">
Customer Enquiries
</h1>

{loading && <p>Loading leads...</p>}

{!loading && leads.length===0 && (
<p>No enquiries yet.</p>
)}

<div className="space-y-4">

{leads.map((lead)=>(
<div
key={lead._id}
className="border p-4 rounded"
>

<h3 className="font-semibold">
{lead.business?.name}
</h3>

<p className="text-gray-600">
{lead.name}
</p>

<p className="text-gray-600">
📞 {lead.phone}
</p>

<p className="text-gray-500">
{lead.message}
</p>

<p className="text-xs text-gray-400 mt-2">
{new Date(lead.createdAt).toLocaleString()}
</p>

</div>
))}

</div>

</div>

);

};

export default MyLeads;