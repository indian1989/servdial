import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";

import {
MapContainer,
TileLayer,
Marker,
Popup
} from "react-leaflet";

import L from "leaflet";

const markerIcon = new L.Icon({
iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
iconSize: [25, 41],
iconAnchor: [12, 41]
});

const SearchResults = () => {

const [searchParams] = useSearchParams();

const keyword = searchParams.get("q") || "";
const city = searchParams.get("city") || "";
const category = searchParams.get("category") || "";

const [businesses,setBusinesses] = useState([]);
const [loading,setLoading] = useState(true);

const [rating,setRating] = useState("");
const [sort,setSort] = useState("popular");

const [page,setPage] = useState(1);
const [totalPages,setTotalPages] = useState(1);

const fetchBusinesses = async () => {

try{

setLoading(true);

const res = await API.get("/business/search",{
params:{
q:keyword,
city,
category,
rating,
sort,
page
}
});

setBusinesses(res.data.businesses || []);
setTotalPages(res.data.totalPages || 1);

}catch(err){
console.error(err);
}

setLoading(false);

};

useEffect(()=>{
fetchBusinesses();
},[keyword,city,category,rating,sort,page]);

return(

<div className="max-w-7xl mx-auto px-4 py-8">

{/* Header */}

<div className="mb-6">

<h1 className="text-2xl font-bold">

Search Results

</h1>

<p className="text-gray-500 text-sm">

{keyword && `Keyword: ${keyword}`}
{city && ` | City: ${city}`}
{category && ` | Category: ${category}`}

</p>

</div>

{/* Filters */}

<div className="grid md:grid-cols-4 gap-4 mb-6">

<select
className="border p-2 rounded"
value={rating}
onChange={(e)=>setRating(e.target.value)}
>
<option value="">All Ratings</option>
<option value="4">4+ Rating</option>
<option value="3">3+ Rating</option>
<option value="2">2+ Rating</option>
</select>

<select
className="border p-2 rounded"
value={sort}
onChange={(e)=>setSort(e.target.value)}
>
<option value="popular">Most Popular</option>
<option value="rating">Top Rated</option>
<option value="newest">Newest</option>
</select>

</div>

{/* Results Layout */}

<div className="grid lg:grid-cols-3 gap-6">

{/* LEFT RESULTS */}

<div className="lg:col-span-2 space-y-4">

{loading && <p>Loading businesses...</p>}

{!loading && businesses.length===0 && (

<p>No businesses found.</p>

)}

{businesses.map((biz)=>(
<div
key={biz._id}
className="border rounded-lg p-4 hover:shadow-md"
>

<div className="flex gap-4">

<img
src={biz.logo}
alt={biz.name}
className="w-20 h-20 object-cover rounded"
/>

<div className="flex-1">

<h3 className="font-semibold text-lg">

{biz.name}

</h3>

<p className="text-gray-600 text-sm">

{biz.category?.name}

</p>

<p className="text-gray-500 text-sm">

{biz.city}

</p>

<p className="text-yellow-500 text-sm">

⭐ {biz.rating || "0"}

</p>

</div>

</div>

</div>
))}

{/* Pagination */}

<div className="flex gap-2 mt-6">

{[...Array(totalPages)].map((_,i)=>(
<button
key={i}
onClick={()=>setPage(i+1)}
className={`px-3 py-1 border rounded ${
page===i+1?"bg-blue-600 text-white":""
}`}
>
{i+1}
</button>
))}

</div>

</div>

{/* RIGHT MAP */}

<div className="h-[600px] rounded overflow-hidden">

<MapContainer
center={[20.5937,78.9629]}
zoom={5}
style={{height:"100%",width:"100%"}}
>

<TileLayer
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

{businesses.map((biz)=>{

if(!biz.location) return null;

return(

<Marker
key={biz._id}
position={[
biz.location.coordinates[1],
biz.location.coordinates[0]
]}
icon={markerIcon}
>

<Popup>

<b>{biz.name}</b>

<br/>

{biz.city}

</Popup>

</Marker>

);

})}

</MapContainer>

</div>

</div>

</div>

);

};

export default SearchResults;