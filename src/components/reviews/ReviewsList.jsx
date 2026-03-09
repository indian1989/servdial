import { useState } from "react";
import API from "../../api/axios";

const ReviewsList = ({ reviews, refresh }) => {

const [page,setPage] = useState(1);
const perPage = 5;

const start = (page-1)*perPage;
const paginated = reviews.slice(start,start+perPage);

const likeReview = async(id)=>{

await API.post(`/reviews/${id}/like`);
refresh();

};

const reportReview = async(id)=>{

await API.post(`/reviews/${id}/report`);
alert("Review reported");

};

return(

<div className="mt-6">

{paginated.map((review)=>(
<div
key={review._id}
className="border p-4 rounded mb-4"
>

<p className="font-semibold">
{review.user?.name}
</p>

<p className="text-yellow-500">
{"⭐".repeat(review.rating)}
</p>

<p className="text-gray-600">
{review.comment}
</p>

<div className="flex gap-4 mt-2 text-sm">

<button
onClick={()=>likeReview(review._id)}
className="text-blue-600"
>
👍 Helpful ({review.likes || 0})
</button>

<button
onClick={()=>reportReview(review._id)}
className="text-red-600"
>
Report
</button>

</div>

</div>
))}

{/* Pagination */}

<div className="flex gap-2">

{Array.from({
length:Math.ceil(reviews.length/perPage)
}).map((_,i)=>(
<button
key={i}
onClick={()=>setPage(i+1)}
className={`px-3 py-1 border ${
page===i+1?"bg-blue-600 text-white":""
}`}
>
{i+1}
</button>
))}

</div>

</div>

);

};

export default ReviewsList;