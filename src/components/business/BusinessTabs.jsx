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
  HelpCircle,
  Utensils
} from "lucide-react";


const BusinessTabs = ({ business }) => {


  /*
  |--------------------------------------------------------------------------
  | FEATURE → TAB CONFIG
  |--------------------------------------------------------------------------
  */

  const featureTabs = {

   services: {
 id:"services",
 label:"Services",
 icon:Briefcase
},


    pricing: {
      id: "pricing",
      label: "Pricing",
      icon: IndianRupee,
    },


    catalog: {
      id: "catalog",
      label: "Catalog",
      icon: Tag,
    },


    food_menu: {
      id: "food_menu",
      label: "Menu",
      icon: Utensils,
    },


    table_booking: {
      id: "booking",
      label: "Booking",
      icon: CalendarCheck,
    },


    room_booking: {
      id: "booking",
      label: "Booking",
      icon: CalendarCheck,
    },


    appointment_booking: {
      id: "booking",
      label: "Booking",
      icon: CalendarCheck,
    },


    party_booking: {
      id: "booking",
      label: "Booking",
      icon: CalendarCheck,
    },


    offers: {
      id:"offers",
      label:"Offers",
      icon:Tag,
    },


    business_hours:{
      id:"hours",
      label:"Hours",
      icon:Clock,
    },


    faq:{
      id:"faq",
      label:"FAQ",
      icon:HelpCircle,
    }

  };




  /*
  |--------------------------------------------------------------------------
  | CREATE DYNAMIC TABS
  |--------------------------------------------------------------------------
  */


  const dynamicTabs = 
  (
    business?.categoryId?.features || []
  )
  .map(feature => {

    return featureTabs[feature];

  })
  .filter(Boolean);



  /*
  |--------------------------------------------------------------------------
  | REMOVE DUPLICATE IDS
  |--------------------------------------------------------------------------
  */


  const uniqueTabs = Array.from(
    new Map(
      dynamicTabs.map(
        tab=>[
          tab.id,
          tab
        ]
      )
    ).values()
  );




  /*
  |--------------------------------------------------------------------------
  | FINAL TABS
  |--------------------------------------------------------------------------
  */


  const tabs = [

    // ALWAYS SHOW
    {
      id:"about",
      label:"About",
      icon:Info,
    },


    ...uniqueTabs,



    // PHOTOS
    ...(business?.images?.length
      ?
      [
        {
          id:"photos",
          label:"Photos",
          icon:Image,
        }
      ]
      :
      []
    ),



    // ALWAYS SHOW
    {
      id:"reviews",
      label:"Reviews",
      icon:Star,
    },


    {
      id:"location",
      label:"Location",
      icon:MapPin,
    }

  ];






  const scrollToSection = (id)=>{

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
tabs.map((tab)=>{


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

);


})
}


</div>


</div>


);


};


export default BusinessTabs;