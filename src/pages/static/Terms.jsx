import React from "react";

import StaticPageLayout from "../../layouts/StaticPageLayout";
import Section from "../../components/common/Section";

import {
  FileText,
  AlertCircle,
  UserCheck,
  Store,
  ShieldCheck,
  Globe,
  Lock,
  CreditCard,
  Ban,
  Mail,
} from "lucide-react";


const Terms = () => {

return (

<StaticPageLayout

title="Terms & Conditions"

subtitle="
Rules and guidelines governing the use of ServDial platform and services.
"


cta={{

title:"Questions about our terms?",

subtitle:
"Contact our support team for clarification regarding platform usage.",


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
gap-4
items-start
">


<AlertCircle className="text-orange-600 mt-1"/>


<p className="text-gray-700 text-sm leading-relaxed">


By accessing or using <strong>ServDial</strong>, you agree to
these Terms & Conditions.


ServDial is a digital platform that helps users discover
businesses and services and helps providers showcase their
businesses online.


If you do not agree with these terms, please do not use the
platform.


</p>


</div>


</Section>








{/* PLATFORM ROLE */}

<Section title="Role of ServDial">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3 mb-3">


<Store className="text-blue-600"/>


<h3 className="font-semibold">
Business Discovery Platform
</h3>


</div>


<p className="text-sm text-gray-700">


ServDial provides technology infrastructure for discovering,
listing, searching, and connecting with businesses and service
providers.


ServDial does not directly provide services listed by businesses
and is not responsible for agreements, transactions, payments,
quality, delivery, or performance between customers and providers.


</p>


</div>


</Section>







{/* USERS */}

<Section title="User Responsibilities">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3 mb-3">


<UserCheck className="text-green-600"/>


<h3 className="font-semibold">
Customer Responsibilities
</h3>


</div>


<ul className="space-y-2 text-sm text-gray-700">


<li>
• Provide accurate information while creating an account.
</li>


<li>
• Verify business details, pricing, availability, and service
quality before making decisions.
</li>


<li>
• Communicate respectfully with businesses and service providers.
</li>


<li>
• Do not misuse the platform for illegal or harmful activities.
</li>


</ul>


</div>


</Section>







{/* PROVIDERS */}

<Section title="Provider & Business Responsibilities">


<div className="bg-gray-50 rounded-xl p-6">


<ul className="space-y-3 text-sm text-gray-700">


<li>
• Providers must submit accurate and updated business information.
</li>


<li>
• Businesses are responsible for their services, pricing,
licenses, permissions, and customer commitments.
</li>


<li>
• Providers must not upload misleading information, fake reviews,
or unauthorized content.
</li>


<li>
• Businesses must comply with applicable laws and regulations.
</li>


</ul>


</div>


</Section>







{/* LISTING */}

<Section title="Business Listings & Verification">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<ShieldCheck className="text-purple-600"/>


<p className="text-sm text-gray-700">


ServDial may review, verify, approve, reject, modify, or remove
business listings based on platform policies.


Verification badges or featured status do not guarantee service
quality, customer satisfaction, legality, or business performance.


</p>


</div>


</div>


</Section>








{/* PAYMENTS */}

<Section title="Payments & Paid Services">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<CreditCard className="text-blue-600"/>


<p className="text-sm text-gray-700">


ServDial may provide paid features including promotions,
featured listings, advertisements, subscriptions, or visibility
enhancement services.


Payment terms, pricing, and availability may change from time to
time.


Any transaction between customers and businesses remains the
responsibility of the respective parties unless explicitly stated
otherwise.


</p>


</div>


</div>


</Section>








{/* PROHIBITED */}

<Section title="Prohibited Activities">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<Ban className="text-red-600"/>


<ul className="space-y-2 text-sm text-gray-700">


<li>
• Creating fake accounts or misleading listings.
</li>


<li>
• Uploading illegal, harmful, or copyrighted content without permission.
</li>


<li>
• Attempting to damage, hack, or disrupt the platform.
</li>


<li>
• Using ServDial for fraudulent activities.
</li>


</ul>


</div>


</div>


</Section>








{/* ACCOUNT */}

<Section title="Account Suspension & Removal">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<Lock className="text-red-500"/>


<p className="text-sm text-gray-700">


ServDial reserves the right to restrict, suspend, or remove
accounts, listings, or content that violate these terms,
community standards, legal requirements, or platform policies.


</p>


</div>


</div>


</Section>








{/* THIRD PARTY */}

<Section title="Third-Party Services">


<div className="bg-gray-50 rounded-xl p-6">


<p className="text-sm text-gray-700">


ServDial may use third-party services including maps,
payments, hosting, analytics, communication tools, and other
integrations.


ServDial is not responsible for third-party availability,
security, policies, or services.


</p>


</div>


</Section>








{/* INTELLECTUAL */}

<Section title="Intellectual Property">


<div className="bg-gray-50 rounded-xl p-6">


<p className="text-sm text-gray-700">


All ServDial branding, design, logos, software, content, and
platform features are protected by applicable intellectual
property laws.


Users may not copy, modify, distribute, or misuse ServDial
content without written permission.


</p>


</div>


</Section>








{/* GLOBAL */}

<Section title="Applicable Laws & Global Expansion">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<Globe className="text-indigo-600"/>


<p className="text-sm text-gray-700">


ServDial currently focuses on businesses and users in India.


As ServDial expands internationally, additional laws,
regulations, and regional requirements may apply depending on
the country of operation.


</p>


</div>


</div>


</Section>








{/* CHANGES */}

<Section title="Changes To These Terms">


<div className="bg-gray-50 rounded-xl p-6">


<p className="text-sm text-gray-700">


ServDial reserves the right to update, modify, or replace these
Terms & Conditions at any time.


Changes may be made without prior notice due to legal,
security, operational, business, or platform improvements.


Users are encouraged to review these terms periodically.


Continued use of ServDial after updates means acceptance of the
revised terms.


</p>


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


For questions regarding these Terms & Conditions:


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


export default Terms;