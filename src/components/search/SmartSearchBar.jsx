import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const SmartSearchBar = () => {

const navigate = useNavigate();

const [query,setQuery] = useState("");
const [results,setResults] = useState([]);
const [loading,setLoading] = useState(false);

const fetchSuggestions = async () => {

if(!query || query.length < 2){
setResults([]);
return;
}

try{

setLoading(true);

const res = await API.get("/search/suggestions",{
params:{q:query}
});

setResults(res.data || []);

}catch(err){
console.error(err);
}

setLoading(false);

};

useEffect(()=>{

const delay = setTimeout(()=>{
fetchSuggestions();
},400);

return ()=>clearTimeout(delay);

},[query]);

const handleSelect = (item)=>{

if(item.type==="business"){
navigate(`/business/${item._id}`);
}

if(item.type==="category"){
navigate(`/search?category=${item.name}`);
}

if(item.type==="city"){
navigate(`/search?city=${item.name}`);
}

setQuery("");
setResults([]);

};

const submitSearch = (e)=>{

e.preventDefault();

navigate(`/search?q=${query}`);

};

return(

<div className="relative w-full">

<form
onSubmit={submitSearch}
>

<input
value={query}
onChange={(e)=>setQuery(e.target.value)}
placeholder="Search for services, businesses..."
className="w-full border p-3 rounded"
/>

</form>

{/* Suggestions */}

{results.length>0 && (

<div className="absolute bg-white border w-full mt-1 rounded shadow-lg z-50">

{results.map((item,i)=>(

<div
key={i}
onClick={()=>handleSelect(item)}
className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between"
>

<span>
{item.name}
</span>

<span className="text-xs text-gray-500">
{item.type}
</span>

</div>

))}

</div>

)}

</div>

);

};

export default SmartSearchBar;