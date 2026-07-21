import {
Calendar,
Utensils,
Bed,
Wrench,
Stethoscope,
DollarSign
} from "lucide-react";


const SmartActionBar = ({business,setBooking})=>{


const category =
(
business.categoryId?.name ||
business.category ||
""
).toLowerCase();



let actions=[];



if(
category.includes("restaurant") ||
category.includes("hotel")
){

actions=[
{
title:"Book Table",
icon:<Utensils/>
},
{
title:"Menu",
icon:<Calendar/>
},
{
title:"Party Booking",
icon:<Calendar/>
}
]

}


else if(
category.includes("hotel")
){

actions=[
{
title:"Book Room",
icon:<Bed/>
},
{
title:"Check Availability",
icon:<Calendar/>
}

]

}


else if(
category.includes("electrician") ||
category.includes("plumber") ||
category.includes("repair")
){

actions=[
{
title:"Book Service",
icon:<Wrench/>
},
{
title:"View Price",
icon:<DollarSign/>
}

]

}


else if(category.includes("doctor")){


actions=[
{
title:"Book Appointment",
icon:<Stethoscope/>
}

]

}



return (

<div className="
bg-white
shadow
rounded-xl
p-4
flex
gap-3
overflow-x-auto
">


{
actions.map((a,i)=>(


<button
key={i}
onClick={()=>setBooking(true)}
className="
min-w-[140px]
border
rounded-xl
p-3
flex
flex-col
items-center
gap-2
hover:bg-blue-50
"
>

{a.icon}

<span className="text-sm">

{a.title}

</span>


</button>


))
}


</div>

)

}


export default SmartActionBar;