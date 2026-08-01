import {
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Truck,
  CreditCard,
  ShieldCheck
} from "lucide-react";


const QuickInfoBar = ({ business }) => {

  // ================= HOURS =================

  const getTodayStatus = () => {

  const hours = business?.businessHours;


  if (!hours) {
    return "Hours not available";
  }


  const today =
    new Date()
      .toLocaleDateString(
        "en-US",
        {
          weekday: "long"
        }
      )
      .toLowerCase();


  const todayHours = hours[today];


  if (!todayHours) {
    return "Closed today";
  }


  if (todayHours.closed) {
    return "Closed today";
  }


  if (
    todayHours.open &&
    todayHours.close
  ) {
    return `${todayHours.open} - ${todayHours.close}`;
  }


  return "Hours not available";

};


return (

<div className="
bg-white
rounded-2xl
shadow-sm
border
p-4
grid
grid-cols-2
md:grid-cols-4
gap-4
">


{/* PHONE */}

<div className="
flex
gap-3
items-center
">

<div className="
bg-blue-50
p-2
rounded-xl
text-blue-600
">

<Phone size={20}/>

</div>


<div>

<p className="text-xs text-gray-500">
Contact
</p>


<p className="font-medium text-sm">
{business.phone || "Not Available"}
</p>


</div>


</div>





{/* HOURS */}

<div className="
flex
gap-3
items-center
">


<div className="
bg-green-50
p-2
rounded-xl
text-green-600
">

<Clock size={20}/>

</div>


<div>


<p className="text-xs text-gray-500">
Opening Hours
</p>


<p className="font-medium text-sm">

{getTodayStatus()}

</p>


</div>


</div>






{/* RESPONSE */}

<div className="
flex
gap-3
items-center
">


<div className="
bg-purple-50
p-2
rounded-xl
text-purple-600
">

<MessageCircle size={20}/>

</div>



<div>


<p className="text-xs text-gray-500">
Response Time
</p>


<p className="font-medium text-sm">

{
business.responseTime
||
"Usually responds quickly"
}


</p>


</div>



</div>





{/* HOME SERVICE */}

{
business.homeService &&

<div className="
flex
gap-3
items-center
">


<div className="
bg-orange-50
p-2
rounded-xl
text-orange-600
">

<Truck size={20}/>

</div>



<div>

<p className="text-xs text-gray-500">
Service
</p>


<p className="font-medium text-sm">

Home Service Available

</p>


</div>


</div>

}





{/* PAYMENT */}

{
business.paymentOptions?.length > 0 &&

<div className="
flex
gap-3
items-center
">


<div className="
bg-yellow-50
p-2
rounded-xl
text-yellow-600
">

<CreditCard size={20}/>

</div>


<div>

<p className="text-xs text-gray-500">
Payment
</p>


<p className="font-medium text-sm">

{
business.paymentOptions.join(", ")
}

</p>


</div>


</div>

}





{/* VERIFIED */}

{
business.isVerified &&

<div className="
flex
gap-3
items-center
">


<div className="
bg-green-50
p-2
rounded-xl
text-green-600
">

<ShieldCheck size={20}/>

</div>


<div>

<p className="text-xs text-gray-500">
Trust
</p>


<p className="font-medium text-sm">

Verified Business

</p>


</div>


</div>

}



</div>

)

}


export default QuickInfoBar;