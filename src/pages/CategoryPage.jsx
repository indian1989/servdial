import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import axios from "../api/axios";

const CategoryPage = () => {

const { category } = useParams();

const [cities,setCities] = useState([]);

useEffect(()=>{

const fetchCities = async ()=>{

try{

const {data} = await axios.get("/api/cities");

setCities(data.cities || []);

}catch(err){
console.log(err);
}

};

fetchCities();

},[]);

const title = `${category} Services in India | ServDial`;

const description = `Find best ${category} services in your city. Contact top rated ${category} professionals on ServDial.`;

return(

<>
<Helmet>

<title>{title}</title>

<meta name="description" content={description} />

<link rel="canonical" href={`https://servdial.onrender.com/category/${category}`} />

</Helmet>

<div className="min-h-screen bg-gray-50 py-10 px-6">

<div className="max-w-6xl mx-auto">

<h1 className="text-3xl font-bold mb-6">

{category} Services in India

</h1>

<p className="text-gray-600 mb-8">

Choose your city to find the best {category} services.

</p>

<div className="grid md:grid-cols-4 gap-6">

{cities.map((city)=>(
<Link
key={city._id}
to={`/${city.name}/${category}`}
className="bg-white shadow rounded p-6 text-center hover:shadow-lg"
>

{category} in {city.name}

</Link>
))}

</div>

</div>

</div>

</>

);

};

export default CategoryPage;