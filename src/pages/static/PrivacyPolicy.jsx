import React from "react";

import StaticPageLayout from "../../layouts/StaticPageLayout";
import Section from "../../components/common/Section";

import {
  Mail,
  ShieldCheck,
  Database,
  MapPin,
  UserCheck,
  Globe,
  Lock,
  Cookie,
} from "lucide-react";


const PrivacyPolicy = () => {

return (

<StaticPageLayout


title="Privacy Policy"


subtitle="
How ServDial collects, uses, protects, and manages user and business information.
"


cta={{

title:"Questions about privacy?",

subtitle:
"Contact our support team regarding your personal information and privacy concerns.",


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


<ShieldCheck className="text-green-600 mt-1"/>


<p className="text-gray-700 leading-relaxed text-sm">


At <strong>ServDial</strong>, we respect your privacy and are
committed to protecting your personal information.


This Privacy Policy explains how we collect, use, store, and
protect information when you use our platform, website,
applications, and related services.


</p>


</div>


</Section>








{/* INFORMATION */}

<Section title="Information We Collect">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3 mb-4">


<Database className="text-blue-600"/>


<h3 className="font-semibold">
Personal & Account Information
</h3>


</div>



<ul className="space-y-3 text-sm text-gray-700">


<li>
• Name, email address, phone number, and account details.
</li>


<li>
• Login information and authentication details.
</li>


<li>
• Business information submitted by providers including
business name, category, address, services, images,
and contact details.
</li>


</ul>


</div>


</Section>







{/* LOCATION */}

<Section title="Location Information">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<MapPin className="text-orange-600"/>


<p className="text-sm text-gray-700">


With your permission, ServDial may collect location-related
information to provide city-based search results,
nearby businesses, and improved discovery experiences.


You may control location permissions through your device
settings.


</p>


</div>


</div>


</Section>








{/* USAGE */}

<Section title="How We Use Your Information">


<div className="bg-gray-50 rounded-xl p-6">


<ul className="space-y-3 text-sm text-gray-700">


<li>
• Provide, operate, and improve ServDial services.
</li>


<li>
• Help users discover relevant businesses and services.
</li>


<li>
• Display business listings and service information.
</li>


<li>
• Communicate important updates, security notices,
and platform information.
</li>


<li>
• Improve search, performance, and user experience.
</li>


</ul>


</div>


</Section>








{/* BUSINESS DATA */}

<Section title="Business Information & Provider Data">


<div className="bg-gray-50 rounded-xl p-6">


<p className="text-sm text-gray-700">


Businesses and service providers may submit information
to create and manage listings on ServDial.


Providers are responsible for ensuring that information
submitted by them is accurate, lawful, and permitted to be
published.


ServDial may display approved business information to help
customers discover and contact service providers.


</p>


</div>


</Section>







{/* COOKIES */}

<Section title="Cookies & Analytics">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<Cookie className="text-purple-600"/>


<p className="text-sm text-gray-700">


ServDial may use cookies, analytics tools, and similar
technologies to understand platform usage, improve
performance, maintain security, and enhance user experience.


Users may manage cookie preferences through browser settings.


</p>


</div>


</div>


</Section>








{/* SHARING */}

<Section title="Information Sharing">


<div className="bg-gray-50 rounded-xl p-6">


<p className="text-sm text-gray-700">


ServDial does not sell personal information to third parties.


Information may be shared only when necessary, including:


</p>



<ul className="mt-3 space-y-2 text-sm text-gray-700">


<li>
• To provide platform services and technical support.
</li>


<li>
• With service providers supporting hosting,
analytics, payments, security, or infrastructure.
</li>


<li>
• When required by applicable laws or legal processes.
</li>


</ul>


</div>


</Section>








{/* SECURITY */}

<Section title="Data Security">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<Lock className="text-green-600"/>


<p className="text-sm text-gray-700">


We implement reasonable technical and organizational
security measures to protect information from unauthorized
access, misuse, loss, or disclosure.


However, no internet-based system can guarantee complete
security.


</p>


</div>


</div>


</Section>







{/* USER RIGHTS */}

<Section title="Your Privacy Rights">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<UserCheck className="text-blue-600"/>


<ul className="space-y-2 text-sm text-gray-700">


<li>
• Request access to your personal information.
</li>


<li>
• Request correction of inaccurate information.
</li>


<li>
• Request account deletion where applicable.
</li>


<li>
• Contact us regarding privacy concerns.
</li>


</ul>


</div>


</div>


</Section>








{/* GLOBAL */}

<Section title="Applicable Laws & International Operations">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<Globe className="text-indigo-600"/>


<p className="text-sm text-gray-700">


ServDial currently operates with a focus on India and plans
to expand globally in the future.


Privacy practices may be updated to comply with applicable
laws and regulations in different regions where ServDial
operates.


</p>


</div>


</div>


</Section>








{/* CHANGES */}

<Section title="Changes To This Privacy Policy">


<div className="bg-gray-50 rounded-xl p-6">


<p className="text-sm text-gray-700">


ServDial reserves the right to update or modify this Privacy
Policy at any time.


Changes may be made without prior notice when required for
legal, security, operational, or business reasons.


Users are encouraged to review this page periodically.
Continued use of ServDial after changes means acceptance
of the updated Privacy Policy.


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


<p className="text-gray-700 text-sm">


For privacy-related questions:


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


export default PrivacyPolicy;