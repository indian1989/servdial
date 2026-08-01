import {
    MessageSquare,
    Star,
} from "lucide-react";

import RatingBreakdown from "../reviews/RatingBreakdown";
import ReviewsList from "../reviews/ReviewsList";
import ReviewForm from "../reviews/ReviewForm";
import BusinessSection from "./BusinessSection";
import BusinessSectionHeader from "./BusinessSectionHeader";

const renderStars = (rating = 0) => {

 return Array.from({length:5}).map((_,index)=>(
   <Star
    key={index}
    size={16}
    className={
      index < Math.round(rating)
      ?
      "fill-yellow-400 text-yellow-400"
      :
      "text-gray-300"
    }
   />
 ));

};

const BusinessReviewsSection = ({
    business,
    reviews = [],
    refresh,
    onSubmitReview,
}) => {

    return (

        <BusinessSection id="reviews">

            <div className="flex items-center justify-between mb-6">

                <div>

                    <h2 className="flex items-center gap-2 text-xl font-bold">

                        <MessageSquare size={22} />

                        Reviews & Ratings

                    </h2>

                    <p className="text-sm text-gray-500 mt-1">

                        {(business?.totalReviews || reviews.length || 0)} Customer Reviews

                    </p>

                </div>

                <div className="text-right">

                    <div className="flex items-center gap-1 font-bold text-lg">

                        <Star
                            size={18}
                            className="fill-yellow-400 text-yellow-400"
                        />

                        {business?.averageRating
 ? Number(business.averageRating).toFixed(1)
 : "New"}

                    </div>

                </div>

                <div className="flex">
 {renderStars(business?.averageRating)}
</div>

            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                <div>

                    <RatingBreakdown
                        reviews={reviews}
                    />

                </div>

                <div className="lg:col-span-2 space-y-6">

                    <ReviewsList
                        reviews={reviews}
                        refresh={refresh}
                    />

                    <ReviewForm
                        onSubmitAttempt={onSubmitReview}
                    />

                </div>

            </div>

        </BusinessSection>

    );

};

export default BusinessReviewsSection;