import StaticPageLayout from "../../layouts/StaticPageLayout";
import Section from "../../components/common/Section";

import {
  Mail,
  AlertCircle,
  ShieldCheck,
  Store,
  Users,
  FileWarning,
  Globe,
} from "lucide-react";


const Disclaimer = () => {

return (

<StaticPageLayout


title="Disclaimer"


subtitle="
Important information regarding ServDial's platform, business listings,
services, and user interactions.
"


cta={{

title:"Need clarification?",

subtitle:
"Contact ServDial support for questions regarding platform usage and policies.",


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


<AlertCircle
className="text-orange-600 mt-1"
/>


<p className="text-gray-700 leading-relaxed">


<strong>ServDial</strong> is a digital business discovery and
listing platform that helps customers find businesses,
professionals, and service providers.


ServDial provides technology infrastructure for connecting
users and businesses but does not directly provide, perform,
manage, or guarantee services offered by listed businesses.


</p>


</div>


</Section>






{/* PLATFORM ROLE */}

<Section title="Role of ServDial">


<div className="bg-gray-50 rounded-xl p-6">


<ul className="space-y-3 text-sm text-gray-700">


<li>
• ServDial operates as an online discovery and business
listing marketplace.
</li>


<li>
• Businesses are responsible for the information,
services, pricing, images, and details provided in their profiles.
</li>


<li>
• ServDial is not an employer, contractor, agent, partner,
or representative of listed businesses.
</li>


<li>
• Any transaction, agreement, communication, or service
between customers and businesses takes place directly between
those parties.
</li>


</ul>


</div>


</Section>







{/* LISTINGS */}

<Section title="Business Information & Listings">


<div className="bg-gray-50 rounded-xl p-6">


<p className="text-sm text-gray-700 leading-relaxed">


Business information displayed on ServDial may come from
business owners, users, public sources, or platform updates.


While ServDial may take reasonable efforts to maintain useful
and accurate information, we do not guarantee that every listing
will always be complete, updated, error-free, or available.


Users should independently verify business details including
pricing, availability, qualifications, licenses, certifications,
and service quality before making decisions.


</p>


</div>


</Section>








{/* VERIFICATION */}

<Section title="Verification & Trust Indicators">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3 mb-3">


<ShieldCheck className="text-green-600"/>


<p className="text-sm text-gray-700">


Verification badges, approval status, premium status,
or featured listings may indicate that certain information
has been reviewed or processed by ServDial.


</p>


</div>



<p className="text-sm text-gray-700">


Such indicators do not represent certification,
guarantee, warranty, endorsement, or assurance of service
quality, safety, performance, legality, or business conduct.


</p>


</div>


</Section>








{/* USER RESPONSIBILITY */}

<Section title="User Responsibility">


<div className="bg-gray-50 rounded-xl p-6">


<ul className="space-y-3 text-sm text-gray-700">


<li>
• Users should evaluate businesses before hiring,
purchasing, or engaging with any service provider.
</li>


<li>
• Users should confirm quotations, payment terms,
timelines, warranties, and service conditions directly.
</li>


<li>
• ServDial is not responsible for disputes, losses,
damages, or disagreements between customers and businesses.
</li>


</ul>


</div>


</Section>







{/* REVIEWS */}

<Section title="Reviews, Ratings & User Content">


<div className="bg-gray-50 rounded-xl p-6">


<p className="text-sm text-gray-700">


Reviews, ratings, comments, images, and other content submitted
by users represent individual opinions and experiences.


ServDial does not guarantee the accuracy, authenticity,
completeness, or legality of user-generated content and may
remove content that violates platform rules or applicable laws.


</p>


</div>


</Section>







{/* PAYMENTS */}

<Section title="Payments, Promotions & Transactions">


<div className="bg-gray-50 rounded-xl p-6">


<p className="text-sm text-gray-700">


ServDial may provide paid features, promotional tools,
advertising options, or enhanced visibility services for businesses.


Any payment agreement, refund arrangement, service contract,
warranty, or transaction between customers and businesses is
the responsibility of the respective parties unless explicitly
stated otherwise by ServDial.


</p>


</div>


</Section>








{/* ADS */}

<Section title="Advertising & Featured Listings">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<Store className="text-blue-600"/>


<p className="text-sm text-gray-700">


Featured placement or paid promotion may increase visibility
on the platform but does not mean ServDial recommends,
certifies, or guarantees that business over others.


</p>


</div>


</div>


</Section>







{/* THIRD PARTY */}

<Section title="Third-Party Services">


<div className="bg-gray-50 rounded-xl p-6">


<p className="text-sm text-gray-700">


ServDial may use or provide access to third-party services,
including maps, payment providers, external websites, and
integrations.


ServDial does not control third-party availability,
security, content, or policies.


</p>


</div>


</Section>







{/* LIABILITY */}

<Section title="Limitation of Liability">


<div className="bg-gray-50 rounded-xl p-6">


<p className="text-sm text-gray-700">


To the maximum extent permitted by applicable laws,
ServDial shall not be responsible for indirect, incidental,
special, consequential, financial, or business losses arising
from platform usage or interactions between users and businesses.


</p>


</div>


</Section>







{/* GLOBAL */}

<Section title="Applicable Laws">


<div className="bg-gray-50 rounded-xl p-6">


<div className="flex gap-3">


<Globe className="text-purple-600"/>


<p className="text-sm text-gray-700">


ServDial currently operates with a focus on India and intends
to expand internationally in the future.


The platform will follow applicable laws and regulations in
the regions where it operates.


</p>


</div>


</div>


</Section>







{/* CHANGES */}

<Section title="Changes To This Disclaimer">


<div className="bg-gray-50 rounded-xl p-6">


<p className="text-sm text-gray-700">


ServDial reserves the right to update, modify, or replace this
Disclaimer at any time.


Changes may be made without prior notice when required for
operational, legal, security, or business reasons.


Users are encouraged to review this page periodically.
Continued use of the platform after updates indicates acceptance
of the revised Disclaimer.


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


<p className="text-gray-700">


For questions regarding this Disclaimer:


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


export default Disclaimer;