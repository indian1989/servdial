import { useState } from "react";

import {
  HelpCircle,
  ChevronDown,
} from "lucide-react";

import BusinessSection from "./BusinessSection";
import BusinessSectionHeader from "./BusinessSectionHeader";

const BusinessFAQ = ({ faq = [] }) => {


const [openIndex,setOpenIndex] = useState(null);



if(!faq || faq.length===0){

return null;

}



return (

<BusinessSection id="faq">


<BusinessSectionHeader
        icon={HelpCircle}
        title="Frequently Asked Questions"
    />

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

className={`
    transition-transform
    duration-300
    ${openIndex === index ? "rotate-180" : ""}
`}

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


</BusinessSection>


)


}



export default BusinessFAQ;