import React from "react";

import StaticPageLayout from "../../layouts/StaticPageLayout";
import Section from "../../components/common/Section";

import {
  Users,
  MessageCircle,
  Star,
  ShieldCheck,
  Image,
  AlertCircle,
  Ban,
  Flag,
  Globe,
  Mail,
} from "lucide-react";


const CommunityGuidelines = () => {


return (

<StaticPageLayout


title="Community Guidelines"


subtitle="
Rules and standards for maintaining a safe, trustworthy, and respectful ServDial community.
"


cta={{

title:"Help us build a trusted community",

subtitle:
"Report inappropriate content or contact our support team for assistance.",


actions:[

{
label:"Contact Support",
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







<Section>


<div className="
bg-gray-50
rounded-2xl
p-6
flex
items-start
gap-4
">


<Users className="text-blue-600 mt-1"/>


<p className="
text-sm
text-gray-700
leading-relaxed
">


ServDial connects customers and businesses through a local
business discovery platform.


These Community Guidelines help maintain a reliable,
respectful, and trustworthy environment for everyone using
ServDial.


</p>


</div>


</Section>









<Section title="Respectful Community Behavior">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<MessageCircle className="text-green-600"/>


<ul className="
text-sm
text-gray-700
space-y-2
">


<li>
• Communicate respectfully with customers, providers, and other users.
</li>


<li>
• Do not use abusive, threatening, hateful, or inappropriate language.
</li>


<li>
• Avoid harassment, discrimination, or personal attacks.
</li>


</ul>


</div>


</div>


</Section>









<Section title="Reviews & Ratings Guidelines">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<Star className="text-yellow-500"/>


<ul className="
text-sm
text-gray-700
space-y-2
">


<li>
• Reviews should represent genuine personal experiences.
</li>


<li>
• Users should provide honest feedback about services received.
</li>


<li>
• Fake reviews, paid reviews, or rating manipulation are prohibited.
</li>


<li>
• Businesses must not pressure users to post misleading reviews.
</li>


</ul>


</div>


</div>


</Section>









<Section title="Business Information Guidelines">


<div className="bg-gray-50 rounded-xl p-6">


<ul className="
text-sm
text-gray-700
space-y-3
">


<li>
• Businesses must provide accurate information about their name,
services, location, contact details, and offerings.
</li>


<li>
• Providers should not make false claims, misleading promises,
or inaccurate advertisements.
</li>


<li>
• Business ownership and service details should be represented honestly.
</li>


</ul>


</div>


</Section>









<Section title="Content & Image Guidelines">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<Image className="text-purple-600"/>


<ul className="
text-sm
text-gray-700
space-y-2
">


<li>
• Upload only content that you own or have permission to use.
</li>


<li>
• Do not upload illegal, offensive, harmful, or misleading images.
</li>


<li>
• Images should accurately represent your business, products,
or services.
</li>


</ul>


</div>


</div>


</Section>









<Section title="Prohibited Activities">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<Ban className="text-red-600"/>


<ul className="
text-sm
text-gray-700
space-y-2
">


<li>
• Creating fake business profiles.
</li>


<li>
• Posting spam or irrelevant content.
</li>


<li>
• Promoting illegal products or services.
</li>


<li>
• Attempting to manipulate search rankings or platform systems.
</li>


<li>
• Misusing customer information.
</li>


</ul>


</div>


</div>


</Section>









<Section title="Customer & Provider Interaction">


<div className="bg-gray-50 rounded-xl p-6">


<p className="
text-sm
text-gray-700
leading-relaxed
">


Customers and providers should communicate clearly regarding
pricing, availability, timelines, and service expectations.


ServDial provides a connection platform but does not control
agreements, payments, or service outcomes between users and
businesses.


</p>


</div>


</Section>









<Section title="Reporting Violations">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<Flag className="text-orange-600"/>


<p className="
text-sm
text-gray-700
">


Users can report suspicious listings, inappropriate content,
fake reviews, or policy violations.


ServDial may review reported content and take appropriate
action based on platform rules and applicable laws.


</p>


</div>


</div>


</Section>









<Section title="Enforcement Actions">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<ShieldCheck className="text-blue-600"/>


<p className="
text-sm
text-gray-700
">


ServDial reserves the right to remove content, restrict
features, suspend accounts, or take other actions against
users or businesses that violate these guidelines.


</p>


</div>


</div>


</Section>









<Section title="Global Community Standards">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<Globe className="text-indigo-600"/>


<p className="
text-sm
text-gray-700
">


ServDial currently focuses on India and may expand globally
in the future.


These guidelines may be adapted to meet regional laws,
cultural expectations, and operational requirements in
different countries.


</p>


</div>


</div>


</Section>









<Section title="Changes To These Guidelines">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<AlertCircle className="text-orange-600"/>


<p className="
text-sm
text-gray-700
">


ServDial may update these Community Guidelines from time to
time.


Changes may be made without prior notice when required for
legal, security, operational, or community protection reasons.


Users and providers are encouraged to review these guidelines
regularly.


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


<p className="
text-sm
text-gray-700
">


For questions or reports related to community standards:


<br/>


<strong>Email:</strong>
support.servdial@gmail.com


</p>


</div>


</Section>






</StaticPageLayout>


);

};


export default CommunityGuidelines;