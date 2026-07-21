import {
  HelpCircle,
  ChevronDown
} from "lucide-react";

import { useState } from "react";


const BusinessFAQ = ({ faq = [] }) => {


const [openIndex,setOpenIndex] = useState(null);



if(!faq || faq.length===0){

return null;

}



return (

<section
id="faq"
className="
bg-white
rounded-2xl
shadow
p-5
"
>


<h2
className="
text-xl
font-bold
flex
items-center
gap-2
mb-5
"
>

<HelpCircle size={22}/>

Frequently Asked Questions

</h2>



<div
className="
space-y-3
"
>


{

faq.map((item,index)=>(


<div
key={index}
className="
border
rounded-xl
overflow-hidden
"
>



<button

onClick={()=>{

setOpenIndex(
openIndex===index
?
null
:
index
)

}}

className="
w-full
flex
justify-between
items-center
p-4
text-left
font-medium
"

>


<span>

{item.question}

</span>



<ChevronDown

size={18}

className={

openIndex===index
?
"rotate-180 transition"
:
"transition"

}

/>


</button>





{

openIndex===index &&

<div
className="
px-4
pb-4
text-sm
text-gray-600
leading-6
"
>

{item.answer}


</div>


}



</div>


))


}


</div>


</section>


)


}



export default BusinessFAQ;