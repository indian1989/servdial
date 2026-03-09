import { useEffect, useState } from "react";
import API from "../../api/axios";

const ProviderAnalytics = () => {

const [stats,setStats] = useState(null);
const [loading,setLoading] = useState(true);

const fetchStats = async ()=>{

try{

const res = await API.get("/analytics/provider");

setStats(res.data);

}catch(err){
console.error(err);
}

setLoading(false);

};

useEffect(()=>{
fetchStats();
},[]);

if(loading) return <p className="p-10">Loading analytics...</p>;

return(

<div className="max-w-6xl mx-auto p-6">

<h1 className="text-2xl font-bold mb-6">
Business Analytics
</h1>

<div className="grid md:grid-cols-4 gap-6">

<div className="border p-4 rounded text-center">

<h2 className="text-3xl font-bold">
{stats.views}
</h2>

<p className="text-gray-500">
Listing Views
</p>

</div>

<div className="border p-4 rounded text-center">

<h2 className="text-3xl font-bold">
{stats.calls}
</h2>

<p className="text-gray-500">
Call Clicks
</p>

</div>

<div className="border p-4 rounded text-center">

<h2 className="text-3xl font-bold">
{stats.whatsapp}
</h2>

<p className="text-gray-500">
WhatsApp Clicks
</p>

</div>

<div className="border p-4 rounded text-center">

<h2 className="text-3xl font-bold">
{stats.leads}
</h2>

<p className="text-gray-500">
Leads Received
</p>

</div>

</div>

</div>

);

};

export default ProviderAnalytics;