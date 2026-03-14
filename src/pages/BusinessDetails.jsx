import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

import EnquiryForm from "../components/enquiry/EnquiryForm";
import ReviewForm from "../components/reviews/ReviewForm";
import ReviewsList from "../components/reviews/ReviewsList";
import RatingBreakdown from "../components/reviews/RatingBreakdown";
import TrackBusinessView from "../components/analytics/TrackBusinessView";

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

const BusinessDetails = () => {

const { id } = useParams();

const [business, setBusiness] = useState(null);
const [reviews, setReviews] = useState([]);
const [similar, setSimilar] = useState([]);

const user = JSON.parse(localStorage.getItem("servdial_user"));

/* Fetch Business */

const fetchBusiness = async () => {

 try {

 const res = await API.get(`/business/${id}`);

 setBusiness(res.data.business);
 setReviews(res.data.reviews || []);

 if(res.data.business?.category?._id){
 fetchSimilar(res.data.business.category._id);
 }

 } catch (err) {
 console.error(err);
 }

};

/* Fetch Similar Businesses */

const fetchSimilar = async (categoryId) => {

 try {

 const res = await API.get("/business/similar", {
 params: { category: categoryId }
 });

 setSimilar(res.data || []);

 } catch (err) {
 console.error(err);
 }

};

useEffect(() => {
 fetchBusiness();
}, [id]);

if (!business) return <p className="p-10">Loading...</p>;

const lat = business?.location?.coordinates?.[1];
const lng = business?.location?.coordinates?.[0];

return (

<div className="max-w-7xl mx-auto px-4 py-8">

{/* Track Page View */}
<TrackBusinessView businessId={business._id} />

{/* HEADER */}

<div className="grid md:grid-cols-3 gap-6 mb-10">

<img
 src={business.image || "/no-image.png"}
 alt={business.name}
 className="w-full h-60 object-cover rounded"
/>

<div className="md:col-span-2">

<h1 className="text-3xl font-bold mb-2">
{business.name}
</h1>

<p className="text-gray-500 mb-2">
{business.category?.name}
</p>

<p className="text-yellow-500 mb-2">
⭐ {business.rating || 0}
</p>

<p className="text-gray-600 mb-4">
{business.description}
</p>

<div className="flex gap-3 flex-wrap">

<a
 href={`tel:${business.phone}`}
 onClick={() => API.post("/analytics/call", { business: business._id })}
 className="bg-blue-600 text-white px-4 py-2 rounded"
>
Call
</a>

<a
 href={`https://wa.me/${business.whatsapp}`}
 onClick={() => API.post("/analytics/whatsapp", { business: business._id })}
 className="bg-green-600 text-white px-4 py-2 rounded"
>
WhatsApp
</a>

{business.website && (
<a
 href={business.website}
 target="_blank"
 rel="noreferrer"
 className="bg-gray-800 text-white px-4 py-2 rounded"
>
Website
</a>
)}

</div>

{/* Lead Enquiry Form */}

<div className="mt-6">
<EnquiryForm businessId={business._id} />
</div>

</div>

</div>

{/* GALLERY */}

{business.images?.length > 0 && (

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

{business.images.map((img, i) => (
<img
 key={i}
 src={img}
 className="h-40 w-full object-cover rounded"
/>
))}

</div>

)}

{/* ADDRESS + MAP */}

<div className="grid md:grid-cols-2 gap-8 mb-10">

<div>

<h2 className="text-xl font-semibold mb-3">
Business Location
</h2>

<p className="text-gray-600 mb-2">
{business.address}
</p>

<p className="text-gray-500">
{business.city}
</p>

<h3 className="font-semibold mt-6 mb-2">
Opening Hours
</h3>

<p className="text-gray-600">
{business.openingHours || "Not Provided"}
</p>

</div>

<div className="h-80 rounded overflow-hidden">

{lat && lng && (

<MapContainer
 center={[lat, lng]}
 zoom={15}
 style={{ height: "100%", width: "100%" }}
>

<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

<Marker position={[lat, lng]} icon={markerIcon}>

<Popup>
{business.name}
</Popup>

</Marker>

</MapContainer>

)}

</div>

</div>

<h2 className="text-xl font-semibold mt-10 mb-4">
Nearby Businesses
</h2>
{nearby.map((biz) => (

<div key={biz._id}>
 {biz.name}
</div>

))}

{/* REVIEWS */}

<div className="grid md:grid-cols-3 gap-8 mt-10">

<div>
<RatingBreakdown reviews={reviews} />
</div>

<div className="md:col-span-2">

<ReviewsList
 reviews={reviews}
 refresh={fetchBusiness}
/>

{user && (
<ReviewForm
 businessId={business._id}
 refresh={fetchBusiness}
/>
)}

</div>

</div>

{/* SIMILAR BUSINESSES */}

<div className="mt-12">

<h2 className="text-xl font-semibold mb-4">
Similar Businesses
</h2>

<div className="grid md:grid-cols-3 gap-6">

{similar.map((biz) => (

<div
 key={biz._id}
 className="border rounded p-4"
>

<img
 src={biz.logo}
 className="h-32 w-full object-cover mb-3"
/>

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

))}

</div>

</div>

</div>

);

};

export default BusinessDetails;