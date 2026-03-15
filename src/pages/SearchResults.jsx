import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../../api/axios";

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


// ================= FETCH BUSINESSES =================

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


// ================= LOAD DATA =================

useEffect(()=>{

fetchBusinesses();

},[keyword,city,category,rating,sort,page]);


// ================= RESET PAGE WHEN FILTER CHANGES =================

useEffect(()=>{

setPage(1);

},[rating,sort,keyword,city,category]);


// ================= SEO TITLE =================

useEffect(()=>{

document.title = `Search ${keyword || category || "Businesses"} in ${city || "India"} | ServDial`;

},[keyword,city,category]);


// ================= UI =================

return(

<div className="max-w-7xl mx-auto px-4 py-8">

{/* HEADER */}

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


{/* FILTERS */}

<div className="grid md:grid-cols-4 gap-4 mb-6 sticky top-16 bg-white py-3 z-10">

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


{/* RESULTS */}

<div className="space-y-4">

{loading && (
<p className="text-gray-500">
Loading businesses...
</p>
)}

{!loading && businesses.length===0 && (
<p>No businesses found.</p>
)}

{businesses.map((biz)=>(

<Link
key={biz._id}
to={`/business/${biz._id}`}
className="block border rounded-lg p-4 hover:shadow-md transition"
>

<div className="flex gap-4">

<img
src={biz.image || "/no-image.png"}
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
📍 {biz.city}
</p>

<p className="text-yellow-500 text-sm">
⭐ {biz.rating || "0"}
</p>

{/* ACTION BUTTONS */}

<div className="flex gap-2 mt-2">

{biz.phone && (

<a
href={`tel:${biz.phone}`}
onClick={(e)=>e.stopPropagation()}
className="text-xs bg-green-500 text-white px-3 py-1 rounded"
>
Call
</a>

)}

{biz.whatsapp && (

<a
href={`https://wa.me/${biz.whatsapp}`}
target="_blank"
rel="noreferrer"
onClick={(e)=>e.stopPropagation()}
className="text-xs bg-green-600 text-white px-3 py-1 rounded"
>
WhatsApp
</a>

)}

</div>

</div>

</div>

</Link>

))}

</div>


{/* PAGINATION */}

{totalPages>1 && (

<div className="flex gap-2 mt-8 flex-wrap justify-center">

{[...Array(totalPages)].map((_,i)=>(

<button
key={i}
onClick={()=>setPage(i+1)}
className={`px-3 py-1 border rounded ${
page===i+1
? "bg-blue-600 text-white"
: "hover:bg-gray-100"
}`}
>

{i+1}

</button>

))}

</div>

)}

</div>

);

};

export default SearchResults;