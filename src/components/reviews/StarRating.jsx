import { useState } from "react";

const StarRating = ({ rating, setRating }) => {

const [hover,setHover] = useState(null);

return(

<div className="flex gap-1">

{[1,2,3,4,5].map((star)=>{

return(

<span
key={star}
className={`cursor-pointer text-2xl ${
(hover || rating) >= star ? "text-yellow-500" : "text-gray-300"
}`}
onClick={()=>setRating(star)}
onMouseEnter={()=>setHover(star)}
onMouseLeave={()=>setHover(null)}
>
★
</span>

);

})}

</div>

);

};

export default StarRating;