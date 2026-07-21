import {
  Info,
  Briefcase,
  IndianRupee,
  CalendarCheck,
  Image,
  Star,
  Tag,
  Clock,
  MapPin,
  HelpCircle
} from "lucide-react";


const BusinessTabs = ({ business }) => {


  const tabs = [
    {
      id: "about",
      label: "About",
      icon: Info
    },

    {
      id: "services",
      label: "Services",
      icon: Briefcase
    },


    {
      id: "pricing",
      label: "Pricing",
      icon: IndianRupee
    },


    {
      id: "booking",
      label: "Booking",
      icon: CalendarCheck,
      show:
        business?.bookingEnabled
    },


    {
      id: "photos",
      label: "Photos",
      icon: Image
    },


    {
      id: "reviews",
      label: "Reviews",
      icon: Star
    },


    {
      id: "offers",
      label: "Offers",
      icon: Tag
    },


    {
      id: "hours",
      label: "Hours",
      icon: Clock
    },


    {
      id: "location",
      label: "Location",
      icon: MapPin
    },


    {
      id: "faq",
      label: "FAQ",
      icon: HelpCircle
    }

  ];




  const scrollToSection = (id) => {

    const element =
      document.getElementById(id);


    if(element){

      element.scrollIntoView({
        behavior:"smooth",
        block:"start"
      });

    }

  };





return (

<div
className="
sticky
top-0
z-40
bg-white
border-b
shadow-sm
overflow-x-auto
"
>


<div
className="
max-w-7xl
mx-auto
px-4
flex
gap-2
py-3
min-w-max
"
>


{
tabs
.filter(
(tab)=> tab.show !== false
)
.map((tab)=>{


const Icon = tab.icon;


return (

<button

key={tab.id}

onClick={()=>
scrollToSection(tab.id)
}

className="
flex
items-center
gap-2
px-4
py-2
rounded-full
text-sm
font-medium
text-gray-600
hover:bg-blue-50
hover:text-blue-600
transition
"

>


<Icon size={16}/>


{tab.label}


</button>


)


})

}


</div>


</div>

)

}


export default BusinessTabs;