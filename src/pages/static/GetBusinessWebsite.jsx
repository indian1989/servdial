import { useState, useEffect } from "react";
import React from "react";
import { Helmet } from "react-helmet-async";
import Select from "react-select";
import API from "../../api/axios";


import {
  Globe,
  Smartphone,
  MapPin,
  MessageCircle,
  Search,
  Star,
  Image,
  CheckCircle,
  ArrowRight,
} from "lucide-react";



const GetBusinessWebsite = () => {

const [businessCategory, setBusinessCategory] = useState(null);
const [city, setCity] = useState(null);

const [categoryOptions, setCategoryOptions] = useState([]);
const [cityOptions, setCityOptions] = useState([]);

useEffect(()=>{

fetchWebsiteOptions();

},[]);



const fetchWebsiteOptions = async()=>{

try{


const [
categoryRes,
cityRes
] = await Promise.all([

API.get("/categories"),

API.get("/cities")

]);


setCategoryOptions(

(categoryRes.data.data || [])
.filter(cat => cat.parentCategory) // ❌ अभी parent हटाएगा

.map(cat => ({
  label: cat.name,
  value: cat.name
}))

);



setCityOptions(

(cityRes.data.data || [])
.map(city=>({

label:
`${city.name}, ${city.state}`,

value: city.name

}))

);



}catch(error){

console.error(
"Website dropdown error",
error
);

}


};

    const whatsappLink = () => {

    const message = `
    Hello ServDial,

    I want a professional website for my business.

    Business Category:
${businessCategory?.value || "Not Selected"}

City:
${city?.value || "Not Selected"}

    Please share details.
    `;

    return (
    `https://wa.me/916200152506?text=${encodeURIComponent(message)}`
    );

    };


  const features = [
    {
      icon: Globe,
      title: "Professional Business Website",
      desc: "A modern website designed for your business identity."
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly Design",
      desc: "Your website works smoothly on mobile, tablet and desktop."
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Integration",
      desc: "Customers can directly contact you through WhatsApp."
    },
    {
      icon: MapPin,
      title: "Google Map Integration",
      desc: "Help customers easily find your business location."
    },
    {
      icon: Search,
      title: "Basic SEO Setup",
      desc: "Improve your online visibility on search engines."
    },
    {
      icon: Star,
      title: "Reviews & Trust",
      desc: "Show customer reviews and build trust online."
    },
  ];


  const businesses = [
    "🍽 Restaurant",
    "💇 Beauty Salon",
    "🏨 Hotel",
    "🏪 Shop",
    "🏥 Clinic",
    "🔧 Service Business",
    "🌱 Nursery",
    "🏋 Gym",
  ];


  const plans = [
    {
      title:"Starter Website",
      price:"₹4999",
      items:[
        "Business Information",
        "Mobile Friendly Website",
        "WhatsApp Button",
        "Google Map",
        "Photo Gallery",
        "Basic SEO Setup"
      ]
    },

    {
      title:"Business Website",
      price:"₹9999",
      popular:true,
      items:[
        "Multiple Pages",
        "Services / Products",
        "Customer Reviews",
        "Advanced Sections",
        "SEO Optimization",
        "Custom Design"
      ]
    },

    {
      title:"Premium Website",
      price:"₹19999+",
      items:[
        "Advanced Features",
        "Booking System",
        "Custom Development",
        "Priority Support",
        "Growth Consultation"
      ]
    }
  ];


  return (
    <>

    <Helmet>

      <title>
        Get Your Business Website | ServDial
      </title>

      <meta
      name="description"
      content="Create a professional business website for your restaurant, shop, salon, hotel or service business with ServDial."
      />

    </Helmet>


    <div className="bg-white">


    {/* ================= HERO ================= */}

    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">

    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">


    <div>

    <h1 className="text-4xl md:text-5xl font-bold leading-tight">

    Get Your Business Website

    </h1>


    <p className="mt-5 text-lg text-blue-100">

    Grow your local business with a professional,
    mobile-friendly website and reach more customers online.

    </p>

    <div className="mt-6 grid sm:grid-cols-2 gap-4">


    <Select

    placeholder="Select Business Type"

    options={categoryOptions}

    value={businessCategory}

    onChange={(option)=>
    setBusinessCategory(option)
    }

    isSearchable

    className="text-gray-800"

    />


    <Select

    placeholder="Select Your City"

    options={cityOptions}

    value={city}

    onChange={(option)=>
    setCity(option)
    }

    isSearchable

    className="text-gray-800"

    />


</div>

    <div className="mt-8 flex flex-wrap gap-4">
        <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
        >

        Get Free Demo

        <ArrowRight size={18}/>

        </a>


        <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="border border-white px-6 py-3 rounded-lg"
        >

        Contact Us

        </a>


</div>

</div>


<div className="bg-white/10 rounded-2xl p-8">

<h3 className="text-2xl font-semibold">

Your Website Includes

</h3>


<ul className="mt-5 space-y-3">

<li>✅ Digital Business Profile</li>
<li>✅ WhatsApp Contact</li>
<li>✅ Google Map</li>
<li>✅ Photo Gallery</li>
<li>✅ SEO Friendly Setup</li>

</ul>


</div>


</div>

</section>




{/* ================= BUSINESS TYPES ================= */}


<section className="py-16">

<div className="max-w-6xl mx-auto px-6">


<h2 className="text-3xl font-bold text-center">

Website For Every Business

</h2>


<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">

{
businesses.map((item,index)=>(
<div
key={index}
className="border rounded-xl p-5 text-center hover:shadow"
>

{item}

</div>
))
}


</div>

</div>

</section>




{/* ================= FEATURES ================= */}


<section className="bg-gray-50 py-16">

<div className="max-w-6xl mx-auto px-6">


<h2 className="text-3xl font-bold text-center">

Everything Your Business Needs Online

</h2>


<div className="grid md:grid-cols-3 gap-6 mt-10">


{
features.map((item,index)=>{

const Icon=item.icon;

return (

<div
key={index}
className="bg-white rounded-xl p-6 shadow-sm"
>

<Icon className="text-blue-600"/>


<h3 className="font-semibold text-lg mt-4">

{item.title}

</h3>


<p className="text-gray-600 mt-2">

{item.desc}

</p>


</div>

)

})
}


</div>

</div>

</section>




{/* ================= PRICING ================= */}


<section className="py-16">

<div className="max-w-6xl mx-auto px-6">


<h2 className="text-3xl font-bold text-center">

Simple Website Packages

</h2>


<div className="grid md:grid-cols-3 gap-6 mt-10">


{
plans.map((plan,index)=>(

<div
key={index}
className={`border rounded-xl p-6 ${
plan.popular
?
"shadow-xl border-blue-500"
:
""
}`}
>


<h3 className="text-xl font-bold">

{plan.title}

</h3>


<div className="text-3xl font-bold mt-3">

{plan.price}

</div>


<ul className="mt-5 space-y-3">

{
plan.items.map((i)=>(

<li
key={i}
className="flex gap-2"
>

<CheckCircle
size={18}
className="text-green-600"
/>

{i}

</li>

))
}

</ul>


</div>

))
}


</div>

</div>

</section>




{/* ================= CTA ================= */}


<section className="bg-blue-600 text-white py-16">

<div className="max-w-4xl mx-auto px-6 text-center">


<h2 className="text-3xl font-bold">

Ready To Take Your Business Online?

</h2>


<p className="mt-4">

Get your professional website and start growing online.

</p>


        <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold"
        >

        Request Free Demo

        </a>

        <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="
            fixed
            bottom-5
            right-5
            bg-green-500
            text-white
            px-5
            py-3
            rounded-full
            shadow-lg
            font-semibold
            z-50
            "
            >

            💬 WhatsApp

            </a>


</div>

</section>



    </div>

    </>
  );
};


export default GetBusinessWebsite;