import {
  Phone,
  MessageCircle,
  Navigation,
  BadgeCheck,
  Crown,
  ShieldCheck,
  Share2,
  Bookmark,
} from "lucide-react";


const BusinessHero = ({
  business,
  images = [],
  activeImg = 0,
  setShowGallery,
  handleCall,
  handleWhatsApp,
  handleDirections,
  setShowShareMenu,
  distance,
}) => {


  const heroImage =
    images?.[activeImg] ||
    business?.logo ||
    "/servdial-logo.png";



  return (

<section className="relative w-full">


{/* ================= HERO IMAGE ================= */}

<div
className="
relative
h-64
sm:h-72
md:h-[430px]
overflow-hidden
"
>


<img

src={heroImage}

alt={`${business.name} ${business.categoryId?.name || "business"} in ${business.cityName || ""}`}

loading="eager"

fetchPriority="high"

decoding="async"

className="
w-full
h-full
object-cover
cursor-pointer
"

onClick={() => setShowGallery?.(true)}

/>



<div
className="
absolute
inset-0
bg-gradient-to-t
from-black/90
via-black/40
to-transparent
"
/>


</div>





{/* ================= BUSINESS INFO ================= */}


<div
className="
absolute
bottom-0
left-0
right-0
p-4
sm:p-6
text-white
"
>



<h1
className="
text-2xl
sm:text-3xl
md:text-5xl
font-bold
leading-tight
"
>

{business.name}

</h1>



<div
className="
flex
items-center
gap-2
mt-2
text-sm
sm:text-base
"
>

<span>

⭐ {business.averageRating || "New"}

</span>


<span>

({business.totalReviews || 0} Reviews)

</span>


</div>





{/* ================= ACTION BUTTONS ================= */}


<div
className="
grid
grid-cols-2
sm:flex
gap-2
mt-4
"
>



<button

onClick={handleCall}

aria-label="Call business"

className="
bg-blue-600
px-4
py-2
rounded-xl
flex
justify-center
items-center
gap-2
text-sm
"

>

<Phone size={18}/>

Call

</button>




<button

onClick={handleWhatsApp}

aria-label="WhatsApp business"

className="
bg-green-600
px-4
py-2
rounded-xl
flex
justify-center
items-center
gap-2
text-sm
"

>

<MessageCircle size={18}/>

WhatsApp

</button>




<button

onClick={handleDirections}

aria-label="Get directions"

className="
bg-gray-800
px-4
py-2
rounded-xl
flex
justify-center
items-center
gap-2
text-sm
"

>

<Navigation size={18}/>

Direction

</button>




<button

aria-label="Save business"

className="
bg-white/20
px-4
py-2
rounded-xl
flex
justify-center
"

>

<Bookmark size={18}/>

</button>



<button

onClick={()=>setShowShareMenu(true)}

aria-label="Share business"

className="
bg-white/20
px-4
py-2
rounded-xl
flex
justify-center
"

>

<Share2 size={18}/>

</button>



</div>





{/* ================= BADGES ================= */}


<div
className="
flex
flex-wrap
gap-2
mt-3
"
>


{
business.isVerified &&

<span
className="
bg-green-500
px-3
py-1
rounded-full
text-xs
font-semibold
flex
items-center
gap-1
"
>

<BadgeCheck size={14}/>

Verified

</span>

}




{
business.plan==="trusted" &&

<span
className="
bg-purple-600
px-3
py-1
rounded-full
text-xs
font-semibold
flex
items-center
gap-1
"
>

<ShieldCheck size={14}/>

Trusted

</span>

}





{
business.plan==="premium" &&

<span

className="
bg-yellow-400
text-black
px-3
py-1
rounded-full
text-xs
font-semibold
flex
items-center
gap-1
"

>

<Crown size={14}/>

Premium

</span>

}

  {/* RIGHT SIDE DISTANCE */}
{distance !== null && (
  <span
    className={`
      backdrop-blur
      text-xs
      px-3
      py-1
      rounded-full
      shadow-lg
      font-semibold
      ml-auto
      flex
      items-center
      gap-1
      whitespace-nowrap

      ${
        distance < 0.1
          ? "bg-green-500/90 text-white"
          : "bg-black/70 text-white"
      }
    `}
  >
    📍{" "}
    {distance < 0.1
      ? "Nearby"
      : `${distance.toFixed(1)} km away`}
  </span>
)}

</div>



</div>



</section>

  );

};



export default BusinessHero;