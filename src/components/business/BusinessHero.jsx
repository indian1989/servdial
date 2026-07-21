import {
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  Share2,
  Bookmark
} from "lucide-react";


const BusinessHero = ({
  business,
  images,
  activeImg,
  setShowGallery,
  handleCall,
  handleWhatsApp,
  handleDirections,
  setShowShareMenu
}) => {


return (

<section className="relative">


{/* COVER IMAGE */}

<div className="h-72 md:h-[430px] overflow-hidden">

<img
src={images[activeImg]}
alt={business.name}
className="w-full h-full object-cover cursor-pointer"
onClick={()=>setShowGallery(true)}
/>


<div className="
absolute inset-0 
bg-gradient-to-t 
from-black/80 
via-black/30 
to-transparent
"/>

</div>




{/* BUSINESS INFO */}

<div className="
absolute 
bottom-5 
left-5 
right-5 
text-white
">


<h1 className="
text-3xl
md:text-5xl
font-bold
">
{business.name}
</h1>



<div className="flex flex-wrap gap-3 mt-3">


<span>
⭐ {business.averageRating || "New"}
</span>


<span>
({business.totalReviews || 0} Reviews)
</span>



<span>
📍 {business.city}, {business.state}
</span>



</div>




<div className="flex gap-2 mt-4 flex-wrap">


<button
onClick={handleCall}
className="
bg-blue-600 
px-4 py-2 
rounded-xl 
flex gap-2
"
>

<Phone size={18}/>
Call Now

</button>



<button
onClick={handleWhatsApp}
className="
bg-green-600 
px-4 py-2 
rounded-xl 
flex gap-2
"
>

<MessageCircle size={18}/>
WhatsApp

</button>




<button
onClick={handleDirections}
className="
bg-gray-800 
px-4 py-2 
rounded-xl
flex gap-2
"
>

<Navigation size={18}/>
Direction

</button>



<button
className="
bg-white/20
px-4 py-2
rounded-xl
"
>

<Bookmark size={18}/>

</button>



<button
onClick={()=>setShowShareMenu(true)}
className="
bg-white/20
px-4 py-2
rounded-xl
"
>

<Share2 size={18}/>

</button>



</div>



<div className="flex gap-2 mt-3">


{
business.isVerified &&
<span className="
bg-green-500/90
px-3 py-1
rounded-full
text-sm
">

✔ Verified Business

</span>
}



<span className="
bg-yellow-500/90
px-3 py-1
rounded-full
text-sm
">

ServDial Trusted Partner

</span>


</div>


</div>



</section>

)

}


export default BusinessHero;