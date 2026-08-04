import React, { useState } from "react";

import StaticPageLayout from "../../layouts/StaticPageLayout";
import Section from "../../components/common/Section";

import {
  HelpCircle,
  Users,
  Store,
  ShieldCheck,
} from "lucide-react";



const FAQItem = ({ question, answer }) => {

const [open,setOpen] = useState(false);


return (

<div className="
bg-gray-50
border
rounded-xl
p-4
mb-3
">


<button

onClick={()=>setOpen(!open)}

className="
flex
justify-between
items-center
w-full
text-left
font-medium
text-gray-800
"


>


<span>{question}</span>


<span className="text-xl text-gray-500">

{open ? "−" : "+"}

</span>


</button>



{open && (

<p className="
mt-3
text-sm
text-gray-600
leading-relaxed
">


{answer}


</p>

)}


</div>


);

};






const FAQ = () => {



const customerFAQs = [


{

question:
"How can I find businesses or services on ServDial?",


answer:
"You can search businesses by category, city, service name, or business name. ServDial helps you discover relevant local businesses based on your requirements."

},



{

question:
"Do I need an account to search businesses?",


answer:
"No. Anyone can browse available businesses and services. An account may be required for features such as reviews, saved preferences, or other user activities."

},



{

question:
"Can I contact businesses directly?",


answer:
"Yes. Business profiles may include available contact options such as phone, WhatsApp, website, or other communication methods provided by the business."

},



{

question:
"Are businesses verified by ServDial?",


answer:
"ServDial may review business information and documents where applicable. However, verification does not guarantee service quality, pricing, availability, or customer satisfaction. Users should verify details before hiring."

},



{

question:
"Can I leave reviews or ratings?",


answer:
"Yes, users may be able to share their experience through reviews and ratings. Reviews must be genuine and follow ServDial community guidelines."

},



{

question:
"Is ServDial responsible for services provided by businesses?",


answer:
"No. ServDial is a discovery platform connecting customers and businesses. Any agreement, payment, service quality, warranty, or dispute is between the customer and the respective business."

},


];






const providerFAQs = [


{

question:
"How can I list my business on ServDial?",


answer:
"Create a provider account, submit your business details, services, category, location, and required information. After review, your listing may become available on the platform."

},



{

question:
"Is business listing free?",


answer:
"ServDial may offer free listings as well as paid visibility features such as promotions, featured listings, and advertising options."

},



{

question:
"What information can providers add?",


answer:
"Providers can add business name, category, services, description, images, contact details, location, business hours, and other relevant information."

},



{

question:
"Can I update my business information later?",


answer:
"Yes. Providers can manage and update their business information through their dashboard according to available platform features."

},



{

question:
"How can I increase my business visibility?",


answer:
"Providers can improve visibility by maintaining complete profiles, adding accurate services, uploading quality images, collecting genuine reviews, and using available promotional features."

},



{

question:
"Can ServDial remove my listing?",


answer:
"Yes. ServDial may restrict or remove listings that violate platform policies, contain misleading information, or fail to meet quality and compliance requirements."

},


];








const accountFAQs = [


{

question:
"How can I create an account?",


answer:
"You can register through the ServDial registration process and provide required information for your account type."

},



{

question:
"How is my personal information protected?",


answer:
"ServDial follows reasonable security practices to protect user information. For more details, please review our Privacy Policy."

},



{

question:
"Can I request account deletion?",


answer:
"Yes. Users may contact ServDial support for account-related requests, including deletion requests where applicable."

},


];








const platformFAQs = [


{

question:
"Does ServDial operate only in India?",


answer:
"ServDial currently focuses on India and is designed to support local business discovery. The platform may expand to other countries and regions in the future."

},



{

question:
"Does ServDial charge customers for contacting businesses?",


answer:
"ServDial does not charge users simply for discovering businesses. Some advanced platform features or services may have separate terms."

},



{

question:
"Can ServDial change its policies?",


answer:
"Yes. ServDial reserves the right to update policies, features, pricing, and platform rules. Changes may be made without prior notice when required for legal, security, operational, or business reasons."

},


];








return (


<StaticPageLayout


title="Frequently Asked Questions (FAQ)"


subtitle="
Common questions about using ServDial for customers and businesses.
"



cta={{

title:
"Still have questions?",


subtitle:
"Contact our support team for additional assistance.",


actions:[

{
label:"Email Support",
link:"mailto:support.servdial@gmail.com",
primary:true
},


{
label:"Browse Services",
link:"/",
primary:false
}

]


}}



>



{/* CUSTOMERS */}


<Section title="Customer FAQs">


<div className="
flex
items-center
gap-3
mb-5
">


<Users className="text-blue-600"/>


<p className="text-sm text-gray-600">

Questions from users searching for local businesses and services.

</p>


</div>



{customerFAQs.map((item,index)=>(

<FAQItem

key={index}

question={item.question}

answer={item.answer}

/>

))}


</Section>









{/* PROVIDERS */}


<Section title="Business & Provider FAQs">


<div className="
flex
items-center
gap-3
mb-5
">


<Store className="text-green-600"/>


<p className="text-sm text-gray-600">

Questions for businesses and service providers listing on ServDial.

</p>


</div>



{providerFAQs.map((item,index)=>(

<FAQItem

key={index}

question={item.question}

answer={item.answer}

/>

))}


</Section>









{/* ACCOUNT */}


<Section title="Account & Privacy FAQs">


<div className="
flex
items-center
gap-3
mb-5
">


<ShieldCheck className="text-purple-600"/>


<p className="text-sm text-gray-600">

Questions related to accounts, privacy, and platform usage.

</p>


</div>



{accountFAQs.map((item,index)=>(

<FAQItem

key={index}

question={item.question}

answer={item.answer}

/>

))}


</Section>









{/* PLATFORM */}


<Section title="Platform Related FAQs">


{platformFAQs.map((item,index)=>(

<FAQItem

key={index}

question={item.question}

answer={item.answer}

/>

))}


</Section>






</StaticPageLayout>


);

};



export default FAQ;