import React from "react";

import StaticPageLayout from "../../layouts/StaticPageLayout";
import Section from "../../components/common/Section";

import {
  RefreshCcw,
  CreditCard,
  AlertCircle,
  ShieldCheck,
  Clock,
  Mail,
  Globe,
} from "lucide-react";


const RefundPolicy = () => {


return (

<StaticPageLayout


title="Refund Policy"


subtitle="
Information regarding payments, refunds, cancellations, and paid services on ServDial.
"


cta={{

title:"Need help with a payment or refund?",


subtitle:
"Contact our support team with your transaction details for assistance.",


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


{/* INTRO */}


<Section>


<div className="
bg-gray-50
rounded-2xl
p-6
flex
items-start
gap-4
">


<RefreshCcw className="text-blue-600 mt-1"/>


<p className="text-sm text-gray-700 leading-relaxed">


This Refund Policy explains the terms regarding payments,
cancellations, and refunds for services provided through
<strong> ServDial</strong>.


ServDial operates as a business discovery and digital listing
platform. Refund eligibility depends on the type of service,
payment, and transaction involved.


</p>


</div>


</Section>









{/* PLATFORM ROLE */}


<Section title="ServDial Payment Role">


<div className="bg-gray-50 rounded-xl p-6">


<p className="text-sm text-gray-700">


ServDial may provide paid platform features such as business
promotion, featured listings, advertising opportunities, or
other digital services.


Payments made directly between customers and businesses for
actual services, products, bookings, or purchases are the
responsibility of the respective parties unless ServDial
explicitly manages such transactions.


</p>


</div>


</Section>









{/* PROVIDER SERVICES */}


<Section title="Refunds For Business & Promotion Services">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<CreditCard className="text-green-600"/>


<ul className="
space-y-3
text-sm
text-gray-700
">


<li>
• Payments for featured listings, advertisements, promotions,
or digital visibility services may be eligible for refund only
under applicable refund conditions.
</li>


<li>
• Once a digital promotional service has started or benefits
have been delivered, refund requests may not be accepted.
</li>


<li>
• Refund eligibility may depend on service duration, usage,
delivery status, and applicable terms.
</li>


</ul>


</div>


</div>


</Section>









{/* NON REFUND */}


<Section title="Non-Refundable Services">


<div className="bg-gray-50 rounded-xl p-6">


<ul className="
space-y-2
text-sm
text-gray-700
">


<li>
• Completed digital services or promotional campaigns.
</li>


<li>
• Services already activated or delivered to the account.
</li>


<li>
• Incorrect information provided by users or businesses.
</li>


<li>
• Changes in business decisions after receiving platform benefits.
</li>


</ul>


</div>


</Section>









{/* REQUEST */}


<Section title="Refund Request Process">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<Clock className="text-orange-600"/>


<p className="text-sm text-gray-700">


Refund requests should be submitted through official ServDial
support channels with relevant details such as registered email,
transaction information, payment reference, and reason for the
request.


ServDial may review each request individually before approving
or rejecting a refund.


</p>


</div>


</div>


</Section>









{/* DUPLICATE */}


<Section title="Duplicate Or Unauthorized Payments">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<ShieldCheck className="text-purple-600"/>


<p className="text-sm text-gray-700">


If a duplicate payment or unauthorized transaction is identified,
users should contact ServDial support immediately.


After verification, appropriate action may be taken according
to the payment circumstances.


</p>


</div>


</div>


</Section>









{/* THIRD PARTY */}


<Section title="Third-Party Payment Services">


<div className="bg-gray-50 rounded-xl p-6">


<p className="text-sm text-gray-700">


ServDial may use third-party payment gateways or financial
service providers.


Refund processing timelines may depend on payment partners,
banks, and applicable financial regulations.


ServDial is not responsible for delays caused by third-party
payment systems.


</p>


</div>


</Section>









{/* PROCESSING TIME */}


<Section title="Refund Processing Time">


<div className="bg-gray-50 rounded-xl p-6">


<p className="text-sm text-gray-700">


Approved refunds will be processed through the original payment
method where possible.


Actual credit time may vary depending on banks, payment
providers, and regional financial systems.


</p>


</div>


</Section>









{/* GLOBAL */}


<Section title="Regional & International Payments">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<Globe className="text-indigo-600"/>


<p className="text-sm text-gray-700">


ServDial currently focuses on India.


As ServDial expands globally, refund procedures may be updated
to comply with applicable laws, payment regulations, and regional
requirements.


</p>


</div>


</div>


</Section>









{/* CHANGES */}


<Section title="Changes To This Refund Policy">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<AlertCircle className="text-orange-600"/>


<p className="text-sm text-gray-700">


ServDial reserves the right to modify, update, or change this
Refund Policy at any time.


Changes may be made without prior notice when required due to
legal, security, operational, payment, or business reasons.


Users are encouraged to review this policy periodically.


</p>


</div>


</div>


</Section>









{/* CONTACT */}


<Section title="Contact Us">


<div className="
bg-gray-50
rounded-xl
p-6
flex
gap-4
">


<Mail/>


<p className="text-sm text-gray-700">


For refund-related queries:


<br/>


<strong>Email:</strong>
support.servdial@gmail.com


<br/>


<strong>Last Updated:</strong>
January 2026


</p>


</div>


</Section>






</StaticPageLayout>


);

};


export default RefundPolicy;