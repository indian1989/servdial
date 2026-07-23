import { useState } from "react";
import {
    FileText,
    CheckCircle2,
    Briefcase,
    Building2,
    CreditCard,
    Languages,
    Accessibility,
    Tag,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

import BusinessSection from "./BusinessSection";
import BusinessSectionHeader from "./BusinessSectionHeader";

const Section = ({ icon, title, items }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="mt-6">
            <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                {icon}
                {title}
            </h3>

            <div className="flex flex-wrap gap-2">
                {items.map((item, index) => (
                    <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
};

const BusinessDescription = ({ business }) => {

    const [expanded, setExpanded] = useState(false);

    if (!business) return null;

    const description =
        business.description ||
        `${business.name} is a trusted ${business.categoryId?.name || "business"} serving customers in ${business.city || ""}.`;

    return (
        <BusinessSection id="about">
            <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
                <FileText size={22} />
                About Business
            </h2>

            <div
                className={`text-gray-600 leading-7 transition-all ${
                    expanded ? "" : "line-clamp-5"
                }`}
            >
                {description}
            </div>

            {description.length > 350 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-3 flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700"
                >
                    {expanded ? (
                        <>
                            Show Less
                            <ChevronUp size={18} />
                        </>
                    ) : (
                        <>
                            Read More
                            <ChevronDown size={18} />
                        </>
                    )}
                </button>
            )}

            <Section
                title="Highlights"
                icon={<CheckCircle2 size={18} />}
                items={business.highlights}
            />

            <Section
                title="Specializations"
                icon={<Briefcase size={18} />}
                items={business.specializations}
            />

            <Section
                title="Amenities"
                icon={<Building2 size={18} />}
                items={business.amenities}
            />

            <Section
                title="Payment Methods"
                icon={<CreditCard size={18} />}
                items={business.paymentMethods}
            />

            <Section
                title="Languages"
                icon={<Languages size={18} />}
                items={business.languages}
            />

            <Section
                title="Accessibility"
                icon={<Accessibility size={18} />}
                items={business.accessibility}
            />

            <Section
                title="Tags"
                icon={<Tag size={18} />}
                items={business.tags}
            />
        </BusinessSection>
    );
};

export default BusinessDescription;