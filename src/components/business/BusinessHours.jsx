import {
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";


const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday"
];


const formatDay = (day)=>{

  return day.charAt(0).toUpperCase()+day.slice(1);

};



const formatTime = (time)=>{

  if(!time) return "";

  const [hour,minute] = time.split(":");

  const h = Number(hour);

  const suffix = h >= 12 ? "PM" : "AM";

  const formatted =
    h % 12 || 12;

  return `${formatted}:${minute} ${suffix}`;

};



const BusinessHours = ({hours})=>{


if(!hours){

return null;

}



const now =
new Date();

const currentDay =
days[now.getDay()===0 ? 6 : now.getDay()-1];



const today =
hours[currentDay];



const isOpen = ()=>{


if(!today || today.closed)
return false;


if(today.is24h)
return true;


const current =
now.getHours()*60+
now.getMinutes();


const open =
today.open?.split(":");

const close =
today.close?.split(":");


if(!open || !close)
return false;


const openMin =
Number(open[0])*60+
Number(open[1]);


const closeMin =
Number(close[0])*60+
Number(close[1]);


return current>=openMin &&
current<=closeMin;


};



return (

<section
id="hours"
className="
bg-white
rounded-2xl
shadow
p-5
"
>


<div className="
flex
items-center
justify-between
mb-5
">


<h2 className="
text-xl
font-bold
flex
gap-2
items-center
">

<Clock size={22}/>

Business Hours

</h2>



{
isOpen()
?
<div className="
flex
items-center
gap-1
text-green-600
font-semibold
">

<CheckCircle size={18}/>

Open Now

</div>

:

<div className="
flex
items-center
gap-1
text-red-500
font-semibold
">

<XCircle size={18}/>

Closed

</div>

}



</div>





<div className="
space-y-3
">


{

days.map(day=>{


const item =
hours[day];


return (

<div
key={day}
className="
flex
justify-between
border-b
pb-2
text-sm
"
>


<span className="
font-medium
capitalize
">

{formatDay(day)}

</span>



<span
className={

item?.closed
?
"text-red-500"
:
"text-gray-600"

}
>


{
item?.closed

?

"Closed"


:

item?.is24h

?

"24 Hours"


:

`${formatTime(item?.open)} - ${formatTime(item?.close)}`

}


</span>


</div>


)


})

}


</div>



</section>


)

}


export default BusinessHours;