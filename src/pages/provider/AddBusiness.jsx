import { useEffect, useState } from "react";
import API from "../../api/axios";

import {
MapContainer,
TileLayer,
Marker,
useMapEvents
} from "react-leaflet";

import L from "leaflet";

const markerIcon = new L.Icon({
iconUrl:"https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
iconSize:[25,41],
iconAnchor:[12,41]
});

const LocationPicker = ({setLocation}) => {

useMapEvents({
click(e){
setLocation([e.latlng.lat,e.latlng.lng]);
}
});

return null;

};

const AddBusiness = () => {

const [categories,setCategories] = useState([]);
const [cities,setCities] = useState([]);

const [logo,setLogo] = useState("");
const [images,setImages] = useState([]);

const [location,setLocation] = useState([20.5937,78.9629]);

const [form,setForm] = useState({
name:"",
description:"",
category:"",
city:"",
address:"",
phone:"",
whatsapp:"",
website:"",
openingHours:""
});

const fetchData = async () => {

try{

const cat = await API.get("/categories");
const cit = await API.get("/cities");

setCategories(cat.data || []);
setCities(cit.data || []);

}catch(err){
console.error(err);
}

};

useEffect(()=>{
fetchData();
detectLocation();
},[]);

const detectLocation = () => {

if(!navigator.geolocation) return;

navigator.geolocation.getCurrentPosition((pos)=>{

setLocation([pos.coords.latitude,pos.coords.longitude]);

});

};

const handleChange = (e) => {

setForm({...form,[e.target.name]:e.target.value});

};

const uploadImage = async (file) => {

const data = new FormData();

data.append("file",file);
data.append("upload_preset","servdial");

const res = await fetch(
"https://api.cloudinary.com/v1_1/dkz4ihfuv/image/upload",
{
method:"POST",
body:data
}
);

const json = await res.json();

return json.secure_url;

};

const handleLogoUpload = async (e) => {

const url = await uploadImage(e.target.files[0]);
setLogo(url);

};

const handleImagesUpload = async (e) => {

const files = Array.from(e.target.files);

let uploaded=[];

for(let file of files){

const url = await uploadImage(file);
uploaded.push(url);

}

setImages(uploaded);

};

const handleSubmit = async (e) => {

e.preventDefault();

try{

await API.post("/business",{

...form,
logo,
images,
location:{
type:"Point",
coordinates:[location[1],location[0]]
}

});

alert("Business submitted for approval");

}catch(err){

alert("Error submitting business");

}

};

return(

<div className="max-w-5xl mx-auto p-6">

<h1 className="text-2xl font-bold mb-6">

Add Your Business

</h1>

<form
onSubmit={handleSubmit}
className="space-y-4"
>

<input
name="name"
placeholder="Business Name"
className="w-full border p-2"
onChange={handleChange}
/>

<textarea
name="description"
placeholder="Business Description"
className="w-full border p-2"
onChange={handleChange}
/>

<select
name="category"
className="w-full border p-2"
onChange={handleChange}
>

<option>Select Category</option>

{categories.map(c=>(
<option
key={c._id}
value={c._id}
>
{c.name}
</option>
))}

</select>

<select
name="city"
className="w-full border p-2"
onChange={handleChange}
>

<option>Select City</option>

{cities.map(c=>(
<option
key={c._id}
value={c.name}
>
{c.name}
</option>
))}

</select>

<input
name="address"
placeholder="Full Address"
className="w-full border p-2"
onChange={handleChange}
/>

<input
name="phone"
placeholder="Phone Number"
className="w-full border p-2"
onChange={handleChange}
/>

<input
name="whatsapp"
placeholder="WhatsApp Number"
className="w-full border p-2"
onChange={handleChange}
/>

<input
name="website"
placeholder="Website"
className="w-full border p-2"
onChange={handleChange}
/>

<input
name="openingHours"
placeholder="Opening Hours"
className="w-full border p-2"
onChange={handleChange}
/>

{/* LOGO */}

<div>

<label className="font-semibold">

Business Logo

</label>

<input
type="file"
onChange={handleLogoUpload}
/>

{logo && (

<img
src={logo}
className="h-20 mt-2"
/>

)}

</div>

{/* GALLERY */}

<div>

<label className="font-semibold">

Business Images

</label>

<input
type="file"
multiple
onChange={handleImagesUpload}
/>

<div className="grid grid-cols-4 gap-2 mt-2">

{images.map((img,i)=>(
<img
key={i}
src={img}
className="h-20 object-cover"
/>
))}

</div>

</div>

{/* MAP */}

<div>

<label className="font-semibold">

Pick Business Location

</label>

<div className="h-80 mt-2">

<MapContainer
center={location}
zoom={13}
style={{height:"100%",width:"100%"}}
>

<TileLayer
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

<Marker
position={location}
icon={markerIcon}
/>

<LocationPicker
setLocation={setLocation}
/>

</MapContainer>

</div>

</div>

<button
className="bg-blue-600 text-white px-6 py-2 rounded"
>

Submit Business

</button>

</form>

</div>

);

};

export default AddBusiness;