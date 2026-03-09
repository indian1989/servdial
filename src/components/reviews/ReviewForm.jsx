import { useState } from "react";
import API from "../../api/axios";
import StarRating from "./StarRating";

const ReviewForm = ({ businessId, refresh }) => {

const [rating,setRating] = useState(5);
const [comment,setComment] = useState("");
const [loading,setLoading] = useState(false);

const submitReview = async (e)=>{

e.preventDefault();

setLoading(true);

try{

await API.post(`/reviews/${businessId}`,{
rating,
comment
});

setComment("");
setRating(5);

refresh();

}catch(err){

alert("Login required to submit review");

}

setLoading(false);

};

return(

<form
onSubmit={submitReview}
className="border p-4 rounded mt-6"
>

<h3 className="font-semibold mb-2">
Write a Review
</h3>

<StarRating
rating={rating}
setRating={setRating}
/>

<textarea
value={comment}
onChange={(e)=>setComment(e.target.value)}
placeholder="Share your experience..."
className="w-full border p-2 mt-3"
/>

<button
disabled={loading}
className="bg-blue-600 text-white px-4 py-2 mt-3 rounded"
>

{loading ? "Submitting..." : "Submit Review"}

</button>

</form>

);

};

export default ReviewForm;