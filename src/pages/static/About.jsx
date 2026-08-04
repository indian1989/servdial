import StaticPageLayout from "../../layouts/StaticPageLayout";
import Section from "../../components/common/Section";

import {
  Search,
  Phone,
  Store,
  Users,
  MapPin,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Globe,
  ShieldCheck,
} from "lucide-react";


const About = () => {
  return (
    <StaticPageLayout

      title="About ServDial"

      subtitle="
      ServDial is a modern business discovery platform that connects customers
      with local businesses and service providers through simple, reliable,
      and location-based search.
      "

      cta={{
        title:
          "Grow your business with ServDial",

        subtitle:
          "Create your digital presence, showcase your services, and connect with customers searching for businesses like yours.",

        actions:[
          {
            label:"List Your Business",
            link:"/register",
            primary:true,
          },
          {
            label:"Explore Services",
            link:"/",
            primary:false,
          }
        ]
      }}

    >


{/* INTRO */}

<Section title="Connecting Customers With Businesses">

<div className="space-y-4 text-gray-700 leading-relaxed">

<p>
ServDial is built to make business discovery simple, fast, and convenient.
Our platform helps people find useful services, shops, restaurants,
professionals, and businesses based on their location and requirements.
</p>


<p>
From electricians and repair professionals to restaurants, hotels,
salons, healthcare providers, and local stores, ServDial helps customers
discover businesses and connect with them directly.
</p>


<p>
At the same time, we help businesses build their online presence,
showcase their services, and reach customers who are actively looking
for their products or services.
</p>


</div>

</Section>




{/* WHO WE ARE */}

<Section title="Who We Are">


<div className="grid md:grid-cols-3 gap-6 mt-6">


<div className="border rounded-2xl p-6 bg-white shadow-sm">

<div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">

<Search className="text-blue-600"/>

</div>


<h3 className="font-semibold text-lg mb-2">
Smart Discovery
</h3>


<p className="text-sm text-gray-600">
Helping users find relevant businesses through categories,
locations, and service requirements.
</p>

</div>




<div className="border rounded-2xl p-6 bg-white shadow-sm">

<div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">

<Store className="text-green-600"/>

</div>


<h3 className="font-semibold text-lg mb-2">
Business Growth
</h3>


<p className="text-sm text-gray-600">
Providing businesses with digital visibility and opportunities
to connect with potential customers.
</p>

</div>




<div className="border rounded-2xl p-6 bg-white shadow-sm">

<div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">

<Globe className="text-purple-600"/>

</div>


<h3 className="font-semibold text-lg mb-2">
Built For Expansion
</h3>


<p className="text-sm text-gray-600">
Starting with India and designed with a vision to support
business discovery globally in the future.
</p>

</div>



</div>


</Section>






{/* MISSION */}

<Section title="Our Mission">


<div className="bg-white border rounded-2xl p-6 shadow-sm">


<div className="flex items-center gap-3 mb-4">

<Sparkles className="text-blue-600"/>

<h3 className="text-xl font-semibold">
Making Business Discovery Easier
</h3>

</div>



<p className="text-gray-700 mb-5">

Our mission is to create a trusted digital ecosystem where customers
can discover businesses easily and businesses can grow through better
online visibility.

</p>



<ul className="space-y-3 text-gray-700">


<li className="flex gap-2">

<CheckCircle2 className="text-blue-600 mt-1" size={18}/>

Help customers discover relevant services quickly

</li>



<li className="flex gap-2">

<CheckCircle2 className="text-blue-600 mt-1" size={18}/>

Support small and growing businesses digitally

</li>



<li className="flex gap-2">

<CheckCircle2 className="text-blue-600 mt-1" size={18}/>

Create a simple connection between demand and services

</li>



</ul>



</div>


</Section>







{/* HOW IT WORKS */}

<Section title="How ServDial Works">


<div className="grid md:grid-cols-3 gap-6 mt-6">


{
[
{
icon:<Search/>,
title:"Search",
text:"Find businesses by category, location, or service."
},

{
icon:<ShieldCheck/>,
title:"Explore",
text:"View business information, services, images, and details."
},


{
icon:<Phone/>,
title:"Connect",
text:"Contact businesses directly through available channels."
}

].map((item,index)=>(


<div
key={index}
className="bg-gray-50 rounded-2xl p-6 text-center"
>


<div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white shadow flex items-center justify-center text-blue-600">

{item.icon}

</div>



<h3 className="font-semibold mb-2">
{item.title}
</h3>


<p className="text-sm text-gray-600">
{item.text}
</p>


</div>


))

}



</div>


</Section>







{/* USERS BUSINESS */}

<Section title="Built For Customers And Businesses">


<div className="grid md:grid-cols-2 gap-6">


<div className="border rounded-2xl p-6">


<h3 className="font-semibold text-xl mb-4 flex gap-2 items-center">

<Users className="text-blue-600"/>

For Customers

</h3>



<ul className="space-y-3 text-gray-700">


<li className="flex gap-2">
<CheckCircle2 size={18} className="text-blue-600"/>
Find services near your location
</li>


<li className="flex gap-2">
<CheckCircle2 size={18} className="text-blue-600"/>
Explore businesses and categories
</li>


<li className="flex gap-2">
<CheckCircle2 size={18} className="text-blue-600"/>
Connect directly with providers
</li>


</ul>


</div>





<div className="border rounded-2xl p-6">


<h3 className="font-semibold text-xl mb-4 flex gap-2 items-center">

<Store className="text-green-600"/>

For Businesses

</h3>


<ul className="space-y-3 text-gray-700">


<li className="flex gap-2">
<CheckCircle2 size={18} className="text-green-600"/>
Create an online business profile
</li>


<li className="flex gap-2">
<CheckCircle2 size={18} className="text-green-600"/>
Showcase products and services
</li>


<li className="flex gap-2">
<CheckCircle2 size={18} className="text-green-600"/>
Reach customers searching online
</li>


</ul>


</div>


</div>


</Section>







{/* FUTURE */}

<Section title="Our Future Vision">


<div className="bg-gradient-to-r from-blue-50 via-white to-green-50 border rounded-2xl p-6">


<div className="flex gap-4">


<MapPin className="text-blue-600"/>


<p className="text-gray-700 leading-relaxed">

ServDial is currently focused on helping businesses and customers
across India. Our long-term vision is to build a global platform where
people can discover trusted businesses and services anywhere.

</p>


</div>


</div>


</Section>







{/* PROMISE */}

<Section title="Our Promise">


<div className="bg-gray-900 text-white rounded-3xl p-8">


<h3 className="text-2xl font-bold mb-4">

Better discovery. Better connections. Better growth.

</h3>


<p className="text-gray-300 leading-relaxed mb-6">

We continuously improve ServDial to create a better experience for
customers searching for services and businesses looking for growth
opportunities.

</p>



<div className="flex flex-wrap gap-5 text-sm text-gray-300">


<span className="flex items-center gap-2">
<Clock size={16}/>
Easy Discovery
</span>


<span className="flex items-center gap-2">
<ShieldCheck size={16}/>
Reliable Information
</span>


<span className="flex items-center gap-2">
<TrendingUp size={16}/>
Business Growth
</span>


</div>


</div>


</Section>




</StaticPageLayout>
  );
};


export default About;