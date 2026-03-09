import { useEffect, useState } from "react";
import API from "../../api/axios";
import { Link } from "react-router-dom";

const RecommendedBusinesses = ({ city }) => {

const [businesses,setBusinesses] = useState([]);

const fetchRecommendations = async ()=>{

try{

const res = await API.get("/recommendations",{
params:{city}
});

setBusinesses(res.data || []);

}catch(err){
console.error(err);
}

};

useEffect(()=>{
fetchRecommendations();
},[city]);

if(!businesses.length) return null;

return(

<div className="max-w-7xl mx-auto px-4 py-12">

<h2 className="text-2xl font-bold mb-6">
Recommended for You
</h2>

<div className="grid md:grid-cols-4 gap-6">

{businesses.map((biz)=>(
<Link
key={biz._id}
to={`/business/${biz._id}`}
className="border rounded-lg overflow-hidden hover:shadow"
>

<img
src={biz.logo}
className="h-36 w-full object-cover"
/>

<div className="p-3">

<h3 className="font-semibold">
{biz.name}
</h3>

<p className="text-sm text-gray-500">
{biz.city}
</p>

<p className="text-yellow-500 text-sm">
⭐ {biz.rating || 0}
</p>

</div>

</Link>
))}

</div>

</div>

);

};

export default RecommendedBusinesses;