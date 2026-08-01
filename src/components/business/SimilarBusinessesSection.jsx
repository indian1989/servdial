// src/components/business/SimilarBusinessesSection.jsx
import { Building2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import BusinessCard from "./BusinessCard";
import BusinessSection from "./BusinessSection";
import BusinessSectionHeader from "./BusinessSectionHeader";
import { normalizeLocation } from "../../utils/locationHelper";

const SimilarBusinessesSection = ({
    business,
    similar = [],
    categoryCount = 0,
}) => {

    const navigate = useNavigate();

    if (!similar.length) return null;

    const category =
        business?.categoryId?.name ||
        business?.category ||
        "Businesses";

    const city =
    business?.cityId?.name ||
    business?.city ||
    "";


const district =
    business?.district ||
    "";


const state =
    business?.state ||
    "";


const locationText =
    normalizeLocation(
        city,
        district,
        state
    );


    return (

        <BusinessSection>

            <div
                className="
                    flex
                    items-start
                    justify-between
                    mb-5
                "
            >

                <div>

                    <h2
                        className="
                            flex
                            items-center
                            gap-2
                            text-xl
                            font-bold
                        "
                    >

                        <Building2 size={22} />

                         Nearby Businesses

                    </h2>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            mt-1
                        "
                    >

                        Nearby {category} in {locationText}

                    </p>

                </div>

                <button
                    onClick={() =>
                        navigate(
                            `/search?category=${encodeURIComponent(category)}&city=${encodeURIComponent(city)}`
                        )
                    }
                    className="
                        hidden
                        md:flex
                        items-center
                        gap-1
                        text-blue-600
                        font-medium
                        hover:text-blue-700
                    "
                >

                    View All

                    <ArrowRight size={18} />

                </button>

            </div>

            <div
                className="
                    flex
                    gap-4
                    overflow-x-auto
                    pb-2
                    scrollbar-hide
                "
            >

                {similar.map((item) => (

                    <div
                        key={item._id}
                        className="
                            min-w-[260px]
                            max-w-[260px]
                            flex-shrink-0
                        "
                    >

                        <BusinessCard
                            business={item}
                            loading="lazy"
                        />

                    </div>

                ))}

            </div>

        </BusinessSection>

    );

};

export default SimilarBusinessesSection;