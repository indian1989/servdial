import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

const ProviderDashboard = () => {

const [businesses,setBusinesses] = useState([]);
const [loading,setLoading] = useState(true);

const user = JSON.parse(localStorage.getItem("servdial_user"));

const fetchBusinesses = async () => {

try{

const res = await API.get("/business/provider");

setBusinesses(res.data || []);

}catch(err){

console.error(err);

}

setLoading(false);

};

useEffect(()=>{

fetchBusinesses();

},[]);

const deleteBusiness = async (id) => {

if(!window.confirm("Delete this business?")) return;

try{

await API.delete(`/business/${id}`);

fetchBusinesses();

}catch(err){

alert("Error deleting business");

}

};

if(!user) return <p className="p-10">Login required</p>;

return(

<div className="max-w-7xl mx-auto px-4 py-8">

{/* HEADER */}

<div className="flex justify-between items-center mb-8">

<h1 className="text-2xl font-bold">

Provider Dashboard

</h1>

<Link
to="/provider/add-business"
className="bg-blue-600 text-white px-4 py-2 rounded"
>

Add New Business

</Link>

</div>

{/* LOADING */}

{loading && <p>Loading your businesses...</p>}

{/* EMPTY */}

{!loading && businesses.length===0 && (

<div className="border rounded p-10 text-center">

<p className="mb-4">

You have not added any business yet.

</p>

<Link
to="/provider/add-business"
className="bg-blue-600 text-white px-4 py-2 rounded"
>

Add Your First Business

</Link>

</div>

)}

{/* BUSINESS LIST */}

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{businesses.map((biz)=>{

let statusColor="bg-yellow-500";

if(biz.status==="approved") statusColor="bg-green-600";
if(biz.status==="rejected") statusColor="bg-red-600";

return(

<div
key={biz._id}
className="border rounded-lg overflow-hidden shadow-sm"
>

<img
src={biz.logo}
alt={biz.name}
className="h-40 w-full object-cover"
/>

<div className="p-4">

<h3 className="font-semibold text-lg">

{biz.name}

</h3>

<p className="text-sm text-gray-500">

{biz.city}

</p>

<div className="mt-2">

<span
className={`text-white text-xs px-2 py-1 rounded ${statusColor}`}
>

{biz.status}

</span>

</div>

<div className="flex gap-2 mt-4">

<Link
to={`/provider/edit-business/${biz._id}`}
className="bg-gray-800 text-white px-3 py-1 text-sm rounded"
>

Edit

</Link>

<button
onClick={()=>deleteBusiness(biz._id)}
className="bg-red-500 text-white px-3 py-1 text-sm rounded"
>

Delete

</button>

</div>

</div>

</div>

);

})}

</div>

</div>

);

};

export default ProviderDashboard;