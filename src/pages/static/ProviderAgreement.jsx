import React from "react";

import StaticPageLayout from "../../layouts/StaticPageLayout";
import Section from "../../components/common/Section";

import {
  Store,
  ShieldCheck,
  FileCheck,
  Users,
  AlertCircle,
  CreditCard,
  Ban,
  Globe,
  Mail,
} from "lucide-react";


const ProviderAgreement = () => {


return (

<StaticPageLayout


title="Provider Agreement"


subtitle="
Terms and responsibilities for businesses and service providers using ServDial.
"


cta={{

title:"Ready to grow your business with ServDial?",


subtitle:
"Create your business profile and connect with customers searching for services.",


actions:[

{
label:"List Your Business",
link:"/register",
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





<Section>


<div className="
bg-gray-50
rounded-2xl
p-6
flex
gap-4
">


<Store className="text-blue-600 mt-1"/>


<p className="text-sm text-gray-700 leading-relaxed">


This Provider Agreement explains the responsibilities,
requirements, and obligations of businesses and service
providers who create listings or use services on
<strong> ServDial</strong>.


By registering as a provider, you agree to follow these terms.


</p>


</div>


</Section>









<Section title="Provider Responsibility">


<div className="bg-gray-50 rounded-xl p-6">


<ul className="space-y-3 text-sm text-gray-700">


<li>
• Providers must provide accurate, complete, and updated
business information.
</li>


<li>
• Providers are responsible for their services, products,
pricing, availability, and customer commitments.
</li>


<li>
• Providers must comply with applicable laws, licenses,
registrations, and professional requirements.
</li>


</ul>


</div>


</Section>









<Section title="Business Information & Verification">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<FileCheck className="text-green-600"/>


<p className="text-sm text-gray-700">


ServDial may request business details, documents, images,
or other information for verification purposes.


Providing information does not guarantee approval, ranking,
visibility, or customer leads.


</p>


</div>


</div>


</Section>









<Section title="Service Quality & Customer Interaction">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<Users className="text-purple-600"/>


<p className="text-sm text-gray-700">


Providers are responsible for maintaining professional
communication, transparent pricing, timely responses,
and quality service delivery.


Any dispute regarding actual services remains between the
customer and provider.


</p>


</div>


</div>


</Section>









<Section title="Reviews & Ratings">


<div className="bg-gray-50 rounded-xl p-6">


<p className="text-sm text-gray-700">


Providers must not create fake reviews, manipulate ratings,
mislead customers, or upload fraudulent information.


ServDial may remove suspicious content or take appropriate
action against violations.


</p>


</div>


</Section>









<Section title="Paid Services & Promotions">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<CreditCard className="text-blue-600"/>


<p className="text-sm text-gray-700">


ServDial may provide optional paid features including
featured listings, advertisements, promotions, or enhanced
visibility options.


Paid services improve visibility but do not guarantee
customers, sales, or business success.


</p>


</div>


</div>


</Section>









<Section title="Restricted Activities">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<Ban className="text-red-600"/>


<ul className="text-sm text-gray-700 space-y-2">


<li>
• Fake business information or misleading claims.
</li>


<li>
• Illegal products, services, or activities.
</li>


<li>
• Misuse of customer information.
</li>


<li>
• Attempts to manipulate ServDial systems.
</li>


</ul>


</div>


</div>


</Section>









<Section title="Account Suspension">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<ShieldCheck className="text-orange-600"/>


<p className="text-sm text-gray-700">


ServDial reserves the right to suspend, restrict, or remove
provider accounts and listings that violate platform rules,
legal requirements, or community standards.


</p>


</div>


</div>


</Section>









<Section title="Global Availability">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<Globe className="text-indigo-600"/>


<p className="text-sm text-gray-700">


ServDial currently focuses on India.


As the platform expands internationally, providers may be
required to comply with additional regional laws and
requirements.


</p>


</div>


</div>


</Section>









<Section title="Changes To Provider Agreement">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<AlertCircle className="text-orange-600"/>


<p className="text-sm text-gray-700">


ServDial may update this Provider Agreement from time to time.


Changes may be made without prior notice when required for
legal, security, operational, or business reasons.


Continued use of provider services after updates indicates
acceptance of revised terms.


</p>


</div>


</div>


</Section>









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


Provider support:


<br/>


<strong>Email:</strong>
support.servdial@gmail.com


</p>


</div>


</Section>





</StaticPageLayout>

);

};


export default ProviderAgreement;